'use client';
import {useEffect,useRef} from 'react';
export default function Cursor(){
  const ref=useRef(null);
  useEffect(()=>{
    const dot=ref.current;
    if(!dot || !window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let x=0,y=0,dx=0,dy=0,frame;
    const move=(e)=>{x=e.clientX;y=e.clientY;};
    const draw=()=>{dx+=(x-dx)*.19;dy+=(y-dy)*.19;dot.style.transform=`translate3d(${dx}px,${dy}px,0) translate(-50%,-50%)`;frame=requestAnimationFrame(draw);};
    draw();window.addEventListener('pointermove',move);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);};
  },[]);
  return <div className="custom-cursor" ref={ref} aria-hidden="true"/>;
}
