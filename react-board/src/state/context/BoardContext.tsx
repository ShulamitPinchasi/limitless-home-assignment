import { createContext } from "react";
import { BoardContextValue } from "../../interfaces/board";

export const BoardContext = createContext<BoardContextValue | null>(null);