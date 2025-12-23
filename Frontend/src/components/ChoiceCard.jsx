// ChoiceCard.js
import React from 'react';
import { School, ArrowRight, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const ChoiceCard = ({ uni, index, onSelect }) => {
  const cardRef = React.useRef(null);

  const handleSelection = () => {
    const selectedCard = cardRef.current;

    gsap.to(selectedCard, {
      scale: 0.95,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        localStorage.setItem("university", uni.name);
        onSelect(uni);
      },
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={handleSelection}
      className="group relative bg-gray-800 border border-indigo-700 rounded-[1.5rem] p-6 cursor-pointer transition-all duration-300 hover:shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="w-16 h-16 bg-indigo-700 rounded-full flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-500">
          <School size={32} className="text-white" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Status</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase">Online</span>
          </div>
        </div>
      </div>

      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2 group-hover:text-indigo-300 transition-colors">
        {uni.name}
      </h3>

      {/* Image Container */}
      <div className='relative h-56 overflow-hidden'>
        <img
          src={uni.image}
          alt={uni.name}
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
        
        {/* Hover Icon */}
        <div className='absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-full text-white scale-0 group-hover:scale-100 transition-transform duration-500'>
            <ArrowUpRight size={20} />
        </div>
      </div>

      <p className="text-gray-300 text-md mb-4 italic">
        {uni.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-indigo-300 group-hover:text-indigo-400 transition-colors" />
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Connect to Node</span>
        </div>
        <ArrowRight className="text-indigo-200 group-hover:text-indigo-400 transform group-hover:translate-x-2 transition-all" />
      </div>

      <div className="absolute bottom-0 left-0 h-2 bg-indigo-600 w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
    </div>
  );
};

export default ChoiceCard;