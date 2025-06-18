
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
import { Snippet } from "@/types/snippet";

interface AddSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (snippet: Omit<Snippet, "id" | "createdAt">) => void;
}

const colorOptions = [
  { value: "blue", label: "Blue", className: "bg-blue-100 border-blue-300" },
  { value: "peach", label: "Peach", className: "bg-orange-100 border-orange-300" },
  { value: "yellow", label: "Yellow", className: "bg-yellow-100 border-yellow-300" },
  { value: "mint", label: "Mint", className: "bg-green-100 border-green-300" },
  { value: "lavender", label: "Lavender", className: "bg-purple-100 border-purple-300" },
];

export const AddSnippetModal = ({ isOpen, onClose, onSubmit }: AddSnippetModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"text" | "link" | "image">("text");
  const [color, setColor] = useState<"blue" | "peach" | "yellow" | "mint" | "lavender">("blue");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      type,
      color,
    });

    // Reset form
    setTitle("");
    setContent("");
    setType("text");
    setColor("blue");
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setTitle("");
    setContent("");
    setType("text");
    setColor("blue");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Snippet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter snippet title..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as "text" | "link" | "image")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text">Text</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="link" id="link" />
                <Label htmlFor="link">Link</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image">Image</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              {type === "text" ? "Content" : type === "link" ? "URL" : "Image URL"}
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === "text"
                  ? "Enter your text content..."
                  : type === "link"
                  ? "https://example.com"
                  : "https://example.com/image.jpg"
              }
              className="w-full min-h-24"
            />
          </div>

          <div className="space-y-3">
            <Label>Card Color</Label>
            <div className="flex gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value as any)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
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
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8]"
              disabled={!title.trim() || !content.trim()}
            >
              Add Snippet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
