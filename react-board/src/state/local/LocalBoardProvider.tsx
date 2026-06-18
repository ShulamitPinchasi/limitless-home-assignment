import { ReactNode, useState } from "react";
import { BoardContext } from "../context/BoardContext";
import { Card, User } from "../../interfaces/card";
import { generateId } from "../../utils/helper";
import { socketClient } from "../../services/socketClient";

export const LocalBoardProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const addCard = (card: Omit<Card, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date();

    const newCard: Card = {
      ...card,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    setCards((prev) => [...prev, newCard]);

    socketClient.send({
      type: "card:create",
      payload: newCard,
    });
  };

  const updateCard = (id: string, changes: Partial<Omit<Card, "id" | "createdAt" | "updatedAt">>) => {
    const existingCard = cards.find((card) => card.id === id);

    if (!existingCard) return;

    const updatedCard: Card = {
      ...existingCard,
      ...changes,
      updatedAt: new Date(),
    };

    setCards((prev) =>
      prev.map((card) => (card.id === id ? updatedCard : card)),
    );

    socketClient.send({
      type: "card:update",
      payload: updatedCard,
    });
  };

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));

    socketClient.send({
      type: "card:delete",
      payload: { id },
    });
  };

  return (
    <BoardContext.Provider
      value={{
        cards,
        users,

        setCards,
        setUsers,

        addCard,
        updateCard,
        deleteCard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
