import { useCardStore } from "../stores/cardStore";
import { getStateMode, StateMode } from "../interfaces/stateMode";
import { useContextBoard } from "../state/context/useContextBoard";
import { useLocalBoard } from "../state/local/useLocalBoard";

export const useBoard = () => {
  const mode = getStateMode();

  const contextBoard = useContextBoard();
  const localBoard = useLocalBoard();
  const zustandBoard = {
    cards: useCardStore((s) => s.cards),
    users: useCardStore((s) => s.users),

    setCards: useCardStore((s) => s.setCards),
    setUsers: useCardStore((s) => s.setUsers),

    addCard: useCardStore((s) => s.addCard),
    updateCard: useCardStore((s) => s.updateCard),
    deleteCard: useCardStore((s) => s.deleteCard),
  };

  if (mode === StateMode.Context) {
    return {
      mode,
      ...contextBoard,
    };
  }

  if (mode === StateMode.Local) {
    return {
      mode,
      ...localBoard,
    };
  }

  return {
    mode,
    ...zustandBoard,
  };
};
