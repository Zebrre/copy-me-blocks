
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Settings } from "lucide-react";

interface HeaderProps {
  onNewCard: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

export const Header = ({ onNewCard, isEditMode, onToggleEditMode }: HeaderProps) => {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CopyMe</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={onToggleEditMode}
              variant={isEditMode ? "default" : "outline"}
              className={`px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 ${
                isEditMode 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                  : "hover:bg-gray-50"
              }`}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditMode ? "Done" : "Edit"}
            </Button>
            
            <Button
              onClick={onNewCard}
              className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Card
            </Button>
            
            <Avatar className="w-10 h-10 ring-2 ring-gray-100 transition-all hover:ring-gray-200">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
