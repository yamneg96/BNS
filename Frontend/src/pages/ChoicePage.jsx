import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Universities } from '../data/data';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import ChoiceCard from '../components/ChoiceCard';

const ChoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const from = location.state?.from || "/login";

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    gsap.set(headerRef.current, { opacity: 0, y: 30 });

    tl.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 0.2
    });
  }, []);

  const handleSelection = (uni) => {
    toast.success(`University of : ${uni.name}`, {duration: 3000});

    gsap.to(containerRef.current, {
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.5,
      onComplete: () => navigate(from)
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#1A202C] flex items-center justify-center p-6 overflow-hidden">
      <div className="max-w-5xl w-full">

        {/* Header Section */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-800 text-white mb-6">
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Medical Authentication</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase italic">
            Select Your <span className="text-indigo-300">University</span>
          </h1>
          <p className="text-gray-300 font-bold italic tracking-tight">
            Please select your university to create a new account or log in using an existing account.
          </p>
        </div>

        {/* University Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Universities.map((uni, index) => (
            <ChoiceCard 
              key={uni.name} 
              uni={uni} 
              index={index} 
              onSelect={handleSelection} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChoicePage;