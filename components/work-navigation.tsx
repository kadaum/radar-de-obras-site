'use client';

import { useEffect, useState } from 'react';

export type WorkSection = { id: string; label: string };

export function WorkNavigation({ sections }: { sections: WorkSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const targets = sections.map(section => document.getElementById(section.id)).filter((node): node is HTMLElement => !!node);
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = targets[0]?.id;
      for (const target of targets) if (target.getBoundingClientRect().top <= 160) current = target.id;
      if (current) setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, [sections]);
  return <nav className="work-contents" aria-label="Nesta ficha">
    <p className="contents-label">Nesta ficha</p>
    <ol>{sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{section.label}</a></li>)}</ol>
  </nav>;
}
