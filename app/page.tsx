"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search, Calendar, CheckCircle, Award, MapPin, ArrowRight, Zap, Target, PenTool, Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";


interface WorkStepData {
  icon: React.ElementType;
  title: string;
  desc: string;
  step: string;
}

function WorkStepCard({ data }: { data: WorkStepData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative group p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-orange-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-all">
        <data.icon size={28} />
      </div>
      <h4 className="font-black uppercase text-xs tracking-widest mb-3 text-slate-900 group-hover:text-orange-600 transition-colors">{data.title}</h4>
      <p className={`text-slate-500 text-[11px] leading-relaxed font-semibold ${isExpanded ? "" : "line-clamp-3 overflow-hidden text-ellipsis"}`}>
        {data.desc}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors bg-transparent border-none cursor-pointer"
      >
        {isExpanded ? "Read Less" : "Read More"} <ArrowRight size={14} className={`transition-transform duration-300 ${isExpanded ? "-rotate-90" : ""}`} />
      </button>
      <div className="absolute top-6 right-6 text-slate-100 group-hover:text-orange-50 text-4xl font-black transition-colors select-none">{data.step}</div>
    </div>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState({
    clients: 0,
    professionals: 0,
    projects: 0,
    requirements: 0,
    cities: 50
  });

  const [searchCity, setSearchCity] = useState("");
  const [isHowWeWorkExpanded, setIsHowWeWorkExpanded] = useState(false);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.professionals) {
          setStats(data);
        }
      })
      .catch(err => console.error("Stats load failed", err));
  }, []);

  const categories = [
    { name: "CIVIL", img: "/images/civil.jpg", type: "Contractor" },
    { name: "ARCHITECTS", img: "/images/architect.jpg", type: "Architect" },
    { name: "INTERIOR DESIGNERS", img: "/images/interior.jpg", type: "Interior Designer" },
  ];

  return (
    <div className="bg-white selection:bg-orange-100 font-sans text-slate-900">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden bg-slate-900 pt-32">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.jpg"
            alt="Luxury Architecture"
            fill
            priority
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/90" />
        </div>

        <div className="z-10 max-w-6xl w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-orange-500 font-black uppercase tracking-[0.2em] text-xs md:text-sm mb-6 block">
              Contractors, Architects & Interior Designers
            </span>
            <h1 className="text-white text-[clamp(2.5rem,6vw,5rem)] leading-[1.1] tracking-tight mb-8">
              Connect with Experts <br />
              <span className="text-white font-sans font-black uppercase text-[clamp(2rem,5vw,4.5rem)]">Curated Products • Expert Craftsmanship</span>
            </h1>

            <p className="text-white/90 text-lg md:text-2xl mt-6 max-w-3xl mx-auto font-medium leading-relaxed">
              Find the right design experts. Create spaces that inspire.
            </p>

            {/* BIG SEARCH BAR */}
            <div className="max-w-3xl mx-auto mt-12 relative group p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl flex items-center">
              <div className="pl-6 text-orange-500"><MapPin size={24} /></div>
              <input
                type="text"
                placeholder="Search by City (e.g. Mumbai, Bangalore)..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="flex-1 bg-transparent border-none py-4 px-4 text-white placeholder:text-white/60 focus:outline-none text-lg font-medium"
              />
              <Link href={`/professionals?city=${searchCity}`} className="bg-orange-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-orange-600 transition-all duration-300">
                Search
              </Link>
            </div>

            <div className="mt-12 flex justify-center gap-12 text-white/50 text-xs font-bold uppercase tracking-widest">
              <span>Verified Professionals</span>
              <span>•</span>
              <span>Premium Projects</span>
              <span>•</span>
              <span>End-to-End Support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. POPULAR CATEGORIES */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-black uppercase tracking-widest text-xs">Expertise Directory</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-2">Popular <span className="text-orange-600">Categories</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="relative h-[500px] rounded-[3rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all"
                onClick={() => window.location.href = `/professionals?type=${encodeURIComponent(cat.type)}`}
              >
                <Image src={cat.img} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-10 left-8 right-8">
                  <h4 className="text-white text-2xl font-black uppercase tracking-tighter mb-4">{cat.name}</h4>
                  <div className="h-1 w-12 bg-orange-600 rounded-full group-hover:w-full transition-all duration-500" />
                  <Link href={`/professionals?type=${encodeURIComponent(cat.type)}`} className="text-white/70 text-[10px] uppercase tracking-widest font-bold mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 block">
                    Explore Experts
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/professionals" className="inline-flex items-center gap-2 border-b-2 border-slate-900 pb-1 text-xs font-black uppercase tracking-widest hover:text-orange-600 hover:border-orange-600 transition-colors">
              View All Categories <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. HOW WE WORK */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
              How <span className="text-orange-600">We Work</span> ?
            </h2>
            <p className="text-slate-600 text-base leading-relaxed font-medium">
              Exphouz is a refined digital platform created for those who aspire to build exceptional spaces. We connect homeowners and businesses with a trusted network of India’s finest contractors, interior designers, architects, and design firms.
              {isHowWeWorkExpanded && (
                <span className="animate-in fade-in duration-500">
                  {" "}Whether you’re shaping a new space or transforming an existing one, Exphouz empowers you to discover the right experts, explore distinctive design approaches, and collaborate with confidence.
                  More than a marketplace, Exphouz is your creative partner—bringing vision, expertise, and execution together to turn inspired ideas into enduring spaces.
                </span>
              )}
            </p>
            <button
              onClick={() => setIsHowWeWorkExpanded(!isHowWeWorkExpanded)}
              className="inline-flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors bg-transparent border-none cursor-pointer"
            >
              {isHowWeWorkExpanded ? "Read Less" : "Read More"} <ArrowRight size={14} className={`transition-transform duration-300 ${isHowWeWorkExpanded ? "-rotate-90" : ""}`} />
            </button>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {[
              {
                icon: PenTool,
                title: "Update requirement",
                desc: "Users can easily post their project needs on Exphouz, detailing the work required across sectors like Civil, Architecture, interior, and more.",
                step: "01"
              },
              {
                icon: Search,
                title: "Discover Experts",
                desc: "Exphouz curates qualified design professionals tailored to your project needs, helping you find the perfect match. Explore verified profiles of architects, interior designers, contractors, and manufacturers—featuring portfolios, signature aesthetics, and completed works.",
                step: "02"
              },
              {
                icon: Calendar,
                title: "Book an appointment",
                desc: "Arrange a consultation with selected professionals to review project details, explore design possibilities, and receive a tailored quotation. Connect with experts whose style resonates with you and begin a refined design partnership.",
                step: "03"
              },
              {
                icon: Target,
                title: "Choose partner",
                desc: "Evaluate curated design proposals and quotations, then select the partner that aligns perfectly with your aesthetic and expectations. Enjoy a refined, end-to-end experience where planning, communication, and execution come together seamlessly for exceptional results.",
                step: "04"
              },
              {
                icon: Zap,
                title: "Turn ideas to reality",
                desc: "With Exphouz by your side, your vision is expertly guided from concept to completion—delivering a seamless and rewarding experience throughout the journey.",
                step: "05"
              },
            ].map((s, i) => (
              <WorkStepCard key={i} data={s} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. OVERLAPPING STATISTICS / INTRO BAR */}
      <section className="relative z-20 -mt-20 px-6 mb-20">
        <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-12 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0 md:pr-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">
              Trusted by thousands.
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed uppercase tracking-widest font-bold">
              Exphouz is a reliable networking platform that connects clients with trusted contractors and design professionals across multiple industries.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
            {[
              { value: stats.professionals || "500+", label: "Professionals" },
              { value: stats.projects || "250+", label: "Projects" },
              { value: stats.cities || "50+", label: "Cities" }, // Static for now
              { value: "4.9/5", label: "User Rating" },
            ].map((item, i) => (
              <div key={i} className="text-left group">
                <h3 className="text-4xl font-black text-slate-900 leading-none group-hover:text-orange-600 transition-colors">
                  {item.value}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE EXPHOUZ (Dark Section) */}
      <section className="py-24 bg-slate-950 text-white px-8 md:px-12 rounded-t-[4rem] -mt-12 relative z-30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-stretch">
          <div className="flex flex-col justify-center">

            <h2 className="text-4xl md:text-5xl mb-8 leading-tight">
              Why Choose <span className="text-white font-black">Exphouz?</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium mb-10">
              Exphouz brings users and professionals together on one powerful platform. By matching real project needs with the right expertise, Exphouz accelerates decision-making and delivers reliable outcomes.
            </p>

            <div className="space-y-6">
              {[
                "Comprehensive solutions",
                "Trusted design professionals across India",
                "Access to diverse expertise, Verified portfolios",
                "Easy-to-use platform, Fostering Collaboration",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                    <CheckCircle size={18} className="text-orange-600 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-white/5 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -mr-16 -mt-16" />

            <h3 className="text-3xl font-black uppercase tracking-tight mb-8 relative z-10">
              <span className="text-orange-600">The Exphouz </span>Advantage
            </h3>

            <ul className="space-y-8 relative z-10">
              {[
                "Curated network of premium design professionals",
                "Verified portfolios and exceptional craftsmanship",
                "Seamless collaboration from concept to completion",
                "One destination for expertise, execution, and curated products"
              ].map((item, i) => (
                <li key={i} className="flex gap-6 items-start">
                  <div className="mt-1 min-w-[24px]"><Award className="text-orange-500" size={24} /></div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-300 leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-24 bg-slate-50 px-6 mb-24 rounded-[3rem] mx-4 md:mx-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
              Client & Pro <span className="text-orange-600">Stories</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "The transformation of our space was beyond amazing. The curated experts worked so well and provided exceptional results.",
                user: "Anug Gupta",
                loc: "Delhi, India"
              },
              {
                text: "Exphouz made it incredibly easy to find a contractor who understood our vision. Highly recommended for hassle-free execution.",
                user: "Priya Sharma",
                loc: "Mumbai, India"
              },
              {
                text: "As a professional, the quality of leads I get here is unmatched. It's a platform that truly values craftsmanship.",
                user: "Ar. Rahul Mehta",
                loc: "Bangalore, India"
              }
            ].map((t, i) => (
              <div key={i} className="p-10 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-100">
                <div className="flex gap-1 text-orange-500 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 font-bold text-xs">
                    {t.user[0]}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-900">{t.user}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
