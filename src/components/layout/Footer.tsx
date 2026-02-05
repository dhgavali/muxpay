import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <h3>Lumina</h3>
                        <p>Unified payment orchestration for the modern internet. Bridging crypto and fiat with elegance.</p>
                    </div>
                    <div className={styles.column}>
                        <h4>Product</h4>
                        <ul className={styles.list}>
                            <li><Link href="/">Features</Link></li>
                            <li><Link href="/creator/dashboard">Creators</Link></li>
                            <li><Link href="/business/dashboard">Business</Link></li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h4>Resources</h4>
                        <ul className={styles.list}>
                            <li><Link href="/">Docs</Link></li>
                            <li><Link href="/">API Reference</Link></li>
                            <li><Link href="/">Status</Link></li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h4>Legal</h4>
                        <ul className={styles.list}>
                            <li><Link href="/">Privacy</Link></li>
                            <li><Link href="/">Terms</Link></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.copyright}>
                    <p>© 2026 Lumina Inc. All rights reserved.</p>
                    <p>Designed with Care.</p>
                </div>
            </div>
        </footer>
    );
}
