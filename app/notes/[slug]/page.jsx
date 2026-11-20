import site from '@/data/site.json';
import NoteDetail from '@/components/NoteDetail';
export function generateStaticParams(){return site.notes.map(n=>({slug:n.slug}));}
export const dynamicParams=false;
export default function NotePage(){return <NoteDetail/>;}
