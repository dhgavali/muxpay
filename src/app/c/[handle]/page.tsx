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
import { Wallet, Zap, CheckCircle, AlertCircle, Globe, Twitter, Github, User, QrCode } from 'lucide-react';

export default function CreatorProfile({ params }: { params: { handle: string } }) {
  const { isConnected, address } = useAccount();
  const { data: creator, isLoading: creatorLoading } = useCreator(params.handle);
  const { balance } = useVaultBalance();
  const { showToast } = useToast();

  const [flow, setFlow] = useState<'none' | 'deposit' | 'session'>('none');
  const [showQr, setShowQr] = useState(false);

  // Check if user is viewing their own profile
  const isSelfTipping = useMemo(() => {
    if (!address || !creator?.address) return false;
    return address.toLowerCase() === creator.address.toLowerCase();
  }, [address, creator?.address]);

  // Loading state
  if (creatorLoading) {
    return (
      <div className={styles.main}>
        <div className={styles.banner} />
        <div className={styles.container}>
          <GlassCard>
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading creator...</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Creator not found
  if (!creator) {
    return (
      <div className={styles.main}>
        <div className={styles.banner} />
        <div className={styles.container}>
          <GlassCard>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Creator Not Found</h1>
            <p>The creator @{params.handle} could not be found.</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  const badges = ["🚀 Growing", "💻 Tech", "🔥 Early User"];
  const supporters = 1342;
  const recentActivity = [
    { name: "0x7a...4e2", amount: 5, msg: "Great work! ☕️", time: "2h ago" },
    { name: "Anonymous", amount: 15, msg: "Keep building!", time: "5h ago" },
    { name: "0x91...b2a", amount: 2, msg: "", time: "1d ago" },
  ];

  return (
    <div className={styles.main}>
      {/* Brand Header */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.brand}>
            <div className={styles.logo}>M</div>
            <span className={styles.brandName}>MuxPay</span>
          </div>
          <span className={styles.motto}>Payments made seamless</span>
        </div>
      </nav>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Profile Info & About */}
          <div className={styles.leftColumn}>
            {/* Profile Card */}
            <div className={styles.profileCard}>
              <div className={styles.avatar}>
                {creator.handle.substring(0, 2).toUpperCase()}
              </div>
              <h1 className={styles.name}>{creator.handle}</h1>
              <p className={styles.address}>{creator.address.slice(0, 6)}...{creator.address.slice(-4)}</p>

              <div className={styles.badges}>
                {badges.map(b => (
                  <span key={b} className={styles.badge}>{b}</span>
                ))}
              </div>

              <div className={styles.socials}>
                <a href="#" className={styles.socialLink}><Globe size={18} /></a>
                <a href="#" className={styles.socialLink}><Twitter size={18} /></a>
                <a href="#" className={styles.socialLink}><Github size={18} /></a>
              </div>
            </div>

            {/* About Card */}
            <div className={styles.card}>
              <h3 className={styles.sectionTitle}>About</h3>
              <p className={styles.aboutText}>
                Hey there! I'm using MuxPay to accept crypto payments and tips.
                If you like my work, consider supporting me.
                Every tip helps me create more content!
              </p>
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{supporters.toLocaleString()}</span>
                  <span className={styles.statLabel}>Supporters</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>Verified</span>
                  <span className={styles.statLabel}>Status</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Donation & Activity */}
          <div className={styles.rightColumn}>
            {/* Donation Card */}
            <div className={styles.donationCard}>
              <h3 className={styles.donationHeader}>Buy <span style={{ color: 'hsl(var(--primary))' }}>{creator.handle}</span> a coffee</h3>

              {/* Connect Wallet First */}
              {!isConnected && (
                <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                  <ConnectButton label="Connect Wallet to Tip" showBalance={false} />
                </div>
              )}

              {/* Self Tipping Warning */}
              {isConnected && isSelfTipping && (
                <div style={{
                  padding: '1rem',
                  background: 'hsl(var(--destructive)/0.1)',
                  color: 'hsl(var(--destructive))',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  border: '1px solid hsl(var(--destructive)/0.2)'
                }}>
                  You cannot tip yourself.
                </div>
              )}

              {/* Donation Flow */}
              {isConnected && !isSelfTipping && (
                <div className={styles.flowContainer} style={{ maxWidth: '100%' }}>
                  {/* Reusing existing logic but simplifed UI wrapper */}
                  {flow === 'none' && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'hsl(var(--secondary))', borderRadius: '0.5rem' }}>
                        <p style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Vault Balance</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>${balance.toFixed(2)}</p>
                      </div>

                      {balance <= 0 ? (
                        <Button onClick={() => setFlow('deposit')} style={{ width: '100%' }}>
                          Deposit USDC
                        </Button>
                      ) : (
                        <Button onClick={() => setFlow('session')} style={{ width: '100%' }}>
                          Start Tipping Session
                        </Button>
                      )}
                    </div>
                  )}

                  {flow === 'deposit' && (
                    <div>
                      <DepositFlow
                        onError={(msg) => showToast(msg, 'error')}
                        onSuccess={(msg) => showToast(msg, 'success')}
                        onComplete={() => setFlow('session')}
                      />
                      <Button onClick={() => setFlow('none')} variant="ghost" size-sm style={{ marginTop: '0.5rem' }}>Cancel</Button>
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
                      <Button onClick={() => setFlow('none')} variant="ghost" size-sm style={{ marginTop: '0.5rem' }}>Cancel session</Button>
                    </div>
                  )}
                </div>
              )}

              {/* QR Code Toggle */}
              <div className={styles.qrToggle} onClick={() => setShowQr(!showQr)}>
                <QrCode size={16} />
                <span>{showQr ? "Hide QR Code" : "Show QR Code"}</span>
              </div>

              {showQr && (
                <div className={styles.qrCodeBox}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    alt="QR Code"
                    style={{ borderRadius: '0.5rem' }}
                  />
                  <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>Scan to visit profile</p>
                </div>
              )}
            </div>

            {/* Recent Supporters */}
            <div className={styles.card}>
              <h3 className={styles.sectionTitle}>Recent Supporters</h3>
              <div className={styles.activityList}>
                {recentActivity.map((act, i) => (
                  <div key={i} className={styles.activityItem}>
                    <div className={styles.activityAvatar}>
                      <User size={16} />
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityHeader}>
                        <span className={styles.activityName}>{act.name}</span>
                        <span className={styles.activityAmount}>+${act.amount}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{act.time}</span>
                      {act.msg && <div className={styles.activityMsg}>{act.msg}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.brand}>
            <div className={styles.logoSmall}>M</div>
            <span className={styles.brandNameUtils}>Powered by MuxPay</span>
          </div>
          <div className={styles.footerLinks}>
            <p>Join us to become a creator and receive crypto tips instantly.</p>
            <a href="/" className={styles.footerLink}>Get Started →</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
