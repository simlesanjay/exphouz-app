"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import { Search, MapPin, Clock, DollarSign, ArrowRight, Filter } from "lucide-react";

interface Requirement {
    id: string;
    title: string;
    description: string;
    projectType: string;
    budgetRange: string;
    timeline: string;
    location: string;
    createdAt: string;
    client: {
        displayName: string;
        city: string;
        state: string;
    };
    _count: {
        responses: number;
    };
}

export default function RequirementsPage() {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchRequirements();
    }, []);

    const fetchRequirements = async () => {
        try {
            const res = await fetch("/api/v1/requirements");
            const data = await res.json();
            if (data.success) {
                setRequirements(data.requirements);
            }
        } catch (error) {
            console.error("Failed to fetch requirements", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRequirements = requirements.filter(req =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white py-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-500/10 skew-x-12 translate-x-20" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <h1 className="text-4xl md:text-5xl font-medium mb-6">Find Your Next Project</h1>
                    <p className="text-slate-300 text-lg max-w-2xl mb-10 font-light">
                        Browse verified requirements from homeowners and businesses looking for design and construction experts.
                    </p>

                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4 max-w-3xl bg-white p-2 rounded-2xl shadow-xl">
                        <div className="flex-1 flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-slate-100 py-3 md:py-0">
                            <Search className="text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by keyword, location..."
                                className="w-full bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* Optional Filter Button - Visual only for now */}
                        <button className="hidden md:flex items-center gap-2 px-6 py-3 font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors border-l border-slate-100">
                            <Filter size={16} /> Filters
                        </button>
                        <button
                            onClick={() => { }} // No-op, search is real-time
                            className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/30"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white h-64 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredRequirements.length === 0 ? (
                            <div className="text-center py-20 text-slate-400">
                                <p className="text-xl">No requirements found matching your search.</p>
                            </div>
                        ) : (
                            filteredRequirements.map((req) => (
                                <RequirementCard key={req.id} requirement={req} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function RequirementCard({ requirement }: { requirement: Requirement }) {
    // Format Budget display
    const budgetMap: Record<string, string> = {
        'low': 'Under ₹5L',
        'mid': '₹5L - ₹20L',
        'high': '₹20L - ₹50L',
        'luxury': '₹50L+'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-2xl border border-slate-100 p-6 md:p-8 hover:shadow-xl hover:border-orange-100 transition-all duration-300 relative overflow-hidden"
        >
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-orange-50 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                            {requirement.projectType || 'Project'}
                        </span>
                        <span className="text-slate-400 text-xs font-medium">
                            {new Date(requirement.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h3 className="text-2xl font-medium text-slate-900 group-hover:text-orange-600 transition-colors">
                        {requirement.title}
                    </h3>

                    <p className="text-slate-500 line-clamp-2 leading-relaxed max-w-3xl">
                        {requirement.description}
                    </p>

                    <div className="flex flex-wrap gap-4 md:gap-8 pt-2">
                        <div className="flex items-center gap-2 text-slate-600">
                            <DollarSign className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-bold">
                                {budgetMap[requirement.budgetRange] || requirement.budgetRange || 'Flexible'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium capitalize">
                                {requirement.location}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium capitalize">
                                {requirement.timeline === 'immediate' ? 'Immediate Start' :
                                    requirement.timeline === '1month' ? 'Within 1 Month' : 'Flexible'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-center gap-4 min-w-[140px] border-t md:border-t-0 md:border-l border-slate-50 pt-6 md:pt-0 md:pl-8">
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Posted By</p>
                        <p className="font-medium text-slate-900">{requirement.client?.displayName || 'Client'}</p>
                    </div>

                    <button className="w-full md:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                        View Details <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
