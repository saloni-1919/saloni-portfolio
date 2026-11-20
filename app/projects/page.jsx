'use client';
import {useSite} from '@/lib/useSite';
import ProjectCard from '@/components/ProjectCard';
import GithubFeed from '@/components/GithubFeed';
export default function Projects(){const site=useSite();return <main className="inner-page section-edge"><div className="inner-head"><p className="eyebrow">PORTFOLIO / WORK + OPEN SOURCE</p><h1>THE WORK<span className="accent">.</span></h1><p>One creative archive: hand-picked projects and every public GitHub repository, updated automatically.</p></div><div className="featured-grid">{site.projects.map((p,i)=><ProjectCard key={p.slug} item={p} index={i}/>)}</div><div id="all-repositories" className="section-title-row smaller"><h2>OPEN SOURCE<span className="accent">.</span></h2><p>All the code behind the work: search, filter, and explore every public repository, including forks and archived projects.</p></div><GithubFeed/></main>}
