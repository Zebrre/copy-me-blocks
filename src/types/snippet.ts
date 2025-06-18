
export interface Snippet {
  id: string;
  title: string;
  content: string;
  type: "text" | "link" | "image";
  color: "blue" | "peach" | "yellow" | "mint" | "lavender";
  createdAt: string;
}
