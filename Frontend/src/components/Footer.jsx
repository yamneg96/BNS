import { FaYoutube, FaInstagram, FaTelegramPlane } from 'react-icons/fa';
import PrivacyModal from "../components/PrivacyModal";
import { useState } from 'react';
import bedIcon from '../assets/medical-bed.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Content Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Copyright & Product Info */}
          <div className="flex items-center gap-4">
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <img src={bedIcon} alt="Bed Icon" className="h-7 w-auto" />
            </div>
            <div className="text-left">
              <p className="text-white font-black tracking-tight leading-none mb-1">BNS</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                &copy; {new Date().getFullYear()} Bed Notification System
              </p>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Connect with NYDev</span>
            
            <div className="flex items-center gap-5">
              <a
                href="https://www.youtube.com/@NYDev-t6p"
                target="_blank"
                rel="noopener noreferrer"
                className="cp text-slate-400 hover:text-red-500 transition-all duration-300 transform hover:scale-125"
                aria-label="YouTube"
              >
                <FaYoutube size={22} />
              </a>
              
              <a
                href="https://instagram.com/nydevofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="cp text-slate-400 hover:text-pink-500 transition-all duration-300 transform hover:scale-125"
                aria-label="Instagram"
              >
                <FaInstagram size={22} />
              </a>
              
              <a
                href="https://t.me/+a4391kX-fU9hYjA0"
                target="_blank"
                rel="noopener noreferrer"
                className="cp text-slate-400 hover:text-indigo-400 transition-all duration-300 transform hover:scale-125"
                aria-label="Telegram"
              >
                <FaTelegramPlane size={22} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Links Area */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-center items-center gap-8">
            <button 
              onClick={() => setShowModal(true)} 
              className="cp text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            
            <div className="hidden sm:block h-1 w-1 bg-slate-700 rounded-full" />
            
            <Link 
              to="/support" 
              className="cp text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors"
            >
              Support Center
            </Link>

            <div className="hidden sm:block h-1 w-1 bg-slate-700 rounded-full" />

            <Link 
              to="/about" 
              className="cp text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors"
            >
              About Project
            </Link>
        </div>

        <div className="mt-8 text-center">
           <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em]">
              Precision Built • HIPAA Compliant • Real-time
           </p>
        </div>
      </div>

      <PrivacyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </footer>
  );
};

export default Footer;