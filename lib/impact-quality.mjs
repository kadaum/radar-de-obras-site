export function impactQuality(value,threshold){
 if(value===null||value===undefined)return 'missing';
 if(!Number.isSafeInteger(value)||value<0)return 'invalid';
 if(typeof threshold==='number'&&value>threshold)return 'outlier';
 return 'unverified';
}
