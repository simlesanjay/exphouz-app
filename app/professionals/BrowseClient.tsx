"use client";

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Star, ShieldCheck, SlidersHorizontal, ArrowRight, Users, Heart } from 'lucide-react';

// INLINED TYPES AND CONSTANTS
enum ProfessionType {
    Architect = 'Architect',
    InteriorDesigner = 'Interior Designer',
    CivilEngineer = 'Civil Engineer',
    Contractor = 'Contractor',
    LandscapeDesigner = 'Landscape Designer',
    VastuConsultant = 'Vastu Consultant',
    ProductDesigner = 'Product Designer',
}

interface Professional {
    id: string;
    fullName: string;
    displayName: string;
    profession: string[];
    location: string;
    profilePhoto: string;
    rating: number;
    reviewsCount: number;
    isVerified: boolean;
    specialization: string[];
    experience: number;
    startingPrice: string;
    portfolio: { imageUrl: string }[];
}

const BrowseClient: React.FC = () => {
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || searchParams.get('city') || '');
    const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'All');
    const [selectedLocation, setSelectedLocation] = useState<string>(searchParams.get('location') || 'All');
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(true);

    const locations = [
        'All Cities',
        'Ahmedabad',
        'Surat',
        'Vadodara',
        'Rajkot',
        'Bhavnagar',
        'Jamnagar',
        'Gandhinagar',
        'Junagadh',
        'Anand',
        'Navsari',
        'Morbi',
        'Nadiad',
        'Bharuch',
        'Mehsana',
        'Bhuj',
        'Porbandar',
        'Valsad',
        'Vapi',
        'Gondal',
        'Veraval',
        'Godhra',
        'Patan',
        'Kalol',
        'Botad',
        'Amreli',
        'Deesa',
        'Jetpur'
    ];

    const SUB_CATEGORIES: Record<string, string[]> = {
        [ProfessionType.Architect]: ['Residential', 'Commercial', 'Landscape', 'Restoration', 'Urban Design'],
        [ProfessionType.InteriorDesigner]: ['Residential', 'Commercial', 'Office', 'Hospitality', 'Retail'],
        [ProfessionType.CivilEngineer]: ['Structural', 'Geotechnical', 'Transportation', 'Environmental'],
        [ProfessionType.Contractor]: ['General', 'Electrical', 'Plumbing', 'HVAC', 'Painting'],
        [ProfessionType.LandscapeDesigner]: ['Garden', 'Public Spaces', 'Residential', 'Maintenance'],
        [ProfessionType.VastuConsultant]: ['Residential', 'Commercial', 'Industrial', 'Site Selection'],
    };

    const [selectedSubtype, setSelectedSubtype] = useState<string>(searchParams.get('subtype') || 'All');

    // Sync state with URL params when they change (e.g. navigation from navbar)
    React.useEffect(() => {
        const typeParam = searchParams.get('type') || 'All';
        const subtypeParam = searchParams.get('subtype') || 'All';
        const locationParam = searchParams.get('location') || 'All';
        const searchParam = searchParams.get('search') || searchParams.get('city') || '';

        if (typeParam !== selectedType) setSelectedType(typeParam);
        if (subtypeParam !== selectedSubtype) setSelectedSubtype(subtypeParam);
        if (locationParam !== selectedLocation) setSelectedLocation(locationParam);
        if (searchParam && searchParam !== searchTerm) setSearchTerm(searchParam);
    }, [searchParams]);

    // Reset sub-category when main category changes
    React.useEffect(() => {
        if (selectedType === 'All' || !SUB_CATEGORIES[selectedType]) {
            setSelectedSubtype('All');
        }
    }, [selectedType]);

    // Fetch Professionals
    React.useEffect(() => {
        const fetchProfessionals = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (searchTerm) params.append('search', searchTerm);
                if (selectedType !== 'All') params.append('type', selectedType);
                if (selectedSubtype !== 'All') params.append('subtype', selectedSubtype);
                if (selectedLocation !== 'All') params.append('location', selectedLocation);

                const res = await fetch(`/api/v1/professionals?${params.toString()}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setProfessionals(data);
            } catch (error) {
                console.error('Error loading professionals:', error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timer = setTimeout(() => {
            fetchProfessionals();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, selectedType, selectedSubtype, selectedLocation]);

    const [savedProIds, setSavedProIds] = useState<Set<string>>(new Set());

    // Fetch Saved Pros to mark them
    React.useEffect(() => {
        const fetchSaved = async () => {
            try {
                const res = await fetch('/api/v1/saved-pros');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        const ids = new Set<string>(data.savedPros.map((item: any) => String(item.professionalId)));
                        setSavedProIds(ids);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch saved pros", e);
            }
        };
        fetchSaved();
    }, []);

    const toggleSave = async (e: React.MouseEvent, proId: string) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic update
        const isSaved = savedProIds.has(proId);
        const newSet = new Set(savedProIds);
        if (isSaved) newSet.delete(proId);
        else newSet.add(proId);
        setSavedProIds(newSet);

        try {
            const res = await fetch('/api/v1/saved-pros', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ professionalId: proId })
            });
            if (!res.ok) {
                // Revert on error
                setSavedProIds(savedProIds);
                alert("Failed to update saved status. Please try again.");
            }
        } catch (error) {
            console.error("Error saving pro", error);
            setSavedProIds(savedProIds);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24 pt-20">
            {/* Search Header */}
            {/* ... keeping existing header ... */}
            <section className="bg-white border-b py-4 px-4 sm:px-6 shadow-sm sticky top-16 z-40">
                <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-4">

                    {/* Left: Title & Search */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                        <h1 className="text-2xl font-bold whitespace-nowrap hidden md:block">
                            Browse <span className="text-amber-600">Experts</span>
                        </h1>

                        <div className="relative w-full sm:w-80 md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search architects..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right: Filters */}
                    <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-500 whitespace-nowrap">
                            <SlidersHorizontal size={14} />
                            <span className="font-medium text-xs">Filters</span>
                        </div>

                        <select
                            className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer hover:bg-slate-100 transition-colors"
                            value={selectedType}
                            onChange={(e) => { setSelectedType(e.target.value); setSelectedSubtype('All'); }}
                        >
                            <option value="All">All Professions</option>
                            {Object.values(ProfessionType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        {selectedType !== 'All' && SUB_CATEGORIES[selectedType] && (
                            <select
                                className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer hover:bg-slate-100 transition-colors animate-in fade-in slide-in-from-left-2"
                                value={selectedSubtype}
                                onChange={(e) => setSelectedSubtype(e.target.value)}
                            >
                                <option value="All">All Specializations</option>
                                <option value="All">All Specializations</option>
                                {SUB_CATEGORIES[selectedType].map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        )}

                        <select
                            className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer hover:bg-slate-100 transition-colors"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>

                        {(searchTerm || selectedType !== 'All' || selectedLocation !== 'All') && (
                            <button
                                className="px-3 py-2 text-xs font-bold text-amber-600 bg-amber-50 rounded-lg uppercase tracking-wider hover:bg-amber-100 transition-colors whitespace-nowrap"
                                onClick={() => { setSearchTerm(''); setSelectedType('All'); setSelectedSubtype('All'); setSelectedLocation('All'); }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="w-full px-4 sm:px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <p className="text-slate-500 text-sm">Showing {professionals.length} professionals</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading experts...</div>
                ) : professionals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {professionals.map((pro) => (
                            <div key={pro.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl transition-all border border-slate-100 group relative">
                                <div className="absolute top-4 right-4 z-10 flex gap-2">
                                    <button
                                        onClick={(e) => toggleSave(e, pro.id)}
                                        className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white text-slate-400 hover:text-red-500 transition-all"
                                    >
                                        <Heart size={20} className={savedProIds.has(pro.id) ? "fill-red-500 text-red-500" : ""} />
                                    </button>
                                    <div className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg text-emerald-500" title="Verified">
                                        <ShieldCheck size={20} />
                                    </div>
                                </div>

                                <div className="relative h-48">
                                    <img src={pro.portfolio[0]?.imageUrl || 'https://picsum.photos/seed/no-port/800/400'} alt="Portfolio" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>

                                <div className="p-8 relative">
                                    <div className="absolute -top-12 left-8 border-4 border-white rounded-full overflow-hidden shadow-md">
                                        <img src={pro.profilePhoto} alt={pro.fullName} className="w-20 h-20 object-cover" />
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{pro.displayName}</h3>
                                                <p className="text-sm text-slate-500 font-medium">{Array.isArray(pro.profession) ? pro.profession.join(", ") : pro.profession}</p>
                                            </div>
                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                                                <Star size={14} className="text-amber-500" fill="currentColor" />
                                                <span className="text-sm font-bold text-amber-700">{pro.rating}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {pro.specialization.slice(0, 3).map(s => (
                                                <span key={s} className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{s}</span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                {pro.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users size={14} />
                                                {pro.experience} Years Exp.
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end pt-4">

                                            <Link
                                                href={`/professionals/${pro.id}`}
                                                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-amber-600 transition-all shadow-md px-6 flex items-center gap-2"
                                            >
                                                <span className="text-sm font-bold">View Profile</span>
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <Search className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No experts found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search term to find what you're looking for.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedType('All'); setSelectedSubtype('All'); setSelectedLocation('All'); }}
                            className="text-amber-600 font-bold underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default BrowseClient;
