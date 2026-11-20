export const dynamic = 'force-static';

import data from '@/data/site.json';
export default function sitemap(){const base=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';const urls=['/','/about','/projects','/dashboards','/notes','/contact',...data.projects.map(p=>`/projects/${p.slug}`),...data.notes.map(p=>`/notes/${p.slug}`)];return urls.map(url=>({url:`${base}${url}`,lastModified:new Date(),changeFrequency:'monthly',priority:url==='/'?1:.6}));}
