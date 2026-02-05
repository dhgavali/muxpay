"use client";

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import styles from './Button.module.css';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
    children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                className={cn(styles.base, styles[variant], className)}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="animate-spin" size={16} />}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
