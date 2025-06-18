
import { SnippetCard } from "@/components/SnippetCard";
import { Snippet } from "@/types/snippet";

interface SnippetGridProps {
  snippets: Snippet[];
  onDeleteSnippet: (id: string) => void;
}

export const SnippetGrid = ({ snippets, onDeleteSnippet }: SnippetGridProps) => {
  if (snippets.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-lg mb-2">No snippets yet</div>
        <div className="text-gray-500">Click "New Card" to create your first snippet!</div>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onDelete={() => onDeleteSnippet(snippet.id)}
        />
      ))}
    </div>
  );
};
