import React from 'react';
import Image from 'next/image';
import { Target, Eye, Shield, Layers, CheckCircle2, Quote, Award, Sparkles } from 'lucide-react';


const About: React.FC = () => {
    return (
        <div className="bg-white pt-20">
            {/* Premium Header */}
            <section className="relative bg-slate-50 py-32 border-b border-slate-100 min-h-[50vh] flex flex-col justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hero.jpg"
                        alt="Luxury Architecture"
                        fill
                        priority
                        className="object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/90" />
                </div>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
                    <p className="text-[#FF5722] text-[10px] font-bold uppercase tracking-[0.5em] mb-8">Redefining Design Ecosystem</p>
                    <h1 className="text-5xl md:text-8xl font-bold mb-10 uppercase tracking-tighter">About <span className="text-slate-900">Exphouz</span></h1>
                    <p className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto leading-relaxed font-light">
                        "A modern digital platform built to simplify how people design, build, and create spaces."
                    </p>
                </div>
            </section>

            {/* Our Story Block */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-10">
                            <h2 className="text-4xl font-bold uppercase underline decoration-[#FF5722] decoration-4 underline-offset-[16px]">Our <span className="">Story</span></h2>
                            <div className="space-y-6 text-slate-600 leading-loose text-lg font-medium">
                                <p>
                                    Exphouz is more than a marketplace; it is a collaboration ecosystem. Founded with a vision to bridge the gap between ideas and execution, we empower users to discover the right professionals, compare options with confidence, and collaborate effortlessly.
                                </p>
                                <p>
                                    We believe great spaces are created when the right minds come together, guided by transparency, trust, and creativity. From expertise to completion, Exphouz supports every step of the journey—helping turn vision into reality.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                                <div className="p-10 bg-slate-50 rounded-[3rem] space-y-4 border border-slate-100 hover:shadow-xl transition-all group">
                                    <div className="p-4 bg-white rounded-2xl w-fit text-[#FF5722] group-hover:bg-[#FF5722] group-hover:text-white transition-colors">
                                        <Target size={24} />
                                    </div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">Our Mission</h4>
                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">To make professional design and construction expertise accessible, reliable, and collaborative for everyone.</p>
                                </div>
                                <div className="p-10 bg-[#020617] rounded-[3rem] space-y-4 text-white hover:shadow-xl transition-all group">
                                    <div className="p-4 bg-white/5 rounded-2xl w-fit text-[#FF5722] group-hover:bg-[#FF5722] group-hover:text-white transition-colors">
                                        <Eye size={24} />
                                    </div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest">Our Vision</h4>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">To become the most trusted platform connecting people, professionals, and projects—shaping better spaces and stronger creative communities.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5722]/20 to-transparent rounded-[4rem] blur-[80px]"></div>
                            <img
                                src="/images/blog1.jpg"
                                alt="Architecture Studio"
                                className="rounded-[4rem] shadow-2xl relative z-10 w-full h-[700px] object-cover"
                            />

                        </div>
                    </div>
                </div>
            </section>

            {/* What Sets Us Apart */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">What <span className="text-[#FF5722]">Sets Us</span> Apart</h2>
                </div>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        { icon: <Shield size={32} />, title: "Verified Pros", desc: "Curated network of premium design professionals with verified credentials and portfolios." },
                        { icon: <Layers size={32} />, title: "Transparent Discovery", desc: "Easy comparison of profiles, portfolios, and real project outcomes without hidden bias." },
                        { icon: <CheckCircle2 size={32} />, title: "Seamless Collab", desc: "Built-in communication tools for effective planning and execution from start to finish." },
                        { icon: <Sparkles size={32} />, title: "Quality Driven", desc: "Focused on delivering high-quality, long-lasting spaces that reflect exceptional craftsmanship." }
                    ].map((item, i) => (
                        <div key={i} className="text-center space-y-6 group">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 group-hover:bg-[#FF5722] group-hover:text-white transition-all duration-500 shadow-sm">
                                <div className="text-slate-400 group-hover:text-white transition-colors">{item.icon}</div>
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900">{item.title}</h3>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Founder's Note Section */}
            <section className="py-40 bg-[#020617] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FF5722]/5 blur-[120px] rounded-full"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-16">
                        <Quote size={64} className="mx-auto text-[#FF5722] opacity-50" />
                        <div className="space-y-12">
                            <h2 className="text-5xl font-bold text-[#FF5722] underline decoration-white/10 underline-offset-[24px]">Founder's <span className="text-white">Note</span></h2>
                            <div className="space-y-8 text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
                                <p>"Exphouz was born from a simple yet powerful belief—that creating meaningful spaces should be an inspiring experience, not a complicated one."</p>
                                <p>"Across the design and construction journey, we saw a recurring challenge: clients struggled to find the right professionals, while talented experts found it difficult to connect with projects that truly matched their expertise."</p>
                                <p>"Our goal is to build a platform where trust, creativity, and collaboration come together. Every connection made on our platform is driven by transparency, quality, and shared ambition."</p>
                            </div>
                        </div>
                        <div className="pt-12">
                            <div className="w-24 h-1 bg-[#FF5722] mx-auto mb-8"></div>
                            <p className="text-3xl font-bold text-white">— Founder, Exphouz</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] mt-2">Ahmedabad • Mumbai • Global Vision</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
