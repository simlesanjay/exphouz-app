
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import {
    User,
    Briefcase,
    Building2,
    Target,
    ImageIcon,
    ShieldCheck,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Plus,
    Globe,
    MapPin,
    Clock,
    IndianRupee,
    FileText,
    MessageCircle,
    Camera,
    LayoutDashboard,
    AlertCircle,
    XCircle
} from 'lucide-react';

import { INDIAN_LOCATIONS, INDIAN_STATES } from '@/lib/constants';

const ProfessionalOnboarding: React.FC = () => {
    const [step, setStep] = useState(1);
    const totalSteps = 6;
    const { data: session } = useSession();
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Basic Profile
        fullName: '',
        email: '',
        mobile: '',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '',
        languages: [] as string[],
        profileImage: '',

        // Step 2: Professional Details & Services
        professionType: [] as string[],
        specializations: [] as string[],
        experience: '',
        education: '',
        gst: '',
        services: [] as string[],

        // Step 3: Firm Information
        isFirm: false,
        firmName: '',
        firmType: 'Individual',
        teamSize: '1-5',
        website: '',

        // Step 4: Preferences & Pricing
        minBudget: '',
        maxBudget: '',
        consultationType: 'Free',
        consultationFee: '',
        siteVisit: 'Yes',

        // Step 5: Portfolio
        projects: [] as any[],

        // Step 6: Verification
        idVerification: false,
        contactMode: 'Chat',
        panNumber: '',
        idProofImage: '',

        // Validation for Step 5
        portfolioImages: Array(8).fill('') as string[],

        // Featured Project Details
        projectTitle: '',
        projectLocation: '',
        projectState: '',
        projectCity: '',
        projectDescription: ''
    });

    const validatePAN = (pan: string) => {
        const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return regex.test(pan.toUpperCase());
    };

    const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const sizeKB = file.size / 1024;
            if (sizeKB > 5500) {
                alert(`Image size must be less than 5.5MB.`);
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, idProofImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleFinish = async (e: React.FormEvent) => {
        e.preventDefault();

        // Call Server Action
        try {
            const { updateProfessionalProfile } = await import('./actions'); // Dynamic import to avoid server-client issues if any
            // Convert languages array to string for backend compatibility if needed, or update backend to accept array.
            // Action expects comma separated string currently: formData.languages.split
            const submissionData = {
                ...formData,
                languages: formData.languages.join(','),
                projectLocation: formData.projectCity && formData.projectState ? `${formData.projectCity}, ${formData.projectState}` : formData.projectLocation
            };
            const result = await updateProfessionalProfile(submissionData);

            if (result.success) {
                setStep(7); // Show success state
            } else {
                alert("Failed to save profile: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving your profile.");
        }
    };

    // Pre-fill from Session & DB
    useEffect(() => {
        const fetchDetails = async () => {
            // Basic session data
            if (session?.user) {
                setFormData(prev => ({
                    ...prev,
                    fullName: session.user?.name || prev.fullName,
                    email: session.user?.email || prev.email,
                    profileImage: session.user?.image || prev.profileImage
                }));
            }

            // Fetch validation details like mobile from DB
            try {
                const { getUserDetails } = await import('./actions');
                const user = await getUserDetails();
                if (user) {
                    setFormData(prev => ({
                        ...prev,
                        fullName: user.name || prev.fullName,
                        email: user.email || prev.email,
                        mobile: user.mobile || prev.mobile
                    }));
                }
            } catch (e) {
                console.error("Failed to fetch user details", e);
            }
        };

        fetchDetails();
    }, [session]);

    // Helper to handle image selection (mock or base64)
    const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validation: Max 400KB
            const sizeKB = file.size / 1024;
            if (sizeKB > 400) {
                alert(`Image size must be less than 400KB. Your file is ${Math.round(sizeKB)}KB.`);
                e.target.value = ''; // Reset input
                return;
            }

            // In a real app, upload to cloud here. For now, we'll use a local object URL or mock.
            // Using a mock placeholder specific to the index to simulate "uploaded" state
            // OR reading as data URL (truncated for safety/demo size)
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPortfolio = [...(formData.portfolioImages || Array(8).fill(''))];
                newPortfolio[index] = reader.result as string;
                setFormData(prev => ({ ...prev, portfolioImages: newPortfolio }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Generic image handler for Profile Photo
    const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validation: Max 400KB
            const sizeKB = file.size / 1024;
            if (sizeKB > 400) {
                alert(`Image size must be less than 400KB. Your file is ${Math.round(sizeKB)}KB.`);
                e.target.value = ''; // Reset input
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleLanguage = (lang: string) => {
        setFormData(prev => {
            const current = prev.languages;
            if (current.includes(lang)) {
                return { ...prev, languages: current.filter(l => l !== lang) };
            } else {
                return { ...prev, languages: [...current, lang] };
            }
        });
    };

    const toggleService = (srv: string) => {
        setFormData(prev => {
            const current = prev.specializations; // Usage of specializations as 'Services'
            if (current.includes(srv)) {
                return { ...prev, specializations: current.filter(s => s !== srv) };
            } else {
                return { ...prev, specializations: [...current, srv] };
            }
        });
    };

    const toggleProfession = (prof: string) => {
        setFormData(prev => {
            const current = prev.professionType;
            if (current.includes(prof)) {
                return { ...prev, professionType: current.filter(p => p !== prof) };
            } else {
                return { ...prev, professionType: [...current, prof] };
            }
        });
    };

    // Dropdown States
    const [servicesOpen, setServicesOpen] = useState(false);
    const [professionsOpen, setProfessionsOpen] = useState(false);

    const PROFESSION_SERVICES: Record<string, string[]> = {
        "Architect": [
            "Residential Architect",
            "Commercial Architect",
            "Institutional Architect",
            "Industrial Architect",
            "Landscape Architect",
            "Vastu Architect",
            "Urban Designer/Planner",
            "Healthcare Architect",
            "Conservation/Historic Preservation Architect"
        ],
        "Interior Designer": [
            "Residential Interior Designers",
            "Commercial Interior Designers",
            "Corporate/Office Designers",
            "Kitchen and Bath Designers",
            "Sustainability/Sustainable Designers",
            "Universal/Accessibility Designers",
            "E-Designers"
        ],
        "Product Designer": [
            "Furniture Designer",
            "Lighting Designer",
            "Industrial Designer (Fixtures & Fittings)",
            "Surface/Material Designer",
            "Architectural Product Designer",
            "Smart Home Designer"
        ],
        "Contractor": [
            "Civil Contractors",
            "Electrical Contractors",
            "Plumbing Contractors",
            "HVAC Contractors",
            "Roofing Contractors",
            "Carpenters",
            "Concrete Contractors",
            "Painting Contractors",
            "Landscaping Contractors"
        ]
    };

    const availableServices = React.useMemo(() => {
        if (formData.professionType.length === 0) return [];
        const services = new Set<string>();
        formData.professionType.forEach(prof => {
            const list = PROFESSION_SERVICES[prof];
            if (list) {
                list.forEach(s => services.add(s));
            }
        });
        return Array.from(services);
    }, [formData.professionType]);

    // Derived cities based on state
    const availableCities = React.useMemo(() => {
        return formData.state ? INDIAN_LOCATIONS[formData.state] || [] : [];
    }, [formData.state]);

    const availableProjectCities = React.useMemo(() => {
        return formData.projectState ? INDIAN_LOCATIONS[formData.projectState] || [] : [];
    }, [formData.projectState]);

    const LANGUAGES_LIST = ['English', 'Hindi', 'Gujarati', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Punjabi'];

    const StepsIndicator = () => (
        <div className="mb-16">
            <div className="flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= i ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/20' : 'bg-white text-slate-300 border border-slate-100'
                            }`}
                    >
                        {step > i ? <CheckCircle2 size={16} /> : i}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4">
                {['Identity', 'Expertise', 'Business', 'Scope', 'Portfolio', 'Trust'].map((label, i) => (
                    <span key={label} className={`text-[9px] font-bold uppercase tracking-widest ${step === i + 1 ? 'text-[#FF5722]' : 'text-slate-400'}`}>
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );

    // Success Screen Content
    if (step === 7) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-24 flex items-center justify-center">
                <div className="max-w-xl w-full bg-white rounded-[4rem] p-16 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-4xl font-bold uppercase mb-4 tracking-tight">Profile <span className="text-[#FF5722]">Submitted</span></h2>
                    <p className="text-slate-500 font-medium leading-relaxed mb-10">
                        Excellent! Your professional profile (ID: EXPHOUZ-PRO-{Math.floor(1000 + Math.random() * 9000)}) has been sent for verification.
                        You can now enter your workspace to manage enquiries and build your legacy.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => router.push('/dashboard/professional')}
                            className="py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#FF5722] transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                        >
                            <LayoutDashboard size={14} /> Go to Dashboard
                        </button>
                        <Link
                            href="/professionals"
                            className="py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            View Public Preview
                        </Link>
                    </div>
                    <p className="mt-8 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Redirecting to dashboard in 5 seconds...
                    </p>
                    {/* Automatic redirect timer - Be careful with side effects in render, better in useEffect but keeping simple as per user code */}
                    {setTimeout(() => router.push('/dashboard/professional'), 5000) && null}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                <header className="text-center mb-16 space-y-4">
                    <p className="text-[#FF5722] text-[10px] font-bold uppercase tracking-[0.5em]">Join the Elite Network</p>
                    <h1 className="text-5xl font-bold uppercase tracking-tighter text-slate-900">Professional <span className="text-[#FF5722]">Onboarding</span></h1>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Complete your profile to unlock high-quality leads and showcase your design legacy to the world.
                    </p>
                </header>

                <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5722]/5 blur-[100px] rounded-full translate-x-32 -translate-y-32"></div>

                    <StepsIndicator />

                    <form onSubmit={handleFinish} className="space-y-12">

                        {/* STEP 1: IDENTITY & CONTACT */}
                        {step === 1 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="flex items-center gap-4 border-l-4 border-[#FF5722] pl-6">
                                    <User className="text-[#FF5722]" size={24} />
                                    <h3 className="text-2xl font-bold uppercase tracking-tight">Basic Profile <span className="text-slate-400">Information</span></h3>
                                </div>

                                <div className="flex flex-col md:flex-row gap-12 items-center pb-8 border-b border-slate-50">
                                    <div className="relative group">
                                        <div className="w-40 h-40 rounded-[3rem] bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group-hover:border-[#FF5722] transition-all cursor-pointer overflow-hidden relative">
                                            {formData.profileImage ? (
                                                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <Camera size={32} />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest mt-2">Upload Photo</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={handleProfilePhotoUpload}
                                            />
                                        </div>
                                        {formData.profileImage && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, profileImage: '' }))}
                                                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        )}
                                        <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-widest mt-3">
                                            Max 400KB
                                        </p>
                                    </div>
                                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Vikram Mehta"
                                                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="vikram@office.com"
                                                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mobile Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">State & City</label>
                                        <div className="flex gap-4">
                                            <select
                                                value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
                                                className="w-1/2 px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium"
                                            >
                                                <option value="">Select State</option>
                                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <select
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                disabled={!formData.state}
                                                className="w-1/2 px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium disabled:bg-slate-100 disabled:text-slate-400"
                                            >
                                                <option value="">{formData.state ? 'Select City' : 'Select State'}</option>
                                                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pincode</label>
                                        <input
                                            type="text"
                                            placeholder="400001"
                                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium"
                                            value={formData.pinCode}
                                            onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Languages Spoken</label>
                                        <div className="flex flex-wrap gap-3">
                                            {LANGUAGES_LIST.map(lang => (
                                                <button
                                                    key={lang}
                                                    type="button"
                                                    onClick={() => toggleLanguage(lang)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${formData.languages.includes(lang)
                                                        ? 'bg-[#FF5722] text-white shadow-lg'
                                                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div >
                            </div >
                        )}

                        {/* STEP 2: PROFESSIONAL DETAILS & SERVICES */}
                        {
                            step === 2 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="flex items-center gap-4 border-l-4 border-[#FF5722] pl-6">
                                        <Briefcase className="text-[#FF5722]" size={24} />
                                        <h3 className="text-2xl font-bold uppercase tracking-tight">Professional <span className="text-slate-400">Expertise</span></h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Profession Type</label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setProfessionsOpen(!professionsOpen)}
                                                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium text-left flex justify-between items-center"
                                                >
                                                    <span className={formData.professionType.length === 0 ? "text-slate-400" : "text-slate-900"}>
                                                        {formData.professionType.length === 0 ? "Select Professions..." : `${formData.professionType.length} Selected`}
                                                    </span>
                                                    <ChevronRight size={16} className={`transition-transform ${professionsOpen ? 'rotate-90' : ''}`} />
                                                </button>

                                                {professionsOpen && (
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-20 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                                        {['Architect', 'Interior Designer', 'Contractor', 'Civil Engineer', 'Product Designer', 'Artist'].map(p => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => toggleProfession(p)}
                                                                className={`p-3 rounded-xl text-xs font-bold uppercase tracking-wide text-left flex items-center gap-3 transition-colors ${formData.professionType.includes(p)
                                                                    ? 'bg-orange-50 text-[#FF5722]'
                                                                    : 'hover:bg-slate-50 text-slate-500'
                                                                    }`}
                                                            >
                                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.professionType.includes(p) ? 'bg-[#FF5722] border-[#FF5722]' : 'border-slate-300'
                                                                    }`}>
                                                                    {formData.professionType.includes(p) && <CheckCircle2 size={10} className="text-white" />}
                                                                </div>
                                                                {p}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {formData.professionType.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {formData.professionType.map(p => (
                                                        <span key={p} className="px-3 py-1.5 bg-orange-50 text-[#FF5722] rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                            {p}
                                                            <button type="button" onClick={() => toggleProfession(p)} className="hover:text-red-500"><XCircle size={10} /></button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Years of Experience</label>
                                            <input type="number" placeholder="e.g. 15" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium" />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Services Offered (Select all that apply)</label>

                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setServicesOpen(!servicesOpen)}
                                                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium text-left flex justify-between items-center"
                                            >
                                                <span className={formData.specializations.length === 0 ? "text-slate-400" : "text-slate-900"}>
                                                    {formData.specializations.length === 0 ? "Select Services..." : `${formData.specializations.length} Selected`}
                                                </span>
                                                <ChevronRight size={16} className={`transition-transform ${servicesOpen ? 'rotate-90' : ''}`} />
                                            </button>

                                            {servicesOpen && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-20 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                                    {availableServices.length > 0 ? (
                                                        availableServices.map(s => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => toggleService(s)}
                                                                className={`p-3 rounded-xl text-xs font-bold uppercase tracking-wide text-left flex items-center gap-3 transition-colors ${formData.specializations.includes(s)
                                                                    ? 'bg-orange-50 text-[#FF5722]'
                                                                    : 'hover:bg-slate-50 text-slate-500'
                                                                    }`}
                                                            >
                                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.specializations.includes(s) ? 'bg-[#FF5722] border-[#FF5722]' : 'border-slate-300'
                                                                    }`}>
                                                                    {formData.specializations.includes(s) && <CheckCircle2 size={10} className="text-white" />}
                                                                </div>
                                                                {s}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="col-span-2 text-center py-4 text-slate-400 text-xs font-medium">
                                                            {formData.professionType.length === 0 ? "Please select a Profession Type first" : "No specific services available for selected profession"}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Selected Services Tags */}
                                        {formData.specializations.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {formData.specializations.map(s => (
                                                    <span key={s} className="px-3 py-1.5 bg-orange-50 text-[#FF5722] rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                        {s}
                                                        <button type="button" onClick={() => toggleService(s)} className="hover:text-red-500"><XCircle size={10} /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Qualifications & Certifications</label>
                                        <textarea rows={3} placeholder="e.g. B.Arch, COA Licensed, LEED Certified..." className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium resize-none"></textarea>
                                    </div>
                                </div>
                            )
                        }

                        {/* STEP 3: FIRM INFORMATION */}
                        {
                            step === 3 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="flex items-center gap-4 border-l-4 border-[#FF5722] pl-6">
                                        <Building2 className="text-[#FF5722]" size={24} />
                                        <h3 className="text-2xl font-bold uppercase tracking-tight">Firm / Business <span className="text-slate-400">Information</span></h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Firm / Studio Name</label>
                                            <input type="text" placeholder="e.g. Design Heritage Studio" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Firm Type</label>
                                            <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium">
                                                <option>Individual</option>
                                                <option>Proprietorship</option>
                                                <option>Partnership Firm</option>
                                                <option>Pvt. Ltd. Company</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Year Established</label>
                                            <input type="number" placeholder="e.g. 2010" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Team Size</label>
                                            <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium">
                                                <option>1-5 Members</option>
                                                <option>5-15 Members</option>
                                                <option>15-50 Members</option>
                                                <option>50+ Members</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Office Address</label>
                                        <textarea rows={3} placeholder="Full business address..." className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium resize-none"></textarea>
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Digital Presence</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <input type="url" placeholder="Website URL" className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium" />
                                            </div>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <input type="url" placeholder="Google Business Link" className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {/* STEP 4: PREFERENCES & PRICING */}
                        {
                            step === 4 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="flex items-center gap-4 border-l-4 border-[#FF5722] pl-6">
                                        <Target className="text-[#FF5722]" size={24} />
                                        <h3 className="text-2xl font-bold uppercase tracking-tight">Project <span className="text-slate-400">Preferences</span></h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Minimum Project Budget</label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <input type="text" placeholder="e.g. 5,00,000" className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Availability Status</label>
                                            <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none font-medium">
                                                <option>Available for New Projects</option>
                                                <option>Limited Availability</option>
                                                <option>Busy (Waitlist only)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-8 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consultation & Site Visits</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Consultation Fee</label>
                                                <select className="w-full px-4 py-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none text-sm font-bold">
                                                    <option>Free First Meeting</option>
                                                    <option>Paid Consultation</option>
                                                    <option>Custom Quote</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Quotation Method</label>
                                                <select className="w-full px-4 py-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-[#FF5722] outline-none text-sm font-bold">
                                                    <option>Per Sq. Ft.</option>
                                                    <option>Lump Sum</option>
                                                    <option>Percentage Basis</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Site Visit Available?</label>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, siteVisit: 'Yes' })}
                                                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.siteVisit === 'Yes'
                                                            ? 'bg-[#FF5722] text-white shadow-lg'
                                                            : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        YES
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, siteVisit: 'No' })}
                                                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.siteVisit === 'No'
                                                            ? 'bg-slate-900 text-white shadow-lg'
                                                            : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        NO
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {/* STEP 5: PORTFOLIO SHOWCASE */}
                        {
                            step === 5 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="flex justify-between items-center border-l-4 border-[#FF5722] pl-6">
                                        <div className="flex items-center gap-4">
                                            <ImageIcon className="text-[#FF5722]" size={24} />
                                            <h3 className="text-2xl font-bold uppercase tracking-tight">Portfolio & <span className="text-slate-400">Work Showcase</span></h3>
                                        </div>
                                        <button type="button" className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-[#FF5722] transition-colors shadow-lg">
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                                            <div className="p-2 bg-amber-100 rounded-full text-amber-600"><AlertCircle size={14} /></div>
                                            <div>
                                                <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Requirement: 8 Portfolio Images</p>
                                                <p className="text-xs text-amber-900/70 mt-1">You must upload exactly 8 high-quality images of your best work to proceed. <br /><strong>Format:</strong> JPEG/PNG, <strong>Size:</strong> Max 400KB per image.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {Array(8).fill(0).map((_, i) => (
                                                <div key={i} className="aspect-square relative group">
                                                    {formData.portfolioImages?.[i] ? (
                                                        <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-[#FF5722] relative">
                                                            <img src={formData.portfolioImages[i]} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newPortfolio = [...formData.portfolioImages];
                                                                    newPortfolio[i] = '';
                                                                    setFormData(prev => ({ ...prev, portfolioImages: newPortfolio }));
                                                                }}
                                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <XCircle size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <label className="w-full h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FF5722] hover:bg-orange-50/10 transition-all text-slate-300 hover:text-[#FF5722]">
                                                            <Plus size={24} />
                                                            <span className="text-[9px] font-bold uppercase tracking-widest mt-2">Image {i + 1}</span>
                                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(i, e)} />
                                                        </label>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {formData.portfolioImages?.filter(img => img).length}/8 Uploaded
                                        </p>
                                    </div>

                                    {/* SEPARATOR */}
                                    <div className="border-t-2 border-dashed border-slate-100 my-8"></div>

                                    {/* FEATURED PROJECT SECTION */}
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><FileText size={18} /></div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-900">Featured Project</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Add a case study (Optional)</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Project Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Modern Villa"
                                                        value={formData.projectTitle}
                                                        onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                                                        className="w-full px-5 py-3 bg-white rounded-xl border-none outline-none font-bold text-sm text-slate-900 placeholder:text-slate-300"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Location</label>
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={formData.projectState}
                                                            onChange={(e) => setFormData({ ...formData, projectState: e.target.value, projectCity: '' })}
                                                            className="w-1/2 px-5 py-3 bg-white rounded-xl border-none outline-none font-bold text-sm text-slate-900"
                                                        >
                                                            <option value="">State</option>
                                                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                        <select
                                                            value={formData.projectCity}
                                                            onChange={(e) => setFormData({ ...formData, projectCity: e.target.value })}
                                                            disabled={!formData.projectState}
                                                            className="w-1/2 px-5 py-3 bg-white rounded-xl border-none outline-none font-bold text-sm text-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
                                                        >
                                                            <option value="">{formData.projectState ? 'City' : 'State First'}</option>
                                                            {availableProjectCities.map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Project Description</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Describe the design style, challenges, and outcome..."
                                                    value={formData.projectDescription}
                                                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                                                    className="w-full px-5 py-3 bg-white rounded-xl border-none outline-none font-bold text-sm text-slate-900 placeholder:text-slate-300 resize-none"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {/* STEP 6: VERIFICATION & TRUST */}
                        {
                            step === 6 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="flex items-center gap-4 border-l-4 border-[#FF5722] pl-6">
                                        <ShieldCheck className="text-[#FF5722]" size={24} />
                                        <h3 className="text-2xl font-bold uppercase tracking-tight">Trust & <span className="text-slate-400">Verification</span></h3>
                                    </div>

                                    <div className="bg-[#020617] p-12 rounded-[3.5rem] text-white space-y-10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5722]/20 blur-3xl rounded-full"></div>
                                        <div className="space-y-4">
                                            <h4 className="text-xl font-bold tracking-tight uppercase">Identity <span className="text-[#FF5722]">Verification</span></h4>
                                            <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-widest">Exphouz requires all professionals to upload official documentation for platform credibility.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* PAN Number Input */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">PAN Number</label>
                                                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl group focus-within:border-[#FF5722] transition-all">
                                                    <div className="p-2 bg-white/10 rounded-lg text-[#FF5722]"><FileText size={16} /></div>
                                                    <input
                                                        type="text"
                                                        placeholder="ABCDE1234F"
                                                        maxLength={10}
                                                        value={formData.panNumber}
                                                        onChange={(e) => {
                                                            const val = e.target.value.toUpperCase();
                                                            if (val.length <= 10) {
                                                                setFormData({ ...formData, panNumber: val });
                                                            }
                                                        }}
                                                        className={`bg-transparent border-none outline-none text-white font-bold w-full uppercase placeholder:text-slate-600 ${formData.panNumber && !validatePAN(formData.panNumber) ? 'text-red-400' : ''}`}
                                                        required
                                                    />
                                                    {formData.panNumber && validatePAN(formData.panNumber) && (
                                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                                    )}
                                                </div>
                                                {formData.panNumber && !validatePAN(formData.panNumber) && (
                                                    <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest pl-1">Invalid PAN Format</p>
                                                )}
                                            </div>

                                            {/* Aadhaar Upload */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Aadhaar Card Proof</label>
                                                <label className={`block w-full p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${formData.idProofImage ? 'bg-[#FF5722]/10 border-[#FF5722]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${formData.idProofImage ? 'bg-[#FF5722] text-white' : 'bg-white/10 text-slate-400'}`}>
                                                            <User size={16} />
                                                        </div>
                                                        <div className="flex flex-col text-left">
                                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${formData.idProofImage ? 'text-[#FF5722]' : 'text-slate-300'}`}>
                                                                {formData.idProofImage ? 'Aadhaar Uploaded' : 'Upload Aadhaar Card'}
                                                            </span>
                                                            <span className="text-[9px] text-slate-500 font-medium">Front & Back merged</span>
                                                        </div>
                                                    </div>
                                                    {formData.idProofImage ? <CheckCircle2 size={16} className="text-[#FF5722]" /> : <Plus size={16} className="text-slate-500" />}
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleAadhaarUpload} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Communication Settings</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {[
                                                { icon: <MessageCircle size={18} />, label: 'CHAT FIRST', desc: 'Secure in-app messaging' },
                                                { icon: <Clock size={18} />, label: 'CALL DIRECT', desc: 'Verified mobile number' },
                                                { icon: <Globe size={18} />, label: 'EMAIL LEADS', desc: 'Formal project inquiries' }
                                            ].map(mode => (
                                                <div key={mode.label} className="p-8 border border-slate-100 rounded-[2rem] space-y-4 cursor-pointer hover:border-[#FF5722] transition-all group">
                                                    <div className="text-slate-300 group-hover:text-[#FF5722] transition-colors">{mode.icon}</div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-1">{mode.label}</p>
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{mode.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100/50">
                                        <input type="checkbox" className="mt-1 w-5 h-5 rounded border-amber-300 text-[#FF5722] focus:ring-[#FF5722]" required />
                                        <label className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-loose">
                                            I solemnly declare that the information provided is accurate and I agree to the <span className="text-[#FF5722] underline cursor-pointer">Professional Partnership Terms</span> of Exphouz Platform.
                                        </label>
                                    </div>
                                </div>
                            )
                        }

                        {/* NAVIGATION BUTTONS */}
                        <div className="flex justify-between items-center pt-10 border-t border-slate-50">
                            {step > 1 ? (
                                <button type="button" onClick={prevStep} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                                    <ChevronLeft size={16} /> Previous Section
                                </button>
                            ) : <div></div>}

                            <div className="flex gap-4">
                                <button type="button" className="px-10 py-5 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-900 transition-all">Save as Draft</button>
                                {step < totalSteps ? (
                                    <button type="button" onClick={nextStep} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-[#FF5722] transition-all flex items-center gap-3 group">
                                        Next Section <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button type="submit" className="px-12 py-5 bg-[#FF5722] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-[#FF5722]/30 hover:bg-[#E64A19] transition-all flex items-center gap-3 transform hover:-translate-y-1">
                                        Submit Profile <CheckCircle2 size={24} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </form >
                </div >
            </div >
        </div >
    );
};

export default ProfessionalOnboarding;
