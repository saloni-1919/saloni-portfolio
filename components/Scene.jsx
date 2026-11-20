'use client';
import {useEffect,useRef} from 'react';
import * as THREE from 'three';
export default function Scene(){
  const canvas=useRef(null);
  useEffect(()=>{
    if(!canvas.current)return;
    let renderer,frame=0,disposed=false;
    try {
      const parent=canvas.current;
      const scene=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(50,1,.1,100);
      camera.position.z=5.9;
      renderer=new THREE.WebGLRenderer({canvas:parent,alpha:true,antialias:true,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
      const group=new THREE.Group();scene.add(group);
      const geometry=new THREE.TorusKnotGeometry(1.43,.31,210,24,2,3);
      const mesh=new THREE.Mesh(geometry,new THREE.MeshPhongMaterial({color:0xf38e58,emissive:0x4c1a10,shininess:80,wireframe:true,transparent:true,opacity:.52}));
      group.add(mesh);
      const pointsGeom=new THREE.BufferGeometry();
      const positions=new Float32Array(480*3);
      for(let i=0;i<480;i++){const r=2.6+Math.random()*3.8,t=Math.random()*Math.PI*2,v=Math.acos(2*Math.random()-1);positions[i*3]=r*Math.sin(v)*Math.cos(t);positions[i*3+1]=r*Math.sin(v)*Math.sin(t);positions[i*3+2]=r*Math.cos(v);}
      pointsGeom.setAttribute('position',new THREE.BufferAttribute(positions,3));
      const points=new THREE.Points(pointsGeom,new THREE.PointsMaterial({color:0xff9f6a,size:.012,transparent:true,opacity:.58}));scene.add(points);
      const light1=new THREE.PointLight(0xffc9a9,15,12);light1.position.set(2,2,4);scene.add(light1);
      const light2=new THREE.PointLight(0x8f4bff,11,12);light2.position.set(-2,-2,-3);scene.add(light2);
      let mx=0,my=0,scroll=0;
      const onMove=(e)=>{mx=(e.clientX/window.innerWidth-.5)*.55;my=(e.clientY/window.innerHeight-.5)*.55;};
      const onScroll=()=>{scroll=window.scrollY/(Math.max(document.documentElement.scrollHeight-window.innerHeight,1));};
      const resize=()=>{const w=parent.clientWidth||window.innerWidth,h=parent.clientHeight||window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
      resize();window.addEventListener('resize',resize);window.addEventListener('pointermove',onMove);window.addEventListener('scroll',onScroll,{passive:true});
      const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const animate=(t)=>{if(disposed)return;group.rotation.y+=(reduce?0:.0023);group.rotation.x+=(reduce?0:.00065);group.rotation.y+=(mx-group.rotation.y*.12)*.002;group.position.y=Math.sin(t*.00055)*.15-scroll*.5;points.rotation.y=t*.000017;renderer.render(scene,camera);if(!reduce)frame=requestAnimationFrame(animate);};
      frame=requestAnimationFrame(animate);
      return()=>{disposed=true;cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',onMove);window.removeEventListener('scroll',onScroll);geometry.dispose();mesh.material.dispose();pointsGeom.dispose();points.material.dispose();renderer.dispose();};
    }catch{renderer?.dispose();}
  },[]);
  return <canvas className="hero-scene" aria-hidden="true" ref={canvas}/>;
}
