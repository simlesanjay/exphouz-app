"use client";

import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                alert("Failed to send reset link.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                        <KeyRound size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Forgot Password?</h1>
                    <p className="text-slate-500 text-sm font-medium">No worries, we'll send you reset instructions.</p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-200 outline-none font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : "Send Reset Link"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm font-bold border border-green-100">
                            Check your email! We sent a reset link to <span className="underline">{email}</span>.
                        </div>
                        <p className="text-xs text-slate-400">
                            Did not receive the email? Check your spam folder or try again.
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="text-orange-600 font-bold text-xs hover:underline uppercase tracking-wide"
                        >
                            Try another email
                        </button>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 font-bold text-xs hover:text-slate-900 transition-colors uppercase tracking-widest">
                        <ArrowLeft size={14} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
