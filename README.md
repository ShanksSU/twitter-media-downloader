# Twitter/X Media Downloader

Download images and videos from Twitter/X with custom filenames and download history.
Animated GIF posts are saved as real `.gif` files. When the media source is MP4,
the script decodes and encodes it locally in the browser.

## Install or update

Copy the complete contents of `script.js` into the existing Tampermonkey script,
save it, and refresh Twitter/X. Replacing the existing script preserves its settings
and download history and avoids duplicate download buttons.

## Short videos to GIF

Use the separate **GIF** button beside the normal download button to convert ordinary
videos up to and including 10 seconds. The normal button still downloads videos as MP4.
The GIF action ignores photos in a mixed-media post and preserves the original media
indexes in filenames. A post without ordinary videos shows a notice.

The API duration is checked before downloading where available. The decoded video duration
is always checked again before encoding, including when the API duration is absent or
inaccurate. Videos over 10 seconds produce a visible notice; they are never truncated.
GIF has no audio. Existing animated GIF downloads keep their separate 120-second limit.

## GIF downloads

- The normal download button converts `animated_gif` media and keeps ordinary videos
  as MP4. The separate GIF button explicitly converts short ordinary videos.
- If a native GIF variant is available, its bytes are preserved.
- MP4-backed animations are converted using the browser video decoder, Canvas, and
  the bundled [gifenc 1.0.3](https://github.com/mattdesl/gifenc) encoder. No conversion
  service, runtime CDN request, extra userscript grant, or external executable is needed.
- The download button shows conversion progress. Hover a failed button for the error.
  Conversion failures do not silently download MP4 or mark the post as completed.
- History records use the generated GIF's size. Download retries reuse the encoded GIF.

The defaults are approximately 15 frames per second, a maximum long edge of 640 pixels,
256 colors per frame, and infinite looping. Smaller sources are not upscaled. The whole
clip is sampled; GIF timing is rounded to 10 ms units. This is a new encoding, not a
byte-for-byte restoration of an uploaded original GIF.

`GifConverter.fps`, `maxSide`, `maxSeconds`, and `maxBytes` can be edited in `script.js`.
The default duration limit is 120 seconds; the source and encoded output limits are
100 MiB each. Exceeding a limit produces an error instead of truncation. Large animations
can take time and produce much larger files than their MP4 sources.

The bundled gifenc code retains its MIT license and copyright notice in `script.js`.

## Validation

Node.js 20 or newer is required only for the tests; there are no npm dependencies.

```sh
npm run check
npm test
```

Tests cover mixed media routing, GIF filenames and sizes, native GIF preservation,
frame sampling and GIF block timing, conversion errors, duration limits, retries,
temporary URL cleanup, and unchanged ordinary video downloads. Browser APIs and
Tampermonkey downloads are mocked in the automated tests.

A separate browser check converted a real MP4 sample and decoded every output frame:
76 frames, 640 × 360 pixels, 5.05 seconds. Actual download behavior on a signed-in
Twitter/X page still needs manual verification after installation.

## 中文说明

将 `script.js` 全部内容替换到原 Tampermonkey 脚本，保存后刷新 X 网页即可。
动图会在本地转换为真正的 GIF，普通视频仍下载为 MP4；按钮会显示转换进度。
默认最高约 15 帧/秒、最长边 640 像素，保留完整时长并循环播放。
超过 120 秒或 100 MiB 限制时显示错误，不会截断动图或改存 MP4。

新增“转 GIF”按钮：普通视频不超过 10 秒时可转换为无声音 GIF，原下载按钮仍保存 MP4。
超过 10 秒会显示提示；没有接口时长也会读取实际视频时长后检查。
