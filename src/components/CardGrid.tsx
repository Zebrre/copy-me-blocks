
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
  "1x1": "bento-card-1x1",
  "1x2": "bento-card-1x2",
  "2x1": "bento-card-2x1",
  "2x2": "bento-card-2x2",
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
    <div className="bento-grid">
      {cards.map((card, index) => (
        <div 
          key={card.id} 
          className={`${gridSizeClasses[card.size]} animate-fade-in`}
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
