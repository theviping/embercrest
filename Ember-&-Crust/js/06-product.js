/* ============ Product modal: quick view, customisation, reviews ============ */
let PM=null;
const optPrice=v=>v>0?'+'+inr(v):'Included';
function optGroup(p,k,g){
  const cur=PM.sel[k];
  if(g.type==='toggle')return`<fieldset class="opt-g"><legend>${g.label}</legend><label class="opt wide"><input type="checkbox" data-pm="toggle" data-k="${k}" ${cur?'checked':''}><span class="opt-c"><b>${g.label}</b><small>${g.sub}</small><em>+${inr(g.price)}</em></span></label></fieldset>`;
  const items=optItems(p,k);
  if(g.type==='one')return`<fieldset class="opt-g"><legend>${g.label} <span class="req-t">Choose 1</span></legend><div class="opt-grid">${items.map(i=>`<label class="opt"><input type="radio" name="pm-${k}" value="${i[0]}" data-pm="one" data-k="${k}" ${cur===i[0]?'checked':''}><span class="opt-c"><b>${i[1]}</b>${i[2]?`<small>${i[2]}</small>`:''}<em>${optPrice(i[3])}</em></span></label>`).join('')}</div></fieldset>`;
  return`<fieldset class="opt-g"><legend>${g.label} <span class="req-t">Optional</span></legend><div class="opt-chips">${items.map(i=>`<label class="opt chip-o"><input type="checkbox" value="${i[0]}" data-pm="many" data-k="${k}" ${(cur||[]).includes(i[0])?'checked':''}><span class="opt-c"><b>${i[1]}</b><em>+${inr(i[3])}</em></span></label>`).join('')}</div></fieldset>`}
function revList(p){const rs=(S.reviews[p.id]||[]).filter(r=>!r.hidden).sort((a,b)=>b.ts-a.ts);
  return`<div class="rv-sum"><div><b>${p.rating.toFixed(1)}</b>${starRow(Math.round(p.rating))}<small>${p.rev.toLocaleString('en-IN')} ratings</small></div><button class="btn ghost sm" data-act="writeReview" data-id="${p.id}">Write a review</button></div><div id="rv-form"></div>
  <ul class="rv-list">${rs.length?rs.slice(0,5).map(r=>`<li class="rv">${avatar(r.name,'#'+(hash(r.name)%0xB0B0B0+0x400000).toString(16).slice(0,6).padStart(6,'4'))}<div><div class="rv-h"><b>${esc(r.name)}</b>${starRow(r.rating)}${r.verified?`<span class="ver">${ic('check')} Verified purchase</span>`:''}<small>${ago(r.ts)}</small></div><p>${esc(r.text)}</p>${r.img?`<img class="rv-img" src="${r.img}" alt="Photo shared by ${esc(r.name)}" loading="lazy">`:''}</div></li>`).join(''):'<li class="muted">No reviews yet. Be the first to share how it tasted.</li>'}</ul>`}
function pmHTML(){
  const {p}=PM,g=p.cust?OPT[p.cust]:null,fav=favs().includes(p.id),pr=pairFor(p),cat=catOf(p.cat);
  const opts=g?Object.keys(g).map(k=>optGroup(p,k,g[k])).join(''):'';
  const fbt=!PM.edit&&pr.length?`<section class="fbt"><h4>Frequently bought together</h4><div class="fbt-row">${[p,...pr].map((x,i)=>`${i?'<span class="plus">+</span>':''}<div class="fbt-i"><span class="fbt-a">${media(x)}</span><small>${esc(x.name)}</small><b>${inr(i?x.price:p.price+selPrice(p,PM.sel))}</b></div>`).join('')}</div><button class="btn ink block" data-act="fbtAdd">${ic('plus')} Add all ${pr.length+1} to cart · <span id="fbt-t"></span></button></section>`:'';
  return`<div class="pm-scroll"><div class="pm-grid"><div class="pm-left"><div class="pm-art"><span class="pm-art-in">${media(p)}</span><div class="pc-badges">${badges(p)}</div><button class="pc-fav${fav?' on':''}" data-act="fav" data-id="${p.id}" aria-pressed="${fav}" aria-label="Save to favourites">${fav?icFill('heart'):ic('heart')}</button></div>
  <div class="pm-info"><p class="crumb">${cat.emoji} ${cat.name}</p><h2>${vm(p.veg)} ${esc(p.name)}</h2><div class="pc-meta">${stars(p.rating,p.rev)}${spice(p.spice)}${lowStock(p)?`<span class="badge off">Only ${p.stock} left</span>`:''}</div><p>${esc(p.desc)}</p><div class="ing">${p.ing.map(i=>`<span>${esc(i)}</span>`).join('')}</div></div></div>
  <div class="pm-right">${opts}<div class="fld"><label for="pm-instr">Special instructions <small class="muted">(optional)</small></label><textarea id="pm-instr" rows="2" maxlength="140" placeholder="E.g. less spicy, no onions, extra crispy">${esc(PM.instr)}</textarea></div>${fbt}<section class="rv-sec" aria-label="Reviews"><h4>Reviews</h4>${revList(p)}</section></div></div></div>
  <button class="x-btn pm-x" data-act="closeLayer" aria-label="Close">${ic('x')}</button>
  <div class="pm-foot"><div class="qty lg" role="group" aria-label="Quantity"><button data-act="pmQty" data-d="-1" aria-label="Decrease quantity">${ic('minus')}</button><output id="pm-q" aria-live="polite">${PM.qty}</output><button data-act="pmQty" data-d="1" aria-label="Increase quantity">${ic('plus')}</button></div><button class="btn red lg grow" data-act="pmAdd" id="pm-add" ${outOf(p)?'disabled':''}></button></div>`}
function updatePM(){if(!PM)return;const{p}=PM,unit=p.price+selPrice(p,PM.sel);$('#pm-q').textContent=PM.qty;const b=$('#pm-add');b.innerHTML=outOf(p)?'Out of stock':`${PM.edit?'Update cart':'Add to cart'} · ${inr(unit*PM.qty)}`;
  const t=$('#fbt-t');if(t)t.textContent=inr(unit+pairFor(p).reduce((a,x)=>a+x.price,0));const mrpEl=$('.pm-info .pm-price');}
function openProduct(pid,{edit}={}){
  const p=prod(pid);if(!p)return;const line=edit&&S.cart.find(l=>l.id===edit);
  PM={p,sel:line?JSON.parse(JSON.stringify(line.sel)):defSel(p),qty:line?line.qty:1,instr:line?line.instr:'',edit:line?line.id:null};
  const el=openLayer(pmHTML(),{kind:'sheet',cls:'pm',label:p.name+' — details and customisation',onClose:()=>{PM=null;if(/^#\/product\//.test(location.hash))history.replaceState(null,'','#/menu')}});
  updatePM();setProductLD(p)}
CHG.pm=t=>{if(!PM)return;const k=t.dataset.k,ty=t.dataset.pm;if(ty==='one')PM.sel[k]=t.value;else if(ty==='toggle')PM.sel[k]=t.checked?1:0;else{const a=PM.sel[k]=PM.sel[k]||[];const i=a.indexOf(t.value);if(t.checked&&i<0)a.push(t.value);if(!t.checked&&i>=0)a.splice(i,1)}updatePM()};
A.pv=b=>openProduct(b.dataset.id);
A.pmQty=b=>{PM.qty=clamp(PM.qty+ +b.dataset.d,1,Math.max(1,Math.min(20,PM.p.stock)));updatePM()};
A.pmAdd=()=>{if(!PM)return;PM.instr=($('#pm-instr')||{}).value||'';const{p}=PM;
  if(PM.edit){const l=S.cart.find(x=>x.id===PM.edit);if(l){l.sel=PM.sel;l.qty=PM.qty;l.instr=PM.instr;l.k=lineKey(p.id,l.sel,l.instr);save();refreshCart();toast(p.name+' updated','ok')}closeLayer(layerEl('pm'));return}
  if(addLine(p.id,{sel:PM.sel,qty:PM.qty,instr:PM.instr}))closeLayer(layerEl('pm'))};
A.fbtAdd=()=>{PM.instr=($('#pm-instr')||{}).value||'';const{p}=PM;let ok=addLine(p.id,{sel:PM.sel,qty:PM.qty,instr:PM.instr,silent:1});if(ok){pairFor(p).forEach(x=>addLine(x.id,{sel:defSel(x),silent:1}));closeLayer(layerEl('pm'));toast('Added the whole combo to your cart','ok',{label:'View cart',act:'cart'})}};
A.editLine=b=>openProduct(S.cart.find(l=>l.id===b.dataset.id).pid,{edit:b.dataset.id});
A.qadd=b=>{const p=prod(b.dataset.id);if(!p)return;addLine(p.id,{sel:defSel(p)});const ic0=b.innerHTML;b.classList.add('pop');setTimeout(()=>b.classList.remove('pop'),400)};
A.fav=b=>{const id=b.dataset.id,f=favs(),i=f.indexOf(id);if(i>=0){f.splice(i,1);toast('Removed from favourites','ok')}else{f.push(id);toast('Saved to favourites ❤️','ok')}save();
  $$(`[data-act=fav][data-id="${id}"]`).forEach(e=>{const on=f.includes(id);e.classList.toggle('on',on);e.setAttribute('aria-pressed',on);e.innerHTML=on?icFill('heart'):ic('heart')});emit('favs')};
/* Reviews */
A.writeReview=b=>{if(!me()){toast('Log in to write a review','warn');openAuth('login');return}
  const box=$('#rv-form');if(box.innerHTML){box.innerHTML='';return}
  box.innerHTML=`<form class="rv-form form" data-form="review" data-id="${b.dataset.id}" novalidate><fieldset class="stars-in"><legend>Your rating</legend>${[5,4,3,2,1].map(i=>`<input type="radio" id="st${i}" name="rating" value="${i}" ${i===5?'checked':''}><label for="st${i}" title="${i} stars"><span class="sr">${i} stars</span>${icFill('star')}</label>`).join('')}</fieldset><div class="fld"><label for="rv-t">Your review</label><textarea id="rv-t" name="text" rows="3" maxlength="400" required placeholder="What did you love? How was the crust, the heat, the portion?"></textarea><span class="err" id="rv-t-e" role="alert"></span></div><div class="fld"><label for="rv-i">Add a photo <small class="muted">(optional)</small></label><input id="rv-i" name="img" type="file" accept="image/*"></div><button class="btn red" type="submit">Post review</button></form>`;$('#rv-t').focus()};
FORMS.review=async f=>{const p=prod(f.dataset.id),text=f.text.value.trim();if(text.length<8){$('#rv-t-e').textContent='Tell us a little more (at least 8 characters).';f.text.classList.add('bad');return}
  let img='';const file=f.img.files[0];if(file){try{img=await readImage(file,360)}catch(e){toast(e.message,'error');return}}
  const r=+f.rating.value,u=me(),verified=S.orders.some(o=>o.uid===u.id&&o.status==='delivered'&&o.items.some(i=>i.pid===p.id));
  (S.reviews[p.id]=S.reviews[p.id]||[]).push({id:uid('r'),name:u.name.split(' ')[0]+' '+(u.name.split(' ')[1]||'')[0]+'.',rating:r,text,ts:Date.now(),verified,hidden:false,img});p.rating=Math.round((p.rating*p.rev+r)/(p.rev+1)*10)/10;p.rev++;save();
  const sec=$('.rv-sec');if(sec){sec.innerHTML='<h4>Reviews</h4>'+revList(p)}toast('Thanks! Your review is live.','ok')};
/* ---------- SEO helpers ---------- */
function setMeta(title,desc){document.title=title;const d=$('meta[name=description]');if(d)d.content=desc;const og=$('meta[property="og:title"]');if(og)og.content=title;const od=$('meta[property="og:description"]');if(od)od.content=desc}
function productLD(p){return{'@type':'Product',name:p.name,description:p.desc,category:catOf(p.cat).name,brand:{'@type':'Brand',name:BRAND.name},aggregateRating:{'@type':'AggregateRating',ratingValue:p.rating,reviewCount:p.rev},offers:{'@type':'Offer',priceCurrency:'INR',price:p.price,availability:outOf(p)?'https://schema.org/OutOfStock':'https://schema.org/InStock'}}}
function setLD(obj){let s=$('#ld-dyn');if(!s){s=document.createElement('script');s.type='application/ld+json';s.id='ld-dyn';document.head.appendChild(s)}s.textContent=JSON.stringify(obj)}
function setProductLD(p){setLD({'@context':'https://schema.org',...productLD(p)})}
function setMenuLD(list){setLD({'@context':'https://schema.org','@type':'Menu',name:BRAND.name+' menu',hasMenuItem:list.slice(0,24).map(p=>({'@type':'MenuItem',name:p.name,description:p.desc,offers:{'@type':'Offer',price:p.price,priceCurrency:'INR'},suitableForDiet:p.veg?'https://schema.org/VegetarianDiet':undefined}))})}
