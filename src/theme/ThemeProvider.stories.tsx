import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { ThemeProvider, useTheme, type ThemeMode } from './ThemeProvider';

const modes: ThemeMode[] = ['system', 'light', 'dark'];

function ThemeSwitcher() {
  const { mode, resolvedMode, setMode } = useTheme();

  return (
    <div style={{ display: 'grid', gap: 'var(--rv-space-3)', fontFamily: 'var(--rv-font-family)' }}>
      <p style={{ margin: 0 }}>
        mode: <strong>{mode}</strong> · resolved: <strong>{resolvedMode}</strong>
      </p>
      <div style={{ display: 'flex', gap: 'var(--rv-space-2)' }}>
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
    // The story is uncontrolled: it demonstrates defaultMode and the switcher.
    mode: { control: false },
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

/** The provider keeps the mode, starting from `defaultMode`. */
export const Uncontrolled: Story = {};

/** The parent owns the mode: here it also logs every requested change. */
export const Controlled: Story = {
  render: function Render() {
    const [mode, setMode] = useState<ThemeMode>('light');
    const [log, setLog] = useState<ThemeMode[]>([]);

    return (
      <ThemeProvider
        mode={mode}
        onModeChange={(next) => {
          setLog((entries) => [...entries, next]);
          setMode(next);
        }}
      >
        <div
          style={{ display: 'grid', gap: 'var(--rv-space-3)', fontFamily: 'var(--rv-font-family)' }}
        >
          <ThemeSwitcher />
          <span>
            onModeChange: <code>{log.join(' → ') || '—'}</code>
          </span>
        </div>
      </ThemeProvider>
    );
  },
};
