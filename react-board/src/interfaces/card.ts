export const COLUMN_ORDER = ['todo', 'in-progress', 'done'] as const;
export type CardStatus = (typeof COLUMN_ORDER)[number];

export interface User {
    id: string;
    name: string;
}

export interface Card {
    id: string;
    title: string;
    description: string;
    status: CardStatus;
    assignee: User;
    createdAt: Date;
    updatedAt: Date;
}

export const COLUMN_LABELS: Record<CardStatus, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

export const ASSIGNEE_OPTIONS: User[] = [
  { id: 'user-1', name: 'Shulamit Yosef' },
  { id: 'user-2', name: 'Demo User' },
];