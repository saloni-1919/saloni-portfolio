'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, BookOpen, FileText } from 'lucide-react';
import { publicPath } from '@/lib/publicPath';

/**
 * A research paper is linked only after its actual PDF exists on the site.
 * Drop a real PDF into public/papers/ with the path configured in data/site.json;
 * it becomes a clickable, new-tab link without changing this component.
 */
export default function PublicationCard({publication, index=0}) {
  const relativePath = /^\/papers\/[a-zA-Z0-9._-]+\.pdf$/.test(publication.pdf || '')
    ? publication.pdf : null;
  const href = relativePath ? publicPath(relativePath) : null;
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!href) return;
    let active = true;
    fetch(href, { method: 'HEAD', cache: 'no-store' })
      .then(response => { if (active) setAvailable(response.ok); })
      .catch(() => { if (active) setAvailable(false); });
    return () => { active = false; };
  }, [href]);

  const inside = <>
    <div className="recognition-paper-top">
      <span className="recognition-paper-count">PAPER / {String(index + 1).padStart(2, '0')}</span>
      {available ? <ArrowUpRight size={23} aria-hidden="true" /> : <BookOpen size={23} aria-hidden="true" />}
    </div>
    <p className="eyebrow">{publication.type} · {publication.date}</p>
    <h3>{publication.title}</h3>
    <p className="recognition-paper-venue">{publication.venue}</p>
    <p className="recognition-paper-summary">{publication.summary}</p>
    <span className={'recognition-paper-action' + (available ? ' ready' : '')}>
      <FileText size={16} aria-hidden="true" />
      {available ? 'OPEN RESEARCH PAPER (PDF)' : 'PDF TO BE UPLOADED'}
      {available && <ArrowUpRight size={16} aria-hidden="true" />}
    </span>
  </>;

  return available && href
    ? <a className="recognition-paper-card clickable" href={href} target="_blank" rel="noopener noreferrer"
        aria-label={`Open PDF: ${publication.title}`}>{inside}</a>
    : <article className="recognition-paper-card" aria-label={`${publication.title} — PDF not yet uploaded`}>{inside}</article>;
}
