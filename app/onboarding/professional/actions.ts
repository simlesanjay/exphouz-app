"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUserDetails() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;
    return await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { name: true, email: true, mobile: true }
    });
}

export async function updateProfessionalProfile(formData: any) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const userId = session.user.id;

        // Upsert Professional Profile
        await prisma.professionalProfile.upsert({
            where: { userId: userId },
            update: {
                // profileImage is handled by the user model usually, but if we want specific professional image:
                profileImage: formData.profileImage,
                city: formData.city,
                state: formData.state,
                pinCode: formData.pinCode,
                languages: formData.languages ? formData.languages.split(',').map((l: string) => l.trim()) : [],
                profession: formData.professionType || [],
                experienceYears: parseInt(formData.experience) || 0,
                specialization: formData.specializations || [],
                qualifications: formData.education,
                gstNumber: formData.gst,
                firmName: formData.firmName,
                firmType: formData.firmType,
                teamSize: parseInt(formData.teamSize?.split('-')[0]) || 1, // simplified logic
                website: formData.website,
                budgetMin: parseFloat(formData.minBudget?.replace(/,/g, '')) || 0,
                // budgetMax handled if needed
                portfolioImages: formData.portfolioImages || [], // Save the array of images
                verificationStatus: "PENDING",
                idProofImage: formData.idProofImage, // Added
                siteVisit: formData.siteVisit === 'Yes'
            },
            create: {
                userId: userId,
                profileImage: formData.profileImage,
                city: formData.city,
                state: formData.state,
                pinCode: formData.pinCode,
                languages: formData.languages ? formData.languages.split(',').map((l: string) => l.trim()) : [],
                profession: formData.professionType || [],
                experienceYears: parseInt(formData.experience) || 0,
                specialization: formData.specializations || [],
                qualifications: formData.education,
                gstNumber: formData.gst,
                panNumber: formData.panNumber,
                firmName: formData.firmName,
                firmType: formData.firmType,
                teamSize: parseInt(formData.teamSize?.split('-')[0]) || 1,
                website: formData.website,
                budgetMin: parseFloat(formData.minBudget?.replace(/,/g, '')) || 0,
                portfolioImages: formData.portfolioImages || [],
                verificationStatus: "PENDING",
                idProofImage: formData.idProofImage,
                siteVisit: formData.siteVisit === 'Yes'
            }
        });

        // Create Featured Project if details are provided
        if (formData.projectTitle && formData.projectLocation) {
            await prisma.project.create({
                data: {
                    professionalId: (await prisma.professionalProfile.findUnique({ where: { userId } }))?.id!,
                    title: formData.projectTitle,
                    description: formData.projectDescription || '',
                    location: formData.projectLocation || 'Unknown',
                    budgetRange: 'On Request', // Default as per onboarding form simplicity
                    images: {
                        create: {
                            // If they provided project images separate from portfolio, we'd use them.
                            // Since the form doesn't explicitly have separate project images yet (just the 8 portfolio ones),
                            // we'll assume the project might use some or leave it empty for now, or just create the project record.
                            // The user requested distinguishing them, so let's just create the RECORD for the case study.
                            // If they want images specific to THIS project, we'd need another upload field.
                            // For this iteration, we create the project text record.
                            url: "/images/hero.jpg" // Local placeholder cover
                        }
                    }
                }
            });
        }

        // Mark user onboarding as complete
        await prisma.user.update({
            where: { id: userId },
            data: { onboardingCompleted: true }
        });

        revalidatePath("/dashboard/professional");
        return { success: true };
    } catch (error) {
        console.error("Update Professional Profile Error:", error);
        return { success: false, error: "Failed to save profile" };
    }
}
