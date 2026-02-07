import { VAULT_ADDRESS } from '@/config/contracts';

export const EIP712_DOMAIN = {
  name: 'CoffeeStream',
  version: '1',
  chainId: 5042002, // Arc Testnet
  verifyingContract: VAULT_ADDRESS,
};

export const EIP712_TYPES = {
  TipSession: [
    { name: 'user', type: 'address' },
    { name: 'creator', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
  ],
};

export interface TipSessionMessage {
  user: string;
  creator: string;
  amount: bigint;
  nonce: bigint;
}

export function formatTipMessage(
  userAddress: string,
  creatorAddress: string,
  amountInUSDC: number,
  nonce: number
): TipSessionMessage {
  // Convert USDC amount to 6 decimals (BigInt)
  const amountInWei = BigInt(Math.floor(amountInUSDC * 1_000_000));
  
  return {
    user: userAddress,
    creator: creatorAddress,
    amount: amountInWei,
    nonce: BigInt(nonce),
  };
}
