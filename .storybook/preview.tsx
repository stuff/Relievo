import type { Decorator, Preview } from '@storybook/react-vite';
import { ThemeProvider, type ThemeMode } from '../src/theme';
import '../src/styles/tokens.scss';
import '../src/styles/global.scss';
import './preview.css';

const splitThemes = ['light', 'dark'] as const;

const withThemeProvider: Decorator = (Story, context) => {
  if (context.parameters.themeProvider === false) {
    return <Story />;
  }

  const mode = context.globals.theme as ThemeMode | 'split';

  // Side-by-side themes use the data-theme attribute: ThemeProvider sets it on <html>,
  // so two providers on one page would fight over it. A single `system` provider leaves <html>
  // untouched and still gives stories a context for useTheme().
  if (mode === 'split') {
    const direction = context.globals.splitDirection as 'row' | 'column';

    return (
      <ThemeProvider key={mode} defaultMode="system">
        <div className="theme-split" data-direction={direction}>
          {splitThemes.map((splitTheme) => (
            <div key={splitTheme} className="theme-split__pane" data-theme={splitTheme}>
              <span className="theme-split__label">{splitTheme}</span>
              <Story />
            </div>
          ))}
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider key={mode} defaultMode={mode}>
      <Story />
    </ThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Theme mode',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'split', title: 'Light + Dark', icon: 'sidebyside' },
          { value: 'system', title: 'System', icon: 'browser' },
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    splitDirection: {
      description: 'Layout of the Light + Dark panes',
      toolbar: {
        title: 'Split',
        icon: 'sidebyside',
        items: [
          { value: 'row', title: 'Side by side', icon: 'sidebyside' },
          { value: 'column', title: 'Stacked', icon: 'stacked' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'split',
    splitDirection: 'row',
  },
  decorators: [withThemeProvider],
};

export default preview;
