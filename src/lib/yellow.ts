'use client';

import { 
  createAppSessionMessage, 
  createCloseAppSessionMessage,
  parseAnyRPCResponse,
  type MessageSigner,
  type RPCProtocolVersion
} from '@erc7824/nitrolite';
import type { WalletClient, Hex } from 'viem';
import { toHex } from 'viem';

// Yellow Network configuration
const CLEARNODE_URL = 'wss://clearnet-sandbox.yellow.com/ws';

export interface YellowSession {
  ws: WebSocket;
  sessionId: string | null;
  userAddress: string;
  creatorAddress: string;
  balance: number;
}

// Create a MessageSigner from a viem WalletClient
// This signer works for ALL RPC methods (unlike createEIP712AuthMessageSigner which is auth-only)
export function createWalletMessageSigner(walletClient: WalletClient): MessageSigner {
  return async (payload: any): Promise<Hex> => {
    try {
      // Convert payload to hex-encoded JSON string (same as ECDSA signer)
      const message = toHex(JSON.stringify(payload, (_, v) => 
        typeof v === 'bigint' ? v.toString() : v
      ));
      
      // Sign using wallet client
      if (!walletClient.account) {
        throw new Error('Wallet account not available');
      }
      
      const signature = await walletClient.signMessage({
        account: walletClient.account,
        message: { raw: message }
      });
      
      return signature;
    } catch (error) {
      console.error('Wallet signing failed:', error);
      throw error;
    }
  };
}

// Connect to Yellow Network's ClearNode
export function connectToClearNode(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(CLEARNODE_URL);
    
    ws.onopen = () => {
      console.log('🟢 Connected to Yellow Network ClearNode!');
      resolve(ws);
    };
    
    ws.onerror = (error) => {
      console.error('❌ Yellow Network connection error:', error);
      reject(error);
    };
  });
}

// Create a tipping session between user and creator
export async function createTippingSession(
  ws: WebSocket,
  signer: MessageSigner,
  userAddress: string,
  creatorAddress: string,
  initialBalance: number // in USDC
): Promise<void> {
  // Convert USDC to 6 decimals
  const balanceInUnits = Math.floor(initialBalance * 1_000_000).toString();

  const sessionParams = [{
    definition: {
      protocol: 'NitroRPC/0.2' as RPCProtocolVersion,
      participants: [userAddress as Hex, creatorAddress as Hex],
      weights: [100, 0],
      quorum: 100,
      challenge: 0,
      nonce: Date.now(),
      application: 'muxpay-tipping'
    },
    allocations: [
      { participant: userAddress as Hex, asset: 'usdc', amount: balanceInUnits },
      { participant: creatorAddress as Hex, asset: 'usdc', amount: '0' }
    ]
  }];

  try {
    const sessionMessage = await createAppSessionMessage(signer, sessionParams as any);
    ws.send(sessionMessage);
    console.log('✅ Yellow tipping session created!');
  } catch (error) {
    console.error('Failed to create Yellow session:', error);
    throw error;
  }
}

// Send an instant tip (off-chain via Yellow) - simple message format
export async function sendInstantTip(
  ws: WebSocket,
  userAddress: string,
  creatorAddress: string,
  amount: number // in USDC
): Promise<void> {
  const amountInUnits = Math.floor(amount * 1_000_000).toString();
  
  // Send as application message
  const tipMessage = {
    jsonrpc: '2.0',
    method: 'transfer',
    params: [{
      from: userAddress,
      to: creatorAddress,
      asset: 'usdc',
      amount: amountInUnits
    }],
    id: Date.now()
  };

  ws.send(JSON.stringify(tipMessage));
  console.log(`💸 Yellow: Instant tip of $${amount} sent!`);
}

// Parse incoming messages from ClearNode
export function handleClearNodeMessage(
  data: string,
  onSessionCreated?: (sessionId: string) => void,
  onPaymentReceived?: (amount: string, sender: string) => void,
  onError?: (error: string) => void
) {
  try {
    const message = parseAnyRPCResponse(data);
    
    if (message && typeof message === 'object') {
      const msg = message as any;
      
      // Check for successful response
      if (msg.result) {
        if (msg.result.appSessionId) {
          console.log('✅ Yellow session confirmed:', msg.result.appSessionId);
          onSessionCreated?.(msg.result.appSessionId);
        }
        return;
      }
      
      // Check for error
      if (msg.error) {
        console.error('❌ Yellow error:', msg.error);
        onError?.(msg.error.message || 'Unknown error');
        return;
      }
      
      console.log('📨 Yellow message:', message);
    }
  } catch (error) {
    console.error('Failed to parse Yellow message:', error);
  }
}

// Close session and trigger on-chain settlement
export async function closeSession(
  ws: WebSocket, 
  signer: MessageSigner,
  sessionId: string
): Promise<void> {
  try {
    const closeMessage = await createCloseAppSessionMessage(signer, {
      app_session_id: sessionId as Hex,
      allocations: []
    });
    ws.send(closeMessage);
    console.log('🔒 Yellow session closed, settlement initiated');
  } catch (error) {
    console.error('Failed to close Yellow session:', error);
    throw error;
  }
}
