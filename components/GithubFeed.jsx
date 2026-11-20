'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Code2, GitFork, Search, Star, RotateCw } from 'lucide-react';
import {publicPath} from '@/lib/publicPath';

const GITHUB_PROFILE = 'https://github.com/saloni-1919?tab=repositories';
const formatName = name => name.replace(/[-_]/g, ' ');

export default function GithubFeed({ preview = false }) {
  const [repos, setRepos] = useState([]);
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('All languages');
  const [kind, setKind] = useState('Everything');
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);setError('');
    const getRepos = async () => {
      const all = [];
      for (let page = 1; page <= 10; page++) {
        const response = await fetch(`https://api.github.com/users/saloni-1919/repos?type=owner&sort=updated&per_page=100&page=${page}`, {
          signal: controller.signal, headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store'
        });
        if(!response.ok) throw new Error(`GitHub API returned ${response.status}`);
        const batch = await response.json();
        if(!Array.isArray(batch)) throw new Error('Unexpected GitHub response');
        all.push(...batch.filter(r=>!r.private));
        if(batch.length < 100) break;
      }
      return all;
    };
    (async () => {
      try {setRepos(await getRepos());}
      catch (err) {
        if(controller.signal.aborted) return;
        try {
          const cached=await fetch(publicPath('/github-feed.json'),{signal:controller.signal});
          if(!cached.ok)throw new Error('No snapshot');
          const payload=await cached.json();
          if(!Array.isArray(payload.repos) || payload.repos.length===0)throw new Error('Empty snapshot');
          setRepos(payload.repos);
          setError('Showing last published repository snapshot. Live GitHub API is temporarily unavailable.');
        }catch {if(!controller.signal.aborted)setError('Live GitHub API is temporarily unavailable.');}
      }
      finally {if(!controller.signal.aborted)setLoading(false);}
    })();
    return () => controller.abort();
  }, [retry]);

  const languages = useMemo(() => ['All languages', ...new Set(repos.map(r => r.language).filter(Boolean))].sort((a,b) => a === 'All languages' ? -1 : b === 'All languages' ? 1 : a.localeCompare(b)), [repos]);
  const filtered = useMemo(() => {
    const match = query.trim().toLowerCase();
    const list = repos.filter(repo => {
      const matchesText = !match || [repo.name, repo.description, repo.language, ...(repo.topics || [])].join(' ').toLowerCase().includes(match);
      const matchesLanguage = language === 'All languages' || repo.language === language;
      const matchesKind = kind === 'Everything' || (kind === 'Originals' && !repo.fork) || (kind === 'Forks' && repo.fork) || (kind === 'Archived' && repo.archived);
      return matchesText && matchesLanguage && matchesKind;
    });
    return [...list].sort((a,b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'stars' ? b.stargazers_count - a.stargazers_count : new Date(b.updated_at) - new Date(a.updated_at));
  }, [repos, query, language, kind, sort]);

  const shown = preview ? filtered.slice(0, 3) : filtered;
  const forkCount = repos.filter(r => r.fork).length;

  return <div className={`github-feed ${preview ? 'github-preview' : 'github-all'}`}>
    <div className="github-feed-heading">
      <div>
        <span className="eyebrow muted">PUBLIC GITHUB REPOSITORIES · AUTO-UPDATING</span>
        <p className="repo-count" aria-live="polite">{loading ? 'Syncing with GitHub…' : error && repos.length===0 ? 'Feed temporarily unavailable' : <><strong>{repos.length}</strong> public repositories{!preview && ` · ${filtered.length} showing`}</>}</p>
      </div>
      <a className="text-link" href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">GITHUB PROFILE <ArrowUpRight size={18}/></a>
    </div>

    {!preview && !loading && repos.length>0 && <>
      <p className="repo-context">Everything in Saloni’s public GitHub account, including forks and archived repositories. Featured projects above are hand-picked; the gallery below stays in sync with GitHub.</p>
      <div className="repo-tools">
        <label className="repo-search"><Search size={18}/><input aria-label="Search GitHub repositories" placeholder="Search names, descriptions, topics…" value={query} onChange={e => setQuery(e.target.value)} /></label>
        <select aria-label="Filter by programming language" value={language} onChange={e => setLanguage(e.target.value)}>{languages.map(l => <option key={l} value={l}>{l}</option>)}</select>
        <select aria-label="Filter repository type" value={kind} onChange={e => setKind(e.target.value)}>{['Everything', 'Originals', 'Forks', 'Archived'].map(k => <option key={k}>{k}</option>)}</select>
        <select aria-label="Sort repositories" value={sort} onChange={e => setSort(e.target.value)}><option value="recent">Recently updated</option><option value="name">Name A–Z</option><option value="stars">Most starred</option></select>
      </div>
      <div className="repo-filter-summary" aria-live="polite">Showing {filtered.length} of {repos.length} repositories · {forkCount} forks included</div>
    </>}

    {loading ? <div className="repo-loading" role="status">Loading Saloni’s repositories from GitHub…</div>
      : error && !repos.length ? <div className="empty-state" role="status"><p>{error} You can still see all repositories on GitHub.</p><div className="repo-error-actions"><button className="outline-button" onClick={() => setRetry(n => n + 1)}><RotateCw size={16}/> RETRY</button><a className="text-link" href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">OPEN GITHUB <ArrowUpRight size={18}/></a></div></div>
      : shown.length === 0 ? <p className="empty-state" role="status">No repositories match these filters. Try a different search.</p>
      : <div className="repo-grid">{shown.map(repo => <a key={repo.id || repo.html_url} className="repo-card" href={repo.html_url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${repo.name} on GitHub`}>
          <div className="repo-icon"><Code2 size={23}/><ArrowUpRight size={19}/></div>
          <div className="repo-flags">{repo.fork && <span><GitFork size={12}/> Fork</span>}{repo.archived && <span>Archived</span>}</div>
          <h3>{formatName(repo.name)}</h3>
          <p>{repo.description || 'Explore the repository, source code and README on GitHub.'}</p>
          <div className="repo-card-foot"><span className="repo-language">{repo.language || 'Code repository'}</span><span><Star size={13}/> {repo.stargazers_count}</span><span><GitFork size={13}/> {repo.forks_count || 0}</span></div>
        </a>)}</div>}

    {error && repos.length>0 && <p className="repo-context" role="status">{error}</p>}
    {preview && (!error || repos.length>0) && <div className="github-preview-footer"><Link href="/projects#all-repositories" className="pill-button">EXPLORE ALL {repos.length || ''} REPOSITORIES <ArrowUpRight size={18}/></Link><span>New repositories appear automatically when GitHub's public API is available</span></div>}
  </div>;
}
