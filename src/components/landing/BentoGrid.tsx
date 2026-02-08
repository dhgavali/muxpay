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
                                <Globe size={32} />
                            </div>
                            <h3 className={styles.cardTitle}>Universal Acceptance</h3>
                            <p className={styles.cardText}>
                                Accept payments from 135+ currencies, crypto, and local payment methods via a single integration.
                            </p>
                        </div>
                        <div className={styles.cardVisual}>
                            {/* Abstract Map or Globe Visual */}
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
                                <Zap size={24} />
                            </div>
                            <h3 className={styles.cardTitleSmall}>Instant Settlement</h3>
                            <p className={styles.cardTextSmall}>
                                Funds land in your account immediately. No holding periods.
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
                            <h3 className={styles.cardTitleSmall}>Bank-Grade Security</h3>
                            <p className={styles.cardTextSmall}>
                                AES-256 encryption and fraud detection built-in.
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
                                <h3 className={styles.cardTitleSmall}>Unified Wallet</h3>
                                <p className={styles.cardTextSmall}>
                                    Manage all your assets in one place. Swap, send, and withdraw with zero friction.
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
