import { forwardRef } from 'react';
import styles from './Input.module.css';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className={styles.wrapper}>
                {label && <label className={styles.label}>{label}</label>}
                <input
                    className={cn(styles.input, className)}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = 'Input';
