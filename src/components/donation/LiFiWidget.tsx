'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import styles from './DonationFlow.module.css';

interface LiFiWidgetProps {
  userAddress: string;
  onSuccess: () => void;
}

export function LiFiWidget({ userAddress, onSuccess }: LiFiWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Note: In production, you would integrate the actual LI.FI widget
  // This is a placeholder UI showing the concept
  const handleBridge = () => {
    setIsLoading(true);
    // Simulate bridging - in real implementation, this would open LI.FI widget
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <GlassCard>
      <div className={styles.widgetContainer}>
        <h3>Step 1: Top Up via LI.FI</h3>
        <p className={styles.description}>
          Bridge funds from any chain to Arc Network using LI.FI
        </p>
        
        <div className={styles.bridgeInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>From:</span>
            <span className={styles.value}>Base / Any Chain</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>To:</span>
            <span className={styles.value}>Arc Network</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Destination:</span>
            <span className={styles.value}>Vault Contract</span>
          </div>
        </div>

        {/* In production, LI.FI widget would be embedded here */}
        <div className={styles.widgetPlaceholder}>
          <p>🌉 LI.FI Bridge Widget</p>
          <p className={styles.small}>Bridge USDC to Arc Network</p>
        </div>

        <Button 
          onClick={handleBridge}
          disabled={isLoading}
          className={styles.actionButton}
        >
          {isLoading ? 'Bridging...' : 'Open Bridge Widget'}
        </Button>
      </div>
    </GlassCard>
  );
}
