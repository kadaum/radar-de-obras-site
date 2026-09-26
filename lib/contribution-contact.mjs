export const CONTACT_NOTICE_VERSION='contact-2026-09-26-v1';
export function contributionContact(body){
 if(body.emailVerified!==undefined||body.email_verified!==undefined||body.consentAt!==undefined)throw new Error('Campo não permitido.');
 if(body.email!=null&&typeof body.email!=='string')throw new Error('Informe um e-mail válido.');
 const email=body.email?.trim().toLowerCase()||null;
 if(email&&(email.length>254||! /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(email)||email.split('@')[0].length>64||email.startsWith('.')||email.includes('..')))throw new Error('Informe um e-mail válido.');
 if(body.marketingConsent!==undefined&&typeof body.marketingConsent!=='boolean')throw new Error('Escolha uma opção válida para receber novidades.');
 const marketingConsent=body.marketingConsent===true;
 if(marketingConsent&&!email)throw new Error('Informe seu e-mail para receber novidades.');
 return {email,marketingConsent};
}
export const protectedContributionSql=`INSERT INTO contributions
(id,work_id,kind,message,observed_on,source_url,status,created_at,reporter_hash,contact_email,email_verified,marketing_consent,marketing_consent_at,contact_notice_version)
SELECT ?,?,?,?,?,?,'pending',?,?,?,0,?,?,?
WHERE (SELECT COUNT(*) FROM contributions WHERE reporter_hash IN (?,?) AND created_at>?)<5
AND (? IS NULL OR (SELECT COUNT(*) FROM contributions WHERE contact_email=? AND created_at>?)<5)
AND NOT EXISTS(SELECT 1 FROM contributions WHERE work_id=? AND message=? AND created_at>?)
AND (SELECT COUNT(*) FROM contributions WHERE created_at>?)<200
AND (SELECT COUNT(*) FROM contributions)<10000`;
export function contributionBindings({id,workId,kind,message,observedOn,sourceUrl,now,reporterHash,previousHash,email,marketingConsent}){
 return [id,workId,kind,message.trim(),observedOn,sourceUrl,now,reporterHash,email,marketingConsent?1:0,marketingConsent?now:null,CONTACT_NOTICE_VERSION,reporterHash,previousHash,now-3600000,email,email,now-3600000,workId,message.trim(),now-3600000,now-86400000];
}
