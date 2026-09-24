import brazilBoundary from '../data/brazil-boundary.json' with {type:'json'};

// Fonte oficial: IBGE, API de Malhas v3, país BR, qualidade máxima.
// https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&qualidade=maxima
// Mesmo a malha máxima é generalizada. Pontos sobre a água, muito próximos da costa
// ou em ilhas pequenas podem ficar fora mesmo quando o cadastro descreve uma obra
// litorânea. A validação geográfica não valida a precisão do ponto de origem.

const EPSILON=1e-10;
const KM_PER_LATITUDE_DEGREE=111.195;
export const NEAR_BOUNDARY_KM=5;

function onSegment(point,start,end){
 const [x,y]=point,[x1,y1]=start,[x2,y2]=end;
 const cross=(x-x1)*(y2-y1)-(y-y1)*(x2-x1);
 const scale=Math.max(1,Math.abs(x2-x1),Math.abs(y2-y1));
 return Math.abs(cross)<=EPSILON*scale&&
  x>=Math.min(x1,x2)-EPSILON&&x<=Math.max(x1,x2)+EPSILON&&
  y>=Math.min(y1,y2)-EPSILON&&y<=Math.max(y1,y2)+EPSILON;
}

// 0 = fora, 1 = dentro, 2 = exatamente na fronteira.
function ringPosition(point,ring){
 if(!Array.isArray(ring)||ring.length<3)return 0;
 const [x,y]=point;
 let inside=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const start=ring[j],end=ring[i];
  if(onSegment(point,start,end))return 2;
  const [x1,y1]=start,[x2,y2]=end;
  if((y1>y)!==(y2>y)&&x<(x2-x1)*(y-y1)/(y2-y1)+x1)inside=!inside;
 }
 return inside?1:0;
}

function inPolygon(point,rings){
 const exterior=ringPosition(point,rings?.[0]);
 if(exterior===0)return false;
 if(exterior===2)return true;
 for(const hole of rings.slice(1)){
  const position=ringPosition(point,hole);
  if(position===2)return true;
  if(position===1)return false;
 }
 return true;
}

function geometries(geojson){
 if(geojson?.type==='FeatureCollection')return geojson.features.flatMap(geometries);
 if(geojson?.type==='Feature')return geometries(geojson.geometry);
 return geojson?[geojson]:[];
}

function segmentDistanceKm(point,start,end){
 const longitudeScale=Math.cos(point[1]*Math.PI/180);
 const x=point[0]*longitudeScale,y=point[1];
 const x1=start[0]*longitudeScale,y1=start[1];
 const x2=end[0]*longitudeScale,y2=end[1];
 const dx=x2-x1,dy=y2-y1,lengthSquared=dx*dx+dy*dy;
 const fraction=lengthSquared?Math.max(0,Math.min(1,((x-x1)*dx+(y-y1)*dy)/lengthSquared)):0;
 return Math.hypot(x-(x1+fraction*dx),y-(y1+fraction*dy))*KM_PER_LATITUDE_DEGREE;
}

function distanceToBoundaryKm(point,geometry){
 const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.type==='MultiPolygon'?geometry.coordinates:[];
 let nearest=Infinity;
 for(const polygon of polygons){
  for(const ring of polygon){
   for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    nearest=Math.min(nearest,segmentDistanceKm(point,ring[j],ring[i]));
   }
  }
 }
 return nearest;
}

/**
 * Classifica o ponto como `inside`, `near-boundary` (até 5 km) ou `outside`.
 * A faixa de proximidade serve para revisão humana: como o GeoJSON nacional não
 * distingue costa de fronteira terrestre, ela não comprova que o ponto é brasileiro.
 * A margem compensa simplificações de até alguns quilômetros observadas na costa,
 * mas também inclui pontos até 5 km além de fronteiras internacionais.
 */
export function geographyCheck(point){
 if(!Array.isArray(point)||point.length!==2||!point.every(Number.isFinite))return 'outside';
 const shapes=geometries(brazilBoundary);
 for(const geometry of shapes){
  if(geometry.type==='Polygon'&&inPolygon(point,geometry.coordinates))return 'inside';
  if(geometry.type==='MultiPolygon'&&geometry.coordinates.some(polygon=>inPolygon(point,polygon)))return 'inside';
 }
 const distance=Math.min(...shapes.map(geometry=>distanceToBoundaryKm(point,geometry)));
 return distance<=NEAR_BOUNDARY_KM?'near-boundary':'outside';
}

/**
 * Retorna se [longitude, latitude] está estritamente dentro da malha oficial máxima.
 * Pontos `near-boundary` continuam falsos aqui para não alterar a semântica do predicado.
 */
export function pointInBrazil(point){
 return geographyCheck(point)==='inside';
}
