import { User } from './user.js';

export type CardStatus = 'todo' | 'in-progress' | 'done';

export interface Card {
    id: string;
    title: string;
    description: string;
    status: CardStatus;
    assignee: User;
    createdAt: Date;
    updatedAt: Date;
}
