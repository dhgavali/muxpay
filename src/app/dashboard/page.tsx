'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCreatorByAddress, useCreatorWithSessions, useCreateCreator } from '@/hooks/useApi';
import styles from './page.module.css';
import { Copy, DollarSign, TrendingUp, Users, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [handle, setHandle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  const { data: creator, isLoading: creatorLoading, error: creatorError, refetch: refetchCreator } = useCreatorByAddress(address);
  const { data: creatorWithSessions, isLoading: sessionsLoading, refetch: refetchSessions } = useCreatorWithSessions(address);
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
      // Refetch both queries to update UI immediately
      await Promise.all([refetchCreator(), refetchSessions()]);
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
      showToast("Link copied to clipboard!", "success")
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
    <div className={styles.layout}>
      <Sidebar
        user={creator ? { name: creator.handle, handle: creator.handle } : undefined}
        role="Creator"
        items={[
          { icon: TrendingUp, label: "Overview", href: "/dashboard" },
          // Add more menu items if they exist, or just placeholder
        ]}
      />

      <div className={styles.mainWrapper}>
        <main className={styles.mainContent}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>Dashboard</h1>
              <p className={styles.subtitle}>Welcome back, {creator?.handle}</p>
            </div>
            <div className={styles.dateDisplay}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </header>

          {/* Stats Grid */}
          <div className={styles.analyticsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span>Total Earnings</span>
                <span className={styles.statBadge}>Live</span>
              </div>
              <div className={styles.statValue}>${totalEarnings.toFixed(2)}</div>
              <div className={styles.statPeriod}>{settledSessions.length} settled sessions</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span>Pending</span>
                <DollarSign size={16} className={styles.iconMuted} />
              </div>
              <div className={styles.statValue}>
                ${openSessions.reduce((sum, s) => sum + s.totalAmount, 0).toFixed(2)}
              </div>
              <div className={styles.statPeriod}>{openSessions.length} open sessions</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span>Total Sessions</span>
                <Users size={16} className={styles.iconMuted} />
              </div>
              <div className={styles.statValue}>{creatorWithSessions?.sessions?.length || 0}</div>
              <div className={styles.statPeriod}>All time</div>
            </div>
          </div>

          {/* Revenue Chart Placeholder */}
          <div className={styles.chartSection}>
            <div className={styles.sectionHeader}>
              <h3>Revenue Overview</h3>
              <div className={styles.chartControls}>
                <button className={styles.chartBtnActive}>1M</button>
                <button className={styles.chartBtn}>3M</button>
                <button className={styles.chartBtn}>6M</button>
                <button className={styles.chartBtn}>1Y</button>
              </div>
            </div>
            <div className={styles.chartPlaceholder}>
              {/* Simulated Graph SVG */}
              <svg viewBox="0 0 800 200" className={styles.chartSvg}>
                <path
                  d="M0 150 C 150 150, 200 80, 300 100 S 500 120, 600 50 S 700 80, 800 30"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                />
                <path
                  d="M0 150 C 150 150, 200 80, 300 100 S 500 120, 600 50 S 700 80, 800 30 L 800 200 L 0 200 Z"
                  fill="url(#gradient)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </main>

        <aside className={styles.rightPanel}>
          {/* Payment Link Card */}
          <div className={styles.panelCard}>
            <h3 className={styles.panelTitle}>Payment Link</h3>
            <p className={styles.panelDesc}>Share this link to receive tips.</p>

            <div className={styles.linkBox}>
              <span className={styles.linkUrl}>
                {typeof window !== 'undefined' && `${window.location.host}/c/${creator?.handle}`}
              </span>
              <button onClick={copyLink} className={styles.copyBtn}>
                <Copy size={16} />
              </button>
            </div>

            {creator?.handle && (
              <ExternalLink
                size={16}
                className={styles.viewBtn}
                style={{ display: 'none' }} // Hiding for now to match layout exactness or just keep copy
              />
            )}
            <Button
              variant="outline"
              size-sm
              className={styles.viewBtn}
              onClick={() => window.open(`/c/${creator?.handle}`, '_blank')}
            >
              View Public Page <ExternalLink size={14} style={{ marginLeft: 4 }} />
            </Button>
          </div>

          {/* Recent Sessions */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Recent Tips</h3>
            </div>

            <div className={styles.tipsList}>
              {creatorWithSessions?.sessions && creatorWithSessions.sessions.length > 0 ? (
                creatorWithSessions.sessions
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 5) // Show top 5
                  .map((session) => (
                    <div key={session.id} className={styles.tipItem}>
                      <div className={styles.tipIcon}>
                        <TrendingUp size={16} />
                      </div>
                      <div className={styles.tipInfo}>
                        <span className={styles.tipAmount}>
                          ${session.totalAmount.toFixed(2)}
                        </span>
                        <span className={styles.tipFrom}>
                          {session.status === 'SETTLED' ? 'Settled' : 'Pending'} ({session.txHash ? 'Tx' : ''})
                        </span>
                      </div>
                      <div className={styles.tipTime}>
                        {new Date(session.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))
              ) : (
                <p className={styles.emptyState}>No tips yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
