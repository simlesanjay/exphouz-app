"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from "next-auth/react";
import { User, ShieldCheck, Mail, Lock, ArrowRight, Linkedin } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from 'next/link';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Loader2 } from 'lucide-react';

enum UserRole {
    CLIENT = 'CLIENT',
    PROFESSIONAL = 'PROFESSIONAL'
}

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Auth: React.FC = () => {
    const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setLoading(false);
            } else {
                // Successful login - fetch session to check role
                const session = await getSession();
                router.refresh();

                // If user tried to login with a specific role toggle but their account is different,
                // we should probably respect their actual account role or the dashboard they are trying to access.
                // For now, redirect based on the role in the session if available, or fallback to the toggle.

                // Note: session.user.role might not be immediately available if not customized in auth options,
                // but assuming it is based on previous code context.
                // Using the toggle role as a hint for where they probably want to go if session role isn't distinct.

                if (session?.user?.role === 'PROFESSIONAL') {
                    router.push("/dashboard/professional");
                } else if (session?.user?.role === 'CLIENT') {
                    router.push("/dashboard/client");
                } else {
                    // Fallback based on toggle
                    if (role === UserRole.PROFESSIONAL) {
                        router.push("/dashboard/professional");
                    } else {
                        router.push("/dashboard/client");
                    }
                }
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        signIn(provider, { callbackUrl: role === UserRole.PROFESSIONAL ? '/onboarding/professional' : '/dashboard/client' });
    };

    return (
        <div className="min-h-[90vh] flex bg-slate-50 overflow-hidden pt-20">
            {/* Left side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative z-10">
                <div className="max-w-md w-full space-y-10 bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold">
                            Welcome Back
                        </h1>
                        <p className="text-slate-500">
                            Log in to access your dashboard and manage your projects.
                        </p>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex p-1 bg-slate-50 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setRole(UserRole.CLIENT)}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === UserRole.CLIENT ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            For Homeowners
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole(UserRole.PROFESSIONAL)}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === UserRole.PROFESSIONAL ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            For Professionals
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            {error}
                        </div>
                    )}

                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <FormControl>
                                                <input
                                                    {...field}
                                                    type="email"
                                                    placeholder="name@domain.com"
                                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Password</label>
                                            <Link href="/forgot-password" className="text-[10px] font-bold text-amber-600 uppercase tracking-widest hover:underline">Forgot?</Link>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <FormControl>
                                                <input
                                                    {...field}
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-[#FF5722] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-xs"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : `Login as ${role.toLowerCase()}`}
                                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    </Form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400"><span className="bg-white px-4">Or continue with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors font-bold text-[10px] tracking-widest uppercase"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('linkedin')}
                            className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors font-bold text-[10px] tracking-widest uppercase"
                        >
                            <Linkedin className="text-[#0077b5]" size={18} fill="currentColor" />
                            LinkedIn
                        </button>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                        New to Exphouz?
                        <Link
                            href="/register"
                            className="text-amber-600 font-bold hover:underline ml-1"
                        >
                            Create an Account
                        </Link>
                    </p>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        Secure login with encrypted credentials
                    </div>
                </div>
            </div>

            {/* Right side - Visual */}
            <div className="hidden lg:block w-1/2 relative bg-slate-900">
                <img
                    src={role === UserRole.CLIENT
                        ? "/images/cover5.jpg"
                        : "/images/auth_pro.jpg"
                    }
                    alt="Auth Visual"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center p-24">
                    <div className="space-y-8 max-w-lg">
                        <h2 className="text-6xl font-bold text-white leading-tight underline decoration-[#FF5722] underline-offset-8">
                            {role === UserRole.CLIENT
                                ? 'Your vision, expertly guided.'
                                : 'Professional Access.'}
                        </h2>
                        <p className="text-xl text-slate-300 leading-relaxed font-light">
                            {role === UserRole.CLIENT
                                ? 'Access a curated network of India\'s finest professionals. From concept to reality, we are with you.'
                                : 'Log in to manage your profile, respond to enquiries, and grow your business.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
