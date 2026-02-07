'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './Navbar.module.css';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isConnected, address } = useAccount();
  const router = useRouter();

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
        MuxPay
      </Link>

      <div className={styles.links}>
        {isConnected && (
          <Link href="/dashboard" className={styles.link}>
            Dashboard
          </Link>
        )}
        <Link href="/creator/dashboard" className={styles.link}>
          Creators
        </Link>
        <Link href="/business/dashboard" className={styles.link}>
          Business
        </Link>
      </div>

      <div className={styles.actions}>
        <ConnectButton />
      </div>
    </motion.nav>
  );
}
