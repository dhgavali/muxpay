"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe, Wallet, ArrowRight } from "lucide-react";
import styles from "./BentoGrid.module.css";

export function BentoGrid() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={styles.header}
                >
                    <h2 className={styles.title}>Everything you need to accept payments</h2>
                    <p className={styles.subtitle}>
                        A complete financial stack designed for modern creators and businesses.
                    </p>
                </motion.div>

                <div className={styles.grid}>
                    {/* Main Large Item */}
                    <motion.div
                        className={`${styles.card} ${styles.cardLarge}`}
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className={styles.cardContent}>
                            <div className={styles.iconWrapperLarge}>
                                <Zap size={32} />
                            </div>
                            <h3 className={styles.cardTitle}>Gas-Free Micro-Tipping</h3>
                            <p className={styles.cardText}>
                                Traditional on-chain tips require one transaction per tip.
                                With Yellow state channels, we lock funds once and process unlimited tips off-chain,
                                reducing costs by over 95%.
                            </p>
                        </div>
                        <div className={styles.cardVisual}>
                            <div className={styles.visualMap} />
                        </div>
                    </motion.div>

                    {/* Secondary Items */}
                    <motion.div
                        className={styles.card}
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className={styles.cardContent}>
                            <div className={styles.iconWrapper}>
                                <Globe size={24} />
                            </div>
                            <h3 className={styles.cardTitleSmall}>Real-Time Feedback</h3>
                            <p className={styles.cardTextSmall}>
                                Fans get instant "Tip Sent" confirmation. No waiting for blockchain block times.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className={styles.card}
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className={styles.cardContent}>
                            <div className={styles.iconWrapper}>
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className={styles.cardTitleSmall}>On-Chain Security</h3>
                            <p className={styles.cardTextSmall}>
                                Off-chain speed with on-chain finality. Your funds are always settled securely.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className={`${styles.card} ${styles.cardWide}`}
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className={styles.cardContentHorizontal}>
                            <div className={styles.iconWrapper}>
                                <Wallet size={24} />
                            </div>
                            <div>
                                <h3 className={styles.cardTitleSmall}>Universal Gateway (Coming Soon)</h3>
                                <p className={styles.cardTextSmall}>
                                    Accept tokens from any chain and settle in USDC on your preferred network.
                                </p>
                            </div>
                            <div className={styles.msAuto}>
                                <ArrowRight size={20} className={styles.arrowIcon} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
