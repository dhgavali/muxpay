'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCreatorByAddress, useCreatorWithSessions, useCreateCreator } from '@/hooks/useApi';
import styles from './page.module.css';
import { Copy, DollarSign, TrendingUp, Users, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [handle, setHandle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { data: creator, isLoading: creatorLoading, error: creatorError } = useCreatorByAddress(address);
  const { data: creatorWithSessions, isLoading: sessionsLoading, refetch } = useCreatorWithSessions(address);
  const createCreatorMutation = useCreateCreator();

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  const handleCreateCreator = async () => {
    if (!handle || !address) return;
    
    setIsCreating(true);
    try {
      await createCreatorMutation.mutateAsync({
        handle,
        address,
      });
      setShowCreateForm(false);
      setHandle('');
      // Refetch to update UI
      setTimeout(() => refetch(), 1000);
    } catch (error: any) {
      alert(error.message || 'Failed to create creator profile');
    } finally {
      setIsCreating(false);
    }
  };

  const copyLink = () => {
    if (creator) {
      const link = `${window.location.origin}/c/${creator.handle}`;
      navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    }
  };

  // Calculate total earnings from settled sessions
  const totalEarnings = creatorWithSessions?.sessions
    ?.filter(s => s.status === 'SETTLED')
    ?.reduce((sum, s) => sum + s.totalAmount, 0) || 0;

  const settledSessions = creatorWithSessions?.sessions?.filter(s => s.status === 'SETTLED') || [];
  const openSessions = creatorWithSessions?.sessions?.filter(s => s.status === 'OPEN') || [];

  if (!isConnected) {
    return null;
  }

  if (creatorLoading || sessionsLoading) {
    return (
      <>
        <Navbar />
        <main className={styles.container}>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p>Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // No creator profile yet
  if (!creator && !showCreateForm) {
    return (
      <>
        <Navbar />
        <main className={styles.container}>
          <GlassCard style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem', textAlign: 'center' }}>
            <h1 className={styles.title}>Welcome to MuxPay! 🎉</h1>
            <p className={styles.subtitle} style={{ marginBottom: '2rem' }}>
              Create your creator profile to start receiving tips and donations.
            </p>
            <Button onClick={() => setShowCreateForm(true)} style={{ width: '100%' }}>
              Create Creator Profile
            </Button>
          </GlassCard>
        </main>
        <Footer />
      </>
    );
  }

  // Show create form
  if (showCreateForm && !creator) {
    return (
      <>
        <Navbar />
        <main className={styles.container}>
          <GlassCard style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem' }}>
            <h2 className={styles.sectionTitle}>Create Your Creator Profile</h2>
            <p className={styles.subtitle} style={{ marginBottom: '2rem' }}>
              Choose a unique handle for your payment page
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>
                Your Handle
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="yourname"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(123, 63, 242, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem',
                }}
              />
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                muxpay.com/c/{handle || 'yourname'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                onClick={handleCreateCreator}
                disabled={!handle || isCreating}
                style={{ flex: 1 }}
              >
                {isCreating ? 'Creating...' : 'Create Profile'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowCreateForm(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
            </div>
          </GlassCard>
        </main>
        <Footer />
      </>
    );
  }

  // Show dashboard
  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Welcome back, @{creator?.handle}</h1>
            <p className={styles.subtitle}>Here's what's happening with your tips.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.grid}>
          <GlassCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(123, 63, 242, 0.2)', 
                borderRadius: '12px' 
              }}>
                <DollarSign size={24} color="#7b3ff2" />
              </div>
              <h3 className={styles.statLabel}>Total Earnings</h3>
            </div>
            <div className={styles.statValue}>${totalEarnings.toFixed(2)}</div>
            <p className={styles.statSubtext}>{settledSessions.length} settled sessions</p>
          </GlassCard>

          <GlassCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(34, 197, 94, 0.2)', 
                borderRadius: '12px' 
              }}>
                <TrendingUp size={24} color="#22c55e" />
              </div>
              <h3 className={styles.statLabel}>Pending</h3>
            </div>
            <div className={styles.statValue}>
              ${openSessions.reduce((sum, s) => sum + s.totalAmount, 0).toFixed(2)}
            </div>
            <p className={styles.statSubtext}>{openSessions.length} open sessions</p>
          </GlassCard>

          <GlassCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(59, 130, 246, 0.2)', 
                borderRadius: '12px' 
              }}>
                <Users size={24} color="#3b82f6" />
              </div>
              <h3 className={styles.statLabel}>Total Sessions</h3>
            </div>
            <div className={styles.statValue}>{creatorWithSessions?.sessions?.length || 0}</div>
            <p className={styles.statSubtext}>All time</p>
          </GlassCard>
        </div>

        {/* Payment Link */}
        <GlassCard>
          <h3 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>Your Payment Link</h3>
          <div className={styles.linkSection}>
            <span className={styles.linkText}>
              {typeof window !== 'undefined' && `${window.location.origin}/c/${creator?.handle}`}
            </span>
            <Button variant="ghost" onClick={copyLink}>
              <Copy size={16} />
            </Button>
          </div>
          <p className={styles.statSubtext} style={{ marginTop: '0.5rem' }}>
            Share this link to receive tips and donations
          </p>
        </GlassCard>

        {/* Recent Sessions */}
        <h2 className={styles.sectionTitle}>Recent Sessions</h2>
        <GlassCard>
          <div className={styles.transactionList}>
            {creatorWithSessions?.sessions && creatorWithSessions.sessions.length > 0 ? (
              creatorWithSessions.sessions
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 10)
                .map((session) => (
                  <motion.div
                    key={session.id}
                    className={styles.transactionItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className={styles.txInfo}>
                      <h4>
                        {session?.txHash?.substring(0, 10)}...{session?.txHash?.substring(58)}
                      </h4>
                      <p>{new Date(session.updatedAt).toLocaleString()}</p>
                    </div>
                    <div className={styles.txAmount}>
                      <span style={{ 
                        color: session.status === 'SETTLED' ? '#22c55e' : '#f59e0b',
                        marginRight: '0.5rem'
                      }}>
                        {session.status === 'SETTLED' ? '✓' : '⏳'}
                      </span>
                      ${session.totalAmount.toFixed(2)}
                      {session.txHash && (
                        <a
                          href={`https://testnet.arcscan.app/tx/${session.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ marginLeft: '0.5rem' }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))
            ) : (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', padding: '2rem' }}>
                No sessions yet. Share your link to start receiving tips!
              </p>
            )}
          </div>
        </GlassCard>
      </main>
      <Footer />
    </>
  );
}
