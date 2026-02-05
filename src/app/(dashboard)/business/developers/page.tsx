"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import styles from "../dashboard/page.module.css";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Developers() {
    const codeSnippet = `
import { Lumina } from '@lumina/sdk';

const client = new Lumina('sk_live_...');

await client.payment.create({
  amount: 50.00,
  currency: 'USDC',
  recipient: 'user_123'
});
  `.trim();

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Developer Resources</h1>
                        <p>Integrate Lumina into your application in minutes.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <h2 className={styles.statTitle} style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Quick Start</h2>
                        <p style={{ lineHeight: '1.6', color: 'hsl(var(--muted-foreground))', marginBottom: '1.5rem' }}>
                            Our SDK abstracts all the blockchain complexity. You just specfiy who to pay and how much.
                            We handle the wallet connections, gas fees, and confirmation methods.
                        </p>
                        <GlassCard>
                            <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Installation</h3>
                            <code style={{ background: 'rgba(0,0,0,0.05)', padding: '0.5rem', borderRadius: '4px', display: 'block' }}>
                                npm install @lumina/sdk
                            </code>
                        </GlassCard>
                    </div>

                    <GlassCard style={{ background: '#1e1e1e', color: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>example.ts</span>
                            <Copy size={16} color="#888" cursor="pointer" />
                        </div>
                        <pre style={{ fontFamily: 'monospace', fontSize: '0.9rem', overflowX: 'auto' }}>
                            {codeSnippet}
                        </pre>
                    </GlassCard>
                </div>

            </main>
            <Footer />
        </>
    );
}
