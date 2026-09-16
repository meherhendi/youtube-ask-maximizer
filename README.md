# Maximize "Ask about this video"

Chrome extension that adds a button to YouTube's **Ask about this video** panel to
expand it to the full width of the browser window.

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
