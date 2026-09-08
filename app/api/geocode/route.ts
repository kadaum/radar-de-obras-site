export async function GET(request: Request) {
  const q=(new URL(request.url).searchParams.get('q')??'').trim().slice(0,180);
  if(q.length<3)return Response.json({error:'Informe uma rua, cidade ou CEP.'},{status:400});
  let query=q;
  if(/^\d{5}-?\d{3}$/.test(q)){
    const cepResponse=await fetch(`https://brasilapi.com.br/api/cep/v2/${q.replace(/\D/g,'')}`);
    if(cepResponse.ok){const cep:any=await cepResponse.json();query=[cep.street,cep.neighborhood,cep.city,cep.state,'Brasil'].filter(Boolean).join(', ');}
  }
  const response=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=br&limit=4&q=${encodeURIComponent(query)}`,{headers:{'User-Agent':'RadarDeObrasHosted/0.1','Accept-Language':'pt-BR'}});
  if(!response.ok)return Response.json({error:'Serviço de endereço indisponível.'},{status:502});
  const rows:any[]=await response.json();
  return Response.json(rows.map(row=>({label:row.display_name,point:[Number(row.lon),Number(row.lat)],source:'OpenStreetMap / Nominatim',precision:'Resultado de geocodificação; confira o local e o trecho'})));
}
