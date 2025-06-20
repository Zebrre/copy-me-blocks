
import { CardComponent } from "@/components/CardComponent";
import { Card } from "@/types/card";

interface CardGridProps {
  cards: Card[];
  onDeleteCard: (id: string) => void;
  isEditMode?: boolean;
  onUpdateCard?: (card: Card) => void;
}

const gridSizeClasses = {
  "1x1": "col-span-1 row-span-1",
  "1x2": "col-span-1 row-span-2", 
  "2x1": "col-span-2 row-span-1",
  "2x2": "col-span-2 row-span-2",
};

export const CardGrid = ({ cards, onDeleteCard, isEditMode = false, onUpdateCard }: CardGridProps) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-lg mb-2 animate-fade-in">No cards yet</div>
        <div className="text-gray-500 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Click "New Card" to create your first card!
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6 auto-rows-[200px] transition-all duration-300">
      {cards.map((card, index) => (
        <div 
          key={card.id} 
          className={`${gridSizeClasses[card.size]} transition-all duration-300 animate-fade-in`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardComponent
            card={card}
            onDelete={() => onDeleteCard(card.id)}
            isEditMode={isEditMode}
            onUpdate={onUpdateCard}
          />
        </div>
      ))}
    </div>
  );
};
