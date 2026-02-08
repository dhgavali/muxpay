"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Sidebar } from "@/components/layout/Sidebar";
import styles from "./page.module.css";
import { MOCK_USERS, getTransactions } from "@/lib/mockData";
import { Key, ArrowUpRight, Copy, CheckCircle2, TrendingUp } from "lucide-react";
import Link from 'next/link';

export default function BusinessDashboard() {
    const user = MOCK_USERS[1]; // Business user
    // Get last 5 transactions for "Recent Tips" (renamed from sessions)
    const recentTips = getTransactions(user.id).slice(0, 2);

    const copyLink = () => {
        // In a real app, use navigator.clipboard
        alert("Payment link copied!");
    };

    return (
        <div className={styles.layout}>
            <Sidebar />

            <div className={styles.mainWrapper}>
                {/* Main Content Area */}
                <main className={styles.mainContent}>
                    <header className={styles.header}>
                        <div>
                            <h1 className={styles.title}>Dashboard</h1>
                            <p className={styles.subtitle}>Welcome back, {user.name}</p>
                        </div>
                        <div className={styles.dateDisplay}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                    </header>

                    {/* Analytics Row */}
                    <div className={styles.analyticsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <span>Total Volume</span>
                                <span className={styles.statBadge}>+12.5%</span>
                            </div>
                            <div className={styles.statValue}>$45,230.50</div>
                            <div className={styles.statPeriod}>vs last 30 days</div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <span>Success Rate</span>
                                <CheckCircle2 size={16} className={styles.successIcon} />
                            </div>
                            <div className={styles.statValue}>99.8%</div>
                            <div className={styles.statPeriod}>0.02% failed</div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <span>Active Keys</span>
                                <Key size={16} className={styles.iconMuted} />
                            </div>
                            <div className={styles.statValue}>3</div>
                            <div className={styles.statPeriod}>All systems operational</div>
                        </div>
                    </div>

                    {/* Main Chart Area (Placeholder) */}
                    <div className={styles.chartSection}>
                        <div className={styles.sectionHeader}>
                            <h3>Revenue Overview</h3>
                            <div className={styles.chartControls}>
                                <button className={styles.chartBtnActive}>1D</button>
                                <button className={styles.chartBtn}>1W</button>
                                <button className={styles.chartBtn}>1M</button>
                                <button className={styles.chartBtn}>1Y</button>
                            </div>
                        </div>
                        <div className={styles.chartPlaceholder}>
                            {/* Simulated Graph SVG */}
                            <svg viewBox="0 0 800 200" className={styles.chartSvg}>
                                <path
                                    d="M0 150 C 100 150, 150 50, 250 80 S 400 120, 500 60 S 650 40, 800 20"
                                    fill="none"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M0 150 C 100 150, 150 50, 250 80 S 400 120, 500 60 S 650 40, 800 20 L 800 200 L 0 200 Z"
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

                {/* Right Panel */}
                <aside className={styles.rightPanel}>
                    {/* Payment Link Card */}
                    <div className={styles.panelCard}>
                        <h3 className={styles.panelTitle}>Payment Link</h3>
                        <p className={styles.panelDesc}>Share this link to accept payments.</p>

                        <div className={styles.linkBox}>
                            <span className={styles.linkUrl}>muxpay.com/{user.handle}</span>
                            <button onClick={copyLink} className={styles.copyBtn}>
                                <Copy size={16} />
                            </button>
                        </div>

                        <Link href={`/c/${user.handle}`} target="_blank">
                            <Button variant="outline" size-sm className={styles.viewBtn}>
                                View Public Page <ArrowUpRight size={14} />
                            </Button>
                        </Link>
                    </div>

                    {/* Recent Tips (Transactions) */}
                    <div className={styles.panelCard}>
                        <div className={styles.panelHeader}>
                            <h3 className={styles.panelTitle}>Recent Tips</h3>
                            <Link href="/business/tips" className={styles.viewAllLink}>View All</Link>
                        </div>

                        <div className={styles.tipsList}>
                            {recentTips.map((tip) => (
                                <div key={tip.id} className={styles.tipItem}>
                                    <div className={styles.tipIcon}>
                                        <TrendingUp size={16} />
                                    </div>
                                    <div className={styles.tipInfo}>
                                        <span className={styles.tipAmount}>+{tip.amount} {tip.currency}</span>
                                        <span className={styles.tipFrom}>from {tip.from}</span>
                                    </div>
                                    <div className={styles.tipTime}>2m</div>
                                </div>
                            ))}

                            {/* Dummy entries if needed or just rely on slice logic which might return empty if no mock data */}
                            {recentTips.length === 0 && (
                                <p className={styles.emptyState}>No recent tips.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
