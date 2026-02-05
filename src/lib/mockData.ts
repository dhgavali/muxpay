export interface User {
    id: string;
    name: string;
    handle?: string; // for creators
    email: string;
    type: 'creator' | 'business' | 'individual';
    avatar?: string;
    balance: {
        eth: number;
        usdc: number;
        sol: number;
    };
}

export interface Transaction {
    id: string;
    amount: number;
    currency: 'USDC' | 'ETH' | 'SOL';
    status: 'completed' | 'pending' | 'failed';
    date: string;
    from: string;
    to: string; // user id
}

export const MOCK_USERS: User[] = [
    {
        id: 'creator_1',
        name: 'Alex Rivera',
        handle: 'alexart',
        email: 'alex@art.com',
        type: 'creator',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        balance: { eth: 1.2, usdc: 4500, sol: 15 },
    },
    {
        id: 'business_1',
        name: 'TechNova Inc.',
        email: 'billing@technova.com',
        type: 'business',
        avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechNova',
        balance: { eth: 5.5, usdc: 25000, sol: 120 },
    },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'tx_1',
        amount: 50,
        currency: 'USDC',
        status: 'completed',
        date: '2023-10-25T10:00:00Z',
        from: 'anonymous',
        to: 'creator_1',
    },
    {
        id: 'tx_2',
        amount: 0.05,
        currency: 'ETH',
        status: 'pending',
        date: '2023-10-26T14:30:00Z',
        from: '0x123...abc',
        to: 'business_1',
    },
    {
        id: 'tx_3',
        amount: 100,
        currency: 'USDC',
        status: 'completed',
        date: '2023-10-24T09:15:00Z',
        from: 'client_A',
        to: 'creator_1',
    },
];

export function getUser(userId: string): User | undefined {
    return MOCK_USERS.find((u) => u.id === userId || u.handle === userId);
}

export function getTransactions(userId: string): Transaction[] {
    return MOCK_TRANSACTIONS.filter((t) => t.to === userId);
}
