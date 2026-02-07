const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export interface Creator {
  id: string;
  handle: string;
  address: string;
  createdAt: string;
}

export interface Session {
  id: string;
  userAddress: string;
  creatorId: string;
  totalAmount: number;
  status: 'OPEN' | 'SETTLED';
  txHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorWithSessions extends Creator {
  sessions: Session[];
}

export interface TipRequest {
  userAddress: string;
  creatorHandle: string;
  amount: number;
  signature: string;
  nonce: number;
}

export interface TipResponse {
  success: boolean;
  currentTotal: number;
}

export interface SettleRequest {
  userAddress: string;
  creatorHandle: string;
}

export interface SettleResponse {
  success: boolean;
  txHash: string;
}

export interface CreateCreatorRequest {
  handle: string;
  address: string;
}

// API Client
export const api = {
  // Get creator by handle
  getCreator: async (handle: string): Promise<Creator> => {
    const response = await fetch(`${API_BASE_URL}/api/creators/${handle}`);
    if (!response.ok) {
      throw new Error('Creator not found');
    }
    return response.json();
  },

  // Get creator by address
  getCreatorByAddress: async (address: string): Promise<Creator> => {
    const response = await fetch(`${API_BASE_URL}/api/creators/address/${address}`);
    if (!response.ok) {
      throw new Error('Creator not found');
    }
    return response.json();
  },

  // Create a new creator
  createCreator: async (data: CreateCreatorRequest): Promise<Creator> => {
    const response = await fetch(`${API_BASE_URL}/api/creators`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create creator');
    }
    
    return response.json();
  },

  // Get creator with sessions (for dashboard)
  getCreatorWithSessions: async (address: string): Promise<CreatorWithSessions> => {
    const response = await fetch(`${API_BASE_URL}/api/creators/address/${address}/sessions`);
    if (!response.ok) {
      throw new Error('Failed to fetch creator data');
    }
    return response.json();
  },

  // Send tip (off-chain)
  sendTip: async (tipData: TipRequest): Promise<TipResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/sessions/tip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tipData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send tip');
    }
    
    return response.json();
  },

  // Settle session (on-chain)
  settleSession: async (settleData: SettleRequest): Promise<SettleResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/sessions/settle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settleData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to settle session');
    }
    
    return response.json();
  },
};
