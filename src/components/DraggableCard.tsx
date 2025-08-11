
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
  className?: string;
  customStyle?: React.CSSProperties;
}

export const DraggableCard = ({ 
  card, 
  onDelete, 
  isEditMode = false, 
  onUpdate,
  isLoading = false,
  onEdit,
  className = '',
  customStyle
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
    disabled: !isEditMode
  });

  const style = {
    ...customStyle,
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
    position: isDragging ? 'relative' : 'static',
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`${className} ${isDragging ? 'z-50 shadow-2xl dnd-kit-dragging' : ''} transition-shadow duration-200`}
    >
      <CardComponent
        card={card}
        onDelete={onDelete}
        isEditMode={isEditMode}
        onUpdate={onUpdate}
        isLoading={isLoading}
        onEdit={onEdit}
        dragHandleProps={isEditMode ? listeners : undefined}
      />
    </div>
  );
};
