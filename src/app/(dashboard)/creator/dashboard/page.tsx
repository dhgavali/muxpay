"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import styles from "./page.module.css";
import { Copy } from "lucide-react";
import { MOCK_USERS, getTransactions } from "@/lib/mockData";
import { motion } from "framer-motion";

export default function CreatorDashboard() {
    const user = MOCK_USERS[0]; // Simulating logged-in creator
    const transactions = getTransactions(user.id);

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Welcome back, {user.name}</h1>
                        <p className={styles.subtitle}>Here is what is happening with your portfolio.</p>
                    </div>
                </div>

                <div className={styles.grid}>
                    <GlassCard>
                        <h3 className={styles.statLabel}>Total Earnings</h3>
                        <div className={styles.statValue}>$12,450.00</div>
                        <p className={styles.statLabel}>+12% from last month</p>
                    </GlassCard>

                    <GlassCard>
                        <h3 className={styles.statLabel}>Your Payment Link</h3>
                        <div className={styles.linkSection} style={{ marginTop: '1rem' }}>
                            <span className={styles.linkText}>muxpay.link/c/{user.handle}</span>
                            <Button variant="ghost" size-sm onClick={() => alert('Copied!')}>
                                <Copy size={16} />
                            </Button>
                        </div>
                        <p className={styles.statLabel} style={{ marginTop: '0.5rem' }}>
                            Share this link to get paid.
                        </p>
                    </GlassCard>
                </div>

                <h2 className={styles.sectionTitle}>Recent Transactions</h2>
                <GlassCard>
                    <div className={styles.transactionList}>
                        {transactions.map((tx) => (
                            <motion.div
                                key={tx.id}
                                className={styles.transactionItem}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className={styles.txInfo}>
                                    <h4>Received from {tx.from}</h4>
                                    <p>{new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                                <div className={styles.txAmount}>
                                    +{tx.amount} {tx.currency}
                                </div>
                            </motion.div>
                        ))}
                        {transactions.length === 0 && <p>No transactions yet.</p>}
                    </div>
                </GlassCard>
            </main>
            <Footer />
        </>
    );
}
