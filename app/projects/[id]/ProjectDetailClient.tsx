"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Tag, User, Maximize2, X } from "lucide-react";

export type ProjectDetail = {
    id: string;
    title: string;
    description: string;
    location: string;
    budgetRange: string | null;
    tags: string[];
    videoUrl: string | null;
    category: string;
    professional: {
        id: string;
        name: string;
        image: string;
        firmName: string | null;
    };
    images: {
        id: string;
        url: string;
        caption: string | null;
    }[];
    createdAt: string;
};

export default function ProjectDetailClient({ project }: { project: ProjectDetail }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-white pb-32 pt-24">
            {/* Top Navigation */}
            <div className="max-w-7xl mx-auto px-6 mb-8 mt-8">
                <Link href={`/professionals/${project.professional.id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors text-xs font-black uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to Profile
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* LEFT: Content & Gallery */}
                <div className="lg:col-span-8 space-y-12">
                    <header>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <span className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                {project.category}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <MapPin size={12} /> {project.location}
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6"
                        >
                            {project.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-600 leading-loose font-medium"
                        >
                            {project.description}
                        </motion.p>
                    </header>

                    {/* Gallery Grid */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Project Gallery</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.images.map((img, idx) => (
                                <motion.div
                                    key={img.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`relative group rounded-2xl overflow-hidden cursor-pointer ${idx === 0 ? 'md:col-span-2 aspect-video' : 'aspect-[4/3]'}`}
                                    onClick={() => setSelectedImage(img.url)}
                                >
                                    <img src={img.url} alt={img.caption || "Project Image"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Maximize2 className="text-white drop-shadow-lg" size={32} />
                                    </div>
                                    {img.caption && (
                                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest">
                                            {img.caption}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Professional Card */}
                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] sticky top-32">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Designed By</h3>

                        <div className="flex items-center gap-4 mb-8">
                            <img
                                src={project.professional.image || "/placeholder-user.jpg"}
                                alt={project.professional.name}
                                className="w-16 h-16 rounded-2xl object-cover bg-white shadow-sm border border-slate-100"
                            />
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg leading-tight">{project.professional.name}</h4>
                                <p className="text-xs font-medium text-slate-500">{project.professional.firmName || "Independent Professional"}</p>
                            </div>
                        </div>

                        <Link
                            href={`/professionals/${project.professional.id}`}
                            className="block w-full py-4 bg-slate-900 text-white text-center rounded-xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors shadow-xl"
                        >
                            View Full Profile
                        </Link>

                        <div className="my-8 border-t border-slate-200" />

                        <div className="space-y-4">
                            {project.budgetRange && (
                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Budget</h5>
                                    <p className="font-bold text-slate-900">{project.budgetRange}</p>
                                </div>
                            )}
                            <div>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Date</h5>
                                <p className="font-bold text-slate-900">{new Date(project.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {project.tags.length > 0 && (
                            <div className="mt-8">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Tags</h5>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        alt="Full size"
                    />
                </div>
            )}
        </div>
    );
}
