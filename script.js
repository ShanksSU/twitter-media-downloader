// ==UserScript==
// @name         Twitter/X Media Downloader
// @name:ja      Twitter/X メディアダウンローダー
// @name:zh-CN   Twitter/X 媒体下载器
// @name:zh-TW   Twitter/X 媒體下載器
// @description        One-click download of images/videos from Twitter/X, with custom filenames and history.
// @description:ja     Twitter/Xの画像や動画をワンクリックでダウンロード。カスタムファイル名や履歴に対応。
// @description:zh-CN  一键下载 Twitter/X 图片和视频，支持自定义文件名和下载历史记录。
// @description:zh-TW  一鍵下載 Twitter/X 圖片和影片，支援自訂檔名與下載歷史紀錄。
// @author      ShanksSU
// @namespace    https://github.com/ShanksSU/twitter-media-downloader
// @version     0.2.1
// @match       https://twitter.com/*
// @match       https://x.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_download
// @grant       GM_addStyle
// @license     MIT
// ==/UserScript==
 
class Config {
    static AUTH_TOKEN = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
    static defaultFilename = '{user-name}(@{user-id})_{index}';
    static language = {
        en: { download: 'Download', completed: 'Download Completed', settings: 'Settings', history: 'Download Log', empty: 'No history yet.', unknown_date: 'Unknown Date', saved: 'Saved', dialog: { title: 'Download Settings', save: 'Save', save_history: 'Remember download history', auto_bookmark: 'Auto Bookmark on Download', clear_history: 'Clear All History', clear_confirm: 'Clear all download history?', pattern: 'File Name Pattern', preview: 'Preview:', empty_pattern: 'Pattern cannot be empty.', reset: '(Reset)', custom_mode: '(Custom Mode)', tag_mode: '(Tag Mode)', shortcut: 'Keyboard Shortcut:', tags: { '{user-name}': 'User Name', '{user-id}': 'User ID', '{status-id}': 'Tweet ID', '{date-time}': 'Time (UTC)', '{date-time-local}': 'Time (Local)', '{full-text}': 'Full Text', '{fav-count}': 'Likes', '{file-type}': 'Media Type', '{file-name}': 'Original Filename', '{media-count}': 'Media Count', '{index}': 'Index' } }, table: { thumb: 'Thumb', user: 'User', type: 'Type', size: 'Size', postTime: 'Post Time', downTime: 'Download Time', action: 'Action', go: 'Go', del: 'Delete' } },
        ja: { download: 'ダウンロード', completed: 'ダウンロード完了', settings: '設定', history: 'ダウンロード履歴', empty: '履歴はありません。', unknown_date: '日付不明', saved: '保存しました', dialog: { title: 'ダウンロード設定', save: '保存', save_history: 'ダウンロード履歴を保存する', auto_bookmark: 'ダウンロード時に自動ブックマーク', clear_history: '履歴をクリア', clear_confirm: 'ダウンロード履歴を削除する？', pattern: 'ファイル名パターン', preview: 'プレビュー:', empty_pattern: 'パターンは空にできません。', reset: '(リセット)', custom_mode: '(カスタム)', tag_mode: '(タグモード)', shortcut: 'ショートカットキー:', tags: { '{user-name}': 'ユーザー名', '{user-id}': 'ユーザーID', '{status-id}': 'ツイートID', '{date-time}': '時間 (UTC)', '{date-time-local}': '時間 (ローカル)', '{full-text}': 'ツイート本文', '{fav-count}': 'いいね数', '{file-type}': 'メディア種類', '{file-name}': '元のファイル名', '{media-count}': 'メディア数', '{index}': 'インデックス' } }, table: { thumb: 'サムネ', user: 'ユーザー', type: '種類', size: 'サイズ', postTime: '投稿時間', downTime: '保存時間', action: 'アクション', go: '開く', del: '削除' } },
        zh: { download: '下载', completed: '下载完成', settings: '设置', history: '下载记录', empty: '暂无记录。', unknown_date: '未知时间', saved: '已保存', dialog: { title: '下载设置', save: '保存', save_history: '保存下载记录', auto_bookmark: '下载时自动加入书签', clear_history: '(清除)', clear_confirm: '确认要清除下载记录？', pattern: '文件名格式', preview: '预览:', empty_pattern: '文件名格式不能为空。', reset: '(重置)', custom_mode: '(自订模式)', tag_mode: '(标签模式)', shortcut: '快捷键设定:', tags: { '{user-name}': '用户名称', '{user-id}': '用户账号', '{status-id}': '推文 ID', '{date-time}': '时间 (UTC)', '{date-time-local}': '时间 (本地)', '{full-text}': '推文內文', '{fav-count}': '点赞数', '{file-type}': '媒体类型', '{file-name}': '原始文件名', '{media-count}': '媒体总数', '{index}': '序号' } }, table: { thumb: '缩图', user: '用户', type: '类型', size: '大小', postTime: '贴文时间', downTime: '下载时间', action: '动作', go: '前往', del: '删除' } },
        'zh-Hant': { download: '下載', completed: '下載完成', settings: '設置', history: '下載紀錄', empty: '暫無紀錄。', unknown_date: '未知時間', saved: '已保存', dialog: { title: '下載設置', save: '保存', save_history: '保存下載記錄', auto_bookmark: '下載時自動加入書籤', clear_history: '(清除)', clear_confirm: '確認要清除下載記錄？', pattern: '文件名規則', preview: '預覽:', empty_pattern: '文件名規則不能為空。', reset: '(重置)', custom_mode: '(自訂模式)', tag_mode: '(標籤模式)', shortcut: '快捷鍵設定:', tags: { '{user-name}': '使用者名稱', '{user-id}': '使用者帳號', '{status-id}': '推文 ID', '{date-time}': '時間 (UTC)', '{date-time-local}': '時間 (本地)', '{full-text}': '推文內文', '{fav-count}': '喜歡數量', '{file-type}': '媒體類型', '{file-name}': '原始檔名', '{media-count}': '媒體總數', '{index}': '排序序號' } }, table: { thumb: '縮圖', user: '用戶', type: '類型', size: '大小', postTime: '貼文時間', downTime: '下載時間', action: '動作', go: '前往', del: '刪除' } }
    };
 
    static logIconUri = `data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cline x1='16' y1='13' x2='8' y2='13'%3E%3C/line%3E%3Cline x1='16' y1='17' x2='8' y2='17'%3E%3C/line%3E%3Cpolyline points='10 9 9 9 8 9'%3E%3C/polyline%3E%3C/svg%3E`;
 
    static media_btn_css = `
        .tmd-down {margin-left: 12px; order: 99; position: relative;}
        .tmd-down:hover > div > div > div > div {color: #FFD700;}
        .tmd-down:hover > div > div > div > div > div {background-color: rgba(255, 215, 0, 0.1);}
        .tmd-down:active > div > div > div > div > div {background-color: rgba(255, 215, 0, 0.2);}
        .tmd-down:hover svg {color: #FFD700;}
        .tmd-down:hover div:first-child:not(:last-child) {background-color: rgba(255, 215, 0, 0.1);}
        .tmd-down:active div:first-child:not(:last-child) {background-color: rgba(255, 215, 0, 0.2);}
        .tmd-down.tmd-media {position: absolute; right: 0;}
        .tmd-down.tmd-media > div {display: flex; border-radius: 99px; margin: 2px;}
        .tmd-down.tmd-media > div > div {display: flex; margin: 6px; color: #fff;}
        .tmd-down.tmd-media:hover > div {background-color: rgba(255,255,255, 0.6);}
        .tmd-down.tmd-media:hover > div > div {color: #FFD700;}
        .tmd-down.tmd-media:not(:hover) > div > div {filter: drop-shadow(0 0 1px #000);}
        .tmd-down g {display: none;}
        .tmd-down.download g.download, .tmd-down.completed g.completed, .tmd-down.exist g.completed, .tmd-down.loading g.loading,.tmd-down.failed g.failed {display: unset;}
        .tmd-down.exist svg {color: #FFD700;}
        .tmd-down.loading svg {animation: spin 1s linear infinite; color: #FFD700;}
        @keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}
        @keyframes tmd-pop-anim {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(1); }
        }
        @keyframes tmd-burst-anim {
            0% {
                box-shadow:
                    0 -10px 0 0 #00ba7c, 7px -7px 0 0 #FFD700,
                    10px 0 0 0 #00ba7c,  7px 7px 0 0 #FFD700,
                    0 10px 0 0 #00ba7c,  -7px 7px 0 0 #FFD700,
                    -10px 0 0 0 #00ba7c, -7px -7px 0 0 #FFD700;
                opacity: 1;
                transform: translate(-50%, -50%) scale(0.5);
            }
            100% {
                box-shadow:
                    0 -25px 0 0 #00ba7c, 18px -18px 0 0 #FFD700,
                    25px 0 0 0 #00ba7c,  18px 18px 0 0 #FFD700,
                    0 25px 0 0 #00ba7c,  -18px 18px 0 0 #FFD700,
                    -25px 0 0 0 #00ba7c, -18px -18px 0 0 #FFD700;
                opacity: 0;
                transform: translate(-50%, -50%) scale(1.2);
            }
        }
        .tmd-down.completed svg {
            color: #00ba7c;
            animation: tmd-pop-anim 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .tmd-down.completed:hover div:first-child:not(:last-child) {
            background-color: rgba(0, 186, 124, 0.2);
        }
        .tmd-down.completed::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: tmd-burst-anim 0.6s ease-out forwards;
            pointer-events: none;
        }
        .tmd-down.tmd-img {position: absolute; right: 0; bottom: 0; display: none !important;}
        .tmd-down.tmd-img > div {display: flex; border-radius: 99px; margin: 2px; background-color: rgba(255,255,255, 0.6);}
        .tmd-down.tmd-img > div > div {display: flex; margin: 6px; color: #fff !important;}
        .tmd-down.tmd-img:not(:hover) > div > div {filter: drop-shadow(0 0 1px #000);}
        .tmd-down.tmd-img:hover > div > div {color: #FFD700;}
        :hover > .tmd-down.tmd-img, .tmd-img.loading, .tmd-img.completed, .tmd-img.exist, .tmd-img.failed {display: block !important;}
        .tweet-detail-action-item {width: 20% !important;}
    `;
 
    static modal_structure_css = `
        .tmd-modal-wrapper {position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10000; display: flex; justify-content: center; align-items: center;}
        .tmd-modal-dialog {background-color: #fff; border-radius: 10px; width: 850px; max-width: 95vw; display: flex; flex-direction: column; color: #0f1419; font-family: sans-serif; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: background-color 0.2s, color 0.2s;}
        .tmd-modal-header {padding: 15px 20px; border-bottom: 1px solid #eff3f4; display: flex; justify-content: space-between; align-items: center; background: #f7f9f9; transition: background-color 0.2s;}
        .tmd-modal-header-left {display: flex; align-items: center; gap: 10px;}
        .tmd-modal-title {margin: 0; font-size: 18px; font-weight: bold;}
        .tmd-modal-actions {display: flex; align-items: center; gap: 15px;}
        .tmd-icon-btn {cursor: pointer; display: flex; align-items: center; color: #536471; background: none; border: none; padding: 0; transition: color 0.2s;}
        .tmd-icon-btn:hover {color: #0f1419;}
        .tmd-icon-btn.danger {color: #f4212e;}
        .tmd-icon-btn.danger:hover {color: #c50f1a;}
        .tmd-modal-content {overflow-y: auto; max-height: 50vh; padding: 0;}
        .tmd-modal-settings {padding: 20px; overflow-y: auto; max-height: 50vh;}
        .tmd-empty-text {text-align: center; color: #536471; margin: 20px 0; padding: 20px;}
        .tmd-modal-content::-webkit-scrollbar, .tmd-table-wrapper::-webkit-scrollbar {width: 8px; height: 8px;}
        .tmd-modal-content::-webkit-scrollbar-track, .tmd-table-wrapper::-webkit-scrollbar-track {background: #ffffff; border-radius: 4px;}
        .tmd-modal-content::-webkit-scrollbar-thumb, .tmd-table-wrapper::-webkit-scrollbar-thumb {background: #cccccc; border-radius: 4px;}
        .tmd-modal-content::-webkit-scrollbar-thumb:hover, .tmd-table-wrapper::-webkit-scrollbar-thumb:hover {background: #b3b3b3;}
        select.tmd-lang-select { background: #fff; color: #0f1419; border: 1px solid #cfd9de; border-radius: 4px; padding: 4px; font-size: 13px; outline: none; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .tmd-dark-theme { background-color: #15202b; color: #fff; border: 1px solid #38444d; box-shadow: 0 4px 12px rgba(255,255,255,0.05); }
        .tmd-dark-theme .tmd-modal-header { background: #1e2732; border-bottom: 1px solid #38444d; }
        .tmd-dark-theme .tmd-icon-btn { color: #8899a6; }
        .tmd-dark-theme .tmd-icon-btn:hover { color: #fff; }
        .tmd-dark-theme .tmd-empty-text { color: #8899a6; }
        .tmd-dark-theme .tmd-table th { background: #1e2732; color: #8899a6; border-bottom: 1px solid #38444d; box-shadow: 0 1px 0 #38444d; }
        .tmd-dark-theme .tmd-table td, .tmd-dark-theme .tmd-log-item { border-bottom: 1px solid #38444d; }
        .tmd-dark-theme .tmd-table tbody tr:hover { background: #1e2732; }
        .tmd-dark-theme .tmd-action-btn { background: #1e2732; border-color: #38444d; color: #fff; }
        .tmd-dark-theme .tmd-action-btn:hover { background: #2c3640; }
        .tmd-dark-theme .tmd-action-btn.del { background: transparent; border-color: #5c1822; color: #f4212e; }
        .tmd-dark-theme .tmd-action-btn.del:hover { background: #311319; }
        .tmd-dark-theme .tmd-textarea { background: #000; border-color: #38444d; color: #fff; }
        .tmd-dark-theme .tmd-tag-btn { background: #1e2732; border-color: #38444d; color: #8899a6; }
        .tmd-dark-theme .tmd-tag-btn:hover { background: #2c3640; color: #1d9bf0; border-color: #1d9bf0; }
        .tmd-dark-theme .tmd-preview-box { background: #1e2732; border-color: #38444d; color: #fff; }
        .tmd-dark-theme select.tmd-lang-select { background: #1e2732; color: #fff; border-color: #38444d; }
        .tmd-dark-theme .tmd-modal-content::-webkit-scrollbar-track, .tmd-dark-theme .tmd-table-wrapper::-webkit-scrollbar-track {background: #15202b;}
        .tmd-dark-theme .tmd-modal-content::-webkit-scrollbar-thumb, .tmd-dark-theme .tmd-table-wrapper::-webkit-scrollbar-thumb {background: #38444d;}
        .tmd-dark-theme .tmd-modal-content::-webkit-scrollbar-thumb:hover, .tmd-dark-theme .tmd-table-wrapper::-webkit-scrollbar-thumb:hover {background: #8899a6;}
    `;
 
    static history_log_css = `
        .tmd-history-btn {position: fixed; left: 16px; bottom: 16px; color: #000; background: #fff; border: 1px solid #ccc; border-radius: 8px; padding: 4px; display: flex; align-items: center; cursor: pointer; z-index: 9999; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: 0.2s;}
        .tmd-history-btn:hover {background: #f0f0f0;}
        .tmd-history-btn.tmd-dark-theme {background: #15202b; color: #fff; border-color: #38444d;}
        .tmd-history-btn.tmd-dark-theme:hover {background: #1e2732;}
        .tmd-history-btn label {display: inline-flex; align-items: center; margin: 0 8px; cursor: pointer; font-family: monospace; font-size: 14px;}
 
        .tmd-table-wrapper { width: 100%; overflow-x: auto; }
        .tmd-table { width: max-content; min-width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; font-family: sans-serif; white-space: nowrap; }
        .tmd-table th, .tmd-table td { border-bottom: 1px solid #eff3f4; vertical-align: middle; }
 
        .tmd-table td {
            padding: 10px 15px;
            max-width: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
 
        .tmd-table td:last-child { max-width: none; overflow: visible; }
        .tmd-table th { background: #f7f9f9; color: #536471; position: sticky; top: 0; z-index: 10; font-weight: bold; box-shadow: 0 1px 0 #eff3f4; padding: 0; }
        .tmd-table th:nth-child(1) .tmd-th-inner { width: 65px; }
        .tmd-table th:nth-child(2) .tmd-th-inner { width: 140px; }
        .tmd-table th:nth-child(3) .tmd-th-inner { width: 70px; }
        .tmd-table th:nth-child(4) .tmd-th-inner { width: 90px; }
        .tmd-table th:nth-child(5) .tmd-th-inner { width: 130px; }
        .tmd-table th:nth-child(6) .tmd-th-inner { width: 130px; }
        .tmd-table th:nth-child(7) .tmd-th-inner { width: 120px; resize: none; }
 
        .tmd-th-inner { resize: horizontal; overflow: hidden; padding: 10px 15px; min-width: 40px; display: block; box-sizing: border-box; }
        .tmd-table tbody tr:hover { background: #f7f9f9; }
        .tmd-thumb { width: 44px; height: 44px; object-fit: cover; border-radius: 6px; background: #eee; display: block; }
        .tmd-action-btn { background: #eff3f4; border: 1px solid #cfd9de; padding: 6px 12px; border-radius: 99px; cursor: pointer; color: #0f1419; font-size: 12px; margin-right: 6px; font-weight: bold; transition: 0.2s; }
        .tmd-action-btn:hover { background: #e1e8ed; }
        .tmd-action-btn.del { color: #f4212e; border-color: #fcaeb4; background: #fff; }
        .tmd-action-btn.del:hover { background: #fce8e8; }
    `;
 
    static settings_form_css = `
        .tmd-checkbox-label {display: flex; align-items: center; margin-bottom: 20px; cursor: pointer; font-size: 15px;}
        .tmd-checkbox-label input {margin-right: 10px; cursor: pointer; width: 16px; height: 16px;}
        .tmd-pattern-header {display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px;}
        .tmd-pattern-label {font-weight: bold; font-size: 15px;}
        .tmd-modal-actions {display: flex; gap: 10px;}
        .tmd-btn-reset {cursor: pointer; color: #1d9bf0; font-size: 13px; border: none; background: none; padding: 0;}
        .tmd-btn-reset:hover {text-decoration: underline;}
        .tmd-textarea {width: 100%; height: 80px; box-sizing: border-box; padding: 10px; border: 1px solid #cfd9de; border-radius: 4px; font-family: monospace; resize: vertical; font-size: 14px; color: #fff; background-color: #15202b;}
        .tmd-textarea:focus {outline: none; border-color: #1d9bf0;}
        .tmd-preview-box {margin-top: 10px; padding: 12px; background: #f7f9f9; border: 1px solid #eff3f4; border-radius: 4px; font-family: monospace; font-size: 13px; color: #0f1419; word-break: break-all;}
        .tmd-preview-error {color: #f4212e; font-size: 13px; margin-top: 8px; display: none;}
        .tmd-btn-save {margin-top: 20px; padding: 8px 24px; background: #1d9bf0; color: #fff; border: none; border-radius: 9999px; cursor: pointer; font-weight: bold; font-size: 15px; display: block; margin-left: auto; text-align: center; transition: background 0.2s;}
        .tmd-btn-save:hover:not(:disabled) {background: #1a8cd8;}
        .tmd-btn-save:disabled {background: #8ecdf8; cursor: not-allowed;}
        .tmd-btn-save.saved {background: #00ba7c; cursor: default;}
        .tmd-active-tags-box { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; background: #f7f9f9; border: 1px solid #eff3f4; border-radius: 6px; min-height: 52px; margin-bottom: 12px; transition: 0.2s; }
        .tmd-active-tag { display: flex; align-items: center; background: #fff; border: 1px solid #cfd9de; border-radius: 99px; padding: 4px 10px; font-size: 13px; font-weight: bold; cursor: grab; box-shadow: 0 1px 3px rgba(0,0,0,0.05); user-select: none; transition: 0.2s; }
        .tmd-active-tag.dragging { opacity: 0.3; cursor: grabbing; border-color: #1d9bf0; }
        .tmd-drag-handle { margin-right: 6px; color: #8899a6; display: flex; align-items: center; }
        .tmd-tag-close { margin-left: 6px; cursor: pointer; color: #8899a6; display: flex; align-items: center; border-radius: 50%; padding: 2px; }
        .tmd-tag-close:hover { background: #eff3f4; color: #f4212e; }
        .tmd-available-tags-box { display: flex; flex-wrap: wrap; gap: 8px; }
        .tmd-available-tag { background: #50e3c2; color: #000; padding: 6px 12px; border-radius: 99px; font-size: 13px; font-weight: bold; cursor: pointer; transition: 0.2s; user-select: none; }
        .tmd-available-tag:hover { filter: brightness(0.9); }
        .tmd-tag-container { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .tmd-tag-btn { background: #eff3f4; border: 1px solid #cfd9de; border-radius: 4px; padding: 4px 8px; font-family: monospace; font-size: 12px; color: #536471; cursor: pointer; transition: 0.2s; }
        .tmd-tag-btn:hover { background: #e1e8ed; color: #1d9bf0; border-color: #1d9bf0; }
        .tmd-dark-theme .tmd-active-tags-box { background: #15202b; border-color: #38444d; }
        .tmd-dark-theme .tmd-active-tag { background: #1e2732; border-color: #38444d; color: #fff; }
        .tmd-dark-theme .tmd-tag-close:hover { background: #2c3640; }
        .tmd-dark-theme .tmd-available-tag { background: #2c9a82; color: #fff; }
        .tmd-dark-theme .tmd-preview-box { background: #1e2732; border-color: #38444d; color: #fff; }
        .tmd-dark-theme .tmd-textarea { background: #000; border-color: #38444d; color: #fff; }
        .tmd-dark-theme .tmd-tag-btn { background: #1e2732; border-color: #38444d; color: #8899a6; }
        .tmd-dark-theme .tmd-tag-btn:hover { background: #2c3640; color: #1d9bf0; border-color: #1d9bf0; }
    `;
 
    static svg = `
        <g class="download">
            <path d="M7 11l5 5 5-5M12 4v12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </g>
        <g class="completed">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <polyline points="8 11 11 14 17 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <g class="loading">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
            <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        </g>
        <g class="failed">
            <circle cx="12" cy="12" r="11" fill="#f33" stroke="currentColor" stroke-width="2" opacity="0.8"/>
            <path d="M14.5 7.5l-5 9M9.5 7.5l5 9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        </g>
    `;
 
    static icon_svg = {
        back: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
        settings: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
        clear: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
        close: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        sun: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
        moon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
    };
}
 
 
class Utils {
    static getCookie(name) {
        let cookies = {};
        document.cookie.split(';').filter(n => n.includes('=')).forEach(n => {
            n.replace(/^([^=]+)=(.+)$/, (_, key, value) => { cookies[key.trim()] = value.trim(); });
        });
        return name ? cookies[name] : cookies;
    }
 
    static formatDate(i, o, tz) {
        let d = new Date(i);
        if (tz) d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        let m = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        let v = {
            YYYY: d.getUTCFullYear().toString(), YY: d.getUTCFullYear().toString(),
            MM: d.getUTCMonth() + 1, MMM: m[d.getUTCMonth()], DD: d.getUTCDate(),
            hh: d.getUTCHours(), mm: d.getUTCMinutes(), ss: d.getUTCSeconds(),
            h2: d.getUTCHours() % 12, ap: d.getUTCHours() < 12 ? 'AM' : 'PM'
        };
        return o.replace(/(YY(YY)?|MMM?|DD|hh|mm|ss|h2|ap)/g, n => ('0' + v[n]).slice(-n.length));
    }
 
    static getInvalidChars() {
        return {
            "\n": "　", "\t": "　", "\\": "⧹", "/": "⧸", "|": "｜", ":": "꞉", "*": "＊", "?": "？", '"': '″', "<": "＜", ">": "＞", '\u200b': '', '\u200c': '', '\u200d': '', '\u2060': '', '\ufeff': '', '🔞': ''
        };
    }
}
 
 
class StorageManager {
    constructor() {
        this.history = [];
        this.saveHistoryFlag = true;
        this.autoBookmarkFlag = false;
        this.filenamePattern = Config.defaultFilename;
        this.shortcutKey = 'D';
        this.theme = 'light';
        this.lang = 'auto';
    }
 
    async init() {
        let rawHistory = await GM_getValue('download_history', []);
        this.history = rawHistory.map(item => typeof item === 'string' ? { id: item, time: null } : item);
        this.saveHistoryFlag = await GM_getValue('save_history', true);
        this.autoBookmarkFlag = await GM_getValue('auto_bookmark', false);
        this.filenamePattern = await GM_getValue('filename', Config.defaultFilename);
        this.shortcutKey = await GM_getValue('shortcut_key', 'D');
        this.theme = await GM_getValue('tmd_theme', 'light');
        this.lang = await GM_getValue('tmd_lang', 'auto');
    }
 
    async setSetting(key, value) {
        await GM_setValue(key, value);
        if (key === 'save_history') this.saveHistoryFlag = value;
        if (key === 'auto_bookmark') this.autoBookmarkFlag = value;
        if (key === 'filename') this.filenamePattern = value;
        if (key === 'shortcut_key') this.shortcutKey = value;
        if (key === 'tmd_theme') this.theme = value;
        if (key === 'tmd_lang') this.lang = value;
    }
 
    async addHistory(infoObj) {
        if (infoObj.id && !this.isDownloaded(infoObj.id)) {
            this.history.push({ ...infoObj, time: Date.now() });
            await GM_setValue('download_history', this.history);
        }
    }
 
    isDownloaded(statusId) {
        return this.history.some(item => item.id === statusId);
    }
 
    async clearHistory() {
        this.history = [];
        await GM_setValue('download_history', []);
    }
 
    async removeHistory(id) {
        this.history = this.history.filter(item => item.id !== id);
        await GM_setValue('download_history', this.history);
    }
}
 
 
class TwitterAPI {
    static async fetchTweetJson(status_id) {
        const cookies = Utils.getCookie();
        let url = encodeURI(`https://${location.hostname}/i/api/graphql/2ICDjqPd81tulZcYrtpTuQ/TweetResultByRestId?variables=${JSON.stringify({
            tweetId: status_id,
            with_rux_injections: false,
            includePromotedContent: true,
            withCommunity: true,
            withQuickPromoteEligibilityTweetFields: true,
            withBirdwatchNotes: true,
            withVoice: true,
            withV2Timeline: true
        })}&features=${JSON.stringify({
            "articles_preview_enabled": true,
            "c9s_tweet_anatomy_moderator_badge_enabled": true,
            "communities_web_enable_tweet_community_results_fetch": false,
            "creator_subscriptions_quote_tweet_preview_enabled": false,
            "creator_subscriptions_tweet_preview_api_enabled": false,
            "freedom_of_speech_not_reach_fetch_enabled": true,
            "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
            "longform_notetweets_consumption_enabled": false,
            "longform_notetweets_inline_media_enabled": true,
            "longform_notetweets_rich_text_read_enabled": false,
            "premium_content_api_read_enabled": false,
            "profile_label_improvements_pcf_label_in_post_enabled": true,
            "responsive_web_edit_tweet_api_enabled": false,
            "responsive_web_enhance_cards_enabled": false,
            "responsive_web_graphql_exclude_directive_enabled": false,
            "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
            "responsive_web_graphql_timeline_navigation_enabled": false,
            "responsive_web_grok_analysis_button_from_backend": false,
            "responsive_web_grok_analyze_button_fetch_trends_enabled": false,
            "responsive_web_grok_analyze_post_followups_enabled": false,
            "responsive_web_grok_image_annotation_enabled": false,
            "responsive_web_grok_share_attachment_enabled": false,
            "responsive_web_grok_show_grok_translated_post": false,
            "responsive_web_jetfuel_frame": false,
            "responsive_web_media_download_video_enabled": false,
            "responsive_web_twitter_article_tweet_consumption_enabled": true,
            "rweb_tipjar_consumption_enabled": true,
            "rweb_video_screen_enabled": false,
            "standardized_nudges_misinfo": true,
            "tweet_awards_web_tipping_enabled": false,
            "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
            "tweetypie_unmention_optimization_enabled": false,
            "verified_phone_label_enabled": false,
            "view_counts_everywhere_api_enabled": true
        })}`);
 
        let headers = {
            'authorization': Config.AUTH_TOKEN,
            'x-twitter-active-user': 'yes',
            'x-twitter-client-language': cookies.lang || 'en'
        };
 
        if (cookies.ct0) headers['x-csrf-token'] = cookies.ct0;
        if (cookies.gt) headers['x-guest-token'] = cookies.gt;
 
        let res = await fetch(url, { headers });
        if (!res.ok) throw new Error("API Fetch Failed");
 
        let tweet_detail = await res.json();
        return tweet_detail.data?.tweetResult?.result?.tweet || tweet_detail.data?.tweetResult?.result;
    }
}
 
 
class DownloadQueue {
    constructor() {
        this.tasks = [];
        this.thread = 0;
        this.max_thread = 2;
    }
 
    add(task) {
        this.tasks.push(task);
        if (this.thread < this.max_thread) {
            this.thread++;
            this.next();
        }
    }
 
    async next() {
        if (this.tasks.length === 0) {
            this.thread--;
            return;
        }
        let task = this.tasks.shift();
        await this.start(task);
        this.next();
    }
 
    start(task) {
        return new Promise(resolve => {
            GM_download({
                url: task.url,
                name: task.name,
                onload: () => { task.onload(); resolve(); },
                onerror: r => { task.onerror(r); this.retry(task); resolve(); },
                ontimeout: r => { task.onerror(r); this.retry(task); resolve(); }
            });
        });
    }
 
    retry(task) {
        task.retry = (task.retry || 0) + 1;
        if (task.retry <= 2) {
            this.max_thread = 1;
            this.tasks.push(task);
        }
    }
}
 
class UIManager {
    constructor(app) {
        this.app = app;
        this.lang = Config.language[document.documentElement.lang] || Config.language.en;
    }
 
    injectCSS() {
        document.head.insertAdjacentHTML('beforeend', `<style>${Config.media_btn_css}${Config.modal_structure_css}${Config.history_log_css}${Config.settings_form_css}</style>`);
    }
 
    setButtonStatus(btn, css, title) {
        if (css) {
            btn.classList.remove('download', 'completed', 'exist', 'loading', 'failed');
            btn.classList.add(css);
        }
        if (title) btn.title = title;
    }
 
    renderHistoryUI() {
        const float_btn_css = `.tmd-history-btn label:before {content: " "; width: 32px; height: 16px; background-position: center; background-repeat: no-repeat; background-image:url("${Config.logIconUri}");}`;
        document.head.insertAdjacentHTML('beforeend', `<style>${float_btn_css}</style>`);
 
        this.historyBtn = document.createElement('div');
        this.historyBtn.title = this.lang.history;
        this.historyBtn.classList.add('tmd-history-btn');
 
        if (this.app.storage.theme === 'dark') {
            this.historyBtn.classList.add('tmd-dark-theme');
        }
 
        this.historyBtn.innerHTML = `<label>${this.app.storage.history.length}</label>`;
        document.body.appendChild(this.historyBtn);
 
        this.historyBtn.onclick = () => this.showModal();
    }
 
    updateHistoryCount() {
        if (this.historyBtn) {
            this.historyBtn.querySelector('label').innerText = this.app.storage.history.length;
        }
    }
 
    getLang() {
        let pref = this.app.storage.lang;
        if (pref !== 'auto' && Config.language[pref]) {
            return Config.language[pref];
        }
        return Config.language[document.documentElement.lang] || Config.language.en;
    }
 
    showModal(startView = 'history') {
        let currentView = startView;
        this.lang = this.getLang();
 
        const $element = (parent, tag, className, content) => {
            let el = document.createElement(tag);
            if (className) el.className = className;
            if (content) el.innerHTML = content;
            parent.appendChild(el);
            return el;
        };
 
        const formatDt = (ts) => {
            if (!ts) return this.lang.unknown_date || 'Unknown Date';
            let d = new Date(ts);
            let pad = n => n.toString().padStart(2, '0');
            return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };
 
        let wapper = $element(document.body, 'div', 'tmd-modal-wrapper');
        wapper.onclick = (e) => { if (e.target === wapper) wapper.remove(); };
 
        let dialog = $element(wapper, 'div', 'tmd-modal-dialog');
        if (this.app.storage.theme === 'dark') dialog.classList.add('tmd-dark-theme');
 
        let header = $element(dialog, 'div', 'tmd-modal-header');
        let headerLeft = $element(header, 'div', 'tmd-modal-header-left');
        let backIcon = (Config.icon_svg && Config.icon_svg.back) ? Config.icon_svg.back : '←';
        let backBtn = $element(headerLeft, 'button', 'tmd-icon-btn', backIcon);
        let titleEl = $element(headerLeft, 'h3', 'tmd-modal-title', '');
        let headerActions = $element(header, 'div', 'tmd-modal-actions');
 
        let langSelect = $element(headerActions, 'select', 'tmd-lang-select');
        let langOptions = [
            { val: 'auto', txt: 'Auto' },
            { val: 'en', txt: 'English' },
            { val: 'ja', txt: '日本語' },
            { val: 'zh', txt: '简体中文' },
            { val: 'zh-Hant', txt: '繁體中文' }
        ];
        langOptions.forEach(l => {
            let opt = $element(langSelect, 'option', '', l.txt);
            opt.value = l.val;
            if (this.app.storage.lang === l.val) opt.selected = true;
        });
 
        langSelect.onchange = async () => {
            await this.app.storage.setSetting('tmd_lang', langSelect.value);
            wapper.remove();
            this.showModal(currentView);
        };
 
        let themeBtn = $element(headerActions, 'button', 'tmd-icon-btn');
        let sunIcon = (Config.icon_svg && Config.icon_svg.sun) ? Config.icon_svg.sun : 'S';
        let moonIcon = (Config.icon_svg && Config.icon_svg.moon) ? Config.icon_svg.moon : 'M';
        themeBtn.innerHTML = this.app.storage.theme === 'dark' ? sunIcon : moonIcon;
        themeBtn.title = 'Toggle Theme';
        themeBtn.onclick = async () => {
            let newTheme = this.app.storage.theme === 'dark' ? 'light' : 'dark';
            await this.app.storage.setSetting('tmd_theme', newTheme);
            themeBtn.innerHTML = newTheme === 'dark' ? sunIcon : moonIcon;
            dialog.classList.toggle('tmd-dark-theme', newTheme === 'dark');
            if (this.historyBtn) {
                this.historyBtn.classList.toggle('tmd-dark-theme', newTheme === 'dark');
            }
        };
 
        let setIcon = (Config.icon_svg && Config.icon_svg.settings) ? Config.icon_svg.settings : '⚙';
        let settingsBtn = $element(headerActions, 'button', 'tmd-icon-btn', setIcon);
        settingsBtn.title = this.lang.settings || 'Settings';
 
        let clearIcon = (Config.icon_svg && Config.icon_svg.clear) ? Config.icon_svg.clear : '🗑';
        let clearBtn = $element(headerActions, 'button', 'tmd-icon-btn danger', clearIcon);
        const dialogLang = this.lang.dialog || {};
        clearBtn.title = dialogLang.clear_history || 'Clear History';
 
        let closeIcon = (Config.icon_svg && Config.icon_svg.close) ? Config.icon_svg.close : 'X';
        let closeBtn = $element(headerActions, 'button', 'tmd-icon-btn', closeIcon);
        closeBtn.onclick = () => wapper.remove();
 
        let historyContainer = $element(dialog, 'div', 'tmd-modal-content');
        let settingsContainer = $element(dialog, 'div', 'tmd-modal-settings');
        let top_settings_row = $element(settingsContainer, 'div', 'tmd-pattern-header');
        top_settings_row.style.alignItems = 'center';
 
        let left_checkbox_group = $element(top_settings_row, 'div');
        left_checkbox_group.style.display = 'flex';
        left_checkbox_group.style.flexDirection = 'column';
        left_checkbox_group.style.gap = '10px';
 
        let save_history_label = $element(left_checkbox_group, 'label', 'tmd-checkbox-label');
        save_history_label.style.marginBottom = '0';
        let save_history_input = $element(save_history_label, 'input');
        save_history_input.type = 'checkbox';
        save_history_input.checked = this.app.storage.saveHistoryFlag;
        $element(save_history_label, 'span', '', dialogLang.save_history || 'Remember download history');
 
        let auto_bookmark_label = $element(left_checkbox_group, 'label', 'tmd-checkbox-label');
        auto_bookmark_label.style.marginBottom = '0';
        let auto_bookmark_input = $element(auto_bookmark_label, 'input');
        auto_bookmark_input.type = 'checkbox';
        auto_bookmark_input.checked = this.app.storage.autoBookmarkFlag;
        $element(auto_bookmark_label, 'span', '', dialogLang.auto_bookmark || 'Auto Bookmark');
 
        let shortcut_label = $element(top_settings_row, 'div', 'tmd-pattern-label');
        shortcut_label.style.marginBottom = '0';
        shortcut_label.innerHTML = `${dialogLang.shortcut || 'Shortcut:'}`;
        let shortcut_input = $element(shortcut_label, 'input', 'tmd-textarea');
        shortcut_input.style.cssText = 'width: 50px; height: 32px; padding: 4px; text-align: center; margin-left: 10px; font-weight: bold; text-transform: uppercase; display: inline-block;';
        shortcut_input.maxLength = 1;
        shortcut_input.value = this.app.storage.shortcutKey || 'D';
        shortcut_input.oninput = () => { shortcut_input.value = shortcut_input.value.toUpperCase(); };
 
        let pattern_header = $element(settingsContainer, 'div', 'tmd-pattern-header');
        pattern_header.style.marginTop = '20px';
        $element(pattern_header, 'label', 'tmd-pattern-label', dialogLang.pattern || 'File Pattern');
 
        let pattern_actions = $element(pattern_header, 'div', 'tmd-modal-actions');
        let modeBtn = $element(pattern_actions, 'button', 'tmd-btn-reset');
        let resetBtn = $element(pattern_actions, 'button', 'tmd-btn-reset', dialogLang.reset || '(Reset)');
 
        let tag_mode_ui = $element(settingsContainer, 'div');
        let active_container = $element(tag_mode_ui, 'div', 'tmd-active-tags-box');
        let available_container = $element(tag_mode_ui, 'div', 'tmd-available-tags-box');
 
        let custom_mode_ui = $element(settingsContainer, 'div');
        let pattern_input = $element(custom_mode_ui, 'textarea', 'tmd-textarea');
        let custom_tag_container = $element(custom_mode_ui, 'div', 'tmd-tag-container');
 
        const tagsDict = dialogLang.tags || {};
 
        const excludedTags = ['{media-count}', '{date-time}'];  // '{full-text}',
        let validTagsKeys = Object.keys(tagsDict).filter(tag => !excludedTags.includes(tag));
 
        validTagsKeys.forEach(tagText => {
            let btnText = `${tagsDict[tagText]}`;
            let tagBtn = $element(custom_tag_container, 'div', 'tmd-available-tag', btnText);
            tagBtn.onclick = () => {
                let start = pattern_input.selectionStart || 0;
                let end = pattern_input.selectionEnd || 0;
                let val = pattern_input.value || '';
                pattern_input.value = val.substring(0, start) + tagText + val.substring(end);
                pattern_input.selectionStart = pattern_input.selectionEnd = start + tagText.length;
                pattern_input.focus();
                updatePreview();
            };
        });
 
        let currentPattern = this.app.storage.filenamePattern || Config.defaultFilename || '{user-name}-{status-id}';
        let extracted = (currentPattern.match(/\{[^}]+\}/g) || []).filter(t => validTagsKeys.includes(t));
        let uniqueTags = [...new Set(extracted)];
 
        let isCustomMode = currentPattern !== uniqueTags.join('_');
        let activeTags = uniqueTags;
 
        const updateTagModeUI = () => {
            active_container.innerHTML = '';
            available_container.innerHTML = '';
            let draggedItem = null;
 
            activeTags.forEach((tag, idx) => {
                let el = $element(active_container, 'div', 'tmd-active-tag');
                el.draggable = true;
                el.dataset.idx = idx;
 
                el.innerHTML = `
                    <span class="tmd-drag-handle"><svg viewBox="0 0 10 10" width="12" height="12" fill="currentColor"><path d="M3 2a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm4-8a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2z"/></svg></span>
                    ${tagsDict[tag]}
                    <span class="tmd-tag-close"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
                `;
 
                el.ondragstart = function (e) { draggedItem = this; e.dataTransfer.effectAllowed = 'move'; setTimeout(() => this.classList.add('dragging'), 0); };
                el.ondragend = function () { this.classList.remove('dragging'); draggedItem = null; };
                el.ondragover = function (e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; return false; };
 
                el.ondrop = function (e) {
                    e.stopPropagation();
                    if (draggedItem && draggedItem !== this) {
                        let fromIdx = parseInt(draggedItem.dataset.idx);
                        let toIdx = parseInt(this.dataset.idx);
                        let [moved] = activeTags.splice(fromIdx, 1);
                        activeTags.splice(toIdx, 0, moved);
 
                        if (!isCustomMode) pattern_input.value = activeTags.join('_');
                        updateTagModeUI();
                        updatePreview();
                    }
                    return false;
                };
 
                el.querySelector('.tmd-tag-close').onclick = () => {
                    activeTags.splice(idx, 1);
                    if (!isCustomMode) pattern_input.value = activeTags.join('_');
                    updateTagModeUI();
                    updatePreview();
                };
            });
 
            validTagsKeys.forEach(tag => {
                if (!activeTags.includes(tag)) {
                    let el = $element(available_container, 'div', 'tmd-available-tag', tagsDict[tag]);
                    el.onclick = () => {
                        activeTags.push(tag);
                        if (!isCustomMode) pattern_input.value = activeTags.join('_');
                        updateTagModeUI();
                        updatePreview();
                    };
                }
            });
        };
 
        const toggleMode = () => {
            modeBtn.innerText = isCustomMode ? (dialogLang.tag_mode || 'Tag Mode') : (dialogLang.custom_mode || 'Custom Mode');
            tag_mode_ui.style.display = isCustomMode ? 'none' : 'block';
            custom_mode_ui.style.display = isCustomMode ? 'block' : 'none';
 
            if (!isCustomMode) {
                let currentText = pattern_input.value || '';
                let textExtracted = (currentText.match(/\{[^}]+\}/g) || []).filter(t => validTagsKeys.includes(t));
                activeTags = [...new Set(textExtracted)];
                pattern_input.value = activeTags.join('_');
                updateTagModeUI();
            }
            updatePreview();
        };
 
        modeBtn.onclick = () => { isCustomMode = !isCustomMode; toggleMode(); };
 
        resetBtn.onclick = () => {
            if (isCustomMode) {
                pattern_input.value = Config.defaultFilename || '{user-name}_{status-id}';
            } else {
                activeTags = ['{user-name}', '{status-id}', '{index}'];
                pattern_input.value = activeTags.join('_');
                updateTagModeUI();
            }
            updatePreview();
        };
 
        let preview_title = $element(settingsContainer, 'div', 'tmd-pattern-label', dialogLang.preview || 'Preview:');
        preview_title.style.marginTop = '15px';
        let preview_box = $element(settingsContainer, 'div', 'tmd-preview-box');
        let preview_error = $element(settingsContainer, 'div', 'tmd-preview-error', dialogLang.empty_pattern || 'Empty');
        let saveSettingsBtn = $element(settingsContainer, 'button', 'tmd-btn-save', dialogLang.save || 'Save');
 
        const updatePreview = () => {
            let val = pattern_input.value.trim();
            if (!val) {
                preview_error.style.display = 'block'; preview_box.style.display = 'none'; saveSettingsBtn.disabled = true; return;
            }
            preview_error.style.display = 'none'; preview_box.style.display = 'block'; saveSettingsBtn.disabled = false;
            let mockInfo = { 'status-id': '20231011', 'user-name': 'Jingliu', 'user-id': 'Jingliu_love', 'fav-count': '999', 'file-type': 'photo', 'file-name': 'original_pic', 'media-count': '2', 'index': '1' };
            let out = val.split('\n').join('');
            let invalid = Utils.getInvalidChars ? Utils.getInvalidChars() : {};
            let datetime = out.match(/{date-time(-local)?:[^{}]+}/) ? out.match(/{date-time(?:-local)?:([^{}]+)}/)[1].replace(/[\\/|<>*?:"]/g, v => invalid[v] || '') : 'YYYYMMDD-hhmmss';
 
            if (Utils.formatDate) {
                mockInfo['date-time'] = Utils.formatDate(Date.now(), datetime);
                mockInfo['date-time-local'] = Utils.formatDate(Date.now(), datetime, true);
            }
 
            let textLength = out.match(/{full-text:(\d+)}/) ? parseInt(out.match(/{full-text:(\d+)}/)[1], 10) : 999;
            mockInfo['full-text'] = 'This is a sample tweet text preview.'.substring(0, textLength);
 
            let parsed = (out.replace(/\.?{file-ext}/, '') + (!out.includes('{index}') && !out.includes('{file-name}') ? '-1' : '') + '.jpg').replace(/{([^{}:]+)(:[^{}]+)?}/g, (_, name) => mockInfo[name] != null ? mockInfo[name] : '');
            preview_box.innerText = parsed;
        };
        pattern_input.addEventListener('input', updatePreview);
 
        pattern_input.value = currentPattern;
        updateTagModeUI();
        toggleMode();
 
        const updateView = () => {
            if (currentView === 'history') {
                let histLen = this.app.storage.history ? this.app.storage.history.length : 0;
                titleEl.innerText = `${this.lang.history || 'History'} (${histLen})`;
                backBtn.style.display = 'none'; settingsBtn.style.display = 'flex'; clearBtn.style.display = 'flex';
                historyContainer.style.display = 'block'; settingsContainer.style.display = 'none';
 
                historyContainer.innerHTML = '';
                if (histLen === 0) {
                    $element(historyContainer, 'p', 'tmd-empty-text', this.lang.empty || 'Empty');
                } else {
                    let tableWrap = $element(historyContainer, 'div', 'tmd-table-wrapper');
                    let table = $element(tableWrap, 'table', 'tmd-table');
                    let thead = $element(table, 'thead');
                    let trHead = $element(thead, 'tr');
 
                    const tableLang = this.lang.table || {};
                    ['thumb', 'user', 'type', 'size', 'postTime', 'downTime', 'action'].forEach(k => {
                        let th = $element(trHead, 'th');
                        $element(th, 'div', 'tmd-th-inner', tableLang[k] || k);
                    });
 
                    let tbody = $element(table, 'tbody');
                    let historyCopy = [...this.app.storage.history].reverse();
 
                    historyCopy.forEach(item => {
                        let tr = $element(tbody, 'tr');
 
                        let tdThumb = $element(tr, 'td');
                        if (item.thumb) {
                            let img = $element(tdThumb, 'img', 'tmd-thumb');
                            img.src = item.thumb;
                        } else { tdThumb.innerText = '-'; }
 
                        $element(tr, 'td', '', item.user || '-');
                        $element(tr, 'td', '', item.type || '-');
                        $element(tr, 'td', '', item.size || 'Unknown');
                        $element(tr, 'td', '', formatDt(item.postTime));
                        $element(tr, 'td', '', formatDt(item.time));
 
                        let tdAction = $element(tr, 'td');
                        let goBtn = $element(tdAction, 'button', 'tmd-action-btn', tableLang.go || 'Go');
                        goBtn.onclick = () => window.open(`https://x.com/i/status/${item.id}`, '_blank');
 
                        let delBtn = $element(tdAction, 'button', 'tmd-action-btn del', tableLang.del || 'Delete');
                        delBtn.onclick = async () => {
                            await this.app.storage.removeHistory(item.id);
                            if (this.updateHistoryCount) this.updateHistoryCount();
                            updateView();
                        };
                    });
                }
            } else {
                titleEl.innerText = dialogLang.title || 'Settings';
                backBtn.style.display = 'flex'; settingsBtn.style.display = 'none'; clearBtn.style.display = 'none';
                historyContainer.style.display = 'none'; settingsContainer.style.display = 'block';
            }
        };
 
        settingsBtn.onclick = () => { currentView = 'settings'; updateView(); };
        backBtn.onclick = () => { currentView = 'history'; updateView(); };
 
        clearBtn.onclick = async () => {
            if (confirm(dialogLang.clear_confirm || 'Clear all?')) {
                await this.app.storage.clearHistory();
                if (this.updateHistoryCount) this.updateHistoryCount();
                updateView();
            }
        };
 
        saveSettingsBtn.onclick = async () => {
            await this.app.storage.setSetting('save_history', save_history_input.checked);
            await this.app.storage.setSetting('auto_bookmark', auto_bookmark_input.checked);
            await this.app.storage.setSetting('filename', pattern_input.value);
            await this.app.storage.setSetting('shortcut_key', shortcut_input.value);
 
            saveSettingsBtn.innerText = this.lang.saved || 'Saved';
            saveSettingsBtn.classList.add('saved'); saveSettingsBtn.disabled = true;
            setTimeout(() => wapper.remove(), 200);
        };
 
        updateView();
    }
 
    addButtonsToArticle(article) {
        if (article.dataset.detected) return;
        article.dataset.detected = 'true';
 
        let media = article.querySelector(['a[href*="/photo/1"]', 'div[role="progressbar"]', 'button[data-testid="playButton"]', 'a[href="/settings/content_you_see"]', 'div.media-image-container', 'div.media-preview-container', 'div[aria-labelledby]>div:first-child>div[role="button"][tabindex="0"]'].join(','));
        if (media) {
            let status_id = article.querySelector('a[href*="/status/"]').href.split('/status/').pop().split('/').shift();
            let btn_share = Array.from(article.querySelector('div[role="group"]:last-of-type, ul.tweet-actions, ul.tweet-detail-actions').querySelectorAll(':scope>div>div, li.tweet-action-item>a, li.tweet-detail-action-item>a')).pop().parentNode;
            let btn_down = btn_share.cloneNode(true);
 
            btn_down.querySelector('button')?.removeAttribute('disabled');
            if (this.app.isTweetDeck) {
                btn_down.firstElementChild.innerHTML = `<svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">${Config.svg}</svg>`;
                btn_down.firstElementChild.removeAttribute('rel');
                btn_down.classList.replace("pull-left", "pull-right");
            } else {
                btn_down.querySelector('svg').innerHTML = Config.svg;
            }
 
            let is_exist = this.app.storage.isDownloaded(status_id);
            this.setButtonStatus(btn_down, 'tmd-down');
            this.setButtonStatus(btn_down, is_exist ? 'exist' : 'download', is_exist ? this.lang.completed : this.lang.download);
 
            btn_share.parentNode.insertBefore(btn_down, btn_share.nextSibling);
            btn_down.onclick = () => {
                this.app.handleDownloadClick(btn_down, status_id, is_exist);
 
                if (this.app.storage.autoBookmarkFlag) {
                    // let bookmarkBtn = article.querySelector('[data-testid="bookmark"]');
                    let bookmarkBtn = btn_share.parentNode.querySelector('button[data-testid="bookmark"]');
                    if (bookmarkBtn) {
                        bookmarkBtn.click();
                    }
                }
            };
        }
 
        let imgs = article.querySelectorAll('a[href*="/photo/"]');
        if (imgs.length > 1) {
            let status_id = article.querySelector('a[href*="/status/"]').href.split('/status/').pop().split('/').shift();
            imgs.forEach(img => {
                let index = img.href.split('/status/').pop().split('/').pop();
                let is_exist = this.app.storage.isDownloaded(status_id);
                let btn_down = document.createElement('div');
                btn_down.innerHTML = `<div><div><svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">${Config.svg}</svg></div></div>`;
                btn_down.classList.add('tmd-down', 'tmd-img');
                this.setButtonStatus(btn_down, 'download');
                img.parentNode.appendChild(btn_down);
                btn_down.onclick = e => {
                    e.preventDefault();
                    this.app.handleDownloadClick(btn_down, status_id, is_exist, index);
 
                    if (this.app.storage.autoBookmarkFlag) {
                        // let bookmarkBtn = article.querySelector('[data-testid="bookmark"]');
                        let bookmarkBtn = btn_share.parentNode.querySelector('button[data-testid="bookmark"]');
                        if (bookmarkBtn) {
                            bookmarkBtn.click();
                        }
                    }
                };
            });
        }
    }
 
    addButtonsToMediaList(listitems) {
        listitems.forEach(li => {
            if (li.dataset.tmdDetected === 'true') return;
            let statusLink = li.querySelector('a[href*="/status/"]');
            if (!statusLink || !statusLink.href) return;
            li.dataset.tmdDetected = 'true';
 
            let status_id = statusLink.href.split('/status/').pop().split(/[\/\?#]/).shift();
            let is_exist = this.app.storage.isDownloaded(status_id);
 
            let btn_down = document.createElement('div');
            btn_down.innerHTML = `<div><div><svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">${Config.svg}</svg></div></div>`;
            btn_down.classList.add('tmd-down', 'tmd-media');
            this.setButtonStatus(btn_down, is_exist ? 'exist' : 'download', is_exist ? this.lang.completed : this.lang.download);
 
            li.appendChild(btn_down);
            btn_down.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.app.handleDownloadClick(btn_down, status_id, is_exist);
            };
        });
    }
}
 
 
class TwitterMediaDownloaderApp {
    constructor() {
        this.storage = new StorageManager();
        this.queue = new DownloadQueue();
        this.ui = new UIManager(this);
        this.isTweetDeck = location.hostname.includes('tweetdeck');
    }
 
    async init() {
        await this.storage.init();
        this.ui.injectCSS();
        this.ui.renderHistoryUI();
 
        document.addEventListener('mouseover', e => {
            let container = e.target.closest('article') || e.target.closest('[role="dialog"]') || e.target.closest('div[aria-labelledby]');
            if (container) window.tmdHoveredContainer = container;
        });
 
        document.addEventListener('keydown', e => {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;
 
            if (this.storage.shortcutKey && e.key.toUpperCase() === this.storage.shortcutKey.toUpperCase()) {
                let container = window.tmdHoveredContainer;
 
                if (!container || !document.body.contains(container)) {
                    container = document.querySelector('[role="dialog"]') || document.querySelector('article');
                }
 
                if (container) {
                    let btn = container.querySelector('.tmd-img:hover') || container.querySelector('.tmd-media:hover') || container.querySelector('.tmd-down');
 
                    if (btn && !btn.classList.contains('loading')) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (typeof btn.onclick === 'function') {
                            btn.onclick(e);
                        } else {
                            btn.click();
                        }
                    }
                }
            }
        });
 
        new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => {
            let article = node.tagName === 'ARTICLE' && node || node.tagName === 'DIV' && (node.querySelector('article') || node.closest('article'));
            if (article) this.ui.addButtonsToArticle(article);
            let listitems = node.tagName === 'LI' && node.getAttribute('role') === 'listitem' && [node] || node.tagName === 'DIV' && node.querySelectorAll('li[role="listitem"]');
            if (listitems) this.ui.addButtonsToMediaList(listitems);
        }))).observe(document.body, { childList: true, subtree: true });
    }
 
    async handleDownloadClick(btn, status_id, is_exist, index) {
        if (btn.classList.contains('loading')) return;
        this.ui.setButtonStatus(btn, 'loading');
 
        let out = this.storage.filenamePattern.split('\n').join('');
 
        let tweet;
        try {
            tweet = await TwitterAPI.fetchTweetJson(status_id);
        } catch (e) {
            this.ui.setButtonStatus(btn, 'failed', 'API_ERROR');
            return;
        }
 
        if (!tweet || !tweet.legacy) {
            this.ui.setButtonStatus(btn, 'failed', 'API_ERROR');
            return;
        }
 
        let user = tweet.core?.user_results?.result?.legacy || { screen_name: 'unknown', name: 'unknown' };
        let invalid = Utils.getInvalidChars();
        let datetime = out.match(/{date-time(-local)?:[^{}]+}/) ? out.match(/{date-time(?:-local)?:([^{}]+)}/)[1].replace(/[\\/|<>*?:"]/g, v => invalid[v] || '') : 'YYYYMMDD-hhmmss';
        let textLength = out.match(/{full-text:(\d+)}/) ? parseInt(out.match(/{full-text:(\d+)}/)[1], 10) : 999;
 
        let info = {
            'status-id': status_id, 'user-id': user.screen_name, 'fav-count': tweet.legacy.favorite_count || 0,
            'user-name': user.name.replace(/[\n\t\\/|<>*?:"]|[\u200b-\u200d\u2060\ufeff]|🔞/g, v => invalid[v] !== undefined ? invalid[v] : ''),
            'date-time': Utils.formatDate(tweet.legacy.created_at, datetime),
            'date-time-local': Utils.formatDate(tweet.legacy.created_at, datetime, true),
            'full-text': (tweet.legacy.full_text || '').replace(/\s*https:\/\/t\.co\/\w+/g, '').replaceAll(/\n+/g, '\n').replace(/[\n\t\\/|<>*?:"]|[\u200b-\u200d\u2060\ufeff]/g, v => invalid[v] !== undefined ? invalid[v] : '').substring(0, textLength)
        };
 
        let medias = tweet.legacy.extended_entities?.media || [];
        info['media-count'] = medias.length;
 
        if (index) {
            let idx = parseInt(index, 10) - 1;
            medias = medias[idx] ? [medias[idx]] : [];
        }
 
        if (medias.length > 0) {
            let tasksLeft = medias.length;
            let totalBytes = 0;
            let fetchSizePromises = [];
 
            medias.forEach((media, i) => {
                let mp4Variants = media.video_info?.variants?.filter(n => n.content_type === 'video/mp4') || [];
                info.url = media.type === 'photo'
                    ? media.media_url_https + ':orig'
                    : (mp4Variants.length > 0 ? mp4Variants.reduce((a, b) => (a.bitrate || 0) >= (b.bitrate || 0) ? a : b).url : media.video_info?.variants[0]?.url);
 
                if (!info.url) {
                    if (--tasksLeft === 0) this.ui.setButtonStatus(btn, 'failed', 'NO_URL');
                    return;
                }
 
                let sizePromise = fetch(info.url, { method: 'HEAD' }).then(res => {
                    let cl = res.headers.get('content-length');
                    if (cl) totalBytes += parseInt(cl, 10);
                }).catch(() => { });
                fetchSizePromises.push(sizePromise);
 
                info.file = info.url.split('/').pop().split(/[:?]/)[0];
                info['file-name'] = info.file.split('.')[0];
                info['file-ext'] = info.file.split('.').pop();
                info['file-type'] = media.type.replace('animated_', '');
                info.index = index ? index : (i + 1);
 
                info.out = (out.replace(/\.?{file-ext}/, '') + ((medias.length > 1 || index) && !out.includes('{index}') && !out.includes('{file-name}') ? '-' + info.index : '') + '.{file-ext}')
                    .replace(/{([^{}:]+)(:[^{}]+)?}/g, (_, name) => info[name] != null ? info[name] : '');
 
                this.queue.add({
                    url: info.url, name: info.out,
                    onload: async () => {
                        if (--tasksLeft === 0) {
                            this.ui.setButtonStatus(btn, 'completed', this.ui.lang.completed);
                            if (this.storage.saveHistoryFlag && !is_exist) {
                                await Promise.all(fetchSizePromises);
                                let sizeStr = totalBytes > 0 ? (totalBytes / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown';
 
                                await this.storage.addHistory({
                                    id: status_id,
                                    user: info['user-name'],
                                    type: medias.length > 1 ? 'Gallery' : info['file-type'],
                                    postTime: new Date(tweet.legacy.created_at).getTime(),
                                    thumb: medias[0]?.media_url_https ? medias[0].media_url_https + ':small' : '',
                                    size: sizeStr
                                });
                                this.ui.updateHistoryCount();
                            }
                        }
                    },
                    onerror: () => { tasksLeft = -1; this.ui.setButtonStatus(btn, 'failed', 'ERROR'); }
                });
            });
        } else {
            this.ui.setButtonStatus(btn, 'failed', 'MEDIA_NOT_FOUND');
        }
    }
}
 
new TwitterMediaDownloaderApp().init();