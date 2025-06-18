
import { useState } from "react";
import { Header } from "@/components/Header";
import { SnippetGrid } from "@/components/SnippetGrid";
import { AddSnippetModal } from "@/components/AddSnippetModal";
import { Snippet } from "@/types/snippet";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snippets, setSnippets] = useState<Snippet[]>([
    {
      id: "1",
      title: "Welcome Email Template",
      content: "Hi there! Welcome to our amazing platform. We're excited to have you on board and can't wait to see what you'll create.",
      type: "text",
      color: "blue",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Portfolio Website",
      content: "https://example-portfolio.com",
      type: "link",
      color: "peach",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Design Inspiration",
      content: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      type: "image",
      color: "mint",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Quick CSS Reset",
      content: "* { margin: 0; padding: 0; box-sizing: border-box; }",
      type: "text",
      color: "lavender",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      title: "GitHub Profile",
      content: "https://github.com/username",
      type: "link",
      color: "yellow",
      createdAt: new Date().toISOString(),
    },
  ]);

  const handleAddSnippet = (snippet: Omit<Snippet, "id" | "createdAt">) => {
    const newSnippet: Snippet = {
      ...snippet,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSnippets([newSnippet, ...snippets]);
    setIsModalOpen(false);
  };

  const handleDeleteSnippet = (id: string) => {
    setSnippets(snippets.filter(snippet => snippet.id !== id));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onNewCard={() => setIsModalOpen(true)} />
      <main className="container mx-auto px-6 py-8">
        <SnippetGrid snippets={snippets} onDeleteSnippet={handleDeleteSnippet} />
      </main>
      <AddSnippetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSnippet}
      />
    </div>
  );
};

export default Index;
