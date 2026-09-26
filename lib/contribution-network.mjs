export const contributionInsertSql="INSERT INTO contributions (id,work_id,kind,message,observed_on,source_url,status,created_at,reporter_hash) SELECT ?,?,?,?,?,?,'pending',?,? WHERE (SELECT COUNT(*) FROM contributions WHERE reporter_hash IN (?,?) AND created_at>?)<5";
export function networkContext(request,secret){
 const local=['localhost','127.0.0.1'].includes(new URL(request.url).hostname);
 return {ip:request.headers.get('cf-connecting-ip')||(local?'local-preview':null),secret:secret||(local?'local-preview-key-not-for-production-2026':null)};
}
export async function networkIdentifiers(ip,secret,now=Date.now()){
 if(!ip||!secret||secret.length<32)throw new Error('Network protection unavailable');
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const dates=[now,now-86400000].map(value=>new Date(value).toISOString().slice(0,10));
 return Promise.all(dates.map(async day=>{
  const bytes=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${ip}|${day}`));
  return Array.from(new Uint8Array(bytes),value=>value.toString(16).padStart(2,'0')).join('');
 }));
}
