import { create } from "zustand";
import { Card, User } from "../interfaces/card";
import { generateId } from "../utils/helper";
import { socketClient } from "../services/socketClient";

type CardState = {
  cards: Card[];
  users: User[];

  setCards: (cards: Card[]) => void;
  setUsers: (users: User[]) => void;
  addCard: (card: Omit<Card, "id" | "createdAt" | "updatedAt">) => void;
  updateCard: (
    id: string,
    changes: Partial<Omit<Card, "id" | "createdAt" | "updatedAt">>,
  ) => void;
  deleteCard: (id: string) => void;
};

export const useCardStore = create<CardState>((set) => ({
  cards: [],
  users: [],

  setCards: (cards) => {
    set({ cards: cards });
  },

  setUsers: (users) => {
    set({ users });
  },
  
  addCard: (card) => {
    const now = new Date();

    const newCard: Card = {
      ...card,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      cards: [...state.cards, newCard],
    }));

    socketClient.send({
      type: "card:create",
      payload: newCard,
    });
  },

  updateCard: (id, changes) => {
    let updatedCard: Card | undefined;

    set((state) => ({
      cards: state.cards.map((card) => {
        if (card.id !== id) return card;

        updatedCard = {
          ...card,
          ...changes,
          updatedAt: new Date(),
        };

        return updatedCard;
      }),
    }));

    if (updatedCard) {
      socketClient.send({
        type: "card:update",
        payload: updatedCard,
      });
    }
  },

  deleteCard: (id) => {
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
    }));

    socketClient.send({
      type: "card:delete",
      payload: {
        id,
      },
    });
  },
}));
