'use client';
import {useParams} from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft,ArrowUpRight} from 'lucide-react';
import {useSite} from '@/lib/useSite';
export default function NoteDetail(){const {slug}=useParams(),site=useSite(),note=site.notes.find(x=>x.slug===slug);if(!note)return <main className="inner-page section-edge"><h1>NOTE NOT FOUND.</h1><Link className="text-link" href="/notes">ALL NOTES <ArrowLeft size={16}/></Link></main>;return <article className="note-article section-edge"><Link href="/notes" className="back-link"><ArrowLeft size={16}/> ALL NOTES</Link><p className="eyebrow">{note.category} / {note.date}</p><h1>{note.title}<span className="accent">.</span></h1><p className="note-lead">{note.summary}</p><div className="article-body">{note.paragraphs?.map((p,i)=><p key={i}>{p}</p>)}</div>{note.source&&<a href={note.source} target="_blank" rel="noopener noreferrer" className="pill-button">EXPLORE THE REPOSITORY <ArrowUpRight size={18}/></a>}</article>}
