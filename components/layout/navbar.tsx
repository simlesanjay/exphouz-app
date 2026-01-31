"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Search, ChevronRight, ChevronDown, DraftingCompass, Armchair, HardHat, Hammer, Trees, Compass } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';

export function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Redirect to requirements page acting as a search results page for now, 
            // or we could have a dedicated /search page.
            // Using /requirements for "Find Work" context or /professionals for finding pros.
            // Let's default to finding professionals for general search, but user asked for "search bar in nav bar".
            // It's ambiguous what they want to search (Pros or Jobs).
            // Let's assume global search or just redirect to professionals list with query.
            router.push(`/professionals?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isHovered = React.useRef(false);
    const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        isHovered.current = true;
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        isHovered.current = false;
        dropdownTimeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 300); // 300ms delay for smoother transition
    };

    const handleOpenChange = (open: boolean) => {
        // If trying to close but we are still hovering, ignore it (prevents click-close)
        if (!open && isHovered.current) {
            return;
        }
        setIsDropdownOpen(open);
    };

    return (
        <header className="fixed top-0 w-full z-[110] bg-white md:bg-white/80 border-b border-slate-100/80 backdrop-blur-xl h-20 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between gap-8">

                {/* LEFT: Logo */}
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight shrink-0 flex items-center gap-1">
                    Exphouz
                </Link>

                {/* CENTER: Search Bar (Desktop) */}
                <div className="hidden md:flex flex-1 max-w-md mx-auto">
                    <form onSubmit={handleSearch} className="group w-full relative">
                        <input
                            type="text"
                            placeholder="Find architects, designers..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-12 pr-4 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
                    </form>
                </div>

                {/* RIGHT: Desktop Links & Auth */}
                <div className="flex items-center gap-6">
                    <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
                        <div
                            className="flex items-center gap-1 h-full"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/professionals" className="hover:text-slate-900 transition-colors py-2">Experts</Link>
                            <DropdownMenu open={isDropdownOpen} onOpenChange={handleOpenChange} modal={false}>
                                <DropdownMenuTrigger className="flex items-center hover:text-slate-900 transition-colors outline-none pt-1 py-2" asChild>
                                    <button type="button"><ChevronDown size={14} /></button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    sideOffset={0}
                                    className="w-64 bg-white p-2 shadow-xl border-slate-100 rounded-2xl"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Browse Professionals
                                    </div>
                                    <DropdownMenuItem asChild className="focus:bg-orange-50 focus:text-orange-900 rounded-xl cursor-pointer">
                                        <Link href="/professionals?type=Architect" className="flex items-center gap-3 py-2.5 px-3 w-full">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                <DraftingCompass size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700">Architects</span>
                                                <span className="text-[10px] text-slate-400 font-medium">Residential & Commercial</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="focus:bg-orange-50 focus:text-orange-900 rounded-xl cursor-pointer">
                                        <Link href="/professionals?type=Interior Designer" className="flex items-center gap-3 py-2.5 px-3 w-full">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                                                <Armchair size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700">Interior Designers</span>
                                                <span className="text-[10px] text-slate-400 font-medium">Home & Office Decor</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="focus:bg-orange-50 focus:text-orange-900 rounded-xl cursor-pointer">
                                        <Link href="/professionals?type=Civil Engineer" className="flex items-center gap-3 py-2.5 px-3 w-full">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                                <HardHat size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700">Civil Engineers</span>
                                                <span className="text-[10px] text-slate-400 font-medium">Structural Experts</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="focus:bg-orange-50 focus:text-orange-900 rounded-xl cursor-pointer">
                                        <Link href="/professionals?type=Contractor" className="flex items-center gap-3 py-2.5 px-3 w-full">
                                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition-colors">
                                                <Hammer size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700">Contractors</span>
                                                <span className="text-[10px] text-slate-400 font-medium">Builders & Renovation</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="focus:bg-orange-50 focus:text-orange-900 rounded-xl cursor-pointer">
                                        <Link href="/professionals?type=Landscape Designer" className="flex items-center gap-3 py-2.5 px-3 w-full">
                                            <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                                                <Trees size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700">Landscape Designers</span>
                                                <span className="text-[10px] text-slate-400 font-medium">Gardens & Outdoors</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="focus:bg-orange-50 focus:text-orange-900 rounded-xl cursor-pointer">
                                        <Link href="/professionals?type=Vastu Consultant" className="flex items-center gap-3 py-2.5 px-3 w-full">
                                            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-100 transition-colors">
                                                <Compass size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700">Vastu Consultants</span>
                                                <span className="text-[10px] text-slate-400 font-medium">Energy & Balance</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Link href="/projects" className="hover:text-slate-900 transition-colors">Find Projects</Link>
                    </nav>

                    <div className="hidden lg:flex items-center gap-3 pl-6 border-l border-slate-200 h-8">
                        {!session ? (
                            <>
                                <Link href="/login" className="text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors">
                                    Log In
                                </Link>
                                <Link href="/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-slate-900/20 hover:shadow-orange-600/30">
                                    Join Now
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/requirements/post" className="hidden xl:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors bg-orange-50 px-4 py-2 rounded-full">
                                    Post Project
                                </Link>
                                <Link href="/dashboard" className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 transition-all">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggler */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-slate-900 lg:hidden hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[115] lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white z-[120] shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <span className="font-serif text-xl font-bold">Menu</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 bg-white">
                                {/* Mobile Search */}
                                <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative mb-8">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full bg-slate-100 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                </form>

                                <nav className="flex flex-col gap-2">
                                    <MobileLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</MobileLink>
                                    <MobileLink href="/professionals" onClick={() => setIsMobileMenuOpen(false)}>Experts</MobileLink>
                                    <MobileLink href="/projects" onClick={() => setIsMobileMenuOpen(false)}>Find Projects</MobileLink>
                                    <MobileLink href="/requirements/post" onClick={() => setIsMobileMenuOpen(false)} className="text-orange-600">Post a Project</MobileLink>
                                </nav>
                            </div>

                            <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50">
                                {!session ? (
                                    <div className="grid gap-3">
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex justify-center py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-900">
                                            Log In
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex justify-center py-3 rounded-xl bg-slate-900 text-white text-sm font-bold">
                                            Sign Up Free
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex justify-center py-3 rounded-xl bg-slate-900 text-white text-sm font-bold">
                                            Dashboard
                                        </Link>
                                        <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="w-full flex justify-center py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500">
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}

function MobileLink({ href, onClick, children, className = "" }: { href: string, onClick: () => void, children: React.ReactNode, className?: string }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors ${className}`}
        >
            <span className="font-bold text-lg text-slate-800">{children}</span>
            <ChevronRight size={20} className="text-slate-300" />
        </Link>
    )
}
