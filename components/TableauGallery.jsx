'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, ExternalLink, RefreshCw, Search, X } from 'lucide-react';
import site from '@/data/site.json';
import { publicPath } from '@/lib/publicPath';

const profile = site.tableau.profile;
const profileUrl = site.tableau.profileUrl;
const validPart = x => typeof x === 'string' && /^[a-zA-Z0-9_.-]{1,180}$/.test(x);
const urls = d => {
  const workbook=encodeURIComponent(d.workbook), view=encodeURIComponent(d.view);
  return {
    publicUrl:`https://public.tableau.com/app/profile/${profile}/viz/${workbook}/${view}`,
    embedUrl:`https://public.tableau.com/views/${workbook}/${view}?:showVizHome=no&:embed=yes&:toolbar=yes`,
    thumbnail:`https://public.tableau.com/thumb/views/${workbook}/${view}`
  };
};
const pinned = site.tableau.featured.filter(d=>validPart(d.workbook)&&validPart(d.view))
  .map((d,i)=>({...d,id:d.workbook,primary:i===0,isFeatured:true,...urls(d)}));
const normalize = d => validPart(d?.workbook) && validPart(d?.view) ? {
  id:d.workbook,workbook:d.workbook,view:d.view,title:String(d.title||d.workbook).slice(0,180),
  subtitle:String(d.subtitle||'').slice(0,240),description:String(d.description||'').slice(0,500),
  category:String(d.category||'TABLEAU PUBLIC').slice(0,100),isFeatured:!!d.isFeatured,
  primary:!!d.primary,...urls(d)
} : null;

function DashboardArt({item, className=''}){
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[item?.thumbnail]);
  return <div className={`tableau-showcase-art ${className}`}>
    {!failed && <img key={item.thumbnail} src={item.thumbnail} alt={`Preview of ${item.title}`} loading="lazy" onError={()=>setFailed(true)}/>}
    {failed && <div className="tableau-showcase-no-image"><BarChart3 size={58}/><span>TABLEAU / DATA STORIES</span></div>}
    <div className="tableau-showcase-art-overlay" aria-hidden="true"/>
  </div>;
}

function DashboardModal({item,onClose}){
  const closeButton=useRef(null);
  useEffect(()=>{
    if(!item)return;
    const handleKey=e=>{if(e.key==='Escape')onClose();};
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    window.addEventListener('keydown',handleKey);
    closeButton.current?.focus();
    return ()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',handleKey);};
  },[item,onClose]);
  if(!item)return null;
  return <div className="tableau-modal" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="tableau-modal-panel" role="dialog" aria-modal="true" aria-label={`${item.title} interactive dashboard`}>
      <div className="tableau-modal-top"><h2>{item.title}</h2><div>
        <a href={item.publicUrl} target="_blank" rel="noopener noreferrer" aria-label="View on Tableau Public"><ExternalLink size={18}/></a>
        <button ref={closeButton} type="button" aria-label="Close dashboard" onClick={onClose}><X size={22}/></button>
      </div></div>
      <iframe title={`${item.title} Tableau dashboard`} src={item.embedUrl} allowFullScreen loading="lazy"/>
      <a className="tableau-modal-link" href={item.publicUrl} target="_blank" rel="noopener noreferrer">OPEN IN TABLEAU PUBLIC <ArrowUpRight size={16}/></a>
    </div>
  </div>;
}

/**
 * Editorial dashboard showcase — one large selected report with clear manual
 * controls, plus a responsive thumbnail collection. No autoplay or moving
 * scroll rail; the user decides which report to open. New published Tableau
 * workbooks come from the static feed rebuilt by GitHub Actions.
 */
export default function TableauGallery({preview=false}){
  const [items,setItems]=useState(pinned);
  const [selected,setSelected]=useState(pinned[0]?.workbook||'');
  const [modal,setModal]=useState(null);
  const [query,setQuery]=useState('');
  const [loading,setLoading]=useState(true);
  const [live,setLive]=useState(false);
  const [retry,setRetry]=useState(0);

  useEffect(()=>{
    const controller=new AbortController();
    setLoading(true);
    fetch(publicPath('/tableau-feed.json'),{signal:controller.signal,cache:'no-store'})
      .then(r=>{if(!r.ok)throw new Error('Tableau feed unavailable');return r.json();})
      .then(data=>{
        const discovered=Array.isArray(data.dashboards) ? data.dashboards.map(normalize).filter(Boolean) : [];
        const seen=new Set(pinned.map(d=>d.workbook.toLowerCase()));
        const extras=discovered.filter(d=>{
          const key=d.workbook.toLowerCase();
          if(seen.has(key))return false;
          seen.add(key);return true;
        });
        setItems([...pinned,...extras]);
        setLive(!!data.autoSync);
      })
      .catch(()=>{if(!controller.signal.aborted)setLive(false);})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return ()=>controller.abort();
  },[retry]);

  const collection=useMemo(()=>{
    const source=preview?items.slice(0,3):items;
    const search=query.trim().toLowerCase();
    return search?source.filter(d=>`${d.title} ${d.description} ${d.category}`.toLowerCase().includes(search)):source;
  },[items,preview,query]);
  const active=collection.find(d=>d.workbook===selected)||collection[0]||null;
  const activeIndex=active?collection.findIndex(d=>d.workbook===active.workbook):-1;
  const change=(direction)=>{
    if(!collection.length)return;
    setSelected(collection[(activeIndex+direction+collection.length)%collection.length].workbook);
  };

  return <div className={`tableau-showcase ${preview?'tableau-showcase-home':'tableau-showcase-page'}`}>
    {!preview && <div className="tableau-showcase-intro">
      <div><span className="eyebrow">THE VISUALIZATION LIBRARY</span><p>Choose a report below to preview it, or open it interactively to explore filters and metrics. Newly published public dashboards join after the scheduled GitHub Pages rebuild.</p></div>
      <label className="tableau-search"><Search size={18}/><input type="search" aria-label="Search dashboards" placeholder="Search dashboards…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
    </div>}
    <div className="tableau-showcase-status">
      <span className="tableau-showcase-status-dot" aria-hidden="true"/>
      <span>{loading?'CHECKING TABLEAU PUBLIC…':live?'PUBLIC TABLEAU / AUTO-DISCOVERY ENABLED':'TABLEAU PUBLIC / FEATURED REPORTS READY'}</span>
      {!preview && <button type="button" onClick={()=>setRetry(v=>v+1)} disabled={loading} aria-label="Refresh published dashboard list"><RefreshCw size={15}/> REFRESH</button>}
      <span className="tableau-showcase-total">{String(collection.length).padStart(2,'0')} REPORTS</span>
    </div>
    {active ? <>
      <div className="tableau-showcase-feature" key={active.workbook}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active.workbook} className="tableau-showcase-visual" initial={false} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.35,ease:'easeOut'}}>
            <DashboardArt item={active}/>
            <div className="tableau-showcase-visual-label"><span>LIVE PREVIEW / TABLEAU</span><span>{String(activeIndex+1).padStart(2,'0')} — {String(collection.length).padStart(2,'0')}</span></div>
          </motion.div>
        </AnimatePresence>
        <div className="tableau-showcase-copy">
          <div className="tableau-showcase-copy-top"><span className="eyebrow">{active.primary?'FEATURED ANALYTICS':active.category||'TABLEAU PUBLIC'}</span><BarChart3 size={24}/></div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active.workbook} initial={false} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.32}}>
              <h3>{active.title}</h3>
              <p>{active.description||active.subtitle||'A data visualization built to make complex questions easier to explore.'}</p>
            </motion.div>
          </AnimatePresence>
          <button className="tableau-showcase-open" type="button" onClick={()=>setModal(active)}>EXPLORE INTERACTIVE REPORT <ArrowUpRight size={20}/></button>
          <div className="tableau-showcase-controls">
            <span>SELECT A DASHBOARD <span className="tableau-showcase-index">{String(activeIndex+1).padStart(2,'0')} / {String(collection.length).padStart(2,'0')}</span></span>
            <div><button type="button" disabled={collection.length<2} aria-label="Previous Tableau report" onClick={()=>change(-1)}><ArrowLeft size={19}/></button>
            <button type="button" disabled={collection.length<2} aria-label="Next Tableau report" onClick={()=>change(1)}><ArrowRight size={19}/></button></div>
          </div>
        </div>
      </div>
      <div className="tableau-showcase-thumbs" aria-label="Choose a Tableau dashboard">
        {collection.map((d,i)=><button key={d.workbook} type="button" aria-pressed={d.workbook===active.workbook} className={`tableau-showcase-thumb ${d.workbook===active.workbook?'is-selected':''}`} onClick={()=>setSelected(d.workbook)}>
          <div className="tableau-showcase-thumb-image"><DashboardArt item={d}/><span>{String(i+1).padStart(2,'0')}</span></div>
          <div className="tableau-showcase-thumb-copy"><strong>{d.title}</strong><span>{d.primary?'MAIN FEATURE':'TABLEAU PUBLIC'} <ArrowUpRight size={15}/></span></div>
        </button>)}
      </div>
    </> : <p className="tableau-no-results">No dashboards match this search. Try a different term.</p>}
    <div className="tableau-showcase-bottom">
      {preview?<><p>SAAS CUSTOMER RETENTION / AIRLINE OPERATIONS / E-COMMERCE PRICING</p><Link className="text-link" href="/dashboards">VIEW ALL DASHBOARDS <ArrowUpRight size={19}/></Link></>
       :<><p>New public workbooks are checked by the deployment workflow approximately every six hours; the three featured dashboards always remain available.</p><a className="text-link" href={profileUrl} target="_blank" rel="noopener noreferrer">TABLEAU PUBLIC PROFILE <ArrowUpRight size={19}/></a></>}
    </div>
    <DashboardModal item={modal} onClose={()=>setModal(null)}/>
  </div>;
}
