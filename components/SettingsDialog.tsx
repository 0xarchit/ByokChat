import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProvidersManager } from "./settings/ProvidersManager";
import { ThemeSelector } from "./settings/ThemeSelector";
import { ContextControls } from "./settings/ContextControls";
import { ImportExport } from "./settings/ImportExport";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="providers" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="context">Context</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-4">
            <ProvidersManager />
          </TabsContent>

          <TabsContent value="context" className="space-y-4">
            <ContextControls />
          </TabsContent>

          <TabsContent value="theme" className="space-y-4">
            <ThemeSelector />
          </TabsContent>

          <TabsContent value="import-export" className="space-y-4">
            <ImportExport />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
