import { useState } from "react";
import { Trash2, RefreshCw, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProviderStore } from "@/store/providerStore";
import { Badge } from "@/components/ui/badge";
import { AIProvider } from "@/types/chat";
import { EditProviderDialog } from "@/components/EditProviderDialog";
import toast from "react-hot-toast";

export function ProvidersManager() {
  const { providers, deleteProvider, rotateKey } = useProviderStore();
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async (id: string, name: string) => {
    if (
      confirm(`Delete provider "${name}"? This will not delete chats using it.`)
    ) {
      await deleteProvider(id);
      toast.success("Provider deleted");
    }
  };

  const handleRotateKey = async (providerId: string) => {
    await rotateKey(providerId);
    toast.success("API key rotated");
  };

  const handleEdit = (provider: AIProvider) => {
    setEditingProvider(provider);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingProvider(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">AI Providers</h3>

      <div className="space-y-3">
        {providers.map((provider) => (
          <div key={provider.id} className="p-4 border rounded-lg space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{provider.name}</span>
                  <Badge variant="secondary">
                    {provider.workerUrl
                      ? `${provider.maxIndex || 1} key${
                          provider.maxIndex !== 1 ? "s" : ""
                        }`
                      : `${provider.apiKeys.length} key${
                          provider.apiKeys.length !== 1 ? "s" : ""
                        }`}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {provider.models.length} models available
                </p>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(provider)}
                  title="Edit provider"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {provider.apiKeys.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRotateKey(provider.id)}
                    title="Rotate API key"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(provider.id, provider.name)}
                  title="Delete provider"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {provider.models.length > 0 && (
              <div className="text-xs text-muted-foreground max-h-20 overflow-y-auto">
                {provider.models.slice(0, 5).join(", ")}
                {provider.models.length > 5 &&
                  ` +${provider.models.length - 5} more`}
              </div>
            )}
          </div>
        ))}

        {providers.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No providers yet. Add one to get started!
          </p>
        )}
      </div>

      <EditProviderDialog
        open={isEditDialogOpen}
        onOpenChange={handleCloseEditDialog}
        provider={editingProvider}
      />
    </div>
  );
}
