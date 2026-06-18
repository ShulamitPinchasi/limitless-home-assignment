/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { handleEvent } from './eventHandler.js';
import { boardState } from '../state/boardState.js';
import { ServerEvent } from '../types/events.js';
import { isClientEvent } from '../types/typeGuards.js';

export const initWs = (server: Server) => {
    const wss = new WebSocketServer({ server });

    const broadcast = (data: ServerEvent) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    };

    wss.on('connection', (ws) => {
        console.log('client connected');

        let currentUserId: string | null = null;

        ws.send(
            JSON.stringify({
                type: 'init',
                payload: boardState,
            } satisfies ServerEvent),
        );

        ws.on('message', (message) => {
            try {
                const parsed = JSON.parse(message.toString());

                if (!isClientEvent(parsed)) throw new Error('Invalid client event');

                const event = parsed;

                if (event.type === 'user:join') currentUserId = event.payload.id;

                handleEvent(event, broadcast);
            } catch (err) {
                console.error('Invalid message', err);
            }
        });

        ws.on('close', () => {
            if (!currentUserId) return;

            boardState.users = boardState.users.filter((user) => user.id !== currentUserId);

            broadcast({
                type: 'presence:update',
                payload: boardState.users,
            });
        });
    });

    return wss;
};
