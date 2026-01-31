"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/login");
            return;
        }

        if (session.user.role === "PROFESSIONAL") {
            router.push("/onboarding/professional");
        } else if (session.user.role === "CLIENT") {
            if (session.user.onboardingCompleted) {
                router.push("/dashboard/client");
            } else {
                router.push("/onboarding/client");
            }
        } else {
            router.push("/");
        }
    }, [session, status, router]);

    return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-600 rounded-full mb-4"></div>
                <p className="text-slate-500 font-medium">Setting up your profile...</p>
            </div>
        </div>
    );
}
