import { Card, User } from './card';

export type BoardState = {
  cards: Card[];
  users: User[];
};

export type ClientEvent =
  | { type: 'user:join'; payload: User }
  | { type: 'card:create'; payload: Card }
  | { type: 'card:update'; payload: Card }
  | { type: 'card:delete'; payload: { id: string } }

export type ServerEvent =
  | { type: 'init'; payload: BoardState }
  | { type: 'board:update'; payload: BoardState }
  | { type: 'presence:update'; payload: User[] };