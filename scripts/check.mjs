import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const errors=[];
const check=(condition,message)=>{if(!condition)errors.push(message);};
const site=JSON.parse(fs.readFileSync(path.join(root,'data/site.json'),'utf8'));
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
check(site.name==='Saloni Nathani','Expected Saloni Nathani as portfolio owner');
check(Array.isArray(site.headline)&&site.headline.length>0,'headline missing');
check(Array.isArray(site.projects)&&site.projects.length>0,'At least one project is required');
check(Array.isArray(site.notes),'Notes must be an array');
for(const key of ['awards','publications','professionalDevelopment','certifications','education','experience','skills'])check(Array.isArray(site[key]),`${key} must be an array`);
check(Array.isArray(site.socials),'Socials must be an array');
check(pkg.scripts?.dev && pkg.scripts?.build,'Next.js dev/build scripts missing');
const slugs=new Set();
for(const x of [...site.projects,...site.notes]){
  check(typeof x.slug==='string'&&/^[a-z0-9-]+$/.test(x.slug),`Invalid slug ${x.slug}`);
  check(!slugs.has(x.slug),`Duplicate slug ${x.slug}`);
  slugs.add(x.slug);
}
for(const x of site.socials)check(/^https:\/\//.test(x.url),`Social URL is not HTTPS: ${x.label}`);
for(const p of site.projects){check(!p.github||/^https:\/\//.test(p.github),`Invalid GitHub URL for ${p.title}`);check(!p.demo||/^https:\/\//.test(p.demo),`Invalid demo URL for ${p.title}`)}
const skillSet=new Set();for(const group of site.skills||[]){for(const s of group.items||[]){const key=s.toLowerCase().replace(/[^a-z0-9]/g,'');check(!skillSet.has(key),`Duplicate skill ${s}`);skillSet.add(key);}}
check(site.education.some(e=>e.school==='Pace University'&&e.gpa==='4.0 / 4.0'),'Pace GPA / recognition missing');
check(site.awards.length===1&&site.awards[0]?.title==='Scholar Award','Recognition must show exactly one Scholar Award');
check(site.publications.length===2,'Expected both research publications');
for(const paper of site.publications)check(/^\/papers\/[a-zA-Z0-9._-]+\.pdf$/.test(paper.pdf||''),`Provide a safe local PDF filename for ${paper.title}`);
check(site.professionalDevelopment.length===2,'Expected both professional-development entries');
check(Array.isArray(site.certifications),'Certifications should be an array (empty until earned)');
for(const f of ['components/PublicationCard.jsx','app/research/page.jsx','app/page.jsx','app/layout.jsx','app/globals.css','app/dashboards/page.jsx','components/TableauGallery.jsx','components/GithubFeed.jsx','.github/workflows/deploy-pages.yml'])check(fs.existsSync(path.join(root,f)),`Missing ${f}`);
check(pkg.scripts['sync:tableau']&&fs.existsSync(path.join(root,'scripts/sync-tableau.mjs')),'Tableau sync script missing');
check(pkg.scripts['sync:github']&&fs.existsSync(path.join(root,'scripts/sync-github.mjs')),'GitHub snapshot script missing');
check(site.tableau?.featured?.[0]?.workbook==='SaaSCustomerChurnRevenueRetentionDashboard','The SaaS dashboard must be featured first');
for(const project of site.projects)check(project.image&&fs.existsSync(path.join(root,'public',project.image.replace(/^\//,''))),`Missing artwork for ${project.title}`);
check(fs.existsSync(path.join(root,'public/.nojekyll')),'GitHub Pages .nojekyll file is missing');
check(fs.existsSync(path.join(root,'public/images/saloni-about-original.jpg')),'Original About portrait missing');
check(fs.readFileSync(path.join(root,'app/about/page.jsx'),'utf8').includes('portrait-original-photo'),'About portrait not connected');
check(fs.readFileSync(path.join(root,'app/page.jsx'),'utf8').includes('id=\"recognition\"'),'Recognition section must be on the homepage');
check(!fs.readFileSync(path.join(root,'app/page.jsx'),'utf8').includes('research-home-section'),'Old separate Research section must be removed');
check(fs.readFileSync(path.join(root,'components/TableauGallery.jsx'),'utf8').includes('tableau-showcase-feature'),'Tableau spotlight showcase missing');
check(fs.readFileSync(path.join(root,'app/page.jsx'),'utf8').includes('id="open-source"'),'GitHub archive must appear inside the Work section');
check(!fs.readFileSync(path.join(root,'app/page.jsx'),'utf8').includes('github-home-section'),'Duplicate GitHub homepage section still present');
check(fs.existsSync(path.join(root,'components/ScrollPolish.jsx')),'Scroll-triggered section animation component missing');
check(!fs.existsSync(path.join(root,'app/api'))&&!fs.existsSync(path.join(root,'app/admin')),'Server-only routes cannot be deployed to GitHub Pages');
if(errors.length){console.error('FAILED VALIDATION:\n'+errors.map(s=>' - '+s).join('\n'));process.exit(1);}console.log(`PASS: ${site.projects.length} featured project(s), ${site.notes.length} note(s), ${site.socials.length} links; required source files present.`);

