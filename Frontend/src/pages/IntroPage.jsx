import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const IntroPage = ({ onComplete }) => {
  const comp = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete,
      });

      tl.from("#intro-slider", {
        xPercent: "-100",
        duration: 1.2,
        ease: "expo.inOut",
      })
        .from(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          y: 30,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
        })
        .to(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          y: -20,
          delay: 1.2,
          stagger: 0.1,
          ease: "power3.in",
        })
        .to("#intro-slider", {
          xPercent: "-100",
          duration: 1.1,
          ease: "expo.inOut",
        });
    }, comp);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={comp}
      className="fixed inset-0 z-[999] overflow-hidden pointer-events-none"
    >
      <div
        id="intro-slider"
        className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white pointer-events-auto"
      >
        <div className="text-center">
          <h1
            id="title-1"
            className="text-6xl md:text-8xl font-black italic text-indigo-500 mb-2"
          >
            BNS
          </h1>
          <h3
            id="title-2"
            className="text-xl md:text-2xl font-light text-slate-400 tracking-widest uppercase"
          >
            Bed Notification System
          </h3>
          <div id="title-3" className="mt-8 flex justify-center gap-1">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;