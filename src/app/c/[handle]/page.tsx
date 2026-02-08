'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { DepositFlow } from '@/components/donation/DepositFlow';
import { YellowDonationSession } from '@/components/donation/YellowDonationSession';
import { useCreator } from '@/hooks/useApi';
import { useVaultBalance } from '@/hooks/useVault';
import { useToast } from '@/components/ui/Toast';
import styles from './page.module.css';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Zap, CheckCircle, AlertCircle } from 'lucide-react';

export default function CreatorProfile({ params }: { params: { handle: string } }) {
  const { isConnected, address } = useAccount();
  const { data: creator, isLoading: creatorLoading } = useCreator(params.handle);
  const { balance } = useVaultBalance();
  const { showToast } = useToast();
  
  const [flow, setFlow] = useState<'none' | 'deposit' | 'session'>('none');

  // Check if user is viewing their own profile
  const isSelfTipping = useMemo(() => {
    if (!address || !creator?.address) return false;
    return address.toLowerCase() === creator.address.toLowerCase();
  }, [address, creator?.address]);

  // Loading state
  if (creatorLoading) {
    return (
      <div className={styles.main}>
        <GlassCard>
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading creator...</p>
        </GlassCard>
      </div>
    );
  }

  // Creator not found
  if (!creator) {
    return (
      <div className={styles.main}>
        <GlassCard>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Creator Not Found</h1>
          <p>The creator @{params.handle} could not be found.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      {/* Header with wallet connection */}
      <div className={styles.header}>
        <ConnectButton />
      </div>

      {/* Creator Profile Card */}
      <GlassCard className={styles.profileCard} hoverEffect={true}>
        <motion.div
          className={styles.avatarContainer}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.avatar}>
            {creator.handle.substring(0, 2).toUpperCase()}
          </div>
        </motion.div>

        <h1 className={styles.name}>@{creator.handle}</h1>
        <p className={styles.bio}>Support this creator with gas-free tips!</p>
        <p className={styles.address}>{creator.address.substring(0, 10)}...{creator.address.substring(creator.address.length - 8)}</p>

        {!isConnected && (
          <div className={styles.connectPrompt}>
            <Wallet size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Connect your wallet to start supporting this creator</p>
          </div>
        )}
      </GlassCard>

      {/* Self-tipping prevention message */}
      {isConnected && isSelfTipping && (
        <GlassCard>
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <AlertCircle size={48} style={{ color: '#f59e0b' }} />
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>This is Your Profile</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              You cannot tip yourself. Share your profile link with others to receive tips!
            </p>
            <Button 
              variant="secondary"
              onClick={() => {
                const link = `${window.location.origin}/c/${creator.handle}`;
                navigator.clipboard.writeText(link);
                showToast('Link copied to clipboard!', 'success');
              }}
            >
              📋 Copy Profile Link
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Donation Flow - Only show if NOT self-tipping */}
      {isConnected && !isSelfTipping && (
        <div className={styles.flowContainer}>
          {/* Flow Progress Indicator - Simplified to 2 steps */}
          <div className={styles.progressSteps}>
            <div className={`${styles.step} ${flow === 'deposit' ? styles.active : ''} ${balance > 0 ? styles.complete : ''}`}>
              <div className={styles.stepIcon}>
                {balance > 0 ? <CheckCircle size={20} /> : '1'}
              </div>
              <span>Deposit USDC</span>
            </div>
            <div className={styles.stepLine}></div>
            <div className={`${styles.step} ${flow === 'session' ? styles.active : ''}`}>
              <div className={styles.stepIcon}>
                <Zap size={20} />
              </div>
              <span>Tip</span>
            </div>
          </div>

          {/* Flow Selection or Active Flow */}
          {flow === 'none' && (
            <GlassCard>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                  {balance > 0 ? '✅ Ready to Tip!' : 'Deposit USDC to Start'}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                  {balance > 0 
                    ? `You have $${balance.toFixed(2)} in your vault. Start a tipping session!`
                    : 'Deposit USDC into your vault to send gas-free tips'
                  }
                </p>
                <div className={styles.flowButtons}>
                  {balance <= 0 && (
                    <Button onClick={() => setFlow('deposit')}>
                      💰 Deposit USDC
                    </Button>
                  )}
                  {balance > 0 && (
                    <Button onClick={() => setFlow('session')}>
                      ⚡ Start Tipping Session
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>
          )}

          {flow === 'deposit' && (
            <div>
              <DepositFlow 
                onError={(msg) => showToast(msg, 'error')} 
                onSuccess={(msg) => showToast(msg, 'success')}
                onComplete={() => setFlow('session')}
              />
              <Button 
                onClick={() => setFlow('none')} 
                variant="ghost" 
                style={{ marginTop: '1rem', width: '100%' }}
              >
                ← Back
              </Button>
            </div>
          )}

          {flow === 'session' && (
            <div>
              <YellowDonationSession 
                creatorHandle={creator.handle} 
                creatorAddress={creator.address}
                onError={(msg) => showToast(msg, 'error')}
                onSuccess={(msg) => showToast(msg, 'success')}
              />
              <Button 
                onClick={() => setFlow('none')} 
                variant="ghost" 
                style={{ marginTop: '1rem', width: '100%' }}
              >
                ← Back to Menu
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
