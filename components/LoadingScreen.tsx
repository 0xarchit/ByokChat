import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const loadingSteps = [
  "Initializing application...",
  "Connecting to database...",
  "Loading providers...",
  "Fetching chat history...",
  "Setting up configurations...",
  "Almost ready...",
];

export function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6 max-w-md px-4">
        {}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            BYOK Chat
          </h1>
          <p className="text-muted-foreground mt-2">AI-Powered Conversations</p>
        </div>

        {}
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-primary/20" />
        </div>

        {}
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-foreground animate-pulse">
            {loadingSteps[currentStep]}
          </p>

          {}
          <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep + 1) / loadingSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {}
        <p className="text-xs text-muted-foreground text-center">
          Please wait while we prepare your workspace
        </p>
      </div>
    </div>
  );
}
