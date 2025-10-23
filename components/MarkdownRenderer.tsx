import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { MermaidDiagram } from "./MermaidDiagram";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

// Import languages for highlight.js (no refractor dependency)
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import c from "react-syntax-highlighter/dist/esm/languages/hljs/c";
import cpp from "react-syntax-highlighter/dist/esm/languages/hljs/cpp";
import csharp from "react-syntax-highlighter/dist/esm/languages/hljs/csharp";
import php from "react-syntax-highlighter/dist/esm/languages/hljs/php";
import ruby from "react-syntax-highlighter/dist/esm/languages/hljs/ruby";
import go from "react-syntax-highlighter/dist/esm/languages/hljs/go";
import rust from "react-syntax-highlighter/dist/esm/languages/hljs/rust";
import sql from "react-syntax-highlighter/dist/esm/languages/hljs/sql";
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml";
import markdown from "react-syntax-highlighter/dist/esm/languages/hljs/markdown";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";

// Register languages
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("c", c);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("html", xml);
SyntaxHighlighter.registerLanguage("xml", xml);
SyntaxHighlighter.registerLanguage("jsx", javascript); // Use javascript for JSX
SyntaxHighlighter.registerLanguage("tsx", typescript); // Use typescript for TSX

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = memo(
  function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const processedContent = useMemo(() => {
      let processed = content;

      processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (match, p1) => {
        return "\n$$" + p1.trim() + "$$\n";
      });

      processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (match, p1) => {
        return "$" + p1.trim() + "$";
      });

      processed = processed.replace(/\$\$\s*\d+\s*\$/g, "");

      processed = processed.replace(/([^\n])\$\$/g, "$1\n$$");
      processed = processed.replace(/\$\$([^\n])/g, "$$\n$1");

      return processed;
    }, [content]);

    return (
      <div className="markdown-content w-full max-w-full min-w-0">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            code({ node, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const code = String(children).replace(/\n$/, "");
              const inline = !className;

              if (inline) {
                return (
                  <code
                    className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              if (language === "mermaid") {
                return <MermaidDiagram code={code} />;
              }

              return <CodeBlock language={language} code={code} />;
            },
            table({ node, children, ...props }: any) {
              return (
                <div className="my-4 sm:my-6 w-full max-w-full overflow-hidden">
                  <div className="border rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto overflow-y-auto max-h-[400px] sm:max-h-[600px] relative scrollbar-thin">
                      <table
                        className="w-full divide-y divide-border min-w-max"
                        {...props}
                      >
                        {children}
                      </table>
                    </div>
                  </div>
                </div>
              );
            },
            thead({ node, children, ...props }: any) {
              return (
                <thead className="bg-muted sticky top-0 z-10" {...props}>
                  {children}
                </thead>
              );
            },
            tbody({ node, children, ...props }: any) {
              return (
                <tbody
                  className="bg-background divide-y divide-border"
                  {...props}
                >
                  {children}
                </tbody>
              );
            },
            tr({ node, children, ...props }: any) {
              return (
                <tr className="hover:bg-muted/30 transition-colors" {...props}>
                  {children}
                </tr>
              );
            },
            th({ node, children, ...props }: any) {
              return (
                <th
                  className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 text-left text-[10px] xs:text-xs font-bold text-foreground uppercase tracking-wider border-r border-border last:border-r-0 whitespace-nowrap bg-muted/80"
                  {...props}
                >
                  {children}
                </th>
              );
            },
            td({ node, children, ...props }: any) {
              return (
                <td
                  className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 text-[10px] xs:text-xs sm:text-sm text-foreground border-r border-border last:border-r-0 whitespace-nowrap"
                  {...props}
                >
                  {children}
                </td>
              );
            },
            p({ node, children, ...props }: any) {
              return (
                <p className="my-2 sm:my-3 leading-relaxed" {...props}>
                  {children}
                </p>
              );
            },
            ul({ node, children, ...props }: any) {
              return (
                <ul
                  className="my-2 sm:my-3 ml-4 sm:ml-6 list-disc space-y-1 sm:space-y-2"
                  {...props}
                >
                  {children}
                </ul>
              );
            },
            ol({ node, children, ...props }: any) {
              return (
                <ol
                  className="my-2 sm:my-3 ml-4 sm:ml-6 list-decimal space-y-1 sm:space-y-2"
                  {...props}
                >
                  {children}
                </ol>
              );
            },
            li({ node, children, ...props }: any) {
              return (
                <li className="leading-relaxed" {...props}>
                  {children}
                </li>
              );
            },
            h1({ node, children, ...props }: any) {
              return (
                <h1
                  className="text-lg sm:text-xl md:text-2xl font-bold mt-4 sm:mt-5 md:mt-6 mb-3 sm:mb-4"
                  {...props}
                >
                  {children}
                </h1>
              );
            },
            h2({ node, children, ...props }: any) {
              return (
                <h2
                  className="text-base sm:text-lg md:text-xl font-bold mt-3 sm:mt-4 md:mt-5 mb-2 sm:mb-3"
                  {...props}
                >
                  {children}
                </h2>
              );
            },
            h3({ node, children, ...props }: any) {
              return (
                <h3
                  className="text-sm sm:text-base md:text-lg font-semibold mt-3 sm:mt-4 mb-2"
                  {...props}
                >
                  {children}
                </h3>
              );
            },
            h4({ node, children, ...props }: any) {
              return (
                <h4
                  className="text-sm sm:text-base font-semibold mt-2 sm:mt-3 mb-1.5 sm:mb-2"
                  {...props}
                >
                  {children}
                </h4>
              );
            },
            blockquote({ node, children, ...props }: any) {
              return (
                <blockquote
                  className="border-l-2 sm:border-l-4 border-primary pl-3 sm:pl-4 py-1.5 sm:py-2 my-3 sm:my-4 italic text-muted-foreground bg-muted/30 rounded-r text-xs sm:text-sm"
                  {...props}
                >
                  {children}
                </blockquote>
              );
            },
            a({ node, children, href, ...props }) {
              return (
                <a
                  href={href}
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              );
            },
            hr({ node, ...props }: any) {
              return <hr className="my-6 border-border" {...props} />;
            },
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.content === nextProps.content;
  }
);

const CodeBlock = memo(
  function CodeBlock({ language, code }: { language: string; code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative group my-3 sm:my-4 max-w-full overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-background/80 hover:bg-background"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>
        <div className="overflow-x-auto rounded-md sm:rounded-lg max-w-full scrollbar-thin">
          <SyntaxHighlighter
            style={atomOneDark}
            language={language || "text"}
            PreTag="div"
            className="!my-0 !rounded-md sm:!rounded-lg text-xs sm:text-sm"
            customStyle={{
              margin: 0,
              borderRadius: "0.375rem",
              padding: "0.75rem",
              maxWidth: "100%",
              fontSize: "inherit",
            }}
            codeTagProps={{
              style: {
                fontSize: "inherit",
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.language === nextProps.language &&
      prevProps.code === nextProps.code
    );
  }
);
