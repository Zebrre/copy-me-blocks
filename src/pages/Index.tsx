
import { useState } from "react";
import { Header } from "@/components/Header";
import { CardGrid } from "@/components/CardGrid";
import { AddCardModal } from "@/components/AddCardModal";
import { Card } from "@/types/card";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [cards, setCards] = useState<Card[]>([
    {
      id: "1",
      title: "Welcome Email Template",
      content: "Hi there! Welcome to our amazing platform. We're excited to have you on board and can't wait to see what you'll create.",
      type: "text",
      color: "blue",
      size: "2x1",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Portfolio Website",
      content: "https://example-portfolio.com",
      type: "link",
      color: "peach",
      size: "1x1",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Design Inspiration",
      content: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      type: "image",
      color: "mint",
      size: "1x2",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Quick CSS Reset",
      content: "* { margin: 0; padding: 0; box-sizing: border-box; }",
      type: "text",
      color: "lavender",
      size: "1x1",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      title: "GitHub Profile",
      content: "https://github.com/username",
      type: "link",
      color: "yellow",
      size: "1x1",
      createdAt: new Date().toISOString(),
    },
  ]);

  const handleAddCard = (card: Omit<Card, "id" | "createdAt">) => {
    const newCard: Card = {
      ...card,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCards([newCard, ...cards]);
    setIsModalOpen(false);
  };

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleUpdateCard = (updatedCard: Card) => {
    setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNewCard={() => setIsModalOpen(true)} 
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
      />
      <main className="container mx-auto px-8 py-8">
        <CardGrid 
          cards={cards} 
          onDeleteCard={handleDeleteCard}
          isEditMode={isEditMode}
          onUpdateCard={handleUpdateCard}
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
