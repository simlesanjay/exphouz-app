"use client";
import Link from 'next/link';
import { Home, Compass, PlusSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation'

const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/professionals', icon: Compass, label: 'Discover' },
    { href: '/requirements/post', icon: PlusSquare, label: 'Post' },
    { href: '/dashboard', icon: User, label: 'Profile' },
];

export default function BottomNav() {
    const pathname = usePathname();

    if (['/login', '/register', '/admin/dashboard'].some(path => pathname.startsWith(path))) {
        return null;
    }

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.2 }}
            className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 z-[100] lg:hidden"
        >
            <div className="max-w-md mx-auto flex justify-around items-center h-20">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link href={item.href} key={item.href} className="flex flex-col items-center justify-center gap-1 w-16">
                            <item.icon strokeWidth={isActive ? 2.5 : 2} size={20} className={isActive ? 'text-orange-600' : 'text-slate-400'} />
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-orange-600' : 'text-slate-400'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </motion.div>
    );
}
