import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { ThemeProvider, useTheme, type ThemeMode } from './ThemeProvider';

const modes: ThemeMode[] = ['system', 'light', 'dark'];

function ThemeSwitcher() {
  const { mode, resolvedMode, setMode } = useTheme();

  return (
    <div style={{ display: 'grid', gap: 'var(--ui-space-3)', fontFamily: 'var(--ui-font-family)' }}>
      <p style={{ margin: 0 }}>
        mode: <strong>{mode}</strong> · resolved: <strong>{resolvedMode}</strong>
      </p>
      <div style={{ display: 'flex', gap: 'var(--ui-space-2)' }}>
        {modes.map((option) => (
          <Button
            key={option}
            variant={option === mode ? 'primary' : 'secondary'}
            onClick={() => setMode(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Theme/ThemeProvider',
  component: ThemeProvider,
  tags: ['autodocs'],
  parameters: {
    // Renders its own provider instead of the toolbar-driven one from preview.tsx.
    themeProvider: false,
  },
  argTypes: {
    defaultMode: { control: 'inline-radio', options: modes },
    children: { control: false },
  },
  args: {
    defaultMode: 'system',
  },
  render: ({ defaultMode }) => (
    // defaultMode only sets the initial mode, so remount when the control changes.
    <ThemeProvider key={defaultMode} defaultMode={defaultMode}>
      <ThemeSwitcher />
    </ThemeProvider>
  ),
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
