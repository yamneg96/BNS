import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const IntroPage = ({ onComplete }) => {
  const comp = useRef(null);
  const [step, setStep] = useState(0);

  // Onboarding Data
  const slides = [
    {
      title: "BNS",
      subtitle: "Bed Notification System",
      desc: "Welcome! Let's get you familiar with the system.",
    },
    {
      title: "Real-Time",
      subtitle: "Instant Updates",
      desc: "Get notified the second a hospital bed becomes available.",
    },
    {
      title: "Efficient",
      subtitle: "Seamless Management",
      desc: "Assign patients and manage admissions with a single click.",
    },
  ];

  // This function handles the final exit animation
  const handleExit = () => {
    gsap.to("#intro-slider", {
      xPercent: -100,
      duration: 1.1,
      ease: "expo.inOut",
      onComplete: onComplete, // Tell Home.jsx to unmount this component
    });
    // Fade in the home content simultaneously
    gsap.to("#welcome", {
      opacity: 1,
      duration: 1,
      delay: 0.3
    });
  };

  const nextStep = () => {
    if (step < slides.length - 1) {
      // Animate text out, change state, animate text back in
      gsap.to(".text-content", {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
          setStep(step + 1);
          gsap.to(".text-content", { opacity: 1, y: 0, duration: 0.5 });
        },
      });
    } else {
      handleExit();
    }
  };

  return (
    <div ref={comp} className="fixed inset-0 z-[999] overflow-hidden">
      <div
        id="intro-slider"
        className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white relative"
      >
        {/* Skip Button */}
        <button 
          onClick={handleExit}
          className="cp border-2 border-white px-4 py-2 rounded-full absolute top-10 right-10 text-slate-400 hover:text-white transition-colors uppercase tracking-widest text-sm"
        >
          Skip
        </button>

        <div className="text-center px-6 text-content">
          <h1 className="text-6xl md:text-8xl font-black italic text-indigo-500 mb-2">
            {slides[step].title}
          </h1>
          <h3 className="text-xl md:text-2xl font-light text-slate-400 tracking-widest uppercase mb-4">
            {slides[step].subtitle}
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto text-lg">
            {slides[step].desc}
          </p>
        </div>

        {/* Controls */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <button
            onClick={nextStep}
            className="cp px-12 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all transform active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            {step === slides.length - 1 ? "Get Started" : "Next"}
          </button>

          {/* Progress Dots */}
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${step === i ? 'bg-indigo-500 w-6' : 'bg-slate-700'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;