import { Order, OrderCustomer, OrderLine, OrderTotals } from './types';

const NETWORK_DELAY_MS = { min: 700, max: 1400 } as const;
const FAILURE_RATE = 0.18;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomDelay = () =>
    NETWORK_DELAY_MS.min + Math.floor(Math.random() * (NETWORK_DELAY_MS.max - NETWORK_DELAY_MS.min));

const createOrderId = () => `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export async function submitOrder(payload: {
    customer: OrderCustomer;
    items: OrderLine[];
    totals: OrderTotals;
}): Promise<Order> {
    await delay(randomDelay());

    if (Math.random() < FAILURE_RATE) {
        throw new Error('Network error while processing payment. Please try again.');
    }

    return {
        id: createOrderId(),
        customer: payload.customer,
        items: payload.items,
        totals: payload.totals,
        createdAt: Date.now(),
    };
}
