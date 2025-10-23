import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Upload, FileJson, Database, Loader2 } from "lucide-react";
import {
  exportCompleteConfig,
  importCompleteConfig,
  exportProvidersOnly,
  importProvidersOnly,
} from "@/lib/config-export";
import toast from "react-hot-toast";
import { useProviderStore } from "@/store/providerStore";
import { useChatStore } from "@/store/chatStore";
import { useSettingsStore } from "@/store/settingsStore";

export function ImportExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const providersFileInputRef = useRef<HTMLInputElement>(null);

  const { loadProviders } = useProviderStore();
  const { loadChats } = useChatStore();
  const { loadSettings } = useSettingsStore();

  const handleExportComplete = async () => {
    setIsExporting(true);
    try {
      await exportCompleteConfig();
      toast.success("Configuration exported successfully!");
    } catch (error) {
      toast.error("Failed to export configuration");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportProviders = async () => {
    setIsExporting(true);
    try {
      await exportProvidersOnly();
      toast.success("Providers exported successfully!");
    } catch (error) {
      toast.error("Failed to export providers");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportComplete = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importCompleteConfig(file);

      await Promise.all([loadProviders(), loadChats(), loadSettings()]);

      toast.success("Configuration imported successfully! Page will reload.");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("Failed to import configuration");
      console.error(error);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImportProviders = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importProvidersOnly(file);
      await loadProviders();
      toast.success("Providers imported successfully!");
    } catch (error) {
      toast.error("Failed to import providers");
      console.error(error);
    } finally {
      setIsImporting(false);
      if (providersFileInputRef.current) {
        providersFileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Complete Configuration
          </CardTitle>
          <CardDescription>
            Export or import everything: providers, API keys, chats, messages,
            and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Export All Data
            </Label>
            <Button
              onClick={handleExportComplete}
              disabled={isExporting || isImporting}
              className="w-full"
              variant="default"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Complete Config
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Download a JSON file with all your data including API keys
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Import All Data
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportComplete}
              className="hidden"
              title="Import complete configuration JSON file"
              aria-label="Import Complete Configuration JSON file"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isExporting || isImporting}
              className="w-full"
              variant="secondary"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Complete Config
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Upload a previously exported configuration file
            </p>
          </div>

          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              ⚠️ Importing will merge with existing data. Duplicate IDs will be
              overwritten.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Providers Only
          </CardTitle>
          <CardDescription>
            Export or import just your AI providers and API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Export Providers
            </Label>
            <Button
              onClick={handleExportProviders}
              disabled={isExporting || isImporting}
              className="w-full"
              variant="outline"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Providers
                </>
              )}
            </Button>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block" />
            <input
              ref={providersFileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportProviders}
              className="hidden"
              title="Import providers JSON file"
              aria-label="Import Providers JSON file"
            />
            <Button
              onClick={() => providersFileInputRef.current?.click()}
              disabled={isExporting || isImporting}
              className="w-full"
              variant="outline"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Providers
                </>
              )}
            </Button>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 Perfect for sharing provider configurations across devices or
              with team members
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
