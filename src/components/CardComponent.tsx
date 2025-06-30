
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

  const handleCardClick = async (e: React.MouseEvent) => {
    // Don't trigger copy if clicking on edit mode controls
    if (isEditMode || (e.target as HTMLElement).closest('.edit-controls')) {
      return;
    }

    // Handle link cards differently
    if (card.type === "link") {
      window.open(card.content, "_blank");
      return;
    }

    // Copy functionality for text and image cards
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

  const handleSizeChange = (newSize: "1x1" | "1x2" | "2x1" | "2x2") => {
    if (onUpdate && !isLoading) {
      const updatedCard = { ...card, size: newSize };
      onUpdate(updatedCard);
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
          <div className="text-blue-600 break-all text-sm bg-white/60 p-3 rounded-xl border border-white/40 transition-all duration-200 hover:bg-white/80 hover:shadow-sm flex items-center gap-2">
            <span className="flex-1">{card.content}</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
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
        h-full w-full rounded-2xl border-2 p-4 shadow-sm transition-all duration-300 flex flex-col relative overflow-visible
        ${isEditMode ? '' : 'cursor-pointer hover:shadow-xl hover:-rotate-1 hover:scale-[1.02] transform-gpu'}
        ${colorVariants[card.color]}
        ${isEditMode ? 'animate-[wiggle_0.5s_ease-in-out_infinite] hover:animate-none' : ''}
        ${isPressed ? 'scale-95' : ''}
        ${isLoading ? 'opacity-70' : ''}
        ${copied ? 'ring-2 ring-green-400 ring-opacity-75' : ''}
        active:scale-95
      `}
      onClick={handleCardClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onDoubleClick={handleDoubleClick}
      role={isEditMode ? "button" : "button"}
      tabIndex={isEditMode ? -1 : 0}
      aria-label={isEditMode ? undefined : `Copy ${card.title}: ${card.content}`}
      onKeyDown={(e) => {
        if (!isEditMode && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCardClick(e as any);
        }
      }}
    >
      {/* Loading Overlay */}
      {(isLoading || copyLoading) && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      {/* Copy Success Indicator */}
      {copied && (
        <div className="absolute inset-0 bg-green-50/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-green-700">
            <Check className="w-5 h-5 animate-bounce" />
            <span className="font-medium">{t('cards.copied')}</span>
          </div>
        </div>
      )}

      {/* Edit Mode Controls */}
      {isEditMode && (
        <div className="edit-controls">
          {/* Top Controls - Edit and Delete */}
          <div className="absolute -top-2 -right-2 flex gap-1 z-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              disabled={isLoading}
              className="w-6 h-6 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={isLoading}
              className="w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          {/* Drag Handle - Top Left */}
          <div className="absolute -top-1 -left-1 z-20">
            <div className="w-5 h-5 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors">
              <Move className="w-2 h-2" />
            </div>
          </div>

          {/* Size Controls - Bottom Right */}
          <div className="absolute -bottom-2 -right-2 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-20">
            <div className="text-xs text-gray-500 mb-1 text-center font-medium">Size</div>
            <div className="grid grid-cols-2 gap-1">
              {(["1x1", "1x2", "2x1", "2x2"] as const).map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSizeChange(size);
                  }}
                  disabled={isLoading}
                  className={`w-6 h-6 text-xs font-semibold rounded transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center justify-center ${
                    card.size === size 
                      ? "bg-blue-500 text-white shadow-sm" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={`Resize to ${size.replace('x', '×')}`}
                >
                  {size.replace('x', '×')}
                </button>
              ))}
            </div>
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
      </div>

      {renderContent()}

      {/* Interactive hint for non-edit mode */}
      {!isEditMode && (
        <div className="mt-auto pt-2">
          <div className="text-xs text-gray-500 text-center opacity-0 group-hover:opacity-100 transition-opacity">
            {card.type === "link" ? "Click to open" : "Click to copy"}
          </div>
        </div>
      )}
    </div>
  );
};
