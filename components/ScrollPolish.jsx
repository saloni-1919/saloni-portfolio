'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Subtle staggered entrance for structural content not already animated by Revealer. */
export default function ScrollPolish(){
  const pathname=usePathname();
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    gsap.registerPlugin(ScrollTrigger);
    const tweens=[];
    const frame=requestAnimationFrame(()=>{
      const elements=gsap.utils.toArray([
        'main .section-kicker',
        'main .career-home-row',
        'main .home-education-card',
        'main .recognition-paper-card',
        'main .detail-row',
        'main .skill-panel',
        'main .resume-mini-entry',
        'main .certification-placeholder',
        'main .tableau-showcase-status'
      ].join(','));
      elements.forEach((el,i)=>{
        const rect=el.getBoundingClientRect();
        // Content already in view should not flash or disappear after hydration.
        if(rect.top<window.innerHeight*.83)return;
        tweens.push(gsap.fromTo(el,{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.85,
          ease:'power3.out',delay:(i%3)*.055,
          scrollTrigger:{trigger:el,start:'top 91%',once:true}
        }));
      });
      ScrollTrigger.refresh();
    });
    return ()=>{
      cancelAnimationFrame(frame);
      // Kill only these page-local tweens/triggers; Lenis remains owned by Providers.
      tweens.forEach(t=>{t.scrollTrigger?.kill();t.kill();});
    };
  },[pathname]);
  return null;
}
