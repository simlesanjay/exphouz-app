import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import LinkedInProvider from "next-auth/providers/linkedin"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
        newUser: "/onboarding",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: true,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: "CLIENT",
                    authProvider: "GOOGLE",
                    emailVerified: new Date(),
                    onboardingCompleted: false,
                }
            },
        }),
        LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID || "",
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: true,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: "PROFESSIONAL", // LinkedIn users likely professionals
                    authProvider: "LINKEDIN",
                    emailVerified: new Date(),
                    onboardingCompleted: false,
                }
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { professionalProfile: true, clientProfile: true }
                });

                if (!user || !user.passwordHash) {
                    throw new Error("Invalid credentials");
                }

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

                if (!isValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                    onboardingCompleted: user.onboardingCompleted,
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub as string
                session.user.role = token.role as Role
                session.user.onboardingCompleted = token.onboardingCompleted as boolean
            }
            return session
        },
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update" && session?.user) {
                // If checking for updating image, ensure it's not huge
                const updatedToken = { ...token, ...session.user };
                if (updatedToken.picture?.startsWith('data:') && updatedToken.picture.length > 2000) {
                    updatedToken.picture = null; // Too large for cookie
                }
                return updatedToken;
            }

            if (user) {
                token.role = user.role
                token.onboardingCompleted = user.onboardingCompleted

                // Prevent huge base64 images from bloating the cookie
                if (user.image?.startsWith('data:')) {
                    token.picture = null;
                    token.image = null; // Ensure we don't carry it over
                }
            }
            return token
        },
    },
}
