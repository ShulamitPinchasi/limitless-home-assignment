import { ClientEvent } from './events.js';

export const isClientEvent = (data: unknown): data is ClientEvent => {
    if (!data || typeof data !== 'object') return false;

    const event = data as { type?: unknown };

    if (typeof event.type !== 'string') return false;

    return ['user:join', 'card:create', 'card:update', 'card:delete'].includes(event.type);
};
