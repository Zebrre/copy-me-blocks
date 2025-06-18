
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Snippet } from "@/types/snippet";
import { Copy, ExternalLink, Trash2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SnippetCardProps {
  snippet: Snippet;
  onDelete: () => void;
}

const colorVariants = {
  blue: "bg-blue-50 border-blue-200",
  peach: "bg-orange-50 border-orange-200",
  yellow: "bg-yellow-50 border-yellow-200",
  mint: "bg-green-50 border-green-200",
  lavender: "bg-purple-50 border-purple-200",
};

export const SnippetCard = ({ snippet, onDelete }: SnippetCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Snippet copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleLinkClick = () => {
    if (snippet.type === "link") {
      window.open(snippet.content, "_blank");
    }
  };

  const renderContent = () => {
    if (snippet.type === "image") {
      return (
        <div className="mb-4">
          <img
            src={snippet.content}
            alt={snippet.title}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      );
    }

    if (snippet.type === "link") {
      return (
        <div className="mb-4">
          <div
            className="text-blue-600 hover:text-blue-800 cursor-pointer break-all text-sm bg-white/60 p-3 rounded-lg border border-white/40"
            onClick={handleLinkClick}
          >
            {snippet.content}
            <ExternalLink className="w-3 h-3 inline ml-1" />
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <div className="text-gray-700 text-sm bg-white/60 p-3 rounded-lg border border-white/40 line-clamp-3">
          {snippet.content}
        </div>
      </div>
    );
  };

  return (
    <div className={`break-inside-avoid rounded-2xl border-2 p-6 shadow-sm hover:shadow-md transition-all duration-200 ${colorVariants[snippet.color]}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
          {snippet.title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 p-1 h-auto"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {renderContent()}

      <div className="flex gap-2">
        <Button
          onClick={handleCopy}
          className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium rounded-xl h-10 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </>
          )}
        </Button>
        
        {snippet.type === "link" && (
          <Button
            onClick={handleLinkClick}
            variant="outline"
            className="px-3 rounded-xl border-white/40 bg-white/60 hover:bg-white/80"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
