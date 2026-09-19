import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

// Shows the kit's name in the sidebar and the browser tab. `themes.normal` is Storybook's
// light or dark theme, picked from the OS preference, so only the brand changes.
addons.setConfig({
  theme: { ...themes.normal, brandTitle: 'Relievo' },
});
