const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const script = fs.readFileSync(require('node:path').join(__dirname, '..', 'script.js'), 'utf8');
const sandbox = {
    console, Blob, URL, AbortController, AbortSignal, setTimeout, clearTimeout,
    document: { documentElement: { lang: 'en' } }, location: { hostname: 'x.com' },
    fetch: async () => new Response(null, { headers: { 'content-length': '1024' } }),
    GM_download: () => {},
};
vm.createContext(sandbox);
vm.runInContext(script.replace('new TwitterMediaDownloaderApp().init();', '') + '\nthis.test = { GifConverter, DownloadQueue, TwitterAPI, TwitterMediaDownloaderApp, TmdGifenc };', sandbox);
const { GifConverter, DownloadQueue, TwitterAPI, TwitterMediaDownloaderApp, TmdGifenc } = sandbox.test;
let passed = 0;
async function check(name, run) { await run(); passed++; console.log('PASS', name); }
const media = (type, id) => ({ type, media_url_https: `https://pbs.twimg.com/media/${id}.jpg`, video_info: { variants: [
    { content_type: 'application/x-mpegURL', url: `https://video.twimg.com/${id}.m3u8` },
    { content_type: 'video/mp4', bitrate: 100, url: `https://video.twimg.com/${id}-low.mp4` },
    { content_type: 'video/mp4', bitrate: 500, url: `https://video.twimg.com/${id}-high.mp4` },
] } });
async function plan(medias, options = {}) {
    const tasks = [], statuses = [], history = [], notices = [];
    TwitterAPI.fetchTweetJson = async () => ({ legacy: { created_at: '2026-09-17T00:00:00Z', extended_entities: { media: medias } }, core: { user_results: { result: { legacy: { name: 'Tester', screen_name: 'tester' } } } } });
    const app = new TwitterMediaDownloaderApp();
    app.storage = { filenamePattern: '{file-type}-{index}.{file-ext}', saveHistoryFlag: true, addHistory: async item => history.push(item) };
    app.ui = { setButtonStatus: (btn, status) => statuses.push(status), showNotice: text => notices.push(text), updateHistoryCount() {}, lang: { completed: 'Done' } };
    app.queue = { add: task => tasks.push(task) };
    await app.handleDownloadClick({ classList: { contains: () => false }, dataset: {} }, '123', false, null, 'unknown', 'unknown', options);
    return { tasks, statuses, history, notices };
}

// Walk GIF blocks independently of the encoder to verify frames and timing.
function assertGifAnimation(bytes, expectedFrames, expectedDuration) {
    let offset = 13;
    if (bytes[10] & 0x80) offset += 3 * (1 << ((bytes[10] & 7) + 1));
    let frames = 0, duration = 0, loop = null, trailer = false;
    const skipBlocks = () => {
        while (offset < bytes.length) {
            const size = bytes[offset++];
            if (!size) return;
            offset += size;
            assert.ok(offset <= bytes.length, 'GIF subblock fits in file');
        }
        assert.fail('Missing GIF subblock terminator');
    };
    while (offset < bytes.length) {
        const marker = bytes[offset++];
        if (marker === 0x3b) { trailer = true; break; }
        if (marker === 0x21) {
            const label = bytes[offset++];
            if (label === 0xf9) {
                assert.equal(bytes[offset++], 4);
                duration += bytes.readUInt16LE(offset + 1) * 10;
                offset += 4;
                assert.equal(bytes[offset++], 0);
            } else if (label === 0xff) {
                const length = bytes[offset++];
                const identifier = bytes.subarray(offset, offset + length).toString();
                offset += length;
                if (identifier === 'NETSCAPE2.0') loop = bytes.readUInt16LE(offset + 2);
                skipBlocks();
            } else { skipBlocks(); }
        } else if (marker === 0x2c) {
            frames++;
            const packed = bytes[offset + 8];
            offset += 9;
            if (packed & 0x80) offset += 3 * (1 << ((packed & 7) + 1));
            offset++; // LZW minimum code size
            skipBlocks();
        } else { assert.fail('Unexpected GIF block: ' + marker); }
    }
    assert.equal(trailer, true);
    assert.equal(offset, bytes.length);
    assert.equal(frames, expectedFrames);
    assert.equal(duration, expectedDuration);
    assert.equal(loop, 0);
}

(async () => {
    await check('explicit short-video action converts videos only, preserves original indexes and GIF history', async () => {
        const video = media('video', 'v'); video.video_info.duration_millis = 10000;
        const p = await plan([media('photo', 'p'), video], { videoGif: true });
        assert.equal(p.tasks.length, 1);
        assert.equal(p.tasks[0].name, 'gif-2.gif');
        assert.equal(p.tasks[0].gif, true);
        assert.equal(p.tasks[0].gifOptions.maxSeconds, 10);
        assert.equal(p.tasks[0].gifOptions.requireVideo, true);
        await p.tasks[0].onload(1048576);
        assert.equal(p.history[0].type, 'gif');
        assert.equal(p.history[0].size, '1.00 MB');
        assert.equal((await plan([video])).tasks[0].name, 'video-1.mp4');
    });
    await check('long videos and photo-only posts show a notice without downloading', async () => {
        const video = media('video', 'v'); video.video_info.duration_millis = 10001;
        const p = await plan([video], { videoGif: true });
        assert.equal(p.tasks.length, 0); assert.equal(p.statuses.at(-1), 'failed');
        assert.match(p.notices[0], /10/);
        const photo = await plan([media('photo', 'p')], { videoGif: true });
        assert.equal(photo.tasks.length, 0); assert.match(photo.notices[0], /No video/);
    });
    await check('missing API duration still requires decoding and enforcing the 10-second limit', async () => {
        const p = await plan([media('video', 'v')], { videoGif: true });
        assert.equal(p.tasks.length, 1); assert.equal(p.tasks[0].gifOptions.maxSeconds, 10);
        GifConverter.validateDuration(10, 10);
        assert.throws(() => GifConverter.validateDuration(10.001, 10), /10s/);
        assert.throws(() => GifConverter.validateDuration(NaN, 10), /invalid/);
        await p.tasks[0].onerror(new Error('over limit'));
        assert.equal(p.history.length, 0); assert.equal(p.notices[0], 'over limit');
    });
    await check('mixed gallery: GIF extension, highest MP4 source, independent filenames and actual GIF size', async () => {
        const p = await plan([media('animated_gif', 'a'), media('photo', 'b'), media('video', 'c')]);
        assert.deepEqual(Array.from(p.tasks, x => x.name), ['gif-1.gif', 'photo-2.jpg', 'video-3.mp4']);
        assert.equal(p.tasks[0].url, 'https://video.twimg.com/a-high.mp4');
        assert.equal(p.tasks[1].url, 'https://pbs.twimg.com/media/b.jpg:orig');
        assert.equal(p.tasks[2].gif, false);
        await p.tasks[1].onload(); await p.tasks[0].onload(1048576); await p.tasks[2].onload();
        assert.equal(p.statuses.at(-1), 'completed');
        assert.equal(p.history[0].size, '1.00 MB');
        assert.equal(p.history[0].type, 'Gallery');
    });
    await check('missing GIF source cannot turn into success when a sibling completes', async () => {
        const missing = media('animated_gif', 'a'); missing.video_info.variants = [];
        const p = await plan([missing, media('photo', 'b')]);
        await p.tasks[0].onload();
        assert.equal(p.statuses.at(-1), 'failed'); assert.equal(p.history.length, 0);
    });
    await check('native GIF variant preferred', async () => {
        const gif = media('animated_gif', 'a');
        gif.video_info.variants.push({ content_type: 'image/gif', url: 'https://video.twimg.com/original.gif' });
        assert.equal((await plan([gif])).tasks[0].url, 'https://video.twimg.com/original.gif');
    });
    const enc = TmdGifenc.GIFEncoder();
    enc.writeFrame(new Uint8Array([0,1,1,0]), 2, 2, { palette: [[255,0,0], [0,0,255]], delay: 100, repeat: 0 });
    enc.finish();
    const originalGif = new Blob([enc.bytesView()], { type: 'image/gif' });
    await check('real GIF sources preserved byte for byte', async () => {
        sandbox.fetch = async () => new Response(originalGif);
        const result = await GifConverter.convert('mock-native-gif');
        assert.deepEqual(Buffer.from(await result.arrayBuffer()), Buffer.from(await originalGif.arrayBuffer()));
    });
    let removed = false;
    class FakeVideo extends EventTarget {
        constructor() { super(); this.style = {}; this._time = 0; this.duration = 1; this.videoWidth = 4; this.videoHeight = 2; }
        load() { if (this.src) queueMicrotask(() => this.dispatchEvent(new Event('loadeddata'))); }
        get currentTime() { return this._time; }
        set currentTime(value) { this._time = value; queueMicrotask(() => this.dispatchEvent(new Event('seeked'))); }
        pause() {} removeAttribute() { this.src = ''; } remove() { removed = true; }
    }
    const fakeVideo = new FakeVideo();
    const context = { drawImage() {}, getImageData() {
        const rgba = new Uint8ClampedArray(4 * 2 * 4);
        for (let i = 0; i < rgba.length; i += 4) { rgba[i] = Math.round(fakeVideo.currentTime * 255); rgba[i+2] = 255-rgba[i]; rgba[i+3] = 255; }
        return { data: rgba };
    } };
    sandbox.document.body = { appendChild() {} };
    sandbox.document.createElement = tag => tag === 'video' ? fakeVideo : { getContext: () => context };
    await check('frame sampling produces an actual animated GIF, complete duration and cleanup', async () => {
        sandbox.fetch = async () => new Response(new Blob(['mock-mp4'], { type: 'video/mp4' }));
        const progress = [];
        const blob = await GifConverter.convert('mock-mp4', p => progress.push(p));
        const result = Buffer.from(await blob.arrayBuffer());
        assert.equal(result.subarray(0, 6).toString(), 'GIF89a');
        assert.equal(blob.type, 'image/gif'); assert.equal(removed, true);
        assert.equal(progress.at(-1), 'GIF 100%');
        assertGifAnimation(result, 15, 1000);
    });
    await check('overlong animations fail instead of silently truncating', async () => {
        fakeVideo.duration = 121;
        await assert.rejects(GifConverter.convert('too-long'), /limit/);
        fakeVideo.duration = 1;
    });
    await check('decoded duration is authoritative; the video cap does not affect animated GIFs', async () => {
        fakeVideo.duration = 10.001;
        await assert.rejects(GifConverter.convert('short-video', undefined, { maxSeconds: 10, requireVideo: true }), /10s/);
        fakeVideo.duration = 10;
        const blob = await GifConverter.convert('ten-second-video', undefined, { maxSeconds: 10, requireVideo: true });
        assertGifAnimation(Buffer.from(await blob.arrayBuffer()), 150, 10000);
        fakeVideo.duration = 11;
        const animation = await GifConverter.convert('animated-gif');
        assertGifAnimation(Buffer.from(await animation.arrayBuffer()), 165, 11000);
        fakeVideo.duration = 1;
    });
    await check('HTTP failure propagates and subsequent conversion still works', async () => {
        sandbox.fetch = async () => new Response('', { status: 403 });
        await assert.rejects(GifConverter.convert('bad'), /403/);
        sandbox.fetch = async () => new Response(originalGif);
        assert.equal((await GifConverter.convert('good')).type, 'image/gif');
    });
    const savedConvert = GifConverter.convert;
    await check('download retries encode once and report success only once', async () => {
        let conversions = 0, attempts = 0, success = 0, failed = 0, downloadUrl;
        GifConverter.convert = async (url, progress, options) => { conversions++; assert.equal(options.maxSeconds, 10); return originalGif; };
        sandbox.GM_download = o => { downloadUrl = o.url; attempts++; if (attempts < 3) o.onerror(new Error('temporary')); else o.onload(); };
        await new DownloadQueue().start({ gif: true, gifOptions: { maxSeconds: 10 }, url: 'source.mp4', name: 'output.gif', onload: n => { success++; assert.equal(n, originalGif.size); }, onerror: () => failed++ });
        assert.equal(conversions, 1); assert.equal(attempts, 3); assert.equal(success, 1); assert.equal(failed, 0);
        await assert.rejects(fetch(downloadUrl)); // Object URL is released after download completes.
    });
    await check('conversion failure never falls back to an MP4 download', async () => {
        let downloads = 0, failures = 0;
        GifConverter.convert = async () => { throw new Error('decode failure'); };
        sandbox.GM_download = () => downloads++;
        await new DownloadQueue().start({ gif: true, url: 'source.mp4', name: 'output.gif', onload: () => assert.fail(), onerror: () => failures++ });
        assert.equal(downloads, 0); assert.equal(failures, 1);
    });
    await check('ordinary downloads preserve URL; synchronous errors release the queue', async () => {
        let attempts = 0, failures = 0;
        sandbox.GM_download = o => { assert.equal(o.url, 'plain.mp4'); attempts++; throw new Error('disabled'); };
        const q = new DownloadQueue();
        await q.start({ url: 'plain.mp4', name: 'plain.mp4', onerror: () => failures++ });
        assert.equal(attempts, 3); assert.equal(failures, 1);
    });
    GifConverter.convert = savedConvert;
    console.log(`${passed} checks passed`);
})().catch(error => { console.error(error); process.exitCode = 1; });
