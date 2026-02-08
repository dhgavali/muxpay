'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useVaultBalance, useUserNonce } from '@/hooks/useVault';
import { useYellow } from '@/hooks/useYellow';
import { useSendTip, useSettleSession } from '@/hooks/useApi';
import { EIP712_DOMAIN, EIP712_TYPES, formatTipMessage, TipSessionMessage } from '@/lib/eip712';
import styles from './DonationFlow.module.css';

interface YellowDonationSessionProps {
  creatorHandle: string;
  creatorAddress: string;
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

export function YellowDonationSession({
  creatorHandle,
  creatorAddress,
  onError,
  onSuccess
}: YellowDonationSessionProps) {
  const { address } = useAccount();
  const { balance, refetch: refetchBalance } = useVaultBalance();
  const { nonce: userNonce } = useUserNonce();
  const { signTypedDataAsync } = useSignTypedData();

  // Yellow hook for off-chain UX
  const {
    isConnected: isYellowConnected,
    isConnecting,
    error: yellowError,
    connect,
    startSession: startYellowSession,
    sendTip: sendYellowTip,
    endSession: endYellowSession
  } = useYellow();

  // Backend hooks for actual settlement
  const sendTipMutation = useSendTip();
  const settleSessionMutation = useSettleSession();

  const [customAmount, setCustomAmount] = useState('');
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [totalTipped, setTotalTipped] = useState(0);
  const [currentNonce, setCurrentNonce] = useState(0);

  const quickAmounts = [1, 5, 10];

  // Initialize nonce
  useEffect(() => {
    if (userNonce !== undefined) {
      setCurrentNonce(userNonce);
    }
  }, [userNonce]);

  // Handle Yellow errors
  useEffect(() => {
    if (yellowError) {
      console.warn('Yellow warning:', yellowError);
      // Don't show error to user - Yellow is just for UX enhancement
    }
  }, [yellowError]);

  // Connect to Yellow and start session
  const handleStartSession = async () => {
    if (!address) {
      onError?.('Please connect your wallet');
      return;
    }

    setIsStartingSession(true);
    try {
      // Try to connect to Yellow for enhanced UX (optional)
      try {
        await connect();
        await startYellowSession(address, creatorAddress, balance);
        console.log('🟢 Yellow session started for enhanced UX');
      } catch (yellowErr) {
        console.warn('Yellow connection failed, continuing with backend-only mode:', yellowErr);
      }

      setIsSessionActive(true);
      onSuccess?.('🟢 Session started! Send instant tips.');
    } catch (err: any) {
      onError?.(err.message || 'Failed to start session');
    } finally {
      setIsStartingSession(false);
    }
  };

  // Send tip - hybrid: Yellow for UX + Backend for actual buffering
  const handleTip = async (amount: number) => {
    if (!address) {
      onError?.('Please connect your wallet');
      return;
    }

    if (amount <= 0) {
      onError?.('Invalid amount');
      return;
    }

    if (totalTipped + amount > balance) {
      onError?.('Insufficient balance in vault');
      return;
    }

    setIsSending(true);
    try {
      const newTotal = totalTipped + amount;
      const nonce = currentNonce;

      // 1. Create EIP-712 message for backend
      const message = formatTipMessage(
        address,
        creatorAddress,
        newTotal,
        nonce
      );

      // 2. Sign the message
      const signature = await signTypedDataAsync({
        domain: EIP712_DOMAIN,
        types: EIP712_TYPES,
        primaryType: 'TipSession',
        message: message as any,
      });

      // 3. Send to backend (actual tip buffering)
      await sendTipMutation.mutateAsync({
        userAddress: address,
        creatorHandle,
        amount: newTotal,
        signature,
        nonce
      });

      // 4. Also send via Yellow for UX (optional, don't fail if Yellow fails)
      try {
        await sendYellowTip(address, creatorAddress, amount);
        console.log('💛 Yellow: Tip mirrored to Yellow Network');
      } catch (yellowErr) {
        console.warn('Yellow tip failed, backend tip succeeded:', yellowErr);
      }

      setTotalTipped(newTotal);
      onSuccess?.(`⚡ $${amount} tip sent! (Total: $${newTotal.toFixed(2)})`);
      setCustomAmount('');
    } catch (err: any) {
      onError?.(err.message || 'Failed to send tip');
    } finally {
      setIsSending(false);
    }
  };

  // End session and settle on-chain via backend
  const handleEndSession = async () => {
    if (!address || totalTipped <= 0) {
      setIsSessionActive(false);
      endYellowSession();
      return;
    }

    setIsSettling(true);
    try {
      // 1. Close Yellow session (for UX)
      try {
        endYellowSession();
        console.log('💛 Yellow session closed');
      } catch (yellowErr) {
        console.warn('Yellow close failed:', yellowErr);
      }

      // 2. Settle via backend (actual on-chain settlement)
      const result = await settleSessionMutation.mutateAsync({
        userAddress: address,
        creatorHandle
      });

      setIsSessionActive(false);
      setTotalTipped(0);
      setCurrentNonce(prev => prev + 1);
      refetchBalance();

      onSuccess?.(`✅ Settled $${totalTipped.toFixed(2)} on-chain! Tx: ${result.txHash?.slice(0, 10)}...`);
    } catch (err: any) {
      onError?.(err.message || 'Settlement failed');
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <GlassCard>
      <div className={styles.widgetContainer}>
        <h3>⚡ Instant Tips</h3>
        <p className={styles.description}>
          Gas-free tips with on-chain settlement
        </p>

        {/* Status */}
        <div className={styles.bridgeInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Status:</span>
            <span className={styles.value}>
              {isSessionActive ? '🟢 Session Active' : '⚪ Ready'}
              {isYellowConnected && ' • Yellow'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Vault Balance:</span>
            <span className={styles.value}>${balance.toFixed(2)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Session Total:</span>
            <span className={styles.value} style={{ color: '#22c55e' }}>
              ${totalTipped.toFixed(2)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Available:</span>
            <span className={styles.value}>
              ${(balance - totalTipped).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Session not started */}
        {!isSessionActive && (
          <Button
            onClick={handleStartSession}
            disabled={isStartingSession || isConnecting || balance <= 0}
            className={styles.actionButton}
            style={{ marginTop: '1rem' }}
          >
            {isStartingSession || isConnecting
              ? '🔄 Starting Session...'
              : '⚡ Start Tipping Session'}
          </Button>
        )}

        {/* Session active - show tip options */}
        {isSessionActive && (
          <>
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                Quick Tip to @{creatorHandle}:
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => handleTip(amount)}
                    disabled={isSending || totalTipped + amount > balance}
                    variant="secondary"
                    style={{ flex: 1 }}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* End session & settle */}
            <Button
              onClick={handleEndSession}
              disabled={isSettling}
              variant={totalTipped > 0 ? 'primary' : 'ghost'}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isSettling
                ? '⏳ Settling on-chain...'
                : totalTipped > 0
                  ? `🔒 Settle $${totalTipped.toFixed(2)} On-Chain`
                  : 'End Session'}
            </Button>
          </>
        )}

        {/* Branding */}
        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: 'hsl(var(--muted-foreground))',
          textAlign: 'center'
        }}>
          Powered by Yellow Network • Nitrolite Protocol
        </p>
      </div>
    </GlassCard>
  );
}
