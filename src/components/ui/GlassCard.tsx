import { HTMLMotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';
import styles from './GlassCard.module.css';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
    return (
        <motion.div
            className={cn(styles.card, className)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? { y: -5 } : undefined}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
