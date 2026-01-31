import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectDetailClient, { ProjectDetail } from "./ProjectDetailClient";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const projectRaw = await prisma.project.findUnique({
        where: { id },
        include: {
            images: true,
            category: true,
            professional: {
                include: {
                    user: true
                }
            }
        }
    });

    if (!projectRaw) {
        notFound();
    }

    const project: ProjectDetail = {
        id: projectRaw.id,
        title: projectRaw.title,
        description: projectRaw.description || "",
        location: projectRaw.location || "Location N/A",
        budgetRange: projectRaw.budgetRange,
        tags: projectRaw.tags,
        videoUrl: projectRaw.videoUrl,
        category: projectRaw.category ? projectRaw.category.name : "Portfolio Item",
        professional: {
            id: projectRaw.professional.id,
            name: projectRaw.professional.displayName || projectRaw.professional.user.name || "Professional",
            image: projectRaw.professional.profileImage || projectRaw.professional.user.image || "",
            firmName: projectRaw.professional.firmName
        },
        images: projectRaw.images.map((img: any) => ({
            id: img.id,
            url: img.url,
            caption: img.caption
        })),
        createdAt: projectRaw.createdAt.toISOString()
    };

    return <ProjectDetailClient project={project} />;
}
