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
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const TypeIcon = typeIcons[card.type];

  const handleCardClick = async (e: React.MouseEvent) => {
    // Don't copy if in edit mode or clicking on edit controls
    if (isEditMode) return;
    
    // Don't copy if clicking on links or buttons
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-no-copy]')) return;
    
    setCopyLoading(true);
    setShowCopyFeedback(true);
    
    try {
      await navigator.clipboard.writeText(card.content);
      setCopied(true);
      toast({
        title: t('cards.copied'),
        description: "Card content copied to clipboard",
      });
      setTimeout(() => {
        setCopied(false);
        setShowCopyFeedback(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
      setShowCopyFeedback(false);
    } finally {
      setCopyLoading(false);
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click (copy)
    if (card.type === "link") {
      window.open(card.content, "_blank");
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
        <div className="mb-3 flex-1 overflow-hidden min-h-0">
          <img
            src={card.content}
            alt={card.title}
            className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
      );
    }

    if (card.type === "link") {
      return (
        <div className="mb-3 flex-1 overflow-hidden min-h-0">
          <div
            className="text-blue-600 hover:text-blue-800 cursor-pointer break-all text-sm bg-white/60 p-3 rounded-xl border border-white/40 transition-all duration-200 hover:bg-white/80 hover:shadow-sm"
            onClick={handleLinkClick}
            data-no-copy="true"
          >
            {card.content}
            <ExternalLink className="w-3 h-3 inline ml-2" />
          </div>
        </div>
      );
    }

    return (
      <div className="mb-3 flex-1 overflow-hidden min-h-0">
        <div className="text-gray-700 text-sm bg-white/60 p-3 rounded-xl border border-white/40 line-clamp-4 transition-all duration-200 hover:bg-white/80 h-full overflow-y-auto">
          {card.content}
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`
        h-full w-full rounded-2xl border-2 p-4 shadow-sm transition-all duration-300 flex flex-col relative overflow-hidden aspect-square
        ${isEditMode ? 'cursor-default' : 'cursor-pointer'}
        hover:shadow-xl hover:-rotate-1 hover:scale-[1.02] transform-gpu
        ${colorVariants[card.color]}
        ${isEditMode ? 'animate-[wiggle_0.5s_ease-in-out_infinite] hover:animate-none' : ''}
        ${isPressed ? 'scale-95' : ''}
        ${isLoading ? 'opacity-70' : ''}
        ${!isEditMode ? 'active:scale-95' : ''}
      `}
      onClick={handleCardClick}
      onMouseDown={() => !isEditMode && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onDoubleClick={handleDoubleClick}
      title={!isEditMode ? "Click to copy content" : undefined}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}
      
      {/* Copy Feedback Overlay */}
      {showCopyFeedback && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className={`transition-all duration-200 ${copied ? 'animate-scale-in' : ''}`}>
            {copied ? (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Copied!</span>
              </div>
            ) : null}
          </div>
        </div>
      )}
      {/* Edit Mode Controls */}
      {isEditMode && (
        <>
          {/* Edit and Delete Controls - Top Right */}
          <div className="absolute -top-2 -right-2 flex gap-1 z-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              disabled={isLoading}
              className="w-6 h-6 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition-all duration-200 hover:scale-110 disabled:opacity-50"
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
              className="w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-all duration-200 hover:scale-110 disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          {/* Size Controls - Bottom Right */}
          <div className="absolute -bottom-2 -right-2 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-20">
            <div className="grid grid-cols-2 gap-0.5">
              {(["1x1", "1x2", "2x1", "2x2"] as const).map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSizeChange(size);
                  }}
                  disabled={isLoading}
                  className={`w-6 h-6 text-xs font-medium rounded transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center justify-center ${
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
        </>
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

      {/* Copy Hint for non-edit mode */}
      {!isEditMode && (
        <div className="mt-auto pt-2 flex items-center justify-center flex-shrink-0">
          <div className="text-xs text-gray-400 opacity-60 flex items-center gap-1">
            <Copy className="w-3 h-3" />
            <span>Click to copy</span>
          </div>
        </div>
      )}
    </div>
  );
};
