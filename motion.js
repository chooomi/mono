const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealObserver;

/** Keep content visible by default; motion is progressive enhancement. */
export function introMotion(root){
 revealObserver?.disconnect();
 if(reduced()||!Element.prototype.animate)return;
 const hero=root.querySelector(".hero-photo,.model-hero,.approach-image");
 hero?.animate([{opacity:.45,clipPath:"inset(4% 0 0 0)"},{opacity:1,clipPath:"inset(0% 0 0 0)"}],{duration:950,easing:"cubic-bezier(.2,.7,.25,1)"});
}

/** Crossfade only after the replacement has decoded; stale requests cannot win. */
export async function swapImage(image,src,alt){
 if(!image||image.getAttribute('src')===src){if(image&&alt)image.alt=alt;return;}
 const parent=image.parentElement;
 const visible=parent.querySelector('.image-previous')||image;
 const previous=visible.complete&&visible.naturalWidth?visible.cloneNode():null;
 parent.querySelectorAll('.image-previous').forEach(el=>el.remove());
 const token=Symbol('image-change');
 image._transitionToken=token;
 image.getAnimations().forEach(a=>a.cancel());
 if(previous&&!reduced()){
  previous.removeAttribute('id');previous.alt='';previous.setAttribute('aria-hidden','true');
  previous.style.objectPosition=getComputedStyle(image).objectPosition;
  previous.className='image-previous';parent.append(previous);
 }
 image.src=src;if(alt)image.alt=alt;
 try{await image.decode();}catch{previous?.remove();return;}
 if(image._transitionToken!==token||!image.isConnected)return;
 if(previous?.isConnected){
  const animation=previous.animate([{opacity:1},{opacity:0}],{duration:520,easing:'ease-in-out'});
  animation.finished.then(()=>previous.remove()).catch(()=>previous.remove());
  image.animate([{transform:'scale(1.018)'},{transform:'scale(1)'}],{duration:700,easing:'cubic-bezier(.2,.7,.25,1)'});
 }
}

export function panelMotion(element){
 if(!reduced()&&Element.prototype.animate)element?.animate([{opacity:.3,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:330,easing:'ease-out'});
}
