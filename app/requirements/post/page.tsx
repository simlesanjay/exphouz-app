"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building, Home, Paintbrush, DollarSign, Calendar, CheckCircle, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PROJECT_TYPES = [
    { id: 'residential', label: 'Residential', icon: Home },
    { id: 'commercial', label: 'Commercial', icon: Building },
    { id: 'interior', label: 'Interior Design', icon: Paintbrush },
];
import { INDIAN_LOCATIONS, INDIAN_STATES } from '@/lib/constants';

export default function PostRequirementPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        type: '',
        budget: '',
        timeline: '',
        description: '',
        location_state: '',
        location_city: '',
    });

    const availableCities = formData.location_state ? INDIAN_LOCATIONS[formData.location_state] || [] : [];

    const handleNext = async () => {
        setError("");
        if (step === 2) {
            // Submit Requirement
            // Basic Validation
            if (!formData.budget || !formData.timeline || !formData.location_city || !formData.location_state || !formData.description) {
                setError("Please fill in all details.");
                return;
            }

            setIsSubmitting(true);
            try {
                const res = await fetch("/api/v1/requirements", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...formData,
                        title: PROJECT_TYPES.find(t => t.id === formData.type)?.label + " Project" || "New Requirement"
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to post requirement");
                }

                setStep(s => s + 1);
            } catch (err: any) {
                console.error("Post Requirement Error:", err);
                setError(err.message || "Something went wrong. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            console.log("Step 1 -> 2 check:", formData.type);
            if (step === 1 && !formData.type) {
                setError("Please select a project type.");
                return;
            }
            setStep(s => s + 1);
        }
    };

    const handleBack = () => {
        setError("");
        setStep(s => s - 1);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-24">
            {/* Progress Header */}
            <div className="w-full bg-white border-b border-slate-100 py-6 px-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-400" />
                        </Link>
                        <h1 className="text-sm font-black uppercase tracking-widest text-slate-900">Post a Requirement</h1>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1 w-12 rounded-full transition-colors ${i <= step ? 'bg-orange-600' : 'bg-slate-200'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-100 p-10 md:p-16"
                >
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-medium mb-4">What connects you to reliable experts?</h2>
                                <p className="text-slate-400">Select the type of project you are planning.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {PROJECT_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setFormData({ ...formData, type: type.id })}
                                        className={`flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 transition-all duration-300 group
                                    ${formData.type === type.id
                                                ? 'border-orange-500 bg-orange-50/50'
                                                : 'border-slate-100 hover:border-orange-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className={`p-4 rounded-full ${formData.type === type.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-orange-500'} transition-colors`}>
                                            <type.icon size={32} />
                                        </div>
                                        <span className={`font-bold uppercase tracking-widest text-xs ${formData.type === type.id ? 'text-orange-900' : 'text-slate-500'}`}>
                                            {type.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-medium mb-4">Project Details</h2>
                                <p className="text-slate-400">Tell us about your budget and timeline.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Budget */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Budget Range</label>
                                        <div className="relative">
                                            <motion.div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <select
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 appearance-none font-medium text-slate-700"
                                                value={formData.budget}
                                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                            >
                                                <option value="">Select Range</option>
                                                <option value="low">Under ₹5 Lakhs</option>
                                                <option value="mid">₹5L - ₹20L</option>
                                                <option value="high">₹20L - ₹50L</option>
                                                <option value="luxury">₹50L+</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Timeline</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <select
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 appearance-none font-medium text-slate-700"
                                                value={formData.timeline}
                                                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                            >
                                                <option value="">Start Date</option>
                                                <option value="immediate">Immediately</option>
                                                <option value="1month">Within 1 Month</option>
                                                <option value="flexible">Flexible</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Location (New) */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Location</label>
                                    <div className="flex gap-4">
                                        <div className="w-1/2 relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <select
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 appearance-none font-medium text-slate-700"
                                                value={formData.location_state}
                                                onChange={(e) => setFormData({ ...formData, location_state: e.target.value, location_city: '' })}
                                            >
                                                <option value="">Select State</option>
                                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="w-1/2 relative">
                                            <select
                                                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 appearance-none font-medium text-slate-700 disabled:bg-slate-100 disabled:text-slate-400"
                                                value={formData.location_city}
                                                onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                                                disabled={!formData.location_state}
                                            >
                                                <option value="">{formData.location_state ? 'Select City' : 'State First'}</option>
                                                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>


                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
                                    <textarea
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium text-slate-700 min-h-[120px]"
                                        placeholder="Describe your project vision..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={48} />
                            </div>
                            <h2 className="text-3xl font-medium mb-4 text-slate-900">Request Posted!</h2>
                            <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
                                Your requirement has been shared with our network of top-tier professionals. Expect to hear from verified experts soon.
                            </p>
                            <div className="flex flex-col md:flex-row justify-center gap-4">
                                <Link href="/requirements" className="inline-block border border-slate-200 text-slate-900 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-all">
                                    View Requests
                                </Link>
                                <Link href="/" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-600 transition-all">
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {step < 3 && (
                        <div className="flex justify-between mt-12 pt-8 border-t border-slate-50">
                            <button
                                onClick={handleBack}
                                disabled={step === 1 || isSubmitting}
                                className={`text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-orange-500 transition-colors ${step === 1 ? 'opacity-0' : 'opacity-100'}`}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>Processing <Loader2 className="animate-spin w-4 h-4" /></>
                                ) : (
                                    <>{step === 2 ? 'Submit Request' : 'Next Step'} <ArrowRight size={16} /></>
                                )}
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
