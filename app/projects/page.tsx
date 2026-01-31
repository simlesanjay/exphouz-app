"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, Filter, ArrowRight } from "lucide-react";

interface Project {
    id: string;
    title: string;
    location: string;
    description: string;
    images: { url: string; caption: string; isCover: boolean }[];
    category: { name: string } | null;
    professional: {
        id: string;
        user: {
            name: string;
            image?: string;
        };
        firmName?: string;
    };
    views?: number; // Mock data for now
}

// Define the shape of a gallery item (individual image)
interface GalleryItem {
    id: string; // Unique combination of project ID + image index or URL
    imageUrl: string;
    caption: string;
    projectTitle: string;
    professionalId: string;
    professionalName: string;
    professionalImage?: string;
    categoryName: string; // The project category, used as fallback
}

export default function ProjectGallery() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const categories = [
        "All",
        "Lounge room",
        "Kitchen",
        "Bedroom",
        "Bathroom",
        "Garden space",
        "Foyer",
        "Verandah",
        "Dining",
        "Office",
        "Wardrobe"
    ];

    useEffect(() => {
        fetchProjects();
    }, []);

    // Flatten projects into gallery items based on selection
    useEffect(() => {
        if (!projects.length) return;

        let items: GalleryItem[] = [];

        projects.forEach(project => {
            // Filter images based on selected category
            const relevantImages = project.images.filter(img => {
                if (selectedCategory === "All") {
                    // Include if the caption is one of our known categories (or basic filtering)
                    return categories.includes(img.caption) || img.caption;
                } else {
                    return img.caption === selectedCategory;
                }
            });

            relevantImages.forEach((img, idx) => {
                items.push({
                    id: `${project.id}-${idx}`,
                    imageUrl: img.url,
                    caption: img.caption || project.category?.name || "Design",
                    projectTitle: project.title,
                    professionalId: project.professional.id,
                    professionalName: project.professional.user.name,
                    professionalImage: project.professional.user.image,
                    categoryName: project.category?.name || "Design"
                });
            });
        });

        setGalleryItems(items);
    }, [selectedCategory, projects]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/v1/projects");
            const data = await res.json();
            if (data.success) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-4">
                        Design <span className="text-orange-600">Ideas</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-widest max-w-2xl mx-auto">
                        Explore thousands of inspiring interiors and architectural masterpieces.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
                {/* Sidebar - Desktop */}
                <aside className="hidden md:block w-64 shrink-0 space-y-8">
                    <div className="sticky top-32">
                        <div className="flex items-center gap-2 mb-6 text-slate-900">
                            <Filter size={18} />
                            <h3 className="text-sm font-bold uppercase tracking-widest">Filters</h3>
                        </div>

                        <div className="space-y-1 border-l-2 border-slate-100 ml-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`block w-full text-left px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-l-2 -ml-[2px] ${selectedCategory === cat
                                        ? "border-orange-600 text-orange-600 bg-orange-50/50"
                                        : "border-transparent text-slate-400 hover:text-slate-900 hover:border-slate-300"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight mb-2">Need Help?</h4>
                            <p className="text-[10px] text-slate-500 font-medium mb-4 leading-relaxed">
                                Can't find what you're looking for? Connect with an expert directly.
                            </p>
                            <Link href="/professionals" className="block text-center w-full py-3 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-colors">
                                Find Professionals
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Mobile Filter Toggle */}
                <div className="md:hidden mb-6">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest"
                    >
                        <span>{selectedCategory}</span>
                        <Filter size={16} />
                    </button>
                    {mobileMenuOpen && (
                        <div className="mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-6 py-4 text-xs font-bold uppercase tracking-widest border-b border-slate-50 hover:bg-slate-50 last:border-0"
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Grid */}
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                            {selectedCategory === "All" ? "All Designs" : `${selectedCategory} Designs`}
                            <span className="ml-3 text-sm text-slate-400 font-medium">{galleryItems.length} Results</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="space-y-4">
                                    <div className="bg-slate-100 aspect-[4/3] rounded-2xl animate-pulse" />
                                    <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                                    <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {selectedCategory === "All" ? (
                                categories.filter(cat => cat !== "All").map(category => {
                                    // Find items for this category
                                    const categoryItems = galleryItems.filter(item => item.caption === category);

                                    if (categoryItems.length === 0) return null;

                                    return (
                                        <section key={category}>
                                            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">
                                                {category}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                                                {categoryItems.map((item, i) => (
                                                    <GalleryCard key={item.id} item={item} index={i} />
                                                ))}
                                            </div>
                                        </section>
                                    );
                                })
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                                    {galleryItems.length === 0 ? (
                                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem]">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                                                <Filter size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">No designs found</h3>
                                            <p className="text-slate-400 text-sm">Try selecting a different category.</p>
                                        </div>
                                    ) : (
                                        galleryItems.map((item, i) => (
                                            <GalleryCard key={item.id} item={item} index={i} />
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
    return (
        <Link href={`/professionals/${item.professionalId}`} className="block group">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="space-y-4"
            >
                {/* Image */}
                <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <img
                        src={item.imageUrl || '/images/placeholder.jpg'}
                        alt={item.caption}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-900 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        View Project
                    </div>
                </div>

                {/* Content Below Image */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors mb-1 truncate">
                        {item.projectTitle}
                    </h3>

                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-slate-100 overflow-hidden shrink-0">
                                {item.professionalImage ? (
                                    <img src={item.professionalImage} alt="Pro" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-slate-400">
                                        {(item.professionalName || "P")[0]}
                                    </div>
                                )}
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[80px]">
                                {item.professionalName}
                            </span>
                        </div>

                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                            {item.caption}
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
