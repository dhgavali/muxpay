"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import styles from "./page.module.css";
import { getUser, MOCK_USERS } from "@/lib/mockData";
import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

export default function CreatorProfile({ params }: { params: { creatorId: string } }) {
    // Simulate decoding 'creatorId' (could be handle or ID)
    // For demo, we just grab the first user if not found or specific logic
    const creator = getUser(params.creatorId) || MOCK_USERS[0];
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("USDC");
    const [showQR, setShowQR] = useState(false);

    return (
        <div className={styles.main}>
            <GlassCard className={styles.profileCard} hoverEffect={true}>
                <motion.div
                    className={styles.avatarContainer}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Using img tag for simplicity in prototype, Next/Image requires config for external domains */}
                    <img src={creator.avatar} alt={creator.name} className={styles.avatar} />
                </motion.div>

                <h1 className={styles.name}>{creator.name}</h1>
                <p className={styles.bio}>Digital Artist & Creator. Support my work!</p>

                <div className={styles.paymentSection}>
                    <div className={styles.currencySelect}>
                        {['USDC', 'ETH', 'SOL'].map((curr) => (
                            <Button
                                key={curr}
                                variant={currency === curr ? 'primary' : 'ghost'}
                                size-sm // Not implemented prop but button accepts ...props, ensuring style variant works.
                                onClick={() => setCurrency(curr)}
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            >
                                {curr}
                            </Button>
                        ))}
                    </div>

                    <div className={styles.inputGroup}>
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            label={`Amount in ${currency}`}
                            style={{ fontSize: '1.25rem', textAlign: 'center' }}
                        />
                    </div>

                    <Button
                        className="w-full"
                        style={{ width: '100%' }}
                        onClick={() => setShowQR(!showQR)}
                    >
                        {showQR ? 'Cancel Payment' : `Pay ${amount ? amount : ''} ${currency}`}
                    </Button>

                    {showQR && (
                        <motion.div
                            className={styles.qrContainer}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                        >
                            <p className={styles.qrLabel}>Scan to pay via Wallet</p>
                            {/* Placeholder QR */}
                            <div className={styles.qrCode}>
                                <QrCode size={130} color="black" />
                            </div>
                        </motion.div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
