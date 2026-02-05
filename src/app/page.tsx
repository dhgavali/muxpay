"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import styles from "./page.module.css";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Wallet, Zap, Globe, ShieldCheck } from "lucide-react";

export default function Home() {
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    },
  };

  return (
    <div className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.gradientBg}>
          <div className={`${styles.blob} ${styles.blob1}`} />
          <div className={`${styles.blob} ${styles.blob2}`} />
          <div className={`${styles.blob} ${styles.blob3}`} />
        </div>

        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="show"
        >
          <motion.h1 className={styles.title} variants={itemVars}>
            The Future of Payments <br /> is Unified.
          </motion.h1>
          <motion.p className={styles.subtitle} variants={itemVars}>
            Accept crypto, fiat, and everything in between.
            A single, elegant platform for creators, businesses, and individuals.
            No more wallet fragmentation.
          </motion.p>
          <motion.div className={styles.ctaGroup} variants={itemVars}>
            <Link href="/creator/dashboard">
              <Button size-lg>For Creators</Button>
            </Link>
            <Link href="/business/dashboard">
              <Button variant="secondary">For Business</Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <motion.section
        className={styles.features}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <GlassCard hoverEffect>
          <div className={styles.icon}>
            <Globe size={32} />
          </div>
          <h3 className={styles.featureTitle}>Global Payments</h3>
          <p className={styles.featureText}>
            Accept payments from anywhere in the world. We handle the currency conversion and chain abstraction.
          </p>
        </GlassCard>

        <GlassCard hoverEffect>
          <div className={styles.icon}>
            <Zap size={32} />
          </div>
          <h3 className={styles.featureTitle}>Instant Settlement</h3>
          <p className={styles.featureText}>
            Get paid instantly in your preferred currency. No more waiting days for bank transfers.
          </p>
        </GlassCard>

        <GlassCard hoverEffect>
          <div className={styles.icon}>
            <ShieldCheck size={32} />
          </div>
          <h3 className={styles.featureTitle}>Secure & Private</h3>
          <p className={styles.featureText}>
            Enterprise-grade security for every transaction. Your data is encrypted and your funds are safe.
          </p>
        </GlassCard>
      </motion.section>

      <Footer />
    </div>
  );
}
