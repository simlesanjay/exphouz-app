"use client";

import React, { useState } from "react";
import { CheckCircle2, User, PenTool, ArrowRight, Loader2, ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
// import { toast } from "sonner"; 

// Define Schema
const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["client", "pro"]),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<"DETAILS" | "OTP">("DETAILS");
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [verifyingOtp, setVerifyingOtp] = useState(false); // To track OTP verification state

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            role: "client",
        },
    });

    const { getValues, setValue, watch, trigger } = form; // Added trigger
    const role = watch("role");
    const email = watch("email");

    const onDetailsSubmit = async () => {
        // Validate details step first
        const isValid = await trigger(["name", "email", "phone", "password", "confirmPassword", "role"]);
        if (!isValid) return;

        setLoading(true);
        try {
            // Send OTP
            const response = await fetch("/api/v1/auth/otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: getValues("email") }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Using alert if toast is not available, prefer toast
                alert(data.error || "Failed to send OTP");
                return;
            }

            setStep("OTP");
        } catch (error) {
            console.error("OTP Error:", error);
            alert("Something went wrong while sending OTP.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtpAndRegister = async () => {
        if (otp.length !== 6) {
            alert("Please enter a valid 6-digit OTP");
            return;
        }

        setVerifyingOtp(true); // Start loading state for verify
        try {
            // 1. Verify OTP
            const verifyRes = await fetch("/api/v1/auth/otp", {
                method: "PUT", // Using PUT for verification as per implementation plan
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: getValues("email"), otp }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
                alert(verifyData.error || "Invalid OTP");
                setVerifyingOtp(false);
                return;
            }

            // 2. Register
            const values = getValues();
            const registerRes = await fetch("/api/v1/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "register",
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: values.role === "pro" ? "PROFESSIONAL" : "CLIENT",
                    phone: values.phone,
                }),
            });

            const registerData = await registerRes.json();

            if (!registerRes.ok) {
                alert(registerData.error || "Registration failed");
                setVerifyingOtp(false);
                return;
            }

            // 3. Auto Login
            const loginResult = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            });

            if (loginResult?.ok) {
                router.push("/onboarding");
            } else {
                router.push("/login");
            }

        } catch (error) {
            console.error("Registration Error:", error);
            alert("An error occurred during registration.");
            setVerifyingOtp(false);
        }
        // No finally block to stop loading here because we redirect on success,
        // and if error we handled it above.
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 pt-32">
            <div className="max-w-6xl w-full grid lg:grid-cols-12 bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100 min-h-[600px]">

                {/* LEFT PANEL */}
                <div className={`lg:col-span-5 p-12 text-white flex flex-col justify-center relative transition-colors duration-500 ${role === 'pro' ? 'bg-orange-900' : 'bg-slate-900'}`}>
                    <div className="relative z-10">
                        <h2 className="text-4xl mb-6 leading-tight">
                            New to <span className="font-black">Exphouz?</span>
                        </h2>
                        <h3 className="text-xl font-bold mb-8 opacity-90">
                            {role === 'pro' ? 'Join as a Professional' : 'Create a Client Account'}
                        </h3>

                        <p className="text-sm leading-relaxed opacity-80 mb-8 font-medium">
                            {role === 'pro'
                                ? "Log in to manage your profile, respond to enquiries, and grow your business."
                                : "Log in to post requirements, connect with professionals, and manage your projects."}
                        </p>

                        <ul className="space-y-4">
                            {role === 'pro' ? (
                                <>
                                    <li className="flex gap-4 text-xs font-bold uppercase tracking-wider text-white/90"><CheckCircle2 size={16} /> Explore Business Leads</li>
                                    <li className="flex gap-4 text-xs font-bold uppercase tracking-wider text-white/90"><CheckCircle2 size={16} /> Unlimited Project Uploads</li>
                                </>
                            ) : (
                                <>
                                    <li className="flex gap-4 text-xs font-bold uppercase tracking-wider text-white/90"><CheckCircle2 size={16} /> Discover Premium Experts</li>
                                    <li className="flex gap-4 text-xs font-bold uppercase tracking-wider text-white/90"><CheckCircle2 size={16} /> Build dream project</li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>

                {/* RIGHT PANEL (Form) */}
                <div className="lg:col-span-7 p-8 md:p-12 overflow-y-auto">
                    {step === "DETAILS" ? (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-100 pb-6 gap-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
                                </div>

                                <div className="bg-slate-100 p-1 rounded-full flex shrink-0">
                                    <button
                                        onClick={() => setValue("role", "client")}
                                        className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${role === "client" ? "bg-white shadow-md text-slate-900" : "text-slate-400"}`}
                                        type="button"
                                    >
                                        <User size={14} /> Client
                                    </button>
                                    <button
                                        onClick={() => setValue("role", "pro")}
                                        className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${role === "pro" ? "bg-white shadow-md text-orange-600" : "text-slate-400"}`}
                                        type="button"
                                    >
                                        <PenTool size={14} /> Pro
                                    </button>
                                </div>
                            </div>

                            <Form {...form}>
                                <form onSubmit={(e) => { e.preventDefault(); onDetailsSubmit(); }} className="space-y-5 max-w-lg">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <input {...field} placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600/50" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <input {...field} placeholder="Email Address" type="email" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600/50" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <input {...field} placeholder="Mobile Number" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600/50" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <input {...field} placeholder="Password" type="password" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600/50" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <input {...field} placeholder="Confirm Password" type="password" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600/50" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all mb-6 shadow-xl active:scale-95 flex items-center justify-center gap-2 ${role === 'pro' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : "Continue to Verify"} <ArrowRight size={16} />
                                    </button>

                                    <p className="text-center text-xs text-slate-500 font-medium">
                                        Already have an account? <Link href="/login" className="text-orange-600 font-bold hover:underline">Log In</Link>
                                    </p>
                                </form>
                            </Form>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-10 space-y-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <Mail className="text-blue-600" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">Verify your Email</h2>
                            <p className="text-slate-500 text-center max-w-sm">
                                We've sent a 6-digit code to <span className="font-bold text-slate-700">{email}</span>. Please enter it below to confirm your account.
                            </p>

                            <div className="w-full max-w-xs space-y-4">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    className="w-full text-center text-3xl tracking-[0.5em] font-bold p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    maxLength={6}
                                />
                                <button
                                    onClick={verifyOtpAndRegister}
                                    disabled={verifyingOtp}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    {verifyingOtp ? <Loader2 className="animate-spin" size={18} /> : "Verify & Create Account"}
                                </button>

                                <button
                                    onClick={() => setStep("DETAILS")}
                                    className="w-full py-2 text-slate-400 font-bold text-xs hover:text-slate-600 flex items-center justify-center gap-2"
                                    type="button"
                                >
                                    <ArrowLeft size={14} /> Back to Details
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

