
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
  "1x1": "bento-span-1x1",
  "1x2": "bento-span-1x2", 
  "2x1": "bento-span-2x1",
  "2x2": "bento-span-2x2",
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
    console.log('Drag end event:', { activeId: active.id, overId: over?.id });

    if (active.id !== over?.id && over?.id) {
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over.id);
      
      console.log('Reordering cards:', { oldIndex, newIndex });
      
      const newCards = arrayMove(cards, oldIndex, newIndex);
      console.log('New card order:', newCards.map(c => ({ id: c.id, title: c.title })));
      
      onReorderCards?.(newCards);
    }
  };

  const handleUpdateCard = (updatedCard: Card) => {
    console.log('Card update in DragDropCardGrid:', updatedCard);
    onUpdateCard?.(updatedCard);
  };

  if (isLoading && cards.length === 0) {
    return (
      <div className="bento-grid">
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
        <div className="bento-grid">
          {cards.map((card, index) => (
            <div 
              key={card.id} 
              className={`${gridSizeClasses[card.size]} animate-fade-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <DraggableCard
                card={card}
                onDelete={() => onDeleteCard(card.id)}
                isEditMode={isEditMode}
                onUpdate={handleUpdateCard}
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
