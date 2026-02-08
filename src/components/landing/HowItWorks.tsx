"use client";

import { motion } from "framer-motion";
import styles from "./HowItWorks.module.css";

const steps = [
    {
        number: "01",
        title: "Deposit",
        description: "Users deposit USDC into a secure on-chain Vault to fund their tipping balance."
    },
    {
        number: "02",
        title: "Tip Instantly",
        description: "Send unlimited micro-tips ($1, $5) off-chain via Yellow State Channels. Zero gas fees."
    },
    {
        number: "03",
        title: "Settle",
        description: "When the session ends, the total amount settles on-chain in a single transaction."
    }
];

export function HowItWorks() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <span className={styles.label}>Workflow</span>
                    <h2 className={styles.title}>How MuxPay works</h2>
                </motion.div>

                <div className={styles.steps}>
                    <div className={styles.line} />
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className={styles.step}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <div className={styles.number}>{step.number}</div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDesc}>{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
