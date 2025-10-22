import { useSettingsStore } from '@/store/settingsStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Sparkles } from 'lucide-react';

export function ThemeSelector() {
  const { theme, updateSettings } = useSettingsStore();

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'cyber-aurora', label: 'Cyber Aurora', icon: Sparkles }
  ] as const;

  return (
    <div className="space-y-4">
      <Label>Theme</Label>
      <div className="grid grid-cols-3 gap-4">
        {themes.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant={theme === value ? 'default' : 'outline'}
            className="h-24 flex flex-col gap-2"
            onClick={() => {
              updateSettings({ theme: value });
              document.documentElement.classList.remove('light', 'dark', 'cyber-aurora');
              document.documentElement.classList.add(value);
            }}
          >
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
