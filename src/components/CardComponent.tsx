
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/types/card";
import { Copy, ExternalLink, Trash2, Check, FileText, Link, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CardComponentProps {
  card: Card;
  onDelete: () => void;
  isEditMode?: boolean;
  onUpdate?: (card: Card) => void;
}

const colorVariants = {
  blue: "bg-blue-50 border-blue-200",
  peach: "bg-orange-50 border-orange-200",
  yellow: "bg-yellow-50 border-yellow-200",
  mint: "bg-green-50 border-green-200",
  lavender: "bg-purple-50 border-purple-200",
};

const typeIcons = {
  text: FileText,
  link: Link,
  image: Image,
};

export const CardComponent = ({ card, onDelete, isEditMode = false, onUpdate }: CardComponentProps) => {
  const [copied, setCopied] = useState(false);
  const TypeIcon = typeIcons[card.type];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(card.content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Card copied to clipboard",
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
    if (card.type === "link") {
      window.open(card.content, "_blank");
    }
  };

  const renderContent = () => {
    if (card.type === "image") {
      return (
        <div className="mb-6 flex-1">
          <img
            src={card.content}
            alt={card.title}
            className="w-full h-32 object-cover rounded-xl"
          />
        </div>
      );
    }

    if (card.type === "link") {
      return (
        <div className="mb-6 flex-1">
          <div
            className="text-blue-600 hover:text-blue-800 cursor-pointer break-all text-sm bg-white/60 p-4 rounded-xl border border-white/40 transition-colors"
            onClick={handleLinkClick}
          >
            {card.content}
            <ExternalLink className="w-3 h-3 inline ml-2" />
          </div>
        </div>
      );
    }

    return (
      <div className="mb-6 flex-1">
        <div className="text-gray-700 text-sm bg-white/60 p-4 rounded-xl border border-white/40 line-clamp-3">
          {card.content}
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`
        h-full rounded-2xl border-2 p-6 shadow-sm transition-all duration-300 flex flex-col
        hover:shadow-lg hover:-rotate-1 hover:scale-[1.02] transform-gpu
        ${colorVariants[card.color]}
        ${isEditMode ? 'animate-[wiggle_0.5s_ease-in-out_infinite]' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <TypeIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate">
            {card.title}
          </h3>
        </div>
        {isEditMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 p-1 h-auto flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {renderContent()}

      {!isEditMode && (
        <div className="flex gap-2 mt-auto">
          <Button
            onClick={handleCopy}
            className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium rounded-xl h-12 transition-all transform hover:scale-105"
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
          
          {card.type === "link" && (
            <Button
              onClick={handleLinkClick}
              variant="outline"
              className="px-4 rounded-xl border-white/40 bg-white/60 hover:bg-white/80 transition-all transform hover:scale-105"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
