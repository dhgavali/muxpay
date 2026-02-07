'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { VAULT_ADDRESS, VAULT_ABI } from '@/config/contracts';
import { useAccount } from 'wagmi';

// Hook to read user's vault balance
export function useVaultBalance() {
  const { address } = useAccount();
  
  const { data, isLoading, refetch } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: data ? Number(data) / 1_000_000 : 0, // Convert from 6 decimals to USDC
    isLoading,
    refetch,
  };
}

// Hook to read user's nonce
export function useUserNonce() {
  const { address } = useAccount();
  
  const { data, isLoading, refetch } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'userNonces',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    nonce: data ? Number(data) : 0,
    isLoading,
    refetch,
  };
}

// Hook to deposit USDC into vault
export function useVaultDeposit() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const deposit = (amount: number) => {
    const amountInWei = BigInt(Math.floor(amount * 1_000_000)); // Convert to 6 decimals
    
    writeContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'deposit',
      args: [amountInWei],
    });
  };

  return {
    deposit,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook to withdraw USDC from vault
export function useVaultWithdraw() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const withdraw = (amount: number) => {
    const amountInWei = BigInt(Math.floor(amount * 1_000_000)); // Convert to 6 decimals
    
    writeContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'withdraw',
      args: [amountInWei],
    });
  };

  return {
    withdraw,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook to read USDC token address
export function useUSDCAddress() {
  const { data, isLoading } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'usdcToken',
  });

  return {
    usdcAddress: data as `0x${string}` | undefined,
    isLoading,
  };
}
