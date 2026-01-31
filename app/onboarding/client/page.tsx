"use client";

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateClientProfile } from "./actions";
import { Upload, MapPin, Globe, Clock, User as UserIcon, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

import { INDIAN_LOCATIONS, INDIAN_STATES } from '@/lib/constants';

export default function ClientOnboardingPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: session?.user?.name || '',
        city: '',
        state: '',
        country: 'India',
        pin_code: '',
        language: 'English',
        timezone: 'IST',
        profile_photo: session?.user?.image || ''
    });

    // Sync with session if it loads later
    React.useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                full_name: session.user.name || '',
                profile_photo: session.user.image || ''
            }));
        }
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'state') {
            // Reset city when state changes
            setFormData(prev => ({ ...prev, state: value, city: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const sizeKB = file.size / 1024;
            if (sizeKB > 400) {
                alert(`Image size must be less than 400KB. Your file is ${Math.round(sizeKB)}KB.`);
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profile_photo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!session?.user?.id) return;

            const result = await updateClientProfile(session.user.id, {
                fullName: formData.full_name,
                profilePhoto: formData.profile_photo,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                pinCode: formData.pin_code,
                preferredLanguage: formData.language,
                timeZone: formData.timezone
            });

            if (result.success) {
                await update(); // Update session
                router.push('/dashboard/client');
            } else {
                alert("Failed to save profile. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    // Derived cities based on state
    const availableCities = formData.state ? INDIAN_LOCATIONS[formData.state] || [] : [];

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome to <span className="text-orange-600">Exphouz</span></h1>
                    <p className="text-slate-500 font-medium">Let's set up your client profile to get started.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Section 1: Personal Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                            <UserIcon size={14} /> Basic Information
                        </div>

                        <div className="flex flex-col items-center mb-6">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 group-hover:border-orange-200 transition-all">
                                    {formData.profile_photo ? (
                                        <img src={formData.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <UserIcon size={32} />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-slate-100 cursor-pointer hover:bg-orange-50 transition-colors">
                                    <Upload size={14} className="text-orange-500" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                </label>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">
                                Upload Photo (Max 400KB)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                            <input
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                type="text"
                                required
                                className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none font-medium focus:ring-2 focus:ring-orange-200 outline-none"
                            />
                        </div>

                        {/* Read Only Contact */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2 opacity-60">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email</label>
                                <div className="w-full px-5 py-3 rounded-2xl bg-slate-100 border-none font-bold text-slate-600">
                                    {session?.user?.email || 'Loading...'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Location */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                            <MapPin size={14} /> Location Details
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">State</label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none font-medium focus:ring-2 focus:ring-orange-200 outline-none"
                                >
                                    <option value="">Select State</option>
                                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">City</label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.state}
                                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none font-medium focus:ring-2 focus:ring-orange-200 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                                >
                                    <option value="">{formData.state ? 'Select City' : 'Select State First'}</option>
                                    {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Country</label>
                                <input name="country" value={formData.country} onChange={handleChange} type="text" readOnly className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none font-medium focus:ring-2 focus:ring-orange-200 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pin Code</label>
                                <input name="pin_code" value={formData.pin_code} onChange={handleChange} type="text" required className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none font-medium focus:ring-2 focus:ring-orange-200 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Preferences */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                            <Globe size={14} /> Preferences
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Language</label>
                                <select name="language" value={formData.language} onChange={handleChange} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none font-medium focus:ring-2 focus:ring-orange-200 outline-none">
                                    <option>English</option>
                                    <option>Hindi</option>
                                    <option>Gujarati</option>
                                    <option>Marathi</option>
                                    <option>Tamil</option>
                                    <option>Telugu</option>
                                    <option>Kannada</option>
                                    <option>Bengali</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Time Zone</label>
                                <select name="timezone" value={formData.timezone} onChange={handleChange} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none font-medium focus:ring-2 focus:ring-orange-200 outline-none">
                                    <option>IST (GMT+5:30)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Complete Profile'} <CheckCircle2 size={20} />
                    </button>

                </form>
            </div>
        </div>
    );
}

