
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardSize } from "@/types/card";
import { FileText, Link, Image } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EditableCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (card: Omit<Card, "id" | "created_at" | "updated_at" | "user_id">) => void;
  editingCard?: Card | null;
}

const colorOptions = [
  { value: "blue", label: "Blue", className: "bg-blue-100 border-blue-300" },
  { value: "peach", label: "Peach", className: "bg-orange-100 border-orange-300" },
  { value: "yellow", label: "Yellow", className: "bg-yellow-100 border-yellow-300" },
  { value: "mint", label: "Mint", className: "bg-green-100 border-green-300" },
  { value: "lavender", label: "Lavender", className: "bg-purple-100 border-purple-300" },
];

const sizeOptions = [
  { value: "1x1", label: "1×1", className: "w-6 h-6", description: "Square" },
  { value: "1x2", label: "1×2", className: "w-8 h-6", description: "Wide" },
  { value: "2x1", label: "2×1", className: "w-6 h-8", description: "Tall" },
  { value: "2x2", label: "2×2", className: "w-8 h-8", description: "Large" },
];

export const EditableCardModal = ({ isOpen, onClose, onSubmit, editingCard }: EditableCardModalProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"text" | "link" | "image">("text");
  const [color, setColor] = useState<"blue" | "peach" | "yellow" | "mint" | "lavender">("blue");
  const [size, setSize] = useState<CardSize>("1x1");

  const isEditing = !!editingCard;

  // Pre-populate form when editing
  useEffect(() => {
    if (editingCard) {
      setTitle(editingCard.title);
      setContent(editingCard.content);
      setType(editingCard.type);
      setColor(editingCard.color);
      setSize(editingCard.size);
    } else {
      // Reset form for new card
      setTitle("");
      setContent("");
      setType("text");
      setColor("blue");
      setSize("1x1");
    }
  }, [editingCard, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      type,
      color,
      size,
    });

    handleClose();
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    if (!isEditing) {
      setTitle("");
      setContent("");
      setType("text");
      setColor("blue");
      setSize("1x1");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? t('cards.editCard') : t('cards.addCard')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm">{t('cards.title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('cards.titlePlaceholder')}
              className="w-full rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">{t('cards.type')}</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as "text" | "link" | "image")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text" className="flex items-center gap-1 text-sm">
                  <FileText className="w-3 h-3" />
                  {t('cards.text')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="link" id="link" />
                <Label htmlFor="link" className="flex items-center gap-1 text-sm">
                  <Link className="w-3 h-3" />
                  {t('cards.link')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image" className="flex items-center gap-1 text-sm">
                  <Image className="w-3 h-3" />
                  {t('cards.image')}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm">
              {type === "text" ? t('cards.content') : type === "link" ? t('cards.url') : t('cards.imageUrl')}
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === "text"
                  ? t('cards.textPlaceholder')
                  : type === "link"
                  ? t('cards.linkPlaceholder')
                  : t('cards.imagePlaceholder')
              }
              className="w-full min-h-20 rounded-lg resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">{t('cards.size')}</Label>
              <div className="grid grid-cols-2 gap-2">
                {sizeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSize(option.value as CardSize)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all text-xs ${
                      size === option.value
                        ? "border-[#2563EB] bg-blue-50 ring-2 ring-blue-200/50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    title={option.description}
                  >
                    <div className={`${option.className} bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg shadow-sm`} />
                    <span className="font-medium">{option.label}</span>
                    <span className="text-gray-500 text-[10px]">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">{t('cards.color')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColor(option.value as any)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      option.className
                    } ${
                      color === option.value
                        ? "ring-2 ring-[#2563EB] ring-offset-1"
                        : "hover:scale-110"
                    }`}
                    title={option.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-lg"
            >
              {t('cards.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] rounded-lg"
              disabled={!title.trim() || !content.trim()}
            >
              {isEditing ? t('cards.updateCard') : t('cards.addCard')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
