import React from "react";
import { Link } from "react-router-dom";
import { Users, Heart, Code, Building2, Rocket, Mail, ChevronLeft, ShieldCheck, Zap } from "lucide-react";

const AboutUs = () => {
  return (
    /* pt-20 added to clear the sticky Navbar */
    <div className="min-h-screen bg-white pt-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-10">
          <Link 
            to="/" 
            className="cp inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors group"
          >
            <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-indigo-50 transition-all">
              <ChevronLeft size={18} />
            </div>
            <span>Back to Portal</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="relative mb-20">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h1 className="text-5xl sm:text-7xl font-black text-slate-900 mb-6 tracking-tighter italic">
                About <span className="text-indigo-600">BNS</span>
              </h1>
              <p className="text-slate-500 text-xl font-medium leading-relaxed">
                A high-performance bed management ecosystem engineered by{" "}
                <span className="text-slate-900 font-black">NYDev</span> to 
                eliminate ward congestion and synchronize hospital operations in real-time.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4">
               <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
                  <ShieldCheck size={48} className="text-indigo-400 mb-4" />
                  <p className="text-white font-black text-xs uppercase tracking-widest italic">Medical Grade Reliability</p>
               </div>
            </div>
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          
          {/* About Project Card */}
          <section className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 hover:border-indigo-100 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Building2 size={28} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Project</h2>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">
              The <strong>Bed Notification System (BNS)</strong> is more than just a tracker; it's a mission-critical 
              platform for modern hospitals. We've optimized the logic of ward allocation, patient tracking, and staff 
              scheduling into a singular, lightning-fast interface.
              <br /><br />
              It ensures timely expiry notifications and absolute transparency for administrators, allowing 
              healthcare heroes to focus on patients, not paperwork.
            </p>
          </section>

          {/* Mission Card */}
          <section className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
               <Zap size={120} className="text-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6 text-white">
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:bg-indigo-500 transition-all">
                  <Rocket size={28} />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Our Mission</h2>
              </div>
              <p className="text-slate-300 font-medium leading-relaxed text-lg">
                We exist to empower medical institutions with data-driven tools that reduce decision friction. 
                Our goal is to build technology that is invisible yet indispensable — enhancing accountability 
                and improving patient outcomes through seamless synchronization.
              </p>
            </div>
          </section>
        </div>

        {/* The Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">The Architects</h2>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Innovation by NYDev</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 bg-white border-2 border-slate-50 rounded-[2.5rem] hover:border-indigo-200 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Code size={28} />
              </div>
              <h3 className="font-black text-slate-900 text-xl mb-3">Scalable Fullstack</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Built using the MERN stack (MongoDB, Express, React, Node) for horizontal scalability and enterprise-grade performance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white border-2 border-slate-50 rounded-[2.5rem] hover:border-indigo-200 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Heart size={28} />
              </div>
              <h3 className="font-black text-slate-900 text-xl mb-3">Human-Centered UI</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Design focused on high-stress environments, ensuring critical data is always readable and actionable at a glance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white border-2 border-slate-50 rounded-[2.5rem] hover:border-indigo-200 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-indigo-600 transition-all">
                <Users size={28} />
              </div>
              <h3 className="font-black text-slate-900 text-xl mb-3">Agile Collaboration</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                A diverse collective of developers from NYDev pushing updates weekly to stay ahead of modern medical needs.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Contact Footer */}
        <section className="bg-indigo-600 rounded-[4rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-500/40">
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-500" />
           <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight italic">Ready to transform your ward?</h2>
              <p className="text-indigo-100 font-bold mb-10 max-w-xl mx-auto">
                Collaborate with the NYDev team to bring BNS or custom software solutions to your institution.
              </p>
              <a
                href="mailto:yamlaknegash96@gmail.com"
                className="cp inline-flex items-center gap-3 text-lg text-indigo-600 font-black bg-white px-10 py-5 rounded-[2rem] hover:bg-slate-900 hover:text-white transition-all shadow-2xl transform active:scale-95 group"
              >
                <Mail className="w-6 h-6" />
                <span>Secure Contact</span>
              </a>
           </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;