import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
export const metadata = { title: 'Research & Recognition' };
export default function Research() {return <main className="inner-page section-edge research-page">
  <div className="inner-head"><p className="eyebrow">RESEARCH / RECOGNITION</p><h1>RESEARCH MEETS<br/><span className="outlined-text">RECOGNITION.</span></h1><p>Publications now appear directly in the Recognition section alongside Saloni’s Scholar Award.</p></div>
  <div className="research-moved-panel"><BookOpen size={35} aria-hidden="true"/><h2>EXPLORE THE RECOGNITION SECTION.</h2><p>Find both research papers and their PDF links in the consolidated homepage Recognition section. Links become active after the original PDFs have been uploaded.</p><Link className="pill-button" href="/#recognition">VIEW RECOGNITION <ArrowUpRight size={19}/></Link></div>
 </main>}
