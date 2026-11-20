'use client';
import {ArrowUpRight} from 'lucide-react';
import Link from 'next/link';
import {useSite} from '@/lib/useSite';
export default function Footer(){const site=useSite();return <footer className="site-footer">
  <div className="footer-top"><p className="eyebrow">HAVE SOMETHING IN MIND?</p><Link href="/contact" className="footer-title">LET'S BUILD<br/><span>THE NEXT THING.</span><ArrowUpRight aria-hidden="true"/></Link></div>
  <div className="footer-bottom"><p>© {new Date().getFullYear()} {site.name}. Built with intention.</p><div>{site.socials.map(x=><a key={x.label} href={x.url} target="_blank" rel="noopener noreferrer">{x.label} ↗</a>)}</div><a href="#top" className="footer-top-link">BACK TO TOP ↑</a></div>
</footer>}
