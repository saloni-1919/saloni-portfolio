/** Pre-build repository snapshot for GitHub API failure fallback on GitHub Pages. */
import fs from 'node:fs/promises';
const file = new URL('../public/github-feed.json', import.meta.url);
const cleanRepo = r => ({
 id:r.id,name:r.name,description:r.description||'',html_url:r.html_url,language:r.language||null,
 stargazers_count:r.stargazers_count||0,forks_count:r.forks_count||0,topics:Array.isArray(r.topics)?r.topics:[],
 fork:!!r.fork,archived:!!r.archived,updated_at:r.updated_at||null
});
try {
 const records=[];
 for(let page=1;page<=10;page++){
  const response=await fetch(`https://api.github.com/users/saloni-1919/repos?type=owner&sort=updated&per_page=100&page=${page}`,{headers:{'Accept':'application/vnd.github+json','User-Agent':'Saloni-Portfolio-GitHub-Pages'},signal:AbortSignal.timeout(15000)});
  if(!response.ok) throw new Error(`GitHub HTTP ${response.status}`);
  const batch=await response.json();if(!Array.isArray(batch))throw new Error('Unexpected GitHub response');
  records.push(...batch);if(batch.length<100)break;
 }
 await fs.writeFile(file,JSON.stringify({repos:records.filter(r=>!r.private).map(cleanRepo),generatedAt:new Date().toISOString()},null,2)+'\n');
 console.log(`GitHub: cached ${records.length} public repository record(s)`);
}catch(err){
 console.warn(`GitHub snapshot unavailable; preserving prior cache: ${err.message}`);
 try{await fs.access(file);}catch{await fs.writeFile(file,'{"repos":[],"generatedAt":null}\n');}
}
