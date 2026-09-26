'use client';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NativeSelect } from '@/components/ui/native-select';
import { Button } from '@/components/ui/button';

export function ContributionForm({ workId }: { workId: string }) {
  const [kind,setKind]=useState('correction');
  const [state,setState]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const [message,setMessage]=useState('');
  const [available,setAvailable]=useState<boolean|null>(null);
  useEffect(()=>{const controller=new AbortController();void fetch('/api/contributions',{signal:controller.signal}).then(response=>response.ok?response.json():null).then(result=>setAvailable(!!result&&typeof result==='object'&&'available' in result&&result.available===true)).catch(()=>{if(!controller.signal.aborted)setAvailable(false);});return()=>controller.abort();},[]);
  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault(); if(state==='sending')return;
    const form=event.currentTarget; const values=new FormData(form);
    setState('sending');setMessage('');
    try {
      const response=await fetch('/api/contributions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({workId,kind,message:values.get('message'),observedOn:values.get('observedOn'),sourceUrl:values.get('sourceUrl'),website:values.get('website')})});
      const result=await response.json() as { error?:string; receipt?:string };
      if(!response.ok)throw new Error(result.error || 'Não foi possível enviar. Tente novamente.');
      setMessage('Recebido para análise. Protocolo '+result.receipt+'. A contribuição ainda não foi publicada.');setState('success');form.reset();
    } catch(error) { setMessage(error instanceof Error?error.message:'Não foi possível enviar. Seus dados continuam no formulário.');setState('error'); }
  }
  return <section id="colaborar" className="contribution-card" aria-labelledby="contribution-title">
    <div className="contribution-intro"><MessageSquarePlus size={24} aria-hidden="true" /><div><h2 id="contribution-title">Sabe algo sobre esta obra?</h2><p>Ajude a corrigir uma informação, registrar o que observou ou encontrar uma foto pública.</p></div></div>
    {available===false?<p className="context-note">O envio está temporariamente indisponível. Tente novamente mais tarde.</p>:state==='success'?<div className="contribution-success" aria-live="polite"><CheckCircle2 size={24} aria-hidden="true" /><p>{message}</p><Button variant="outline" onClick={()=>setState('idle')}>Enviar outra contribuição</Button></div>:<form onSubmit={submit}><fieldset disabled={state==='sending'||available!==true}>
      <label htmlFor="contribution-kind">O que você quer informar?</label><NativeSelect id="contribution-kind" value={kind} onChange={e=>setKind(e.target.value)}><option value="correction">Corrigir uma informação</option><option value="observation">Informar o andamento observado</option><option value="public_source">Indicar foto ou documento público</option></NativeSelect>
      <label htmlFor="contribution-message">Conte o que você sabe</label><Textarea id="contribution-message" name="message" required minLength={20} maxLength={2000} rows={3} placeholder="Qual informação precisa mudar? O que você observou?" />
      <div className="contribution-fields"><div><label htmlFor="contribution-date">Data da observação{kind==='observation'?'':' (opcional)'}</label><Input id="contribution-date" name="observedOn" type="date" required={kind==='observation'} max={new Date().toISOString().slice(0,10)} /></div><div><label htmlFor="contribution-url">Link público{kind==='public_source'?'':' (opcional)'}</label><Input id="contribution-url" name="sourceUrl" type="url" maxLength={1500} required={kind==='public_source'} placeholder="https://" /></div></div>
      <div className="form-trap" aria-hidden="true"><label htmlFor="contribution-website">Deixe vazio</label><input id="contribution-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <p className="contribution-policy">Sem cadastro. Não inclua dados pessoais. As contribuições são revisadas antes de qualquer publicação e não alteram o status oficial automaticamente.</p>
      <Button type="submit" disabled={state==='sending'} className="contribution-submit">{state==='sending'?'Enviando…':'Enviar para análise'}</Button>
      <p role={state==='error'?'alert':'status'} aria-live="polite" className="form-message">{message}</p>
    </fieldset></form>}
  </section>;
}
