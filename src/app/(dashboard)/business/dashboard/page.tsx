"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import styles from "./page.module.css";
import { MOCK_USERS, getTransactions } from "@/lib/mockData";
import { Key, BarChart3, ArrowUpRight } from "lucide-react";
import Link from 'next/link';

export default function BusinessDashboard() {
    const user = MOCK_USERS[1]; // Business user

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>{user.name} Dashboard</h1>
                        <p>Overview of your crypto payment gateway.</p>
                    </div>
                    <Link href="/business/developers">
                        <Button variant="outline">Developer Docs</Button>
                    </Link>
                </div>

                <div className={styles.grid}>
                    <GlassCard hoverEffect>
                        <h3 className={styles.statTitle}>Total Volume (30d)</h3>
                        <div className={styles.statValue}>$45,230.50</div>
                        <div className={styles.chartPlaceholder}>
                            <div className={styles.chartLine} />
                        </div>
                    </GlassCard>

                    <GlassCard hoverEffect>
                        <h3 className={styles.statTitle}>Active API Keys</h3>
                        <div className={styles.statValue}>3</div>
                        <div className={styles.apiKeySection}>
                            <div className={styles.keyDisplay}>
                                <span className={styles.blurKey}>sk_live_51Mz...Xy29</span>
                                <Key size={16} />
                            </div>
                            <Button size-sm style={{ marginTop: '1rem', width: '100%' }}>Generate New Key</Button>
                        </div>
                    </GlassCard>

                    <GlassCard hoverEffect>
                        <h3 className={styles.statTitle}>Success Rate</h3>
                        <div className={styles.statValue}>99.8%</div>
                        <p style={{ color: 'hsl(142, 76%, 36%)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowUpRight size={16} /> 0.2%
                        </p>
                    </GlassCard>
                </div>

                <h3>Recent Integrations</h3>
                {/* Placeholder for integration list */}
            </main>
            <Footer />
        </>
    );
}
