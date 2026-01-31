"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type ProfessionalWithDetails = Prisma.ProfessionalProfileGetPayload<{
    include: {
        user: {
            select: { name: true; image: true };
        };
        services: {
            include: {
                subCategory: true;
            };
        };
        projects: {
            select: {
                images: {
                    where: { isCover: true };
                    take: 1;
                };
            };
            take: 1;
        };
    };
}>;

export async function getProfessionals({
    query,
    tag,
}: {
    query?: string;
    tag?: string;
}) {
    try {
        const where: Prisma.ProfessionalProfileWhereInput = {
            verificationStatus: "VERIFIED", // Only verified pros
            isActive: true,
        };

        // 1. Search Filter
        if (query) {
            where.OR = [
                { displayName: { contains: query, mode: "insensitive" } },
                { profession: { has: query } },
                { city: { contains: query, mode: "insensitive" } },
                { user: { name: { contains: query, mode: "insensitive" } } },
                { firmName: { contains: query, mode: "insensitive" } },
            ];
        }

        // 2. Tag Filter (Service SubCategory)
        if (tag && tag !== "All") {
            where.services = {
                some: {
                    subCategory: {
                        name: { equals: tag, mode: "insensitive" },
                    },
                },
            };
        }

        // 3. Fetch Data
        const professionals = await prisma.professionalProfile.findMany({
            where,
            include: {
                user: {
                    select: { name: true, image: true },
                },
                services: {
                    include: {
                        subCategory: true,
                    },
                },
                projects: {
                    take: 1, // Take one project to get a cover image potentially
                    include: {
                        images: {
                            where: { isCover: true },
                            take: 1,
                        },
                    },
                },
            },
            orderBy: [
                { rating: "desc" }, // Secondary sort by default
            ],
        });

        // 4. Custom Sort (Premium First)
        // Map plan to weight: Premium = 3, Pro = 2, Free/Null = 1
        const getWeight = (plan: string | null) => {
            const p = plan?.toLowerCase();
            if (p === "premium") return 3;
            if (p === "pro") return 2;
            return 1;
        };

        const sorted = professionals.sort((a, b) => {
            const weightA = getWeight(a.subscriptionPlan);
            const weightB = getWeight(b.subscriptionPlan);
            return weightB - weightA; // Descending
        });

        return { success: true, data: sorted };
    } catch (error) {
        console.error("Error fetching professionals:", error);
        return { success: false, error: "Failed to fetch professionals" };
    }
}

export async function getAllTags() {
    try {
        const subCategories = await prisma.subCategory.findMany({
            select: { name: true },
            distinct: ['name']
        });
        return ["All", ...subCategories.map(s => s.name)];
    } catch (error) {
        return ["All"];
    }
}

export async function contactExpert(
    professionalId: string,
    formData: {
        name: string;
        phone: string;
        email: string;
        message: string;
    },
    userId?: string // Optional: if logged in
) {
    try {
        if (!professionalId) throw new Error("Professional ID is required");

        // 1. Get Professional's User ID (to link conversation)
        const pro = await prisma.professionalProfile.findUnique({
            where: { id: professionalId },
            include: { user: true }
        });

        if (!pro) throw new Error("Professional not found");

        // 2. Identify Client (Logged in User or Guest handling - for now we require login or store as meta)
        // If userId is provided, we link it to a ClientProfile
        let clientId = null;
        if (userId) {
            const client = await prisma.clientProfile.findUnique({
                where: { userId: userId }
            });
            clientId = client?.id;
        }

        // For this implementation, we will assume if no client ID, we might not be able to create a linked conversation easily
        // BUT strict requirement wasn't given to fail if not logged in, but the schema requires clientId for Conversation.
        // If Guest: We might need to create a temporary user or just handle it differently.
        // Let's assume for now the user MUST be logged in as a Client to contact (standard practice).

        if (!clientId) {
            // Check if we can find client by userId if not found above (maybe they didn't finish onboarding)
            // or return error
            return { success: false, error: "You must be logged in as a client to contact experts." };
        }

        // 3. Create or Find Conversation
        // Check if existing conversation exists
        let conversation = await prisma.conversation.findFirst({
            where: {
                clientId: clientId,
                professionalId: professionalId,
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    clientId: clientId,
                    professionalId: professionalId,
                }
            });
        }

        // 4. Create Message
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: userId!, // Client User ID
                content: `[Enquiry Form]\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\nMessage: ${formData.message}`,
            }
        });

        // 5. Increment enquiry count
        await prisma.professionalProfile.update({
            where: { id: professionalId },
            data: { enquiryCount: { increment: 1 } }
        });

        return { success: true };
    } catch (error) {
        console.error("Contact Expert Error:", error);
        return { success: false, error: "Failed to send message" };
    }
}
