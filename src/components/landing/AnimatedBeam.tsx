"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./AnimatedBeam.module.css";
import { Wallet, Globe, CreditCard, Bitcoin } from "lucide-react";

export function AnimatedBeam() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Inputs: Different payment methods/chains
    const inputs = [
        { icon: <Wallet size={24} />, label: "Wallet" },
        { icon: <Globe size={24} />, label: "Global" },
        { icon: <Bitcoin size={24} />, label: "Crypto" },
        { icon: <CreditCard size={24} />, label: "Cards" },
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

            {/* Central Hub */}
            <div className={styles.hubContainer}>
                <div className={styles.hub}>
                    <span className={styles.hubLabel}>MuxPay</span>
                </div>
                <div className={styles.hubGlow} />
            </div>

            {/* Output */}
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
                            delay: 0.2 // Slightly offset from inputs
                        }}
                    />
                </div>
                <div className={styles.outputNode}>
                    <div className={styles.iconWrapper}>
                        <span className={styles.dollar}>$</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
