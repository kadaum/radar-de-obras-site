import { Building2, GraduationCap, HeartPulse, Route, Waves, Bus, Shield, Landmark, Leaf, Zap, TrainFront, Plane, Radio, Factory, FlaskConical, BriefcaseBusiness, Wheat, Trophy, Users, Fuel, CircleHelp } from 'lucide-react';
import enrichment from '@/lib/work-enrichment.json';
import Link from 'next/link';
import {areaPath} from '@/lib/official-areas.mjs';

// Presentation only: preserve the source label and never infer a facility from an area.
const icons: Record<string, typeof Building2> = {
  'saúde': HeartPulse, 'educação': GraduationCap, 'rodovia': Route,
  'infraestrutura hídrica, portos, hidrovia': Waves, 'infraestrutura urbana e mobilidade': Bus,
  'desenvolvimento': Building2, 'defesa civil': Shield, 'esporte': Trophy,
  'administrativo': Landmark, 'assistência social': Users, 'cultura': Landmark,
  'segurança pública': Shield, 'meio ambiente': Leaf, 'agricultura e organização agrária': Wheat,
  'defesa nacional': Shield, 'trabalho e emprego': BriefcaseBusiness, 'aviação civil': Plane,
  'energia': Zap, 'indústria, serviços e comércio exterior': Factory,
  'ciência, tecnologia e inovação': FlaskConical, 'ferrovia': TrainFront,
  'comunicações': Radio, 'previdência social': Users, 'petróleo, gás e outros hcs': Fuel,
};

export function WorkClassification({ id, classification }: { id: string; classification?: {type:string|null}[] }) {
  const item = enrichment.projects[id as keyof typeof enrichment.projects];
  const types = [...new Map((classification ?? item?.classification ?? []).flatMap(x => x.type?.trim() ? [[x.type.trim().toLocaleLowerCase('pt-BR'),x.type.trim()] as const] : [])).entries()];
  if (!types.length) return null;
  return <div className="work-classification" aria-label="Áreas oficiais do projeto">
    {types.map(([key, label]) => { const Icon = icons[key] || CircleHelp; return <Link href={areaPath(label)} className="classification-chip" key={key} aria-label={`Explorar obras da área ${label}`}><Icon size={17} aria-hidden="true" /><span>{label}</span><span aria-hidden="true">↗</span></Link>; })}
    <span className="classification-origin">Classificação oficial</span>
  </div>;
}
