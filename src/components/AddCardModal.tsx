
import { useState } from "react";
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

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (card: Omit<Card, "id" | "created_at" | "updated_at" | "user_id">) => void;
}

const colorOptions = [
  { value: "blue", label: "Blue", className: "bg-blue-100 border-blue-300" },
  { value: "peach", label: "Peach", className: "bg-orange-100 border-orange-300" },
  { value: "yellow", label: "Yellow", className: "bg-yellow-100 border-yellow-300" },
  { value: "mint", label: "Mint", className: "bg-green-100 border-green-300" },
  { value: "lavender", label: "Lavender", className: "bg-purple-100 border-purple-300" },
];

const sizeOptions = [
  { value: "1x1", label: "Small (1×1)", className: "w-8 h-8" },
  { value: "1x2", label: "Tall (1×2)", className: "w-8 h-12" },
  { value: "2x1", label: "Wide (2×1)", className: "w-12 h-8" },
  { value: "2x2", label: "Large (2×2)", className: "w-12 h-12" },
];

export const AddCardModal = ({ isOpen, onClose, onSubmit }: AddCardModalProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"text" | "link" | "image">("text");
  const [color, setColor] = useState<"blue" | "peach" | "yellow" | "mint" | "lavender">("blue");
  const [size, setSize] = useState<CardSize>("1x1");

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

    // Reset form
    setTitle("");
    setContent("");
    setType("text");
    setColor("blue");
    setSize("1x1");
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setTitle("");
    setContent("");
    setType("text");
    setColor("blue");
    setSize("1x1");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{t('cards.addCard')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t('cards.title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('cards.titlePlaceholder')}
              className="w-full rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <Label>{t('cards.type')}</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as "text" | "link" | "image")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t('cards.text')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="link" id="link" />
                <Label htmlFor="link" className="flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  {t('cards.link')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image" className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  {t('cards.image')}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
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
              className="w-full min-h-24 rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <Label>{t('cards.size')}</Label>
            <div className="grid grid-cols-2 gap-3">
              {sizeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSize(option.value as CardSize)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    size === option.value
                      ? "border-[#2563EB] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`${option.className} bg-gray-300 rounded`} />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t('cards.color')}</Label>
            <div className="flex gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value as any)}
                  className={`w-10 h-10 rounded-xl border-2 transition-all ${
                    option.className
                  } ${
                    color === option.value
                      ? "ring-2 ring-[#2563EB] ring-offset-2"
                      : "hover:scale-110"
                  }`}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-xl"
            >
              {t('cards.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] rounded-xl"
              disabled={!title.trim() || !content.trim()}
            >
              {t('cards.addCard')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
