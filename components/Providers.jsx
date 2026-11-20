'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
export default function Providers({children}) {
  useEffect(()=>{
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis=new Lenis({duration:1.22, smoothWheel:true});
    const tick=(time)=>lenis.raf(time*1000);
    gsap.ticker.add(tick);
    lenis.on('scroll',ScrollTrigger.update);
    return ()=>{lenis.destroy();gsap.ticker.remove(tick);};
  },[]);
  return children;
}
