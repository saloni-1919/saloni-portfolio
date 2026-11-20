'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ArrowUpRight, Menu, X} from 'lucide-react';
import {useState} from 'react';
const links=[['/','HOME'],['/projects','WORK'],['/dashboards','DASHBOARDS'],['/about','ABOUT'],['/#recognition','RECOGNITION'],['/notes','NOTES'],['/contact','CONTACT']];
export default function Navbar(){const pathname=usePathname();const[open,setOpen]=useState(false);return <header className="site-header">
 <Link className="site-logo" href="/" onClick={()=>setOpen(false)} aria-label="Saloni Nathani home"><span className="logo-mark">S<span>✳</span></span><span className="logo-type">SALONI<br/>NATHANI</span></Link>
 <nav className={`nav-links ${open?'nav-open':''}`} aria-label="Main navigation">{links.map(([href,label])=><Link key={href} className={pathname===href?'active':''} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>
 <Link className="nav-cta" href="/contact">LET'S TALK <ArrowUpRight size={16}/></Link>
 <button className="nav-toggle" type="button" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={23}/>:<Menu size={23}/>}</button>
 </header>}
