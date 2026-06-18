import { Card } from '../models/card.js';
import { User } from '../models/user.js';

export interface BoardState {
    cards: Card[];
    users: User[];
}
