
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/types/card";
import { Copy, ExternalLink, Trash2, Check, FileText, Link, Image, Move, MoreHorizontal } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CardComponentProps {
  card: Card;
  onDelete: () => void;
  isEditMode?: boolean;
  onUpdate?: (card: Card) => void;
}

const colorVariants = {
  blue: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  peach: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  yellow: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
  mint: "bg-green-50 border-green-200 hover:bg-green-100",
  lavender: "bg-purple-50 border-purple-200 hover:bg-purple-100",
};

const typeIcons = {
  text: FileText,
  link: Link,
  image: Image,
};

export const CardComponent = ({ card, onDelete, isEditMode = false, onUpdate }: CardComponentProps) => {
  const [copied, setCopied] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const TypeIcon = typeIcons[card.type];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(card.content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Card content copied to clipboard",
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

  const handleSizeChange = (newSize: "1x1" | "1x2" | "2x1" | "2x2") => {
    if (onUpdate) {
      onUpdate({ ...card, size: newSize });
    }
  };

  const renderContent = () => {
    if (card.type === "image") {
      return (
        <div className="mb-4 flex-1 overflow-hidden">
          <img
            src={card.content}
            alt={card.title}
            className="w-full h-32 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
          />
        </div>
      );
    }

    if (card.type === "link") {
      return (
        <div className="mb-4 flex-1">
          <div
            className="text-blue-600 hover:text-blue-800 cursor-pointer break-all text-sm bg-white/60 p-4 rounded-xl border border-white/40 transition-all duration-200 hover:bg-white/80 hover:shadow-sm"
            onClick={handleLinkClick}
          >
            {card.content}
            <ExternalLink className="w-3 h-3 inline ml-2" />
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4 flex-1">
        <div className="text-gray-700 text-sm bg-white/60 p-4 rounded-xl border border-white/40 line-clamp-3 transition-all duration-200 hover:bg-white/80">
          {card.content}
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`
        h-full w-full rounded-2xl border-2 p-6 shadow-sm transition-all duration-300 flex flex-col cursor-pointer relative overflow-hidden
        hover:shadow-xl hover:-rotate-1 hover:scale-[1.02] transform-gpu
        ${colorVariants[card.color]}
        ${isEditMode ? 'animate-[wiggle_0.5s_ease-in-out_infinite] hover:animate-none' : ''}
        ${isPressed ? 'scale-95' : ''}
        active:scale-95
      `}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Edit Mode Controls */}
      {isEditMode && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="w-8 h-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Size Controls in Edit Mode */}
      {isEditMode && (
        <div className="absolute -bottom-2 -right-2 bg-white rounded-full shadow-lg border border-gray-200 p-1">
          <div className="flex gap-1">
            {(["1x1", "1x2", "2x1", "2x2"] as const).map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`w-6 h-6 text-xs font-medium rounded-full transition-all duration-200 hover:scale-110 ${
                  card.size === size 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {size.replace('x', '×')}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <TypeIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate">
            {card.title}
          </h3>
        </div>
        {isEditMode && (
          <Move className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0" />
        )}
      </div>

      {renderContent()}

      {!isEditMode && (
        <div className="flex gap-2 mt-auto w-full">
          <Button
            onClick={handleCopy}
            className="flex-1 min-w-0 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium rounded-xl h-12 transition-all transform hover:scale-105 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 animate-bounce flex-shrink-0" />
                <span className="truncate">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Copy</span>
              </>
            )}
          </Button>
          
          {card.type === "link" && (
            <Button
              onClick={handleLinkClick}
              variant="outline"
              className="px-4 flex-shrink-0 rounded-xl border-white/40 bg-white/60 hover:bg-white/80 transition-all transform hover:scale-105 active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
