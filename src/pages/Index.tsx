
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { CardGrid } from "@/components/CardGrid";
import { AddCardModal } from "@/components/AddCardModal";
import { useCards } from "@/hooks/useCards";
import { useState } from "react";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { cards, loading: cardsLoading, addCard, updateCard, deleteCard } = useCards();

  useEffect(() => {
    if (!authLoading && !user) {
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
    await addCard(cardData);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNewCard={() => setIsModalOpen(true)} 
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
      />
      <main className="container mx-auto px-8 py-8">
        {cardsLoading ? (
          <div className="text-center py-16">
            <div className="text-lg">{t('auth.loading')}</div>
          </div>
        ) : (
          <CardGrid 
            cards={cards} 
            onDeleteCard={deleteCard}
            isEditMode={isEditMode}
            onUpdateCard={updateCard}
          />
        )}
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
