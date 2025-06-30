
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardComponent } from './CardComponent';
import { Card } from '@/types/card';

interface DraggableCardProps {
  card: Card;
  onDelete: () => void;
  isEditMode?: boolean;
  onUpdate?: (card: Card) => void;
  isLoading?: boolean;
  onEdit?: () => void;
}

export const DraggableCard = ({ 
  card, 
  onDelete, 
  isEditMode = false, 
  onUpdate,
  isLoading = false,
  onEdit
}: DraggableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: card.id,
    disabled: !isEditMode // Only enable dragging in edit mode
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  console.log('DraggableCard render:', { 
    cardId: card.id, 
    isEditMode, 
    isDragging,
    hasListeners: !!listeners 
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditMode ? listeners : {})}
      className={`transition-all duration-200 ${isDragging ? 'z-50 cursor-grabbing' : ''}`}
    >
      <CardComponent
        card={card}
        onDelete={onDelete}
        isEditMode={isEditMode}
        onUpdate={onUpdate}
        isLoading={isLoading}
        onEdit={onEdit}
      />
    </div>
  );
};
