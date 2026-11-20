'use client';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {useSite} from '@/lib/useSite';
export default function Notes(){const site=useSite();return <main className="inner-page section-edge"><div className="inner-head"><p className="eyebrow">IDEAS / ARCHITECTURE / LEARNINGS</p><h1>FIELD NOTES<span className="accent">.</span></h1><p>Technical breakdowns and notes from projects. These are portfolio notes, not claims of separately published articles.</p></div><div className="notes-list">{site.notes.map((n,i)=><Link href={`/notes/${n.slug}`} className="note-row" key={n.slug}><div className="note-number">{String(i+1).padStart(2,'0')}</div><div><p className="eyebrow">{n.category} · {n.date}</p><h2>{n.title}</h2><p>{n.summary}</p></div><ArrowUpRight size={28}/></Link>)}</div></main>}
