# Contributing

Conventions for components, tokens and tests are in `AGENTS.md`. This page holds the recipes.

## Capturing a visual change

Show visual changes in both themes, and check selection states in grayscale too.

1. Build Storybook and serve it:

   ```bash
   pnpm build-storybook -o <dir>
   python3 -m http.server 6199 -d <dir>
   ```

2. Capture a story with headless Chrome, once per theme (`theme:light`, `theme:dark`):

   ```bash
   google-chrome --headless=new --no-sandbox --hide-scrollbars \
     --force-device-scale-factor=2 --window-size=W,H --virtual-time-budget=10000 \
     --screenshot=out.png \
     "http://localhost:6199/iframe.html?id=<story-id>&viewMode=story&globals=theme:light"
   ```

   Use a window at least 300px high, or the capture is cut.

3. Combine the light and dark captures into one image to compare them (ImageMagick `convert`, `+append` for side by side, `-append` for stacked).

Save the captures in `storybook-static/captures/` (gitignored).

## Updating the README screenshot

`docs/assets/overview.png` is the "All components" story of the Overview, in the light and dark themes side by side. Redo it when the Overview or the look of a component changes:

1. Build and serve Storybook as above, and capture `overview-all-components--all-components` once per theme, with `--window-size=560,1400` and a scale factor of 2.
2. Crop each capture to `1120x2215+0+520` (from the tab bar to the end of the "Contact email" error: check that no row is cut in half after a change), put the light one on the left with `+append`, and shrink the result with `optipng`.
