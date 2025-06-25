
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { DragDropCardGrid } from "@/components/DragDropCardGrid";
import { EditableCardModal } from "@/components/EditableCardModal";
import { useCards } from "@/hooks/useCards";
import { useOptimisticCards } from "@/hooks/useOptimisticCards";
import { useState } from "react";
import { Card } from "@/types/card";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const { 
    cards: serverCards, 
    loading: cardsLoading, 
    addCard: serverAddCard, 
    updateCard: serverUpdateCard, 
    deleteCard: serverDeleteCard 
  } = useCards();

  // Use optimistic updates for better UX
  const {
    cards: optimisticCards,
    addCard: optimisticAddCard,
    updateCard: optimisticUpdateCard,
    deleteCard: optimisticDeleteCard,
    isLoading: getCardLoadingState,
  } = useOptimisticCards(serverCards, {
    addCard: serverAddCard,
    updateCard: serverUpdateCard,
    deleteCard: serverDeleteCard,
  });

  useEffect(() => {
    console.log('Index: Auth state changed', { user, authLoading });
    if (!authLoading && !user) {
      console.log('Index: Redirecting to auth');
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">{t('auth.loading')}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleAddCard = async (cardData: any) => {
    await optimisticAddCard(cardData);
    setIsModalOpen(false);
  };

  const handleUpdateCard = async (card: Card) => {
    if (editingCard) {
      // Update existing card with new data
      await optimisticUpdateCard({ ...editingCard, ...card });
      setEditingCard(null);
      setIsModalOpen(false);
    } else {
      // Just update card properties (like size)
      optimisticUpdateCard(card);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    optimisticDeleteCard(cardId);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleReorderCards = async (reorderedCards: Card[]) => {
    // Update positions and send to server
    const cardsWithPositions = reorderedCards.map((card, index) => ({
      ...card,
      position: index
    }));
    
    // Update each card with new position
    for (const card of cardsWithPositions) {
      await optimisticUpdateCard(card);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCard(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNewCard={() => setIsModalOpen(true)} 
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DragDropCardGrid 
          cards={optimisticCards} 
          onDeleteCard={handleDeleteCard}
          isEditMode={isEditMode}
          onUpdateCard={handleUpdateCard}
          onReorderCards={handleReorderCards}
          isLoading={cardsLoading}
          getCardLoadingState={getCardLoadingState}
          onEditCard={handleEditCard}
        />
      </main>
      <EditableCardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingCard ? handleUpdateCard : handleAddCard}
        editingCard={editingCard}
      />
    </div>
  );
};

export default Index;
