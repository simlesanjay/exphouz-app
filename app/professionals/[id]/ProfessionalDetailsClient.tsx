"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ShieldCheck, Star, MapPin, Calendar, Mail, Phone, MessageSquare,
    ExternalLink, ArrowLeft, CheckCircle2, IndianRupee, X, Send,
    ChevronLeft, ChevronRight, Globe, Award, FolderOpen, Share2, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from "next-auth/react";
import { contactExpert } from '../actions';

export interface ProjectSummary {
    id: string;
    title: string;
    description: string;
    images: string[];
    category: string;
    location: string;
    budgetRange: string;
}

export interface ProfessionalDetails {
    id: string;
    displayName: string;
    fullName: string;
    profilePhoto: string;
    profession: string[];
    location: string;
    experience: string;
    rating: number;
    reviewsCount: number;
    services: string[];
    specialization: string[];
    portfolio: ProjectSummary[];
    startingPrice: string;
    isVerified: boolean;
    about: string;
    website: string;
    portfolioImages: string[];
}

const ProjectCarousel: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="relative w-full h-full overflow-hidden group">
            <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`Project Slide ${idx}`}
                        className="w-full h-full object-cover shrink-0"
                        loading="lazy"
                    />
                ))}
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 z-10"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 z-10"
                    >
                        <ChevronRight size={20} />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentIndex(idx);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${currentIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/80'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const ProfessionalDetailsClient: React.FC<{ pro: ProfessionalDetails }> = ({ pro }) => {
    const { data: session } = useSession();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    if (!pro) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Professional not found</h2>
                    <Link href="/professionals" className="text-amber-600 underline">Back to Browse</Link>
                </div>
            </div>
        );
    }

    const [isSaved, setIsSaved] = useState(false);

    // Fetch Saved Status
    React.useEffect(() => {
        const checkSaved = async () => {
            if (!session) return;
            try {
                const res = await fetch('/api/v1/saved-pros');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        const saved = data.savedPros.some((item: any) => item.professionalId === pro.id);
                        setIsSaved(saved);
                    }
                }
            } catch (e) { console.error(e); }
        };
        checkSaved();
    }, [session, pro.id]);

    const toggleSave = async () => {
        if (!session?.user?.id) { alert("Please login to save."); return; }

        const oldStatus = isSaved;
        setIsSaved(!oldStatus);

        try {
            const res = await fetch('/api/v1/saved-pros', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ professionalId: pro.id })
            });
            if (!res.ok) setIsSaved(oldStatus);
        } catch (e) {
            console.error(e);
            setIsSaved(oldStatus);
        }
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!session?.user?.id) {
                alert("Please log in to contact this expert.");
                setIsLoading(false);
                return;
            }

            const result = await contactExpert(
                pro.id,
                formData,
                session.user.id
            );

            if (result.success) {
                setIsSent(true);
                setTimeout(() => {
                    setIsSent(false);
                    setIsContactModalOpen(false);
                    setFormData({ name: '', phone: '', email: '', message: '' }); // Reset form
                }, 2000);
            } else {
                alert(result.error || "Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            {/* Contact Modal */}
            <AnimatePresence>
                {isContactModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    >
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsContactModalOpen(false)} />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <button onClick={() => setIsContactModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                <X size={20} />
                            </button>

                            <div className="p-10 md:p-12 space-y-8">
                                {isSent ? (
                                    <div className="text-center py-12 space-y-6">
                                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
                                        <p className="text-slate-500 font-medium">Your inquiry has been sent to {pro.displayName}. They will reach out to you shortly.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-2 text-center">
                                            <h3 className="text-3xl font-bold text-slate-900">Contact <span className="text-[#FF5722]">{pro.displayName}</span></h3>
                                            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest">Start a conversation about your project</p>
                                        </div>

                                        <form onSubmit={handleContactSubmit} className="space-y-5">
                                            <div className="grid grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="John Doe"
                                                        className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722]/20 outline-none font-medium text-slate-900 placeholder:text-slate-300"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        placeholder="+91..."
                                                        className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722]/20 outline-none font-medium text-slate-900 placeholder:text-slate-300"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="name@email.com"
                                                    className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722]/20 outline-none font-medium text-slate-900 placeholder:text-slate-300"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                                                <textarea
                                                    required
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    rows={4}
                                                    placeholder="I'm interested in discussing a new residential project in..."
                                                    className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722]/20 outline-none font-medium text-slate-900 placeholder:text-slate-300 resize-none"
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full py-4.5 bg-[#FF5722] text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#FF5722]/20 hover:bg-[#E64A19] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                            >
                                                {isLoading ? 'Sending...' : <><Send size={18} /> Send Inquiry</>}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Immersive Header */}
            <div className="relative h-[60vh] min-h-[500px]">
                <img
                    src={pro.portfolio[0]?.images[0] || '/images/portfolio_fallback.jpg'}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                {/* Navbar Area (Simplified) */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
                    <Link href="/professionals" className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white hover:text-slate-900 transition-all border border-white/10 group">
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleSave}
                            className={`px-5 py-2.5 rounded-full backdrop-blur-md border flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${isSaved ? 'bg-white text-red-500 border-white' : 'bg-white/10 text-white border-white/10 hover:bg-white hover:text-slate-900'}`}
                        >
                            <Heart size={16} className={isSaved ? "fill-current" : ""} /> {isSaved ? 'Saved' : 'Save to Favorites'}
                        </button>
                        <button className="bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full hover:bg-white hover:text-slate-900 transition-all border border-white/10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                            <Share2 size={16} /> Share Profile
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col md:flex-row items-end gap-8"
                    >
                        <div className="relative shrink-0">
                            <div className="w-40 h-40 rounded-[2rem] p-1.5 bg-white/20 backdrop-blur-md shadow-2xl overflow-hidden">
                                <img src={pro.profilePhoto} alt={pro.fullName} className="w-full h-full rounded-[1.7rem] object-cover bg-white" />
                            </div>
                            {pro.isVerified && (
                                <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg border-[3px] border-slate-900">
                                    <ShieldCheck size={20} />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-white pb-2 space-y-3">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">{pro.displayName}</h1>
                                <p className="text-lg md:text-xl text-slate-300 font-medium tracking-wide flex items-center gap-3">
                                    {Array.isArray(pro.profession) ? pro.profession.join(", ") : pro.profession}
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                    <span className="text-slate-400 text-base">{pro.fullName}</span>
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                    <Star className="text-amber-400 fill-amber-400" size={18} />
                                    <span className="text-sm font-bold text-white">{pro.rating} <span className="text-slate-400 font-medium">({pro.reviewsCount})</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300 font-bold uppercase tracking-widest">
                                    <MapPin size={18} className="text-slate-400" />
                                    {pro.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300 font-bold uppercase tracking-widest">
                                    <Calendar size={18} className="text-slate-400" />
                                    {pro.experience}Y+ Exp.
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="lg:col-span-2 space-y-12"
                    >
                        {/* About Section */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-8">Professional Overview</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                                            <FolderOpen size={20} />
                                        </div>
                                        Portfolio Gallery
                                    </h3>
                                    {pro.portfolioImages && pro.portfolioImages.filter(img => img && img.trim() !== '').length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {pro.portfolioImages.filter(img => img && img.trim() !== '').map((img, idx) => (
                                                <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer relative">
                                                    <img src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                                                            <ExternalLink size={16} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-400">No portfolio images uploaded.</p>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                        <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                                            <Award size={20} />
                                        </div>
                                        Specializations
                                    </h3>
                                    {pro.specialization && pro.specialization.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {pro.specialization.map((spec, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold uppercase tracking-wider border border-slate-100 hover:bg-slate-100 transition-colors">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-400">No specializations listed.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Portfolio Section */}
                        <div className="space-y-8">
                            <div className="flex justify-between items-end px-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900">Featured <span className="text-[#FF5722]">Works</span></h2>
                                    <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Explore our curated selection of projects</p>
                                </div>
                                <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{pro.portfolio.length} Projects</span>
                            </div>

                            <div className="space-y-12">
                                {pro.portfolio.map((item, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        key={item.id}
                                        className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 group"
                                    >
                                        <div className="flex flex-col md:flex-row h-full">
                                            <div className="md:w-7/12 relative h-80 md:h-[450px]">
                                                <ProjectCarousel images={item.images} />
                                                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                                                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black tracking-[0.2em] uppercase text-slate-900 shadow-lg ml-2">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="md:w-5/12 p-8 md:p-12 flex flex-col">
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-4">
                                                        {item.description || 'A masterpiece of contemporary design, blending functionality with aesthetic brilliance to create a unique living experience.'}
                                                    </p>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                                                            <div className="p-2 bg-white rounded-xl shadow-sm text-[#FF5722]">
                                                                <MapPin size={16} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                                                                <p className="text-sm font-bold text-slate-900">{item.location || 'Pan-India'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                                                            <div className="p-2 bg-white rounded-xl shadow-sm text-[#FF5722]">
                                                                <IndianRupee size={16} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget</p>
                                                                <p className="text-sm font-bold text-slate-900">{item.budgetRange || 'On Request'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={`/projects/${item.id}`}
                                                    className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#FF5722] transition-colors flex items-center justify-center gap-2 group/btn"
                                                >
                                                    View Details <ArrowLeft size={16} className="rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="bg-[#0f172a] rounded-[3rem] p-10 shadow-2xl border-t-8 border-[#FF5722] sticky top-32 text-white overflow-hidden relative">
                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <MessageSquare size={200} />
                            </div>

                            <div className="relative z-10">
                                { /* Starting Price Removed */}

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setIsContactModalOpen(true)}
                                        className="w-full py-5 bg-[#FF5722] text-white rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#FF5722]/20 hover:bg-[#ff7043] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <MessageSquare size={18} />
                                        Contact Expert
                                    </button>
                                    <button className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
                                        <Calendar size={18} />
                                        Schedule Visit
                                    </button>
                                </div>

                                { /* Direct Contact Details Removed */}
                            </div>
                        </div>

                        {pro.website && (
                            <a
                                href={pro.website.startsWith('http') ? pro.website : `https://${pro.website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-xl transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                            <Globe size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website</p>
                                            <p className="text-slate-900 font-bold">Visit Portfolio</p>
                                        </div>
                                    </div>
                                    <ExternalLink size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </a>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalDetailsClient;
