"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateClientProfile(userId: string, data: any) {
    try {
        if (!userId) throw new Error("User ID is required");

        // Update User Model (for shared fields)
        await db.user.update({
            where: { id: userId },
            data: {
                name: data.fullName,
                image: data.profilePhoto,
                onboardingCompleted: true,
            }
        });

        // Update or Create Client Profile
        const profile = await db.clientProfile.upsert({
            where: { userId: userId },
            create: {
                userId: userId,
                profileImage: data.profilePhoto,
                city: data.city,
                state: data.state,
                country: data.country,
                pinCode: data.pinCode,
                preferredLanguage: data.preferredLanguage,
                timeZone: data.timeZone,
            },
            update: {
                profileImage: data.profilePhoto,
                city: data.city,
                state: data.state,
                country: data.country,
                pinCode: data.pinCode,
                preferredLanguage: data.preferredLanguage,
                timeZone: data.timeZone,
            }
        });

        revalidatePath('/');
        return { success: true, profile };
    } catch (error) {
        console.error("Error updating client profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}
