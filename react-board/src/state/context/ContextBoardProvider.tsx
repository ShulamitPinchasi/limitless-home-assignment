import { ReactNode, useReducer } from "react";
import { generateId } from "../../utils/helper";
import { socketClient } from "../../services/socketClient";
import { Card, User } from "../../interfaces/card";
import { BoardContext } from "./BoardContext";

type BoardContextState = {
  cards: Card[];
  users: User[];
};

type BoardAction =
  | { type: "setCards"; payload: Card[] }
  | { type: "setUsers"; payload: User[] }
  | { type: "addCard"; payload: Card }
  | {
      type: "updateCard";
      payload: {
        id: string;
        changes: Partial<Omit<Card, "id" | "createdAt" | "updatedAt">>;
      };
    }
  | { type: "deleteCard"; payload: { id: string } }
  | { type: "setCards"; payload: Card[] }
  | { type: "setUsers"; payload: User[] };

const initialState: BoardContextState = {
  cards: [],
  users: [],
};

const boardReducer = (
  state: BoardContextState,
  action: BoardAction,
): BoardContextState => {
  switch (action.type) {
    case "setCards":
      return {
        ...state,
        cards: action.payload,
      };

    case "setUsers":
      return {
        ...state,
        users: action.payload,
      };

    case "addCard":
      return {
        ...state,
        cards: [...state.cards, action.payload],
      };

    case "updateCard":
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.payload.id
            ? {
                ...card,
                ...action.payload.changes,
                updatedAt: new Date(),
              }
            : card,
        ),
      };

    case "deleteCard":
      return {
        ...state,
        cards: state.cards.filter((card) => card.id !== action.payload.id),
      };

    default:
      return state;
  }
};

export const BoardContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  const addCard = (card: Omit<Card, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date();

    const newCard: Card = {
      ...card,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    dispatch({
      type: "addCard",
      payload: newCard,
    });

    socketClient.send({
      type: "card:create",
      payload: newCard,
    });
  };

  const updateCard = (
    id: string,
    changes: Partial<Omit<Card, "id" | "createdAt" | "updatedAt">>,
  ) => {
     console.log('context updateCard called', { id, changes });
    const existingCard = state.cards.find((card) => card.id === id);

  console.log('existingCard', existingCard);
    if (!existingCard) return;

    const updatedCard: Card = {
      ...existingCard,
      ...changes,
      updatedAt: new Date(),
    };

     console.log('sending card:update', updatedCard);


    dispatch({
      type: "updateCard",
      payload: {
        id,
        changes,
      },
    });

    socketClient.send({
      type: "card:update",
      payload: updatedCard,
    });
  };
  const deleteCard = (id: string) => {
    dispatch({
      type: "deleteCard",
      payload: { id },
    });

    socketClient.send({
      type: "card:delete",
      payload: { id },
    });
  };

  const setCards = (cards: Card[]) => {
    dispatch({
      type: "setCards",
      payload: cards,
    });
  };

  const setUsers = (users: User[]) => {
    dispatch({
      type: "setUsers",
      payload: users,
    });
  };

  return (
    <BoardContext.Provider
      value={{
        cards: state.cards,
        users: state.users,
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
