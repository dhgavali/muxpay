'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { LiFiWidget } from '@/components/donation/LiFiWidget';
import { DepositFlow } from '@/components/donation/DepositFlow';
import { DonationSession } from '@/components/donation/DonationSession';
import { useCreator } from '@/hooks/useApi';
import { useVaultBalance } from '@/hooks/useVault';
import styles from './page.module.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Zap, CheckCircle } from 'lucide-react';

export default function CreatorProfile({ params }: { params: { handle: string } }) {
  const { isConnected } = useAccount();
  const { data: creator, isLoading: creatorLoading } = useCreator(params.handle);
  const { balance } = useVaultBalance();
  
  const [flow, setFlow] = useState<'none' | 'bridge' | 'deposit' | 'session'>('none');

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

      {/* Donation Flow */}
      {isConnected && (
        <div className={styles.flowContainer}>
          {/* Flow Progress Indicator */}
          <div className={styles.progressSteps}>
            <div className={`${styles.step} ${flow === 'bridge' ? styles.active : ''} ${balance > 0 ? styles.complete : ''}`}>
              <div className={styles.stepIcon}>
                {balance > 0 ? <CheckCircle size={20} /> : '1'}
              </div>
              <span>Bridge Funds</span>
            </div>
            <div className={styles.stepLine}></div>
            <div className={`${styles.step} ${flow === 'deposit' ? styles.active : ''} ${balance > 0 ? styles.complete : ''}`}>
              <div className={styles.stepIcon}>
                {balance > 0 ? <CheckCircle size={20} /> : '2'}
              </div>
              <span>Deposit</span>
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
                  {balance > 0 ? '✅ Ready to Tip!' : 'Choose Your Starting Point'}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                  {balance > 0 
                    ? `You have $${balance.toFixed(2)} in your vault. Start a tipping session!`
                    : 'Bridge funds from another chain or deposit USDC directly'
                  }
                </p>
                <div className={styles.flowButtons}>
                  {balance <= 0 && (
                    <>
                      <Button onClick={() => setFlow('bridge')} variant="secondary">
                        🌉 Bridge from Other Chains
                      </Button>
                      <Button onClick={() => setFlow('deposit')}>
                        💰 Deposit USDC (Arc Network)
                      </Button>
                    </>
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

          {flow === 'bridge' && (
            <div>
              <LiFiWidget
                userAddress={creator.address}
                onSuccess={() => {
                  setFlow('deposit');
                }}
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

          {flow === 'deposit' && (
            <div>
              <DepositFlow />
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
              <DonationSession 
                creatorHandle={creator.handle} 
                creatorAddress={creator.address}
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
