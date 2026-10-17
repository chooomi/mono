const clamp01=x=>Math.max(0,Math.min(1,x));
function backInOut(t){const s=2*1.525;return t<.5?((2*t)**2*((s+1)*2*t-s))/2:(((2*t-2)**2*((s+1)*(2*t-2)+s))+2)/2;}
export function floatPose(progress,index,count){
 const t=clamp01(progress*(1+Math.max(0,count-1)*.03)-index*.03);
 const eased=t===0?0:t===1?1:backInOut(t),squeeze=2.3**-.43;
 return {opacity:clamp01(eased),y:120*(1-eased),scaleY:2.3+(1-2.3)*eased,scaleX:squeeze+(1-squeeze)*eased};
}
export function scrollRange(top,height,viewport,maxScroll){
 const start=Math.max(0,Math.min(maxScroll,top+height/2-viewport*1.5));
 return {start,end:Math.max(start+1,Math.min(maxScroll,top+height-viewport*.6))};
}

/** ScrollFloat's float/characters preset, adapted to MONO's native DOM. */
export function installScrollFloat(root){
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 let raf=0,alive=true,needsMeasure=true;
 const initialY=scrollY,started=performance.now();
 const entries=[...root.querySelectorAll('h1,h2')].map(heading=>{
  const original=heading.innerHTML,label=heading.innerText;
  const visual=document.createElement('span');visual.className='scroll-float-visual';visual.setAttribute('aria-hidden','true');
  while(heading.firstChild)visual.append(heading.firstChild);
  const walker=document.createTreeWalker(visual,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){const frag=document.createDocumentFragment();for(const word of node.textContent.split(/(\s+)/)){
   if(!word.trim()){frag.append(document.createTextNode(word));continue;}
   const wrap=document.createElement('span');wrap.className='scroll-float-word';
   for(const char of Array.from(word)){const el=document.createElement('span');el.className='scroll-float-char';el.textContent=char;wrap.append(el);}
   frag.append(wrap);
  }node.replaceWith(frag);}
  const sr=document.createElement('span');sr.className='sr-only';sr.textContent=label;
  heading.append(sr,visual);heading.classList.add('scroll-float');
  const rect=heading.getBoundingClientRect();
  return {heading,original,chars:[...visual.querySelectorAll('.scroll-float-char')],range:{start:0,end:1},initial:rect.top<innerHeight*.8&&rect.bottom>0,last:-1};
 });
 const paint=(entry,p)=>{if(entry.last===p)return;entry.last=p;entry.chars.forEach((el,i)=>{
  const pose=floatPose(p,i,entry.chars.length);el.style.willChange=p===0||p===1?'auto':'transform, opacity';el.style.opacity=String(pose.opacity);el.style.transform=`translateY(${pose.y}%) scale(${pose.scaleX},${pose.scaleY})`;
 });};
 const measure=()=>{const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);for(const e of entries){const r=e.heading.getBoundingClientRect();e.range=scrollRange(r.top+scrollY,r.height,innerHeight,max);}needsMeasure=false;};
 const frame=now=>{raf=0;if(!alive)return;if(needsMeasure)measure();let pending=false;for(const e of entries){
  if(media.matches){paint(e,1);continue;}
  const duration=(1+Math.max(0,e.chars.length-1)*.03)*800;
  if(e.initial){const p=clamp01((now-started)/duration);paint(e,p);if(p<1)pending=true;}
  else paint(e,clamp01((scrollY-e.range.start)/(e.range.end-e.range.start)));
 }if(pending)raf=requestAnimationFrame(frame);};
 const schedule=()=>{if(alive&&!raf)raf=requestAnimationFrame(frame);};
 const resize=()=>{needsMeasure=true;schedule();};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',resize);media.addEventListener('change',schedule);
 document.fonts.ready.then(()=>{if(alive)resize();});
 measure();for(const e of entries)paint(e,media.matches?1:e.initial?0:clamp01((initialY-e.range.start)/(e.range.end-e.range.start)));schedule();
 return ()=>{alive=false;cancelAnimationFrame(raf);removeEventListener('scroll',schedule);removeEventListener('resize',resize);media.removeEventListener('change',schedule);for(const e of entries){if(e.heading.isConnected){e.heading.innerHTML=e.original;e.heading.classList.remove('scroll-float');}}};
}
