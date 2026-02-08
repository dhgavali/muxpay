"use client";

import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import styles from "./page.module.css";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { AnimatedBeam } from "@/components/landing/AnimatedBeam";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CheckCircle2, ArrowRight } from "lucide-react";

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
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <div className={styles.main}>
      <Navbar />

      {/* Hero Section - Split Layout */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          {/* Left Content */}
          <motion.div
            className={styles.heroContent}
            variants={containerVars}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVars} className={styles.badge}>
              <span className={styles.badgeDot} />
              Now available for everyone
            </motion.div>

            <motion.h1 className={styles.heroTitle} variants={itemVars}>
              Unified payments for the <span className={styles.highlight}>modern economy</span>.
            </motion.h1>

            <motion.p className={styles.heroSubtitle} variants={itemVars}>
              Accept crypto, fiat, and cards through a single API.
              MuxPay abstracts the complexity of blockchain so you can focus on your business.
            </motion.p>

            <motion.div className={styles.heroActions} variants={itemVars}>
              <Link href="/dashboard">
                <Button className={styles.primaryBtn}>
                  Start Integration <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className={styles.secondaryBtn}>
                  Contact Sales
                </Button>
              </Link>
            </motion.div>

            <motion.div className={styles.trustSignals} variants={itemVars}>
              <div className={styles.trustItem}>
                <CheckCircle2 size={16} className={styles.checkIcon} />
                <span>Instant Settlement</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle2 size={16} className={styles.checkIcon} />
                <span>Global Coverage</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={styles.visualCard}>
              <AnimatedBeam />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Prop Section */}
      <BentoGrid />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Final CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to simplify your payments?</h2>
          <p className={styles.ctaText}>Join thousands of creators and businesses using MuxPay today.</p>
          <div className={styles.ctaButtons}>
            <Link href="/dashboard">
              <Button variant="primary" style={{ minWidth: '160px' }}>Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
