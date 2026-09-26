import {Link2,Mail,Share2} from 'lucide-react';
export function ShareWork({url,title}:{url:string;title:string}){
 const text=`${title} — Radar de Obras\n${url}`;
 return <details className="share-control">
  <summary className="share-button"><Share2 size={17} aria-hidden="true"/> Compartilhar</summary>
  <div className="share-menu">
   <strong>Compartilhe esta obra</strong>
   <p>Envie a ficha ou copie o link permanente.</p>
   <div className="share-options">
    <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
    <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`}><Mail size={16} aria-hidden="true"/> E-mail</a>
   </div>
   <label htmlFor="share-work-url"><Link2 size={15} aria-hidden="true"/> Link da obra</label>
   <input id="share-work-url" aria-label="Link permanente da obra para copiar" value={url} readOnly/>
  </div>
 </details>;
}
