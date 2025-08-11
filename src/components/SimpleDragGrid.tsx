import { useState, useRef } from 'react';
import { Card } from '@/types/card';
import { CardComponent } from './CardComponent';
import { useTranslation } from 'react-i18next';

interface SimpleDragGridProps {
  cards: Card[];
  onDeleteCard: (id: string) => void;
  isEditMode?: boolean;
  onUpdateCard?: (card: Card) => void;
  onReorderCards?: (cards: Card[]) => void;
  isLoading?: boolean;
  getCardLoadingState?: (cardId: string) => boolean;
  onEditCard?: (card: Card) => void;
}

const gridSizeClasses = {
  "1x1": "bento-card-1x1",
  "1x2": "bento-card-1x2",
  "2x1": "bento-card-2x1", 
  "2x2": "bento-card-2x2",
};

export const SimpleDragGrid = ({
  cards,
  onDeleteCard,
  isEditMode = false,
  onUpdateCard,
  onReorderCards,
  isLoading = false,
  getCardLoadingState,
  onEditCard
}: SimpleDragGridProps) => {
  const { t } = useTranslation();
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [dragOverCard, setDragOverCard] = useState<string | null>(null);
  const draggedElement = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    if (!isEditMode) return;
    setDraggedCard(cardId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragOver = (e: React.DragEvent, cardId: string) => {
    if (!isEditMode || !draggedCard) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCard(cardId);
  };

  const handleDragLeave = () => {
    setDragOverCard(null);
  };

  const handleDrop = (e: React.DragEvent, targetCardId: string) => {
    if (!isEditMode || !draggedCard) return;
    e.preventDefault();
    
    if (draggedCard !== targetCardId) {
      const draggedIndex = cards.findIndex(card => card.id === draggedCard);
      const targetIndex = cards.findIndex(card => card.id === targetCardId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newCards = [...cards];
        const [draggedItem] = newCards.splice(draggedIndex, 1);
        newCards.splice(targetIndex, 0, draggedItem);
        onReorderCards?.(newCards);
      }
    }
    
    setDraggedCard(null);
    setDragOverCard(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverCard(null);
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-lg mb-2">{t('cards.noCards')}</div>
        <div className="text-gray-500">{t('cards.createFirst')}</div>
      </div>
    );
  }

  return (
    <div className={`bento-grid ${isEditMode ? 'bento-grid-edit' : ''}`}>
      {cards.map((card) => (
        <div
          key={card.id}
          className={`
            ${gridSizeClasses[card.size]}
            ${draggedCard === card.id ? 'opacity-50' : ''}
            ${dragOverCard === card.id ? 'ring-2 ring-blue-400' : ''}
            transition-all duration-200
          `}
          draggable={isEditMode}
          onDragStart={(e) => handleDragStart(e, card.id)}
          onDragOver={(e) => handleDragOver(e, card.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, card.id)}
          onDragEnd={handleDragEnd}
        >
          <CardComponent
            card={card}
            onDelete={() => onDeleteCard(card.id)}
            isEditMode={isEditMode}
            onUpdate={onUpdateCard}
            isLoading={getCardLoadingState?.(card.id) || false}
            onEdit={() => onEditCard?.(card)}
          />
        </div>
      ))}
    </div>
  );
};