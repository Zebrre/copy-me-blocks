
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableCard } from './DraggableCard';
import { CardSkeleton } from './CardSkeleton';
import { Card } from '@/types/card';
import { useTranslation } from 'react-i18next';

interface DragDropCardGridProps {
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
  "1x1": "col-span-1 row-span-1", // Square - Default
  "1x2": "col-span-1 row-span-2", // Tall rectangle 
  "2x1": "col-span-2 row-span-1", // Wide rectangle
  "2x2": "col-span-2 row-span-2", // Large square
};

export const DragDropCardGrid = ({ 
  cards, 
  onDeleteCard, 
  isEditMode = false, 
  onUpdateCard,
  onReorderCards,
  isLoading = false,
  getCardLoadingState,
  onEditCard
}: DragDropCardGridProps) => {
  const { t } = useTranslation();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over?.id);
      
      const newCards = arrayMove(cards, oldIndex, newIndex);
      onReorderCards?.(newCards);
    }
  };

  if (isLoading && cards.length === 0) {
    return (
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gridAutoRows: '200px' }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-lg mb-2 animate-fade-in">{t('cards.noCards')}</div>
        <div className="text-gray-500 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {t('cards.createFirst')}
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cards.map(card => card.id)} strategy={rectSortingStrategy}>
        <div 
          className={`grid transition-all duration-300 ${isEditMode ? 'gap-8 p-4' : 'gap-4'}`}
          style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gridAutoRows: 'minmax(200px, auto)' 
          }}
        >
          {cards.map((card, index) => (
            <div 
              key={card.id} 
              className={`${gridSizeClasses[card.size]} transition-all duration-300 animate-fade-in ${
                isEditMode ? 'edit-mode-card' : ''
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <DraggableCard
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
      </SortableContext>
    </DndContext>
  );
};
