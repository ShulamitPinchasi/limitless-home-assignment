import { useEffect } from "react";
import { socketClient } from "../services/socketClient";
import { currentUser } from "../utils/currentUser";
import { useBoard } from "./useBoard";

export const useBoardSocket = () => {
  const { setCards, setUsers } = useBoard();

  useEffect(() => {
    socketClient.connect(
      (event) => {
        switch (event.type) {
          case "init":
            setCards(event.payload.cards);
            setUsers(event.payload.users);
            break;

          case "board:update":
            setCards(event.payload.cards);
            break;

          case "presence:update":
            setUsers(event.payload);
            break;
        }
      },
      () => {
        socketClient.send({
          type: "user:join",
          payload: currentUser,
        });
      },
    );
  }, [setCards, setUsers]);
};
