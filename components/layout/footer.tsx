import React from 'react';
import Link from 'next/link';
import { Linkedin, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-[#020617] text-slate-500 py-32 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
                    <div className="space-y-10">
                        <Link href="/" className="flex flex-col -space-y-2 group">
                            <span className="text-3xl font-bold tracking-tighter text-white uppercase group-hover:text-[#FF5722] transition-colors">Exphouz</span>
                            <span className="text-[9px] font-bold tracking-[0.6em] text-slate-600 uppercase mt-1">Refined Digital Platform</span>
                        </Link>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] leading-loose max-w-xs">
                            Connecting visionaries with trusted professionals across India's premier design and construction industries.
                        </p>
                        <div className="flex gap-8">
                            <a href="#" className="text-slate-600 hover:text-white transition-colors"><Linkedin size={20} /></a>
                            <a href="#" className="text-slate-600 hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-slate-600 hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-slate-600 hover:text-white transition-colors"><Facebook size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white text-[11px] font-bold tracking-[0.4em] mb-12 uppercase">Professional Path</h4>
                        <ul className="space-y-6 text-[11px] font-bold tracking-[0.2em] uppercase">
                            <li><Link href="/professionals" className="hover:text-[#FF5722] transition-colors">Architects Directory</Link></li>
                            <li><Link href="/professionals" className="hover:text-[#FF5722] transition-colors">Interior Designers</Link></li>
                            <li><Link href="/professionals" className="hover:text-[#FF5722] transition-colors">Contractors</Link></li>
                            <li><Link href="/professionals" className="hover:text-[#FF5722] transition-colors">Product Design</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-[11px] font-bold tracking-[0.4em] mb-12 uppercase">Company Discovery</h4>
                        <ul className="space-y-6 text-[11px] font-bold tracking-[0.2em] uppercase">
                            <li><Link href="/about" className="hover:text-[#FF5722] transition-colors">Our Vision</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-[#FF5722] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/legal/terms-homeowner" className="hover:text-[#FF5722] transition-colors">Terms of Service</Link></li>
                            <li><Link href="/legal/refund" className="hover:text-[#FF5722] transition-colors">Refund & Cancellation</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-[11px] font-bold tracking-[0.4em] mb-12 uppercase">Newsletter</h4>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-8 leading-loose">Subscribe to receive curated project updates and industry news.</p>
                        <div className="flex border-b border-white/20 pb-4">
                            <input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                className="bg-transparent border-none outline-none text-white text-[10px] font-bold tracking-widest w-full placeholder:text-slate-700"
                            />
                            <button className="text-[#FF5722]"><ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-slate-700 italic font-serif">Ahmedabad • Mumbai • Bangalore • Delhi</p>
                    <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-slate-700">© {new Date().getFullYear()} EXPHOUZ. ALL RIGHTS RESERVED.</p>
                </div>
            </div>
        </footer>
    );
};


