/**
 * OPTIONAL: Clone 5araang's exact template and apply a first-pass Saloni personalization.
 * Run from the portfolio project root: node extras/apply-original-template.mjs
 * This is NOT needed to run the standalone portfolio.
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const target=path.resolve(root,'..','saloni-original-template');
const upstream='https://github.com/5araang/Nextjs-cinematic-portfolio.git';
const fail=(message)=>{console.error(message);process.exit(1)};
if(fs.existsSync(target))fail(`Target already exists: ${target}. Move/rename it first so no content is overwritten.`);
console.log('Cloning original open-source portfolio...');
const result=spawnSync('git',['clone','--depth','1',upstream,target],{stdio:'inherit'});
if(result.status!==0)fail('Git clone failed. Check internet access and git installation.');
const at=(p)=>path.join(target,p);
const edit=(p,fn)=>{if(!fs.existsSync(at(p)))fail(`Upstream file changed or missing: ${p}`);const old=fs.readFileSync(at(p),'utf8');const updated=fn(old);if(updated===old)console.warn(`Warning: ${p} did not match expected sections`);fs.writeFileSync(at(p),updated);};
const write=(p,s)=>fs.writeFileSync(at(p),s);
write('src/app/about/content.js',`import { SiPython, SiPytorch, SiGit, SiDocker } from 'react-icons/si';
import { TbSql } from 'react-icons/tb';
export const SECTION = { label: 'About Me' };
export const HEADING = { line1: 'Building', line2: 'with', line3: 'purpose.' };
export const BIO = [
  "I'm *Saloni Nathani*, with a background in *Information Systems* at *Pace University*. I'm interested in turning complicated information into useful AI-driven tools and thoughtful software experiences.",
  "I explore *machine learning*, *natural language processing*, *transformers*, *data systems*, and production-minded engineering. I care about transparent outputs and practical impact.",
  "My featured project, *BioSum Reliable*, combines evidence-ranked extractive summarization, biomedical entity recognition, and transformer-based summarization in a *FastAPI* pipeline.",
  "I enjoy taking a problem from research through prototyping and into usable software, with a focus on clear communication and responsible evaluation."
];
// Add Saloni's actual resume at public/resume.pdf before publishing.
export const RESUME_URL = '/resume.pdf';
export const TECH = [
  { name: 'Python', icon: SiPython },
  { name: 'SQL', icon: TbSql },
  { name: 'PyTorch', icon: SiPytorch },
  { name: 'Git', icon: SiGit },
  { name: 'Docker', icon: SiDocker },
];
export const CREATIVE = [];
// Add verified role/date information with Saloni's approval.
export const EXPERIENCE = [
  { role: 'Tekhnologia Innovations — experience details to confirm', period: '' }
];
`);
write('src/app/work/content.js',`export const SECTION = { label: 'Selected Work', heading: 'Projects.' };
export const FALLBACK_PROJECTS = [
  { id:'biosum-reliable',num:'01',category:'AI / Biomedical NLP',title:'BioSum Reliable',description:'Evidence-backed biomedical text summarization using extractive NLP, entity recognition, transformers and FastAPI.',tech:'Python · FastAPI · PyTorch · spaCy · Transformers',link:'https://github.com/saloni-1919/biosum-reliable',review:null },
];
`);
write('src/app/contact/content.js',`export const SECTION = { label: 'Get in touch' };
export const COUNTRIES = [ { code:'1',name:'US / Canada',flag:'🇺🇸' }, { code:'91',name:'India',flag:'🇮🇳' }, { code:'44',name:'UK',flag:'🇬🇧' } ];
export const TECH = [];
export const CREATIVE = [];
`);
edit('src/components/Hero.jsx',s=>s
 .replace('Digital Experience Designer','AI · Data · Software')
 .replace('"Sarang.".split("")','"Saloni.".split("")')
 .replace(/text="I create \*immersive\*[\s\S]*?"\s*delay=\{30\}/,`text="I build *thoughtful AI systems* and *data-driven applications* that turn complex information into practical, trustworthy experiences."\n             delay={30}`)
 .replace(/text="I mainly work with React,[\s\S]*?"\s*delay=\{22\}/,`text="My interests span *Python*, *NLP*, *transformer models*, *machine learning*, and *backend engineering*."\n             delay={22}`)
 .replace(/text="So far, I’ve completed[\s\S]*?"\s*delay=\{15\}/,`text="Explore my biomedical NLP work, including *BioSum Reliable*, and discover more projects on GitHub."\n             delay={15}`)
);
edit('src/components/Footer.jsx',s=>s.replaceAll('Creative Developer','AI / Data / Software').replaceAll('Sarang Walle','Saloni Nathani').replaceAll('Sarang','Saloni Nathani').replaceAll('sarangwalle@gmail.com','github.com/saloni-1919'));
edit('src/components/Navbar.jsx',s=>s.replace(/<Image\s+[\s\S]*?\s+priority\s*\/>/,`<span className="text-white font-black tracking-tighter text-lg">SALONI NATHANI<span className="text-[#ff6b1a]">.</span></span>`));
write('src/app/layout.js',`import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import TrackVisit from '@/components/TrackVisit';
import { Analytics } from '@vercel/analytics/next';
import NewsletterPopup from '@/components/NewsletterPopup';
const inter=Inter({subsets:['latin'],variable:'--font-inter',display:'swap'});
const playfair=Playfair_Display({subsets:['latin'],style:['normal','italic'],variable:'--font-playfair',display:'swap'});
const BASE=process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata={
 metadataBase:new URL(BASE),
 title:{default:'Saloni Nathani — AI, Data & Software',template:'%s — Saloni Nathani'},
 description:'Saloni Nathani — machine learning, biomedical NLP and software engineering portfolio.',
 alternates:{canonical:BASE},
 openGraph:{type:'website',title:'Saloni Nathani',description:'AI, Data & Software portfolio'},
 robots:{index:true,follow:true}
};
const person={'@context':'https://schema.org','@type':'Person',name:'Saloni Nathani',url:BASE,sameAs:['https://github.com/saloni-1919','https://www.linkedin.com/in/saloninathani']};
export default function RootLayout({children}){return <html lang="en" className={inter.variable} ><head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(person)}} /></head><body><TrackVisit/>{children}<Analytics/><NewsletterPopup/></body></html>}
`);
// Prevent the original template from opening WhatsApp with a fabricated placeholder number.
edit('src/components/Contact.jsx',s=>s.replace("const myNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';","const myNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;\n      if (!myNumber) { setStatus('error'); return; }"));
// Keep original MIT notice intact. Add site-specific setup notes.
fs.writeFileSync(at('SALONI-CUSTOMIZATION.md'),`# Saloni personalization notes\n\nThis is the upstream 5araang/Nextjs-cinematic-portfolio project with selected Saloni content adapted. Original MIT license is retained.\n\nIMPORTANT: The original project's public image/video/logo assets, admin defaults, API keys, SEO/LLM auxiliary files, testimonials, blog data, social settings, and other content may still reference the original author. **Audit and replace them before publication.**\n\nAdd her portrait/video/logo/resume, confirm experience dates and email, configure admin/Supabase/Resend, and follow upstream INSTALL.md. The placeholder WhatsApp number was disabled for safety; set a confirmed NEXT_PUBLIC_WHATSAPP_NUMBER only with consent.\n\nPrimary links: https://github.com/saloni-1919 and https://www.linkedin.com/in/saloninathani\n\nYou can use the fully self-contained sibling 'saloni-cinematic-portfolio' project instead if you don't want to configure the original's extra services.\n`);
const remaining=[];
for(const dir of ['src','public']){
 const walk=(folder)=>{for(const child of fs.readdirSync(folder,{withFileTypes:true})){const file=path.join(folder,child.name);if(child.isDirectory())walk(file);else if(/\.(jsx?|tsx?|json|txt|md|xml|html|css)$/.test(file)){const txt=fs.readFileSync(file,'utf8');if(/Sarang|sarangwalle|sarang-space|5araang|saarang/i.test(txt))remaining.push(path.relative(target,file));}}};walk(at(dir));
}
fs.writeFileSync(at('SALONI-REVIEW-FILES.txt'),`Remaining files that may mention the original author or branding:\n${remaining.join('\n')}\n`);
console.log(`\nOriginal reference template cloned and initial Saloni content applied at:\n${target}`);
console.log('Important: audit SALONI-REVIEW-FILES.txt, replace original creator assets, follow INSTALL.md and do not publish unverified details.');
