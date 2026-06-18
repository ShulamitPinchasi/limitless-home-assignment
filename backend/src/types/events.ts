import { Card } from '../models/card.js';
import { BoardState } from './boardState.js';

export type ClientEvent =
    | { type: 'card:create'; payload: Card }
    | { type: 'card:update'; payload: Card }
    | { type: 'card:delete'; payload: { id: string } }
    | { type: 'user:join'; payload: { id: string; name: string } };

export type ServerEvent =
    | { type: 'init'; payload: BoardState }
    | { type: 'presence:update'; payload: BoardState['users'] }
    | { type: 'board:update'; payload: BoardState };
