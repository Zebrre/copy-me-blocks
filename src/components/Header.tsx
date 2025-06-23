
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onNewCard: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

export const Header = ({ onNewCard, isEditMode, onToggleEditMode }: HeaderProps) => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('app.title')}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
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
              {isEditMode ? t('app.done') : t('app.edit')}
            </Button>
            
            <Button
              onClick={onNewCard}
              className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('app.newCard')}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-10 h-10 ring-2 ring-gray-100 transition-all hover:ring-gray-200 cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('auth.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
