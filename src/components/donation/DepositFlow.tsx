'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useUSDCAddress } from '@/hooks/useVault';
import { useUSDCBalance, useUSDCAllowance, useApproveUSDC } from '@/hooks/useUSDC';
import { useVaultDeposit } from '@/hooks/useVault';
import styles from './DonationFlow.module.css';

interface DepositFlowProps {
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
  onComplete?: () => void; // Called when deposit is complete to advance to tip section
}

export function DepositFlow({ onError, onSuccess, onComplete }: DepositFlowProps = {}) {
  const { address } = useAccount();
  const { usdcAddress } = useUSDCAddress();
  const { balance: usdcBalance, refetch: refetchUSDCBalance } = useUSDCBalance(usdcAddress);
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance(usdcAddress);
  
  const { approve, isPending: isApproving, isConfirming: isApprovingConfirming, isSuccess: isApproved, error: approveError } = useApproveUSDC(usdcAddress);
  const { deposit, isPending: isDepositing, isConfirming: isDepositingConfirming, isSuccess: isDeposited, error: depositError } = useVaultDeposit();
  
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'approve' | 'deposit'>('approve');
  
  // Track if we've already handled success to prevent infinite callbacks
  const hasHandledApproval = useRef(false);
  const hasHandledDeposit = useRef(false);

  const amountNum = parseFloat(amount) || 0;
  const needsApproval = allowance < amountNum;

  // Handle approval errors
  useEffect(() => {
    if (approveError && onError) {
      onError('Approval failed: ' + ((approveError as any)?.shortMessage || approveError.message));
    }
  }, [approveError, onError]);

  // Handle deposit errors
  useEffect(() => {
    if (depositError && onError) {
      onError('Deposit failed: ' + ((depositError as any)?.shortMessage || depositError.message));
    }
  }, [depositError, onError]);

  // Handle successful approval - only once
  useEffect(() => {
    if (isApproved && step === 'approve' && !hasHandledApproval.current) {
      hasHandledApproval.current = true;
      setStep('deposit');
      refetchAllowance();
      onSuccess?.('USDC approved successfully!');
    }
  }, [isApproved, step, refetchAllowance, onSuccess]);

  // Handle successful deposit - only once
  useEffect(() => {
    if (isDeposited && !hasHandledDeposit.current) {
      hasHandledDeposit.current = true;
      onSuccess?.('Deposit successful!');
      
      // Refetch balances
      refetchUSDCBalance();
      refetchAllowance();
      
      // Reset form
      setAmount('');
      setStep('approve');
      
      // Auto-advance to tip section after a short delay
      setTimeout(() => {
        onComplete?.();
      }, 1500);
    }
  }, [isDeposited, refetchUSDCBalance, refetchAllowance, onSuccess, onComplete]);

  // Reset handled flags when user starts a new transaction
  const handleApprove = async () => {
    if (amountNum <= 0) return;
    hasHandledApproval.current = false;
    approve(amountNum);
  };

  const handleDeposit = async () => {
    if (amountNum <= 0) return;
    hasHandledDeposit.current = false;
    deposit(amountNum);
  };

  return (
    <GlassCard>
      <div className={styles.widgetContainer}>
        <h3>Deposit to Vault</h3>
        <p className={styles.description}>
          Deposit USDC into the Arc Vault Contract
        </p>

        <div className={styles.bridgeInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Your USDC Balance:</span>
            <span className={styles.value}>${usdcBalance.toFixed(2)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Current Allowance:</span>
            <span className={styles.value}>${allowance.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>
            Amount to Deposit
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={styles.customTipInput}
            style={{ marginBottom: '0.5rem' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[10, 50, 100].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: 'rgba(123, 63, 242, 0.2)',
                  border: '1px solid rgba(123, 63, 242, 0.4)',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        {needsApproval ? (
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Step 1/2: Approve USDC spending
            </p>
            <Button
              onClick={handleApprove}
              disabled={!amount || amountNum <= 0 || isApproving || isApprovingConfirming}
              className={styles.actionButton}
            >
              {isApproving || isApprovingConfirming ? 'Approving...' : `Approve $${amountNum.toFixed(2)} USDC`}
            </Button>
          </div>
        ) : (
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Step 2/2: Deposit to Vault
            </p>
            <Button
              onClick={handleDeposit}
              disabled={!amount || amountNum <= 0 || isDepositing || isDepositingConfirming}
              className={styles.actionButton}
            >
              {isDepositing || isDepositingConfirming 
                ? 'Depositing...' 
                : isDeposited 
                  ? '✅ Deposited!' 
                  : `Deposit $${amountNum.toFixed(2)} USDC`
              }
            </Button>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
