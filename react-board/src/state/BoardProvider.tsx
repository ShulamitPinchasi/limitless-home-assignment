import { ReactNode } from "react";
import { StateMode, getStateMode } from "../interfaces/stateMode";
import { BoardContextProvider } from "./context/ContextBoardProvider";
import { LocalBoardProvider } from "./local/LocalBoardProvider";

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const mode = getStateMode();

  switch (mode) {
    case StateMode.Context:
      return <BoardContextProvider>{children}</BoardContextProvider>;

    case StateMode.Local:
      return <LocalBoardProvider>{children}</LocalBoardProvider>;

    default:
      return <BoardContextProvider>{children}</BoardContextProvider>;
  }
};
