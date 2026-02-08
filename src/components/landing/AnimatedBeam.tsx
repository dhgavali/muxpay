"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./AnimatedBeam.module.css";
import { Wallet, Globe, CreditCard, Bitcoin } from "lucide-react";

export function AnimatedBeam() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Custom Colored Icons
    const Icons = {
        bitcoin: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F7931A" />
                <path d="M16.5 10.5C16.5 8.5 15 8 13.5 8H11V6H9.5V8H8V16H9.5V18H11V16H13.5C15.5 16 16.5 15 16.5 13.5C16.5 12.5 15.5 12 14.5 11.5C15.5 11 16.5 10.5 16.5 10.5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        ethereum: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" fill="#627EEA" />
            </svg>
        ),
        base: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="12" fill="#0052FF" />
                <path d="M16 10H8V14H16V10Z" fill="white" />
            </svg>
        ),
        tether: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#26A17B" />
                <path d="M9 8H15V10H13V16H11V10H9V8Z" fill="white" />
            </svg>
        ),
        solana: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 18H20" stroke="#9945FF" strokeWidth="3" strokeLinecap="round" />
                <path d="M4 12H20" stroke="#14F195" strokeWidth="3" strokeLinecap="round" />
                <path d="M4 6H20" stroke="#9945FF" strokeWidth="3" strokeLinecap="round" />
            </svg>
        ),
    };

    // Inputs: Multiple Cryptos
    const inputs = [
        { icon: <Icons.ethereum />, label: "ETH" },
        { icon: <Icons.base />, label: "Base" }, // Logic: Base
        { icon: <Icons.tether />, label: "USDT" },
        { icon: <Icons.solana />, label: "SOL" },
    ];

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.inputs}>
                {inputs.map((item, index) => (
                    <div key={index} className={styles.inputNode}>
                        <div className={styles.iconWrapper}>{item.icon}</div>
                        {/* Beam Line */}
                        <div className={styles.beamPath}>
                            <motion.div
                                className={styles.beamParticle}
                                animate={{
                                    x: [0, 100],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: index * 0.5
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Central Hub - MuxPay */}
            <div className={styles.hubContainer}>
                <div className={styles.hub}>
                    {/* Replaced Text with Logo Image */}
                    <img src="/M.png" alt="MuxPay" width={60} style={{ borderRadius: "12px" }} />
                </div>
                <div className={styles.hubGlow} />
                {/* Added System Label */}
                <span className={styles.nodeLabelLarge}>MuxPay System</span>
            </div>

            {/* Output - Your Wallet */}
            <div className={styles.output}>
                <div className={styles.beamPathOutput}>
                    <motion.div
                        className={styles.beamParticle}
                        animate={{
                            x: [0, 100],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 0.2
                        }}
                    />
                </div>
                <div className={styles.outputNode}>
                    <div className={styles.iconWrapper}>
                        <Wallet size={24} color="white" />
                    </div>
                    <span className={styles.nodeLabel}>Your Wallet</span>
                </div>
            </div>
        </div>
    );
}
