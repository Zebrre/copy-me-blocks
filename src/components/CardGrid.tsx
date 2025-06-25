
import { CardComponent } from "@/components/CardComponent";
import { CardSkeleton } from "@/components/CardSkeleton";
import { Card } from "@/types/card";
import { useTranslation } from "react-i18next";

interface CardGridProps {
  cards: Card[];
  onDeleteCard: (id: string) => void;
  isEditMode?: boolean;
  onUpdateCard?: (card: Card) => void;
  isLoading?: boolean;
  getCardLoadingState?: (cardId: string) => boolean;
}

const gridSizeClasses = {
  "1x1": "col-span-1 row-span-1",
  "1x2": "col-span-1 row-span-2", 
  "2x1": "col-span-2 row-span-1",
  "2x2": "col-span-2 row-span-2",
};

export const CardGrid = ({ 
  cards, 
  onDeleteCard, 
  isEditMode = false, 
  onUpdateCard,
  isLoading = false,
  getCardLoadingState 
}: CardGridProps) => {
  const { t } = useTranslation();

  if (isLoading && cards.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[200px]">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[200px] transition-all duration-300">
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
            isLoading={getCardLoadingState?.(card.id) || false}
          />
        </div>
      ))}
    </div>
  );
};
