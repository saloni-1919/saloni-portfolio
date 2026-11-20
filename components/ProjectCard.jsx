'use client';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import Revealer from './Revealer';
import {publicPath} from '@/lib/publicPath';
export default function ProjectCard({item,index=0}){
 return <Revealer delay={Math.min(index*.08,.24)}><Link href={`/projects/${item.slug}`} className={`project-card visual-${item.visual||'violet'}`}>
   <div className="project-art">{item.image&&<div className="project-art-image" style={{backgroundImage:`url("${publicPath(item.image)}")`}} aria-hidden="true"/>}<span className="art-no">{item.number||String(index+1).padStart(2,'0')}</span>{!item.image&&<div className="art-orb"><i/><i/><i/></div>}<div className="art-title">{item.title}</div><ArrowUpRight className="project-art-arrow" size={26}/></div>
   <div className="project-card-info"><div><p className="eyebrow">{item.type||'SOFTWARE PROJECT'}</p><h3>{item.title}</h3></div><ArrowUpRight size={24}/></div>
   <p className="project-description">{item.summary}</p>
   <div className="chips">{(item.stack||[]).slice(0,4).map(s=><span key={s}>{s}</span>)}</div>
 </Link></Revealer>;
}
