'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useWalletClient } from 'wagmi';
import type { MessageSigner } from '@erc7824/nitrolite';
import { 
  connectToClearNode, 
  createTippingSession, 
  sendInstantTip, 
  handleClearNodeMessage,
  closeSession,
  createWalletMessageSigner
} from '@/lib/yellow';

export interface UseYellowReturn {
  isConnected: boolean;
  isConnecting: boolean;
  sessionId: string | null;
  error: string | null;
  totalTipped: number;
  connect: () => Promise<void>;
  startSession: (userAddress: string, creatorAddress: string, balance: number) => Promise<void>;
  sendTip: (userAddress: string, creatorAddress: string, amount: number) => Promise<void>;
  endSession: () => void;
}

export function useYellow(): UseYellowReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalTipped, setTotalTipped] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const signerRef = useRef<MessageSigner | null>(null);
  const { data: walletClient } = useWalletClient();

  // Connect to Yellow Network ClearNode
  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ws = await connectToClearNode();
      wsRef.current = ws;
      
      // Create signer from wallet client
      signerRef.current = createWalletMessageSigner(walletClient);

      // Set up message handler
      ws.onmessage = (event) => {
        handleClearNodeMessage(
          event.data,
          (id) => setSessionId(id),
          (amount, sender) => {
            console.log(`Received ${amount} from ${sender}`);
          },
          (err) => setError(err)
        );
      };

      ws.onclose = () => {
        setIsConnected(false);
        setSessionId(null);
        console.log('🔴 Disconnected from Yellow Network');
      };

      setIsConnected(true);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Yellow Network');
    } finally {
      setIsConnecting(false);
    }
  }, [walletClient]);

  // Start a tipping session
  const startSession = useCallback(async (
    userAddress: string,
    creatorAddress: string,
    balance: number
  ) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      await connect();
    }

    if (!wsRef.current || !signerRef.current) {
      throw new Error('Not connected to Yellow Network');
    }

    setError(null);
    await createTippingSession(
      wsRef.current,
      signerRef.current,
      userAddress,
      creatorAddress,
      balance
    );
  }, [connect]);

  // Send an instant tip
  const sendTip = useCallback(async (
    userAddress: string,
    creatorAddress: string,
    amount: number
  ) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to Yellow Network');
    }

    setError(null);
    await sendInstantTip(
      wsRef.current,
      userAddress,
      creatorAddress,
      amount
    );
    
    setTotalTipped((prev) => prev + amount);
  }, []);

  // End session and trigger settlement
  const endSession = useCallback(async () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && signerRef.current && sessionId) {
      try {
        await closeSession(wsRef.current, signerRef.current, sessionId);
        setSessionId(null);
        setTotalTipped(0);
      } catch (err: any) {
        setError(err.message || 'Failed to close session');
      }
    }
  }, [sessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    sessionId,
    error,
    totalTipped,
    connect,
    startSession,
    sendTip,
    endSession
  };
}
