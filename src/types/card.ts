
export interface Card {
  id: string;
  title: string;
  content: string;
  type: "text" | "link" | "image";
  color: "blue" | "peach" | "yellow" | "mint" | "lavender";
  size: "1x1" | "1x2" | "2x1" | "2x2";
  position?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type CardSize = "1x1" | "1x2" | "2x1" | "2x2";
export type CardType = "text" | "link" | "image";
export type CardColor = "blue" | "peach" | "yellow" | "mint" | "lavender";
