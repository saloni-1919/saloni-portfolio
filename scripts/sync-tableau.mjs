/**
 * Build-time Tableau Public discovery for static GitHub Pages.
 * No credentials; pinned reports are always present as a safety net.
 * Tableau's author workbook endpoint is publicly accessible but undocumented.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
const site = JSON.parse(await fs.readFile(new URL('../data/site.json', import.meta.url), 'utf8'));
const {tableau} = site;
const file = new URL('../public/tableau-feed.json', import.meta.url);
const pageSize = 50;
const safe = x => typeof x === 'string' && /^[A-Za-z0-9_.-]{1,180}$/.test(x) ? x : '';
const pretty = x => x.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_]+/g,' ').trim();
function shape({workbook, view, title='', subtitle='', description='', category='TABLEAU PUBLIC', updatedAt=null, isFeatured=false, primary=false}) {
  const wb = safe(workbook), vw = safe(view);
  if (!wb || !vw) return null;
  const raw = `https://public.tableau.com/views/${encodeURIComponent(wb)}/${encodeURIComponent(vw)}`;
  return {
    id: wb, workbook: wb, view: vw, title: title || pretty(wb), subtitle, description, category,
    primary, isFeatured, updatedAt,
    embedUrl: `${raw}?:showVizHome=no&:embed=yes&:toolbar=yes`,
    publicUrl: `https://public.tableau.com/app/profile/${tableau.profile}/viz/${encodeURIComponent(wb)}/${encodeURIComponent(vw)}`,
    thumbnail: `https://public.tableau.com/thumb/views/${encodeURIComponent(wb)}/${encodeURIComponent(vw)}`
  };
}
const pinned = tableau.featured.map((d,i)=>shape({...d,isFeatured:true, primary:i===0})).filter(Boolean);
const clean = x => String(x || '').replace(/<[^>]*>/g,'').slice(0,400);
function extract(json){
  if (Array.isArray(json)) return json;
  for(const value of [json?.contents,json?.workbooks,json?.data?.contents,json?.results]) if(Array.isArray(value))return value;
  throw new Error('Unexpected Tableau listing format');
}
function transform(raw){
  if (!raw || raw.showInProfile === false) return null;
  const wb = safe(raw.workbookRepoUrl || raw.repoUrl || '');
  const view = safe(String(raw.defaultViewRepoUrl || '').split('/').filter(Boolean).pop()) || safe(String(raw.defaultViewName || '').replace(/[\s.]/g,''));
  return shape({workbook:wb,view,title:clean(raw.title)||pretty(wb),description:clean(raw.description),updatedAt:raw.lastPublishDate || raw.lastUpdateDate || null});
}
let discovered=[]; let synced=false;
try {
  const records=[];
  for (let start=0; start<1000; start+=pageSize) {
    const u=`https://public.tableau.com/public/apis/workbooks?profileName=${encodeURIComponent(tableau.profile)}&start=${start}&count=${pageSize}&visibility=NON_HIDDEN`;
    const response=await fetch(u,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const batch=extract(await response.json());records.push(...batch);
    if(batch.length<pageSize)break;
  }
  discovered=records.map(transform).filter(Boolean);synced=true;
  console.log(`Tableau Public: discovered ${discovered.length} dashboard(s)`);
} catch(err){
  console.warn(`Tableau Public unavailable, using previous feed/fallback: ${err.message}`);
  try{
    const prior=JSON.parse(await fs.readFile(file,'utf8'));
    discovered=(prior.dashboards || []).filter(d => !d.isFeatured && safe(d.workbook) && safe(d.view)).map(d=>shape(d)).filter(Boolean);
  }catch{}
}
const seen=new Set(pinned.map(d=>d.workbook.toLowerCase()));
const extra=discovered.filter(d=>{const k=d.workbook.toLowerCase();if(seen.has(k))return false;seen.add(k);return true;}).sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
const output={dashboards:[...pinned,...extra],featured:pinned.length,autoSync:synced,profile:tableau.profileUrl,generatedAt:new Date().toISOString(),refreshHours:6};
await fs.writeFile(file, JSON.stringify(output,null,2)+'\n');
console.log(`Wrote ${output.dashboards.length} dashboard(s) to public/tableau-feed.json`);
