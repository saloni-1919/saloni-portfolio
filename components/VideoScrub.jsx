'use client';
import {useEffect,useRef} from 'react';
import {publicPath} from '@/lib/publicPath';
export default function VideoScrub(){
  const ref=useRef(null);const src=process.env.NEXT_PUBLIC_HERO_VIDEO;
  useEffect(()=>{
    if(!src || !ref.current)return;
    const vid=ref.current;let frame=0;
    const sync=()=>{if(!vid.duration || !Number.isFinite(vid.duration))return;const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);const progress=Math.min(1,window.scrollY/max);vid.currentTime=progress*Math.max(vid.duration-.05,0);};
    const onScroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(sync);};
    vid.addEventListener('loadedmetadata',sync);window.addEventListener('scroll',onScroll,{passive:true});
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);vid.removeEventListener('loadedmetadata',sync);};
  },[src]);
  return src?<video ref={ref} src={src?.startsWith('/') ? publicPath(src) : src} className="scrub-video" muted playsInline preload="metadata" aria-hidden="true"/>:null;
}
