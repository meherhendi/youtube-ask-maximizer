# Maximize "Ask about this video"

Chrome extension that adds a button to YouTube's **Ask about this video** panel to
expand it to the full width of the browser window, with larger, easier-to-read text.

**[Website and FAQ &rarr;](https://meherhendi.github.io/youtube-ask-maximizer/)**

YouTube pins the "Ask about this video" AI panel to a fixed column of roughly 456px
with 14px body text, and gives you no way to widen it. This extension adds a maximize
toggle to the panel header: one click and the panel fills the browser window at 18px
text. Click again, or press `Esc`, to restore it.

Manifest V3, zero permissions, no network requests, no tracking, ~11 KB.

## Install

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select this folder
4. Reload any open YouTube tab

## Use

Open a video, click **Ask** (the "Ask about this video" panel opens on the right),
then click the ⤢ button in the panel header. Click again — or press `Esc` — to
restore the normal width. Navigating to another video restores it automatically.

## Files

- `manifest.json` — MV3 manifest, content script scoped to youtube.com
- `content.js` — finds the Ask panel, injects the toggle button, manages state
- `styles.css` — the maximized (full-viewport-width) layout
- `docs/` — the GitHub Pages site

## License

[MIT](LICENSE)
