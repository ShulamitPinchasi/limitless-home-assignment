import { useContext } from "react";
import { BoardContext } from "./BoardContext";

export const useContextBoard = () => {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error("useContextBoard must be used inside BoardContextProvider");
  }

  return context;
};
