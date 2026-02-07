'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ERC20_ABI } from '@/config/contracts';
import { useAccount } from 'wagmi';
import { VAULT_ADDRESS } from '@/config/contracts';

// Hook to approve USDC spending
export function useApproveUSDC(usdcAddress: `0x${string}` | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = (amount: number) => {
    if (!usdcAddress) return;
    
    const amountInWei = BigInt(Math.floor(amount * 1_000_000)); // Convert to 6 decimals
    
    writeContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [VAULT_ADDRESS, amountInWei],
    });
  };

  return {
    approve,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook to check USDC balance
export function useUSDCBalance(usdcAddress: `0x${string}` | undefined) {
  const { address } = useAccount();
  
  const { data, isLoading, refetch } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!usdcAddress,
    },
  });

  return {
    balance: data ? Number(data) / 1_000_000 : 0, // Convert from 6 decimals to USDC
    isLoading,
    refetch,
  };
}

// Hook to check USDC allowance
export function useUSDCAllowance(usdcAddress: `0x${string}` | undefined) {
  const { address } = useAccount();
  
  const { data, isLoading, refetch } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, VAULT_ADDRESS] : undefined,
    query: {
      enabled: !!address && !!usdcAddress,
    },
  });

  return {
    allowance: data ? Number(data) / 1_000_000 : 0, // Convert from 6 decimals to USDC
    isLoading,
    refetch,
  };
}
