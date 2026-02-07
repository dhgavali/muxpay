'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useVaultBalance, useUserNonce } from '@/hooks/useVault';
import { useSendTip, useSettleSession } from '@/hooks/useApi';
import { EIP712_DOMAIN, EIP712_TYPES, formatTipMessage } from '@/lib/eip712';
import styles from './DonationFlow.module.css';

interface DonationSessionProps {
  creatorHandle: string;
  creatorAddress: string;
}

export function DonationSession({ creatorHandle, creatorAddress }: DonationSessionProps) {
  const { address } = useAccount();
  const { balance, refetch: refetchBalance } = useVaultBalance();
  const { nonce, refetch: refetchNonce } = useUserNonce();
  const { signTypedDataAsync } = useSignTypedData();
  
  const [totalTipped, setTotalTipped] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const sendTipMutation = useSendTip();
  const settleMutation = useSettleSession();

  const quickAmounts = [1, 5, 10];

  const handleTip = async (amount: number) => {
    if (!address) {
      setStatus({ type: 'error', message: 'Please connect your wallet' });
      return;
    }

    if (amount <= 0) {
      setStatus({ type: 'error', message: 'Invalid amount' });
      return;
    }

    const newTotal = totalTipped + amount;
    
    if (newTotal > balance) {
      setStatus({ type: 'error', message: 'Insufficient balance in vault' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Please sign the message...' });

      // Format the message for signing
      const message = formatTipMessage(address, creatorAddress, newTotal, nonce);

      // Sign the typed data (EIP-712)
      const signature = await signTypedDataAsync({
        domain: EIP712_DOMAIN,
        types: EIP712_TYPES,
        primaryType: 'TipSession',
        message,
      });

      // Send to backend (Yellow logic - off-chain)
      await sendTipMutation.mutateAsync({
        userAddress: address,
        creatorHandle,
        amount: newTotal,
        signature,
        nonce,
      });

      setTotalTipped(newTotal);
      setStatus({ type: 'success', message: `$${amount} tip signed! (Off-chain)` });
      setCustomAmount('');
      
    } catch (error: any) {
      console.error('Tip error:', error);
      setStatus({ type: 'error', message: error.message || 'Failed to send tip' });
    }
  };

  const handleSettle = async () => {
    if (!address) return;
    
    if (totalTipped <= 0) {
      setStatus({ type: 'error', message: 'No tips to settle' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Settling on Arc Network...' });

      const result = await settleMutation.mutateAsync({
        userAddress: address,
        creatorHandle,
      });

      setStatus({ 
        type: 'success', 
        message: `✅ Settled! Tx: ${result.txHash.substring(0, 10)}...` 
      });
      
      setTotalTipped(0);
      
      // Refresh balances
      setTimeout(() => {
        refetchBalance();
        refetchNonce();
      }, 2000);
      
    } catch (error: any) {
      console.error('Settle error:', error);
      setStatus({ type: 'error', message: error.message || 'Settlement failed' });
    }
  };

  return (
    <GlassCard>
      <div className={styles.sessionContainer}>
        <h3>Yellow Session (Gas-Free Tips)</h3>
        <p className={styles.description}>
          Sign tips off-chain, settle on Arc when done
        </p>

        {/* Balance Display */}
        <div className={styles.balanceDisplay}>
          <div className={styles.balanceLabel}>Your Vault Balance</div>
          <div className={styles.balanceAmount}>
            ${balance.toFixed(2)}
            <span className={styles.balanceCurrency}>USDC</span>
          </div>
        </div>

        {/* Status Messages */}
        {status && (
          <div className={`${styles.statusMessage} ${styles[status.type]}`}>
            {status.message}
          </div>
        )}

        {/* Quick Tip Buttons */}
        <div className={styles.tippingSection}>
          <h4>Quick Tip</h4>
          <div className={styles.tipButtons}>
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                className={styles.tipButton}
                onClick={() => handleTip(amount)}
                disabled={sendTipMutation.isPending}
              >
                ${amount}
              </button>
            ))}
          </div>
          
          {/* Custom Amount */}
          <input
            type="number"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className={styles.customTipInput}
          />
          {customAmount && (
            <Button
              onClick={() => handleTip(parseFloat(customAmount))}
              disabled={sendTipMutation.isPending}
              style={{ marginTop: '0.75rem', width: '100%' }}
            >
              Tip ${customAmount}
            </Button>
          )}
        </div>

        {/* Session Info */}
        <div className={styles.sessionInfo}>
          <div className={styles.sessionInfoItem}>
            <span className={styles.label}>Total Tipped (Off-chain):</span>
            <span className={styles.value}>${totalTipped.toFixed(2)}</span>
          </div>
          <div className={styles.sessionInfoItem}>
            <span className={styles.label}>Remaining Balance:</span>
            <span className={styles.value}>${(balance - totalTipped).toFixed(2)}</span>
          </div>
        </div>

        {/* Settle Button */}
        <Button
          onClick={handleSettle}
          disabled={totalTipped <= 0 || settleMutation.isPending}
          className={styles.settleButton}
        >
          {settleMutation.isPending ? 'Settling...' : `Settle & Disconnect ($${totalTipped.toFixed(2)})`}
        </Button>
      </div>
    </GlassCard>
  );
}
