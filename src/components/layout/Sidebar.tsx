"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BarChart3,
    Wallet,
    Settings,
    Code2,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./Sidebar.module.css";
import { MOCK_USERS } from "@/lib/mockData";

export type SidebarItem = {
    icon: any;
    label: string;
    href: string;
};

interface SidebarProps {
    user?: { name: string; handle?: string };
    items?: SidebarItem[];
    role?: string;
}

const defaultBusinessItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/business/dashboard" },
    { icon: BarChart3, label: "Analytics", href: "/business/analytics" },
    { icon: Wallet, label: "Tips", href: "/business/tips" },
    { icon: Code2, label: "Developers", href: "/business/developers" },
    { icon: Settings, label: "Settings", href: "/business/settings" },
];

export function Sidebar({ user, items, role = "Business" }: SidebarProps) {
    const pathname = usePathname();
    // Default to Business User mock if no user provided
    const currentUser = user || MOCK_USERS[1];
    const currentItems = items || defaultBusinessItems;

    return (
        <aside className={styles.sidebar}>
            {/* Logo Area */}
            <div className={styles.logoContainer}>
                <div className={styles.logo}>M</div>
                <span className={styles.brandName}>MuxPay</span>
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                {currentItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Footer */}
            <div className={styles.footer}>
                <div className={styles.userCard}>
                    <div className={styles.avatar}>
                        {currentUser.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>{currentUser.name}</p>
                        <p className={styles.userRole}>{role}</p>
                    </div>
                    <Button variant="ghost" size-sm className={styles.logoutBtn}>
                        <LogOut size={16} />
                    </Button>
                </div>
            </div>
        </aside>
    );
}
