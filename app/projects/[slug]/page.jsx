import site from '@/data/site.json';
import ProjectDetail from '@/components/ProjectDetail';
export function generateStaticParams(){return site.projects.map(p=>({slug:p.slug}));}
export const dynamicParams=false;
export default function ProjectPage(){return <ProjectDetail/>;}
