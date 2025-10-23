import { useSettingsStore } from '@/store/settingsStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ContextControls() {
  const { summarizeAfter, retainMessages, temperature, maxTokens, updateSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="summarizeAfter">Summarize after N messages</Label>
        <Input
          id="summarizeAfter"
          type="number"
          value={summarizeAfter}
          onChange={(e) => updateSettings({ summarizeAfter: parseInt(e.target.value) || 20 })}
          min={5}
          max={100}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Automatically summarize conversation after this many messages
        </p>
      </div>

      <div>
        <Label htmlFor="retainMessages">Retain last N messages</Label>
        <Input
          id="retainMessages"
          type="number"
          value={retainMessages}
          onChange={(e) => updateSettings({ retainMessages: parseInt(e.target.value) || 10 })}
          min={1}
          max={50}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Keep this many recent messages in context after summarization
        </p>
      </div>

      <div>
        <Label htmlFor="temperature">Temperature (optional)</Label>
        <Input
          id="temperature"
          type="number"
          value={temperature ?? ''}
          onChange={(e) => updateSettings({ temperature: e.target.value ? parseFloat(e.target.value) : undefined })}
          placeholder="Let API decide"
          step={0.1}
          min={0}
          max={2}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Leave empty to use API defaults
        </p>
      </div>

      <div>
        <Label htmlFor="maxTokens">Max Tokens (optional)</Label>
        <Input
          id="maxTokens"
          type="number"
          value={maxTokens ?? ''}
          onChange={(e) => updateSettings({ maxTokens: e.target.value ? parseInt(e.target.value) : undefined })}
          placeholder="Let API decide"
          min={1}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Leave empty to use API defaults
        </p>
      </div>
    </div>
  );
}
