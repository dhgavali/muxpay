'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/Button';
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
      <Link href="/" className={styles.logoContainer}>
        <div className={styles.logo}>M</div>
        <span className={styles.brandName}>MuxPay</span>
      </Link>



      <div className={styles.actions}>
        {isConnected && (
          <Link href="/dashboard">
            <Button variant="secondary" style={{ marginRight: '0.5rem' }}>
              Dashboard
            </Button>
          </Link>
        )}
        <ConnectButton />
      </div>
    </motion.nav>
  );
}
