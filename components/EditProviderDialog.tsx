"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProviderStore } from "@/store/providerStore";
import { Plus, X, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { AIProvider } from "@/types/chat";
import toast from "react-hot-toast";

interface EditProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: AIProvider | null;
}

export function EditProviderDialog({
  open,
  onOpenChange,
  provider,
}: EditProviderDialogProps) {
  const { updateProvider } = useProviderStore();

  const [name, setName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [workerUrl, setWorkerUrl] = useState("");
  const [maxIndex, setMaxIndex] = useState("1");
  const [apiKeys, setApiKeys] = useState<string[]>([""]);
  const [isCloudflare, setIsCloudflare] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [fetchedModels, setFetchedModels] = useState<string[]>([]);
  const [manualModels, setManualModels] = useState("");
  const [defaultModel, setDefaultModel] = useState<string>("");
  const [testingKeyIndex, setTestingKeyIndex] = useState<number | null>(null);
  const [keyTestResults, setKeyTestResults] = useState<
    Record<number, "success" | "error" | null>
  >({});

  useEffect(() => {
    if (provider && open) {
      setName(provider.name);
      setApiUrl(provider.baseUrl || provider.apiUrl || "");
      setWorkerUrl(provider.workerUrl || "");
      setMaxIndex(provider.maxIndex?.toString() || "1");
      setApiKeys(provider.apiKeys.length > 0 ? provider.apiKeys : [""]);
      setIsCloudflare(!!provider.workerUrl);
      setFetchedModels(provider.models || []);
      setKeyTestResults({});
    }
  }, [provider, open]);

  const handleAddKey = () => {
    setApiKeys([...apiKeys, ""]);
  };

  const handleRemoveKey = (index: number) => {
    if (apiKeys.length > 1) {
      setApiKeys(apiKeys.filter((_, i) => i !== index));
    }
  };

  const handleKeyChange = (index: number, value: string) => {
    const updated = [...apiKeys];
    updated[index] = value;
    setApiKeys(updated);

    setKeyTestResults((prev) => ({ ...prev, [index]: null }));
  };

  const testApiKey = async (index: number) => {
    const key = apiKeys[index];
    if (!key.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    if (!apiUrl.trim()) {
      toast.error("Please enter API URL first");
      return;
    }

    const allModels = [
      ...fetchedModels,
      ...manualModels
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m),
    ];

    if (allModels.length === 0) {
      toast.error(
        "Please add at least one model first (fetch or add manually)"
      );
      return;
    }

    setTestingKeyIndex(index);
    setKeyTestResults((prev) => ({ ...prev, [index]: null }));

    try {
      const chatUrl = apiUrl.replace(/\/+$/, "") + "/chat/completions";
      const modelToUse = defaultModel || allModels[0];
      const response = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [{ role: "user", content: "test" }],
          max_tokens: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("API key validation failed");
      }

      setKeyTestResults((prev) => ({ ...prev, [index]: "success" }));
      toast.success("API key is valid!");
    } catch (error) {
      setKeyTestResults((prev) => ({ ...prev, [index]: "error" }));
      toast.error("API key is invalid or unauthorized");
    } finally {
      setTestingKeyIndex(null);
    }
  };

  const fetchModels = async () => {
    if (isCloudflare) {
      toast(
        "Cloudflare models cannot be auto-fetched. Edit them manually in the model list."
      );
      return;
    }

    const validKey = apiKeys.find((k) => k.trim());
    if (!validKey || !apiUrl.trim()) {
      toast.error("Please provide API URL and at least one API key");
      return;
    }

    setIsFetchingModels(true);
    try {
      const modelsUrl = apiUrl.replace(/\/+$/, "") + "/models";

      const response = await fetch(modelsUrl, {
        headers: {
          Authorization: `Bearer ${validKey}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch models");

      const data = await response.json();
      const models = isCloudflare
        ? data.result?.map((m: any) => m.name) || []
        : data.data?.map((m: any) => m.id) || [];
      setFetchedModels(models);
      toast.success(`Found ${models.length} models`);
    } catch (error) {
      toast.error("Failed to fetch models. You can add them manually.");
      setFetchedModels([]);
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleSave = async () => {
    if (!provider) return;

    const validKeys = isCloudflare
      ? ["dummy-key"]
      : apiKeys.filter((k) => k.trim());

    if (!name.trim()) {
      toast.error("Please fill in provider name");
      return;
    }

    if (isCloudflare) {
      if (!workerUrl.trim()) {
        toast.error("Please provide Worker URL for Cloudflare");
        return;
      }
      const maxIdx = parseInt(maxIndex);
      if (isNaN(maxIdx) || maxIdx < 1) {
        toast.error("Max Index must be at least 1");
        return;
      }
      if (fetchedModels.length === 0) {
        toast.error("Please provide at least one model for Cloudflare");
        return;
      }
    } else {
      if (!apiUrl.trim()) {
        toast.error("Please provide API URL");
        return;
      }
      if (validKeys.length === 0) {
        toast.error("Please provide at least one API key");
        return;
      }
    }

    try {
      let modelsToSave: string[] = [];

      if (isCloudflare) {
        modelsToSave = fetchedModels;
      } else {
        const manualModelsList = manualModels
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean);

        modelsToSave = [...new Set([...fetchedModels, ...manualModelsList])];

        if (modelsToSave.length === 0) {
          toast.error("Please fetch models or add them manually");
          return;
        }
      }

      const updates: any = {
        name: name.trim(),
        apiKeys: validKeys,
        models: modelsToSave,
      };

      if (isCloudflare) {
        updates.workerUrl = workerUrl.trim();
        updates.maxIndex = parseInt(maxIndex);
        if (provider.currentIndex === undefined) {
          updates.currentIndex = 0;
        }

        updates.baseUrl = undefined;
        updates.apiUrl = undefined;
      } else {
        updates.baseUrl = apiUrl.trim();
        updates.apiUrl = apiUrl.trim();

        updates.workerUrl = undefined;
        updates.maxIndex = undefined;
        updates.currentIndex = undefined;
      }

      await updateProvider(provider.id, updates);

      toast.success("Provider updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update provider");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!provider) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit AI Provider</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="providerName">Provider Name *</Label>
            <Input
              id="providerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., OpenAI, Groq, Cerebras"
            />
          </div>

          {!isCloudflare && (
            <div>
              <Label htmlFor="apiUrl">API Base URL *</Label>
              <Input
                id="apiUrl"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.openai.com/v1"
              />
              <p className="text-xs text-muted-foreground mt-1">Base URL</p>
            </div>
          )}

          {isCloudflare && (
            <>
              <div>
                <Label htmlFor="workerUrl">Worker URL *</Label>
                <Input
                  id="workerUrl"
                  value={workerUrl}
                  onChange={(e) => setWorkerUrl(e.target.value)}
                  placeholder="https://your-worker.your-subdomain.workers.dev/chat"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your Cloudflare Worker endpoint URL
                </p>
              </div>

              <div>
                <Label htmlFor="maxIndex">Max Index *</Label>
                <Input
                  id="maxIndex"
                  type="number"
                  min="1"
                  value={maxIndex}
                  onChange={(e) => setMaxIndex(e.target.value)}
                  placeholder="e.g., 5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Number of accounts configured in your worker (1-based)
                </p>
              </div>

              <div>
                <Label htmlFor="cloudflareModels">
                  Models (comma-separated) *
                </Label>
                <Input
                  id="cloudflareModels"
                  value={manualModels}
                  onChange={(e) => setManualModels(e.target.value)}
                  placeholder="e.g., @cf/meta/llama-3.1-8b-instruct, @cf/mistral/mistral-7b-instruct-v0.1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter Cloudflare AI model IDs separated by commas
                </p>
              </div>
            </>
          )}

          {!isCloudflare && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>API Keys *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddKey}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Key
                </Button>
              </div>

              <div className="space-y-2">
                {apiKeys.map((key, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          type="password"
                          value={key}
                          onChange={(e) =>
                            handleKeyChange(index, e.target.value)
                          }
                          placeholder="sk-..."
                          className={
                            keyTestResults[index] === "success"
                              ? "border-green-500"
                              : keyTestResults[index] === "error"
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {keyTestResults[index] === "success" && (
                          <CheckCircle2 className="h-4 w-4 text-green-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        )}
                        {keyTestResults[index] === "error" && (
                          <XCircle className="h-4 w-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => testApiKey(index)}
                        disabled={testingKeyIndex === index || !key.trim()}
                        title="Test API key"
                      >
                        {testingKeyIndex === index ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </Button>
                      {apiKeys.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveKey(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Current keys will be replaced with the ones you provide here
              </p>
            </div>
          )}

          {!isCloudflare && (
            <div>
              <Button
                type="button"
                variant="secondary"
                onClick={fetchModels}
                disabled={isFetchingModels}
                className="w-full"
              >
                {isFetchingModels ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching Models...
                  </>
                ) : (
                  "Fetch Available Models"
                )}
              </Button>

              {fetchedModels.length > 0 && (
                <div className="mt-3 border rounded-lg overflow-hidden">
                  <div className="bg-muted px-3 py-2 border-b">
                    <p className="text-sm font-semibold">
                      {fetchedModels.length} models available
                    </p>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {fetchedModels.map((model, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 text-sm bg-background hover:bg-muted/50 rounded border transition-colors flex items-center justify-between group"
                        >
                          <span>{model}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setFetchedModels(
                                fetchedModels.filter((_, i) => i !== index)
                              );
                              toast.success("Model removed");
                            }}
                            title="Remove model"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-3">
                <Label htmlFor="manualModelsStandard">
                  Or Add Models Manually (comma-separated)
                </Label>
                <Input
                  id="manualModelsStandard"
                  value={manualModels}
                  onChange={(e) => setManualModels(e.target.value)}
                  placeholder="e.g., gpt-4, gpt-3.5-turbo, claude-3-opus"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add custom models if auto-fetch failed or models are missing
                </p>
              </div>
            </div>
          )}

          {}
          {(() => {
            const allModels = [
              ...fetchedModels,
              ...manualModels
                .split(",")
                .map((m) => m.trim())
                .filter((m) => m),
            ];
            if (allModels.length > 0) {
              return (
                <div>
                  <Label htmlFor="defaultModel">
                    Default Model for API Validation
                  </Label>
                  <Select
                    value={defaultModel || allModels[0]}
                    onValueChange={setDefaultModel}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          allModels[0]
                            ? `${allModels[0]} (first model)`
                            : "Select default model"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {allModels.map((model, index) => (
                        <SelectItem key={index} value={model}>
                          {model}
                          {index === 0 && !defaultModel && " (default)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    This model will be used for API key validation
                  </p>
                </div>
              );
            }
            return null;
          })()}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
