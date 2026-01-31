import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfessionalDetailsClient, { ProfessionalDetails } from "./ProfessionalDetailsClient";

export const dynamic = "force-dynamic";

export default async function ProfessionalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch professional from database with all relations
    const proRaw = await prisma.professionalProfile.findUnique({
        where: { id },
        include: {
            user: true,
            // Fetch services and their sub-category names
            services: {
                include: {
                    subCategory: true
                }
            },
            // Fetch portfolio projects
            projects: {
                include: {
                    images: true,
                    category: true
                },
                orderBy: { createdAt: 'desc' },
                take: 10 // Increased limit for detailed view
            }
        }
    });

    if (!proRaw) {
        notFound();
    }

    // Map projects to format expected by client component
    const portfolioProjects = proRaw.projects.map((p: any) => {
        // Collect all image URLs
        const images = p.images.map((img: any) => img.url);
        if (images.length === 0) {
            images.push("/images/placeholder.jpg");
        }

        return {
            id: p.id,
            title: p.title,
            description: p.description || "",
            images: images,
            category: p.category ? p.category.name : "Uncategorized",
            location: p.location || "Location N/A",
            budgetRange: p.budgetRange || "On Request"
        };
    });

    // Determine profile cover image (use first project cover or placeholder)
    // Try to find a project with an explicit cover image, else use first image of first project
    let profileCover = "";
    if (proRaw.projects.length > 0) {
        // Just pick the first image of the first project for now as cover background
        const firstProj = proRaw.projects[0];
        if (firstProj.images.length > 0) profileCover = firstProj.images[0].url;
    }
    if (!profileCover) profileCover = "/images/blog1.jpg";


    // Map profile data to ProfessionalDetails interface
    const pro: ProfessionalDetails = {
        id: proRaw.id,
        displayName: proRaw.displayName || proRaw.user.name || "Professional",
        fullName: proRaw.user.name || "",
        profilePhoto: proRaw.profileImage || proRaw.user.image || "/images/placeholder.jpg",
        // Profession is stored in 'profession' field
        profession: proRaw.profession || ["Design Professional"],
        location: [proRaw.city, proRaw.state].filter(Boolean).join(", ") || "Location N/A",
        // Calculate experience string
        experience: proRaw.experienceYears ? proRaw.experienceYears.toString() : "0",
        rating: proRaw.rating || 0,
        reviewsCount: proRaw.reviewCount || 0,
        // Map services to string array
        services: proRaw.services.map((s: any) => s.subCategory.name),
        specialization: proRaw.specialization || [],
        portfolio: portfolioProjects,
        startingPrice: proRaw.startingPrice ? `₹${proRaw.startingPrice.toLocaleString()}` : "On Request",
        isVerified: proRaw.verificationStatus === "VERIFIED",
        about: proRaw.shortBio || "",
        website: proRaw.website || "",
        portfolioImages: proRaw.portfolioImages || []
    };

    return <ProfessionalDetailsClient pro={pro} />;
}
