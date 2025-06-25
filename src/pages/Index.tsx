
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { CardGrid } from "@/components/CardGrid";
import { AddCardModal } from "@/components/AddCardModal";
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

  const handleUpdateCard = (card: Card) => {
    optimisticUpdateCard(card);
  };

  const handleDeleteCard = (cardId: string) => {
    optimisticDeleteCard(cardId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNewCard={() => setIsModalOpen(true)} 
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CardGrid 
          cards={optimisticCards} 
          onDeleteCard={handleDeleteCard}
          isEditMode={isEditMode}
          onUpdateCard={handleUpdateCard}
          isLoading={cardsLoading}
          getCardLoadingState={getCardLoadingState}
        />
      </main>
      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCard}
      />
    </div>
  );
};

export default Index;
