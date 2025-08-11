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
  dragHandleProps?: any;
}

const colorVariants = {
  blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50 hover:from-blue-100 hover:to-blue-150",
  peach: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/50 hover:from-orange-100 hover:to-orange-150",
  yellow: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200/50 hover:from-yellow-100 hover:to-yellow-150",
  mint: "bg-gradient-to-br from-green-50 to-green-100 border-green-200/50 hover:from-green-100 hover:to-green-150",
  lavender: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50 hover:from-purple-100 hover:to-purple-150",
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
  onEdit,
  dragHandleProps,
}: CardComponentProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const TypeIcon = typeIcons[card.type];

  const handleCopy = async (e: React.MouseEvent) => {
    if (isEditMode) return;
    e.stopPropagation();
    
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

  const handleLinkClick = (e: React.MouseEvent) => {
    if (card.type === "link" && !isEditMode) {
      e.stopPropagation();
      window.open(card.content, "_blank");
    }
  };

  const handleSizeChange = (e: React.MouseEvent, newSize: "1x1" | "1x2" | "2x1" | "2x2") => {
    e.stopPropagation();
    if (onUpdate && !isLoading) {
      const updatedCard = { ...card, size: newSize };
      onUpdate(updatedCard);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isEditMode && onEdit) {
      e.stopPropagation();
      onEdit();
    }
  };

  const renderContent = () => {
    if (card.type === "image") {
      return (
        <div className="flex-1 overflow-hidden mb-4 min-h-0">
          <img
            src={card.content}
            alt={card.title}
            className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-105 shadow-md"
            loading="lazy"
          />
        </div>
      );
    }

    if (card.type === "link") {
      return (
        <div className="flex-1 mb-4 min-h-0">
          <div className="text-blue-600 hover:text-blue-800 text-sm bg-white/70 p-4 rounded-2xl border border-white/50 transition-all duration-300 hover:bg-white/90 hover:shadow-md backdrop-blur-sm h-full overflow-hidden">
            <div className="line-clamp-4 break-all">
              {card.content}
              <ExternalLink className="w-4 h-4 inline ml-2 opacity-70" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 mb-4 min-h-0">
        <div className="text-gray-700 text-sm bg-white/70 p-4 rounded-2xl border border-white/50 transition-all duration-300 hover:bg-white/90 backdrop-blur-sm leading-relaxed h-full overflow-hidden">
          <div className="line-clamp-4">{card.content}</div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`
        bento-card shadow-lg transform-gpu group relative
        ${isEditMode ? 'cursor-default animate-[wiggle_0.5s_ease-in-out_infinite] hover:animate-none ring-2 ring-blue-200/50 overflow-visible' : 'cursor-pointer hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1'}
        ${colorVariants[card.color]}
        ${isPressed ? 'scale-95' : ''}
        ${isLoading ? 'opacity-70' : ''}
        ${copied ? 'ring-2 ring-green-400/50' : ''}
        active:scale-95
      `}
      onMouseDown={() => !isEditMode && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handleCopy}
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
        <>
          {/* Top Controls - Edit and Delete */}
          <div className="absolute -top-3 -right-3 flex gap-1 z-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              disabled={isLoading}
              className="w-7 h-7 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
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
              className="w-7 h-7 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          {/* Drag Handle - Top Left */}
          <div 
            className="absolute -top-3 -left-3 z-50 w-7 h-7 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors"
            {...dragHandleProps}
            style={{ touchAction: 'none' }}
          >
            <Move className="w-3 h-3" />
          </div>

          {/* Size Controls - Bottom Center */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 p-1.5 z-50">
            <div className="flex gap-1">
              {(["1x1", "1x2", "2x1", "2x2"] as const).map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleSizeChange(e, size)}
                  disabled={isLoading}
                  className={`w-7 h-7 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center justify-center ${
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

      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <div className="p-2 rounded-xl bg-white/50 backdrop-blur-sm flex-shrink-0">
          <TypeIcon className="w-4 h-4 text-gray-600" />
        </div>
        <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate">
          {card.title}
        </h3>
      </div>

      {renderContent()}

      {/* Copy/Link Status Indicator */}
      {!isEditMode && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          {copyLoading ? (
            <div className="bg-blue-500/90 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm whitespace-nowrap">
              <Loader2 className="w-3 h-3 animate-spin" />
              Copying...
            </div>
          ) : copied ? (
            <div className="bg-green-500/90 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm animate-bounce whitespace-nowrap">
              <Check className="w-3 h-3" />
              {t('cards.copied')}
            </div>
          ) : card.type === "link" ? (
            <div className="bg-blue-500/20 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm whitespace-nowrap">
              <ExternalLink className="w-3 h-3" />
              Copy
            </div>
          ) : (
            <div className="bg-gray-500/20 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <Copy className="w-3 h-3" />
              Copy
            </div>
          )}
        </div>
      )}
    </div>
  );
};
