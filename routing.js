import {DEFAULT_CONFIG,MODELS,FACADES,FINISHES} from './models.js';
export function pageLocation(location,base=''){
 if(base&&location.hash?.startsWith('#/')){const route=new URL(location.hash.slice(1),'https://mono.invalid');return {path:route.pathname,search:route.search,hash:route.hash};}
 const pathname=base&&location.pathname.startsWith(base+'/')?location.pathname.slice(base.length):location.pathname;
 return {path:pathname||'/',search:location.search||'',hash:location.hash||''};
}
export function siteURL(href,base=''){
 if(!base)return href;
 const route=new URL(href,'https://mono.invalid');
 return route.pathname==='/'&&!route.search?base+'/'+route.hash:base+'/#'+route.pathname+route.search+route.hash;
}
export function configFromSearch(search,current=DEFAULT_CONFIG){
 const params=new URLSearchParams(search),result={...current};
 const allowed={model:MODELS.map(m=>m.id),facade:FACADES.map(f=>f.id),terrace:['none','open'],finish:FINISHES.map(f=>f.id)};
 for(const key of Object.keys(allowed))if(params.has(key))result[key]=allowed[key].includes(params.get(key))?params.get(key):DEFAULT_CONFIG[key];
 return result;
}
export function configQuery(c){return '?'+new URLSearchParams({model:c.model,facade:c.facade,terrace:c.terrace,finish:c.finish}).toString();}
