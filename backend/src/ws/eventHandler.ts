import { boardState } from '../state/boardState.js';
import { ClientEvent, ServerEvent } from '../types/events.js';

type BroadcastFn = (data: ServerEvent) => void;

export const handleEvent = (event: ClientEvent, broadcast: BroadcastFn) => {
    switch (event.type) {
        case 'user:join': {
            const exists = boardState.users.some((user) => user.id === event.payload.id);

            if (!exists) boardState.users.push(event.payload);

            broadcast({
                type: 'presence:update',
                payload: boardState.users,
            });
            break;
        }

        case 'card:create': {
            boardState.cards.push(event.payload);
            broadcastBoard(broadcast);
            break;
        }

        case 'card:update': {
            boardState.cards = boardState.cards.map((c) => (c.id === event.payload.id ? event.payload : c));
            broadcastBoard(broadcast);
            break;
        }

        case 'card:delete': {
            boardState.cards = boardState.cards.filter((c) => c.id !== event.payload.id);
            broadcastBoard(broadcast);
            break;
        }
    }
};

const broadcastBoard = (broadcast: BroadcastFn) => {
    broadcast({
        type: 'board:update',
        payload: boardState,
    });
};
