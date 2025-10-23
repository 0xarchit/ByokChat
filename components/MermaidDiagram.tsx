import { useEffect, useRef, useState, memo } from "react";
import mermaid from "mermaid";
import { AlertCircle } from "lucide-react";

interface MermaidDiagramProps {
  code: string;
}

let isInitialized = false;

export const MermaidDiagram = memo(
  function MermaidDiagram({ code }: MermaidDiagramProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState(true);
    const [svg, setSvg] = useState<string>("");

    useEffect(() => {
      if (!isInitialized) {
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "inherit",
        });
        isInitialized = true;
      }
    }, []);

    useEffect(() => {
      if (!code.trim()) return;

      setError(null);
      setIsRendering(true);
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

      const renderDiagram = async () => {
        try {
          const existingError = document.getElementById("dmermaid-error");
          if (existingError) {
            existingError.remove();
          }

          const result = await mermaid.render(id, code);
          setSvg(result.svg);
          setIsRendering(false);
        } catch (err) {
          console.error("Mermaid rendering error:", err);

          const errorDiv = document.getElementById("dmermaid-error");
          if (errorDiv) {
            errorDiv.remove();
          }

          setError(
            err instanceof Error ? err.message : "Invalid diagram syntax"
          );
          setIsRendering(false);
        }
      };

      renderDiagram();
    }, [code]);

    useEffect(() => {
      if (ref.current && svg) {
        ref.current.innerHTML = svg;
      }
    }, [svg]);

    useEffect(() => {
      const cleanupErrors = () => {
        const errorDivs = document.querySelectorAll(
          '#dmermaid-error, [id^="mermaid-"]'
        );
        errorDivs.forEach((div) => {
          if (
            div.textContent?.includes("Syntax error") ||
            div.textContent?.includes("mermaid version")
          ) {
            div.remove();
          }
        });
      };

      const interval = setInterval(cleanupErrors, 100);
      return () => clearInterval(interval);
    }, []);

    if (error) {
      return (
        <div className="my-4 border border-destructive/50 rounded-lg overflow-hidden">
          <div className="bg-destructive/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-destructive mb-1">
                Mermaid Diagram Error
              </p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
          <div className="bg-muted/50 p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-muted-foreground">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div className="my-4">
        <div
          ref={ref}
          className="flex justify-center items-center p-4 bg-background/50 rounded-lg border overflow-x-auto overflow-y-auto max-h-[600px]"
          style={{ minHeight: isRendering ? "100px" : "auto" }}
        />
        {isRendering && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Rendering diagram...
          </p>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.code === nextProps.code;
  }
);
