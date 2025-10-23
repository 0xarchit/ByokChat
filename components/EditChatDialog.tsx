import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChatStore } from '@/store/chatStore';
import { useProviderStore } from '@/store/providerStore';
import { ChatSession } from '@/types/chat';
import toast from 'react-hot-toast';

interface EditChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chat: ChatSession | null;
}

export function EditChatDialog({ open, onOpenChange, chat }: EditChatDialogProps) {
  const { updateChat } = useChatStore();
  const { providers } = useProviderStore();
  
  const [name, setName] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [model, setModel] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  const [maxTokens, setMaxTokens] = useState<number | undefined>(undefined);
  const [maxInputTokens, setMaxInputTokens] = useState<number | undefined>(undefined);
  const [maxLastMessages, setMaxLastMessages] = useState<number | undefined>(undefined);
  const [maxInputCharacters, setMaxInputCharacters] = useState<number | undefined>(undefined);
  const [maxInputWords, setMaxInputWords] = useState<number | undefined>(undefined);
  const [summarizeAfter, setSummarizeAfter] = useState<number | undefined>(undefined);

  const selectedProvider = providers.find(p => p.id === selectedProviderId);

  useEffect(() => {
    if (chat) {
      setName(chat.name);
      setSelectedProviderId(chat.providerId);
      setModel(chat.model);
      setSystemPrompt(chat.systemPrompt);
      setTemperature(chat.temperature);
      setMaxTokens(chat.maxTokens);
      setMaxInputTokens(chat.maxInputTokens);
      setMaxLastMessages(chat.maxLastMessages);
      setMaxInputCharacters(chat.maxInputCharacters);
      setMaxInputWords(chat.maxInputWords);
      setSummarizeAfter(chat.summarizeAfter);
    }
  }, [chat]);

  const handleUpdate = async () => {
    if (!chat || !name.trim() || !selectedProviderId || !model.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await updateChat(chat.id, {
        name: name.trim(),
        providerId: selectedProviderId,
        model: model.trim(),
        systemPrompt: systemPrompt.trim(),
        temperature,
        maxTokens,
        maxInputTokens,
        maxLastMessages,
        maxInputCharacters,
        maxInputWords,
        summarizeAfter
      });
      
      toast.success('Chat updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update chat');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Chat Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Chat Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My AI Chat"
            />
          </div>

          <div>
            <Label htmlFor="provider">AI Provider *</Label>
            <Select value={selectedProviderId} onValueChange={setSelectedProviderId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProvider && (
            <div>
              <Label htmlFor="model">Model *</Label>
              {selectedProvider.models.length > 0 ? (
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {selectedProvider.models.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="gpt-4o-mini"
                />
              )}
            </div>
          )}

          <div>
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful AI assistant."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                value={temperature ?? ''}
                onChange={(e) => setTemperature(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Auto"
                step={0.1}
                min={0}
                max={2}
              />
            </div>

            <div>
              <Label htmlFor="maxTokens">Max Output Tokens</Label>
              <Input
                id="maxTokens"
                type="number"
                value={maxTokens ?? ''}
                onChange={(e) => setMaxTokens(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Auto"
                min={1}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">Context & Input Limits</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxInputTokens">Max Input Tokens</Label>
                <Input
                  id="maxInputTokens"
                  type="number"
                  value={maxInputTokens ?? ''}
                  onChange={(e) => setMaxInputTokens(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Unlimited"
                  min={1}
                />
                <p className="text-xs text-muted-foreground mt-1">Estimated token limit for API requests</p>
              </div>

              <div>
                <Label htmlFor="maxLastMessages">Max Last Messages</Label>
                <Input
                  id="maxLastMessages"
                  type="number"
                  value={maxLastMessages ?? ''}
                  onChange={(e) => setMaxLastMessages(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="10"
                  min={1}
                />
                <p className="text-xs text-muted-foreground mt-1">Number of recent messages to send</p>
              </div>

              <div>
                <Label htmlFor="maxInputCharacters">Max Input Characters</Label>
                <Input
                  id="maxInputCharacters"
                  type="number"
                  value={maxInputCharacters ?? ''}
                  onChange={(e) => setMaxInputCharacters(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Unlimited"
                  min={1}
                />
                <p className="text-xs text-muted-foreground mt-1">Character limit per message</p>
              </div>

              <div>
                <Label htmlFor="maxInputWords">Max Input Words</Label>
                <Input
                  id="maxInputWords"
                  type="number"
                  value={maxInputWords ?? ''}
                  onChange={(e) => setMaxInputWords(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Unlimited"
                  min={1}
                />
                <p className="text-xs text-muted-foreground mt-1">Word limit per message</p>
              </div>

              <div className="col-span-2">
                <Label htmlFor="summarizeAfter">Summarize After N Messages</Label>
                <Input
                  id="summarizeAfter"
                  type="number"
                  value={summarizeAfter ?? ''}
                  onChange={(e) => setSummarizeAfter(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="20 (default)"
                  min={5}
                />
                <p className="text-xs text-muted-foreground mt-1">Auto-summarize when message count exceeds this</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Chat</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
