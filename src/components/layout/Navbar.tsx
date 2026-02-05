"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            className={cn(styles.navbar, scrolled && styles.scrolled)}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Link href="/" className={styles.logo}>
                Lumina
            </Link>

            <div className={styles.links}>
                <Link href="/creator/dashboard" className={styles.link}>Creators</Link>
                <Link href="/business/dashboard" className={styles.link}>Business</Link>
            </div>

            <div className={styles.actions}>
                <Link href="/login">
                    <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/signup">
                    <Button>Get Started</Button>
                </Link>
            </div>
        </motion.nav>
    );
}
