
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/types/card";
import { Copy, ExternalLink, Trash2, Check, FileText, Link, Image, Move, Loader2, Edit2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface CardComponentProps {
  card: Card;
  onDelete: () => void;
  isEditMode?: boolean;
  onUpdate?: (card: Card) => void;
  isLoading?: boolean;
  onEdit?: () => void;
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

export const CardComponent = ({ 
  card, 
  onDelete, 
  isEditMode = false, 
  onUpdate,
  isLoading = false,
  onEdit 
}: CardComponentProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const TypeIcon = typeIcons[card.type];

  const handleCopy = async () => {
    setCopyLoading(true);
    try {
      await navigator.clipboard.writeText(card.content);
      setCopied(true);
      toast({
        title: t('cards.copied'),
        description: "Card content copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setCopyLoading(false);
    }
  };

  const handleLinkClick = () => {
    if (card.type === "link") {
      window.open(card.content, "_blank");
    }
  };

  const handleSizeChange = (newSize: "1x1" | "1x2" | "2x1" | "2x2") => {
    if (onUpdate && !isLoading) {
      onUpdate({ ...card, size: newSize });
    }
  };

  const handleDoubleClick = () => {
    if (!isEditMode && onEdit) {
      onEdit();
    }
  };

  const renderContent = () => {
    if (card.type === "image") {
      return (
        <div className="mb-3 flex-1 overflow-hidden">
          <img
            src={card.content}
            alt={card.title}
            className="w-full h-32 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
      );
    }

    if (card.type === "link") {
      return (
        <div className="mb-3 flex-1">
          <div
            className="text-blue-600 hover:text-blue-800 cursor-pointer break-all text-sm bg-white/60 p-3 rounded-xl border border-white/40 transition-all duration-200 hover:bg-white/80 hover:shadow-sm"
            onClick={handleLinkClick}
          >
            {card.content}
            <ExternalLink className="w-3 h-3 inline ml-2" />
          </div>
        </div>
      );
    }

    return (
      <div className="mb-3 flex-1">
        <div className="text-gray-700 text-sm bg-white/60 p-3 rounded-xl border border-white/40 line-clamp-3 transition-all duration-200 hover:bg-white/80">
          {card.content}
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`
        h-full w-full rounded-2xl border-2 p-4 shadow-sm transition-all duration-300 flex flex-col cursor-pointer relative overflow-hidden
        hover:shadow-xl hover:-rotate-1 hover:scale-[1.02] transform-gpu
        ${colorVariants[card.color]}
        ${isEditMode ? 'animate-[wiggle_0.5s_ease-in-out_infinite] hover:animate-none' : ''}
        ${isPressed ? 'scale-95' : ''}
        ${isLoading ? 'opacity-70' : ''}
        active:scale-95
      `}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onDoubleClick={handleDoubleClick}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      {/* Edit Mode Controls */}
      {isEditMode && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.()}
            disabled={isLoading}
            className="w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={isLoading}
            className="w-8 h-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
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
                disabled={isLoading}
                className={`w-6 h-6 text-xs font-medium rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50 ${
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

      <div className="flex items-start justify-between mb-3 min-h-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <TypeIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">
            {card.title}
          </h3>
        </div>
        {isEditMode && (
          <Move className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0 ml-2" />
        )}
      </div>

      {renderContent()}

      {!isEditMode && (
        <div className="flex gap-2 mt-auto pt-2 w-full min-h-0">
          <Button
            onClick={handleCopy}
            disabled={copyLoading || isLoading}
            className="flex-1 min-w-0 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium rounded-lg h-10 text-sm transition-all transform hover:scale-105 active:scale-95 px-3 disabled:opacity-50"
          >
            <div className="flex items-center justify-center gap-1.5 min-w-0 w-full">
              {copyLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 flex-shrink-0 animate-spin" />
                  <span className="truncate text-xs sm:text-sm font-medium">Copying...</span>
                </>
              ) : copied ? (
                <>
                  <Check className="w-3.5 h-3.5 flex-shrink-0 animate-bounce" />
                  <span className="truncate text-xs sm:text-sm font-medium">{t('cards.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate text-xs sm:text-sm font-medium">{t('cards.copy')}</span>
                </>
              )}
            </div>
          </Button>
          
          {card.type === "link" && (
            <Button
              onClick={handleLinkClick}
              variant="outline"
              disabled={isLoading}
              className="px-3 h-10 flex-shrink-0 rounded-lg border-white/40 bg-white/60 hover:bg-white/80 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
