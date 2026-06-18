import { Card, User } from "./card";

export interface BoardContextValue {
  cards: Card[];
  users: User[];

  addCard: (card: Omit<Card, "id" | "createdAt" | "updatedAt">) => void;

  updateCard: (id: string, changes: Partial<Omit<Card, "id" | "createdAt" | "updatedAt">>) => void;

  deleteCard: (id: string) => void;

  setCards: (cards: Card[]) => void;
  setUsers: (users: User[]) => void;
}
