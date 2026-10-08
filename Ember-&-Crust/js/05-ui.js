/* ============ UI kit: layers, toasts, shared components ============ */
const A={},FORMS={},CHG={};
const layers=[];
function focusables(r){return $$('a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])',r).filter(e=>e.offsetParent!==null)}
function openLayer(html,{kind='dialog',cls='',label='Dialog',onClose}={}){
  const el=document.createElement('div');el.className='layer '+kind;
  el.innerHTML=`<div class="scrim" data-act="closeLayer"></div><div class="panel ${cls}" role="dialog" aria-modal="true" aria-label="${esc(label)}" tabindex="-1">${html}</div>`;
  document.body.appendChild(el);layers.push({el,prev:document.activeElement,onClose});document.body.classList.add('lock');
  requestAnimationFrame(()=>{el.classList.add('in');const p=$('.panel',el);const f=focusables(p).find(x=>!x.classList.contains('x-btn'))||p;f.focus({preventScroll:true})});return el}
function closeLayer(el){
  const i=el?layers.findIndex(l=>l.el===el):layers.length-1;if(i<0)return;const L=layers.splice(i,1)[0];
  L.el.classList.remove('in');L.el.classList.add('out');setTimeout(()=>L.el.remove(),200);
  if(!layers.length)document.body.classList.remove('lock');try{L.prev&&L.prev.focus&&L.prev.focus({preventScroll:true})}catch(e){}
  L.onClose&&L.onClose()}
const layerEl=cls=>layers.map(l=>l.el).find(e=>$('.panel.'+cls,e));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&layers.length){closeLayer();return}
  if(e.key==='Tab'&&layers.length){const p=$('.panel',layers[layers.length-1].el),f=focusables(p);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
function toast(msg,type='ok',action){
  const box=$('#toasts'),t=document.createElement('div');t.className='toast '+type;
  t.innerHTML=`<span class="t-ic">${ic(type==='error'?'alert':type==='warn'?'info':'check')}</span><span>${esc(msg)}</span>${action?`<button class="t-act" data-act="${action.act}">${esc(action.label)}</button>`:''}`;
  box.appendChild(t);requestAnimationFrame(()=>t.classList.add('in'));
  while(box.children.length>3)box.firstChild.remove();
  setTimeout(()=>{t.classList.remove('in');setTimeout(()=>t.remove(),250)},3800)}
function confirmBox(title,msg,ok,cb,danger=true){
  const el=openLayer(`<div class="dlg"><h3>${esc(title)}</h3><p class="muted">${esc(msg)}</p><div class="row end"><button class="btn ghost" data-act="closeLayer">Cancel</button><button class="btn ${danger?'red':'orange'}" data-act="confirmOk">${esc(ok)}</button></div></div>`,{label:title,cls:'sm'});
  el._cb=cb}
A.confirmOk=(b)=>{const el=b.closest('.layer');const cb=el._cb;closeLayer(el);cb&&cb()};
A.closeLayer=b=>closeLayer(b.closest('.layer'));
/* ---------- small components ---------- */
const stars=(r,n)=>`<span class="stars" aria-label="Rated ${r.toFixed(1)} out of 5">${icFill('star')}<b>${r.toFixed(1)}</b>${n?`<i>(${n>=1000?(n/1000).toFixed(1)+'k':n})</i>`:''}</span>`;
const starRow=r=>`<span class="starrow" role="img" aria-label="${r} out of 5 stars">${[1,2,3,4,5].map(i=>`<span class="${i<=r?'on':''}">${icFill('star')}</span>`).join('')}</span>`;
const vm=v=>`<span class="vm ${v?'veg':'nv'}" role="img" aria-label="${v?'Vegetarian':'Non-vegetarian'}" title="${v?'Vegetarian':'Non-vegetarian'}"></span>`;
const spice=n=>n?`<span class="spice" role="img" aria-label="Spice level ${n} of 3">${Array.from({length:3},(_,i)=>ic('flame',i<n?'on':'')).join('')}</span>`:'';
const avatar=(n,c)=>`<span class="avatar" style="--c:${c||'#B4121B'}" aria-hidden="true">${esc(n.split(' ').map(x=>x[0]).slice(0,2).join(''))}</span>`;
function media(p,big){const bg=ART_BG[p.art[0]]||ART_BG.pizza;return`<span class="media" style="--a:${bg[0]};--b:${bg[1]}">${p.img?`<img src="${p.img}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:artSVG(p.art,hash(p.id),p.name)}</span>`}
function mediaFor(art,name,seed){const bg=ART_BG[art[0]]||ART_BG.pizza;return`<span class="media" style="--a:${bg[0]};--b:${bg[1]}">${artSVG(art,seed,name)}</span>`}
function badges(p){const b=[];if(p.tag==='best')b.push(`<span class="badge fire">${ic('flame')} Popular</span>`);if(p.tag==='new')b.push('<span class="badge new">New</span>');const d=discPct(p);if(d)b.push(`<span class="badge off">${d}% OFF</span>`);return b.join('')}
function priceHTML(p){const from=p.cust==='pizza';return`<span class="price"><b>${from?'<small>from</small> ':''}${inr(p.price)}</b>${p.mrp>p.price?`<s>${inr(p.mrp)}</s>`:''}</span>`}
function card(p){
  const out=outOf(p),fav=favs().includes(p.id);
  return`<article class="pc${out?' is-out':''}" data-id="${p.id}">
  <div class="pc-media"><button class="pc-open" data-act="pv" data-id="${p.id}" aria-label="Quick view ${esc(p.name)}">${media(p)}</button>
   <div class="pc-badges">${badges(p)}</div>
   <button class="pc-fav${fav?' on':''}" data-act="fav" data-id="${p.id}" aria-pressed="${fav}" aria-label="${fav?'Remove '+esc(p.name)+' from favourites':'Save '+esc(p.name)+' to favourites'}">${fav?icFill('heart'):ic('heart')}</button>
   ${lowStock(p)?`<span class="pc-low">Only ${p.stock} left</span>`:''}${out?'<span class="pc-oos">Out of stock</span>':''}</div>
  <div class="pc-body"><div class="pc-meta">${vm(p.veg)}${stars(p.rating,p.rev)}${spice(p.spice)}</div>
   <h3><button class="linkish" data-act="pv" data-id="${p.id}">${esc(p.name)}</button></h3>
   <p class="pc-desc">${esc(p.desc)}</p>
   <div class="pc-foot">${priceHTML(p)}<button class="btn orange sm" data-act="qadd" data-id="${p.id}" ${out?'disabled':''} aria-label="Add ${esc(p.name)} to cart">${ic('plus')} Add</button></div>
   <div class="pc-links">${p.cust?`<button class="txt-btn" data-act="pv" data-id="${p.id}">Customize</button>`:''}<button class="txt-btn" data-act="pv" data-id="${p.id}">${ic('eye')} Quick view</button></div></div></article>`}
function skeletonCards(n=8){return Array.from({length:n},()=>'<div class="pc sk" aria-hidden="true"><div class="pc-media sk-box"></div><div class="pc-body"><div class="sk-line w40"></div><div class="sk-line w80 h"></div><div class="sk-line"></div><div class="sk-line w60"></div></div></div>').join('')}
function miniCard(p){return`<div class="mini"><button class="mini-art" data-act="pv" data-id="${p.id}" aria-label="View ${esc(p.name)}">${media(p)}</button><div class="mini-b"><b>${esc(p.name)}</b><span>${inr(p.price)}</span></div><button class="round-btn" data-act="qadd" data-id="${p.id}" aria-label="Add ${esc(p.name)}">${ic('plus')}</button></div>`}
function emptyState(icon,title,msg,cta){return`<div class="empty"><svg viewBox="0 0 160 120" aria-hidden="true"><ellipse cx="80" cy="102" rx="54" ry="8" fill="rgba(0,0,0,.08)"/><circle cx="80" cy="58" r="44" fill="var(--surface2)" stroke="var(--line)" stroke-width="2"/><circle cx="80" cy="58" r="30" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/><path d="M52 24v22M46 24v20a6 6 0 0 0 12 0V24M52 46v30M110 24c-8 4-10 16-10 26h10v26" fill="none" stroke="var(--red)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(-8 0)"/></svg><h3>${esc(title)}</h3><p class="muted">${esc(msg)}</p>${cta||''}</div>`}
const endsAt=k=>{const d=new Date(),n=new Date(d);if(k==='3h'){n.setMinutes(0,0,0);n.setHours((Math.floor(d.getHours()/3)+1)*3);return n.getTime()}
  if(k==='day'){n.setHours(24,0,0,0);return n.getTime()}
  n.setHours(23,59,59,0);const add=(7-d.getDay())%7;n.setDate(n.getDate()+add);return n.getTime()};
const cd=ts=>`<span class="cd" data-cd="${ts}" role="timer" aria-label="Time remaining"><span>--</span>:<span>--</span>:<span>--</span></span>`;
function tickCd(){const now=Date.now();$$('[data-cd]').forEach(e=>{let s=Math.max(0,Math.floor((+e.dataset.cd-now)/1000));const d=Math.floor(s/86400);s%=86400;const h=String(Math.floor(s/3600)).padStart(2,'0'),m=String(Math.floor(s%3600/60)).padStart(2,'0'),x=String(s%60).padStart(2,'0');e.innerHTML=(d?`<span>${d}d</span> `:'')+`<span>${h}</span>:<span>${m}</span>:<span>${x}</span>`});
  $$('[data-since]').forEach(e=>{const m=Math.floor((now-+e.dataset.since)/MIN),s=Math.floor((now-+e.dataset.since)%MIN/1000);e.textContent=m+':'+String(s).padStart(2,'0');e.closest('.kc')?.setAttribute('data-late',m>=20?'2':m>=12?'1':'0')})}
function field({id,label,type='text',value='',req,hint,ac,ph,pattern,mode,max,cls=''}){return`<div class="fld ${cls}"><label for="${id}">${esc(label)}${req?' <span class="req" aria-hidden="true">*</span>':''}</label><input id="${id}" name="${id}" type="${type}" value="${esc(value)}"${req?' required aria-required="true"':''}${ac?` autocomplete="${ac}"`:''}${ph?` placeholder="${esc(ph)}"`:''}${mode?` inputmode="${mode}"`:''}${max?` maxlength="${max}"`:''}${pattern?` pattern="${pattern}"`:''}${hint?` aria-describedby="${id}-h"`:''}><span class="err" id="${id}-e" role="alert"></span>${hint?`<small class="hint" id="${id}-h">${esc(hint)}</small>`:''}</div>`}
const V={email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),phone:v=>/^[6-9]\d{9}$/.test(v.replace(/[\s+-]|^91/g,'')),pin:v=>/^\d{6}$/.test(v)};
function checkForm(f,rules){let ok=true,first=null;$$('.err',f).forEach(e=>e.textContent='');$$('input.bad,select.bad,textarea.bad',f).forEach(e=>e.classList.remove('bad'));
  for(const [id,fn,msg] of rules){const el=$('#'+id,f);if(!el)continue;const v=el.value.trim();const m=fn(v)?'':msg;if(m){ok=false;el.classList.add('bad');el.setAttribute('aria-invalid','true');const e=$('#'+id+'-e',f);if(e)e.textContent=m;first=first||el}else el.removeAttribute('aria-invalid')}
  first&&first.focus();return ok}
const req=(m)=>[v=>v.length>0,m];
/* ---------- Header / footer / nav ---------- */
const LOGO=`<svg viewBox="0 0 40 40" class="logo-mark" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="var(--red)"/><path d="M20 6c1 5 6 8 6 14a6 6 0 0 1-12 0c0-3 2-4 3-7 1 2 2 2 3-1z" fill="#FFC53D"/><path d="M20 15c.6 3 3 4 3 7.5a3 3 0 0 1-6 0c0-2 1.5-2.5 2-4.5z" fill="#FF7A1A"/><path d="M8 30q12 8 24 0" stroke="#FFF3E2" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`;
function headerHTML(){
  const u=me(),b=branch(),oi=openInfo(b),unread=S.notifs.filter(n=>!n.read).length,t=totals();
  const r=route().name;const nav=[['menu','Menu'],['offers','Offers'],['about','About'],['locations','Locations'],['contact','Contact']].map(([k,l])=>`<a href="#/${k}"${r===k?' aria-current="page"':''}>${l}</a>`).join('');
  return`<div class="topbar"><div class="wrap"><span>${ic('truck')} Free delivery above ₹499</span><button class="tb-code" data-act="copyCode" data-code="WELCOME20" aria-label="Copy coupon code WELCOME20">Use code <b>WELCOME20</b> for 20% off ${ic('copy')}</button></div></div>
  <header class="hdr"><div class="wrap hdr-in"><a class="logo" href="#/" aria-label="${BRAND.name} — home">${LOGO}<span><b>Ember <i>&amp;</i> Crust</b><small>${BRAND.tag}</small></span></a>
  <nav class="nav" aria-label="Primary">${nav}</nav>
  <div class="hdr-act"><button class="chip-btn branch-chip" data-act="branch" aria-label="Change branch. Current: ${esc(b.name)}, ${oi.short}">${ic('pin')}<span>${esc(b.name)}</span><i class="dot ${oi.open?'on':''}"></i></button>
  <a class="icon-btn hide-s" href="#/menu" data-act="focusSearch" aria-label="Search the menu">${ic('search')}</a>
  <button class="icon-btn" data-act="bell" aria-label="Notifications${unread?`, ${unread} unread`:''}">${ic('bell')}${unread?`<i class="cnt" id="bellCnt">${unread}</i>`:''}</button>
  <a class="icon-btn hide-s" href="#/account/favorites" aria-label="Favourites">${ic('heart')}</a>
  ${u?`<a class="icon-btn user" href="#/account" aria-label="My account">${avatar(u.name)}</a>`:`<button class="btn ghost sm hide-s" data-act="login">Log in</button>`}
  <button class="cart-btn" data-act="cart" aria-label="Open cart, ${t.count} items">${ic('bag')}<span class="cart-amt">${t.count?inr(t.sub):'Cart'}</span><i class="cnt" ${t.count?'':'hidden'}>${t.count}</i></button></div></div></header>`}
function footerHTML(){
  const soc=[['ig','instagram','Instagram'],['fb','facebook','Facebook'],['xx','x','X'],['yt','youtube','YouTube']].map(([i,k,l])=>`<a class="soc" href="${BRAND.social[k]}" target="_blank" rel="noopener" aria-label="${l}">${ic(i)}</a>`).join('');
  const pay=['UPI','VISA','Mastercard','RuPay','Paytm','COD'].map(x=>`<span class="pay-pill">${x}</span>`).join('');
  return`<footer class="ftr"><div class="wrap"><div class="ftr-grid"><div class="ftr-brand"><a class="logo" href="#/">${LOGO}<span><b>Ember <i>&amp;</i> Crust</b><small>${BRAND.tag}</small></span></a><p>Hand-stretched pizzas, smashed burgers and fries that stay crisp. Made to order in Bengaluru, delivered hot.</p><div class="socs">${soc}</div></div>
  <div><h4>Quick links</h4><ul><li><a href="#/menu">Menu</a></li><li><a href="#/offers">Offers</a></li><li><a href="#/about">About us</a></li><li><a href="#/contact">Contact</a></li><li><a href="#/locations">Branches</a></li><li><a href="#/rewards">Rewards</a></li></ul></div>
  <div><h4>Order</h4><ul><li><a href="#/menu/pizza">Pizza</a></li><li><a href="#/menu/burgers">Burgers</a></li><li><a href="#/menu/combos">Combos</a></li><li><a href="#/track">Track an order</a></li><li><a href="#/account">My account</a></li></ul></div>
  <div><h4>Policies</h4><ul><li><a href="#/policy/terms">Terms &amp; Conditions</a></li><li><a href="#/policy/privacy">Privacy Policy</a></li><li><a href="#/policy/refund">Refund Policy</a></li><li><a href="#/policy/delivery">Delivery Policy</a></li><li><a href="#/admin">Owner login</a></li></ul></div></div>
  <div class="ftr-bot"><span>© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</span><div class="pays" aria-label="Accepted payments">${pay}</div></div></div></footer>`}
function bottomNavHTML(){const r=route().name,t=totals(),it=[['home','Home','#/',''],['menu','Menu','#/menu','grid'],['offers','Offers','#/offers','tag'],['cart','Cart','','bag'],['account','Account','#/account','user']];
  return it.map(([k,l,h,i])=>k==='home'?`<a href="${h}"${r==='home'?' aria-current="page"':''}>${ic('home')}<span>${l}</span></a>`:k==='cart'?`<button data-act="cart" aria-label="Cart, ${t.count} items">${ic('bag')}<span>${l}</span>${t.count?`<i class="cnt">${t.count}</i>`:''}</button>`:`<a href="${h}"${r===k?' aria-current="page"':''}>${ic(i)}<span>${l}</span></a>`).join('')}
function renderChrome(){
  const r=route().name,adm=r==='admin'||r==='kitchen';document.body.classList.toggle('admin-mode',adm);
  $('#hdr').innerHTML=adm?'':headerHTML();$('#ftr').innerHTML=adm?'':footerHTML();$('#bnav').innerHTML=adm?'':bottomNavHTML();refreshFloat()}
function refreshFloat(){
  const t=totals(),r=route().name,hide=['admin','kitchen','checkout'].includes(r)||layers.length&&false;
  const fc=$('#fcart');fc.hidden=!t.count||hide;fc.innerHTML=t.count?`<span class="fc-n">${t.count}</span><span><b>View cart</b><small>${inr(t.sub)}${t.toFree>0&&t.type==='delivery'?` · ${inr(t.toFree)} to free delivery`:''}</small></span>${ic('arrow')}`:'';
  $('#wafab').hidden=['admin','kitchen'].includes(r)}
function refreshBell(){const n=S.notifs.filter(x=>!x.read).length;const b=$('[data-act=bell]');if(b){let c=$('.cnt',b);if(n){if(!c){c=document.createElement('i');c.className='cnt';b.appendChild(c)}c.textContent=n}else c&&c.remove()}const p=layerEl('bellp');if(p)$('.panel',p).innerHTML=bellHTML()}
function refreshCart(){
  const t=totals();$$('.cart-btn .cnt').forEach(e=>{e.textContent=t.count;e.hidden=!t.count});$$('.cart-amt').forEach(e=>e.textContent=t.count?inr(t.sub):'Cart');
  const bn=$('#bnav');if(bn&&!document.body.classList.contains('admin-mode'))bn.innerHTML=bottomNavHTML();refreshFloat();
  const d=layerEl('cartp');if(d){const pn=$('.panel',d),sc=$('.cart-scroll',pn)?.scrollTop||0;pn.innerHTML=cartHTML();const s=$('.cart-scroll',pn);if(s)s.scrollTop=sc}
  emit('cart')}
/* ---------- Cart drawer ---------- */
function cartLine(l){const i=lineInfo(l);if(!i)return'';const editable=i.p&&i.p.cust&&!l.reward;
  return`<li class="cl"><span class="cl-art">${l.bundle?mediaFor(i.art,i.name,i.seed):media(i.p)}</span><div class="cl-b"><div class="cl-top"><b>${esc(i.name)}</b>${l.reward?'<span class="badge new">Reward</span>':''}</div>${i.summary?`<p class="cl-sum">${esc(i.summary)}</p>`:''}${l.instr?`<p class="cl-sum">“${esc(l.instr)}”</p>`:''}
  <div class="cl-row"><div class="qty" role="group" aria-label="Quantity for ${esc(i.name)}"><button data-act="qty" data-id="${l.id}" data-d="-1" aria-label="Decrease quantity">${ic('minus')}</button><output aria-live="polite">${l.qty}</output><button data-act="qty" data-id="${l.id}" data-d="1" aria-label="Increase quantity">${ic('plus')}</button></div><b class="cl-p">${l.reward?'FREE':inr(i.unit*l.qty)}</b></div>
  <div class="cl-act">${editable?`<button class="txt-btn" data-act="editLine" data-id="${l.id}">${ic('edit')} Edit</button>`:''}<button class="txt-btn danger" data-act="rm" data-id="${l.id}">${ic('trash')} Remove</button></div></div></li>`}
function freeBar(t){if(t.type==='pickup'||!t.count)return'';const pct=t.freeAt?clamp(t.sub/t.freeAt*100,0,100):100;return`<div class="free-bar" role="group" aria-label="Free delivery progress"><p>${t.freeAt===0||t.toFree<=0?`🎉 <b>You’ve unlocked FREE delivery!</b>`:`Add <b>${inr(t.toFree)}</b> more to unlock <b>FREE delivery</b> 🚚`}</p><div class="bar"><i style="width:${pct}%"></i></div></div>`}
function couponBox(t){
  const codes=S.coupons.filter(c=>c.active&&(!c.exp||new Date(c.exp+'T23:59:59')>new Date())).slice(0,4);
  return`<div class="cp"><form data-form="coupon" class="cp-form"><label class="sr" for="cpin">Coupon code</label><input id="cpin" name="code" placeholder="Enter coupon code" value="" autocomplete="off" autocapitalize="characters"><button class="btn ink sm" type="submit">Apply</button></form>
  ${S.coupon?`<div class="cp-on ${t.err?'warn':''}">${ic(t.err?'info':'check')}<span><b>${esc(S.coupon)}</b> ${t.err?esc(t.err):`applied · you save ${inr(t.disc+(t.ship?BRAND.fee:0))}`}</span><button class="txt-btn" data-act="rmCoupon" aria-label="Remove coupon">${ic('x')}</button></div>`:`<div class="cp-chips">${codes.map(c=>`<button class="chip" data-act="applyCode" data-code="${c.code}" title="${esc(c.desc)}">${c.code}</button>`).join('')}</div>`}</div>`}
function sumRows(t){return`<dl class="sum"><div><dt>Subtotal</dt><dd>${inr(t.sub)}</dd></div>${t.disc?`<div class="g"><dt>Discount (${esc(S.coupon)})</dt><dd>−${inr(t.disc)}</dd></div>`:''}<div><dt>${t.type==='pickup'?'Pickup':'Delivery fee'}</dt><dd>${t.fee?inr(t.fee):'<span class="g">FREE</span>'}</dd></div><div><dt>Taxes (GST 5%)</dt><dd>${inr(t.tax)}</dd></div><div class="tot"><dt>Total</dt><dd>${inr(t.total)}</dd></div></dl>${t.saved?`<p class="saved">🎉 You saved <b>${inr(t.saved)}</b> on this order</p>`:''}`}
function cartHTML(){
  const t=totals();
  const head=`<div class="dr-h"><h2>Your cart${t.count?` <small>(${t.count})</small>`:''}</h2><button class="x-btn" data-act="closeLayer" aria-label="Close cart">${ic('x')}</button></div>`;
  if(!S.cart.length)return head+`<div class="cart-scroll">${emptyState('bag','Your cart is empty','Hot, cheesy and fast. Pick something delicious from the menu.','<a class="btn red" href="#/menu" data-act="closeLayer">Explore menu</a>')}<h4 class="sub-h">Popular right now</h4><div class="mini-list">${S.products.filter(p=>p.tag==='best'&&!outOf(p)).slice(0,3).map(miniCard).join('')}</div></div>`;
  const rec=recos();const under=t.sub<BRAND.minOrder;
  return head+`<div class="cart-scroll">${freeBar(t)}<div class="seg" role="radiogroup" aria-label="Order type"><button role="radio" aria-checked="${t.type==='delivery'}" class="${t.type==='delivery'?'on':''}" data-act="otype" data-t="delivery">${ic('bike')} Delivery</button><button role="radio" aria-checked="${t.type==='pickup'}" class="${t.type==='pickup'?'on':''}" data-act="otype" data-t="pickup">${ic('bag')} Pickup</button></div>
  <ul class="cl-list">${S.cart.map(cartLine).join('')}</ul>
  ${rec.length?`<h4 class="sub-h">You may also like</h4><div class="mini-list">${rec.slice(0,3).map(miniCard).join('')}</div>`:''}
  ${couponBox(t)}${sumRows(t)}</div>
  <div class="dr-f">${under?`<p class="warn-t">${ic('info')} Minimum order is ${inr(BRAND.minOrder)}. Add ${inr(BRAND.minOrder-t.sub)} more to checkout.</p>`:''}<a class="btn red block lg" href="#/checkout" data-act="toCheckout" ${under?'aria-disabled="true"':''}>Proceed to checkout · ${inr(t.total)}</a><a class="btn wa block" href="${waLink(S.cart,me()?.name)}" target="_blank" rel="noopener">${ic('wa')} Order on WhatsApp</a></div>`}
function openCart(){if(layerEl('cartp'))return;const el=openLayer(cartHTML(),{kind:'drawer',cls:'cartp',label:'Shopping cart'})}
/* ---------- Bell ---------- */
const NICON={order:'receipt',offer:'tag',coupon:'gift'};
function bellHTML(){const n=S.notifs;return`<div class="dr-h"><h2>Notifications</h2><button class="x-btn" data-act="closeLayer" aria-label="Close notifications">${ic('x')}</button></div><div class="row between pad"><button class="txt-btn" data-act="readAll">Mark all as read</button><button class="txt-btn danger" data-act="clearNotifs">Clear all</button></div><ul class="notif-list cart-scroll">${n.length?n.map(x=>`<li><a class="nt ${x.read?'':'unread'}" href="${x.link||'#/'}" data-act="openNotif" data-id="${x.id}"><span class="nt-i ${x.type}">${ic(NICON[x.type]||'bell')}</span><span><b>${esc(x.title)}</b><span>${esc(x.body)}</span><small>${ago(x.ts)}</small></span></a></li>`).join(''):`<li>${emptyState('bell','You’re all caught up','Order updates, offers and coupon reminders will appear here.')}</li>`}</ul>`}
/* ---------- Login modal ---------- */
function authHTML(mode='login'){
  const tabs=`<div class="seg" role="tablist"><button role="tab" aria-selected="${mode==='login'}" class="${mode==='login'?'on':''}" data-act="authTab" data-m="login">Log in</button><button role="tab" aria-selected="${mode==='signup'}" class="${mode==='signup'?'on':''}" data-act="authTab" data-m="signup">Sign up</button></div>`;
  const head=`<div class="dr-h"><h2>${mode==='signup'?'Create your account':mode==='reset'?'Reset password':'Welcome back'}</h2><button class="x-btn" data-act="closeLayer" aria-label="Close">${ic('x')}</button></div>`;
  if(mode==='reset')return head+`<form class="pad form" data-form="reset" novalidate><p class="muted">Enter your email and we’ll send you a link to set a new password.</p>${field({id:'re',label:'Email',type:'email',req:1,ac:'email'})}<button class="btn red block" type="submit">Send reset link</button><button type="button" class="txt-btn center" data-act="authTab" data-m="login">Back to log in</button></form>`;
  if(mode==='signup')return head+`<div class="pad">${tabs}<form class="form" data-form="signup" novalidate>${field({id:'sn',label:'Full name',req:1,ac:'name'})}${field({id:'sp',label:'Mobile number',type:'tel',req:1,ac:'tel',mode:'numeric',hint:'10-digit Indian mobile number'})}${field({id:'se',label:'Email',type:'email',req:1,ac:'email'})}${field({id:'spw',label:'Password',type:'password',req:1,ac:'new-password',hint:'At least 8 characters'})}<button class="btn red block lg" type="submit">Create account</button><p class="muted small center">Get <b>WELCOME20</b> and earn points on every order.</p></form></div>`;
  return head+`<div class="pad">${tabs}<form class="form" data-form="login" novalidate>${field({id:'le',label:'Email',type:'email',req:1,ac:'email'})}${field({id:'lp',label:'Password',type:'password',req:1,ac:'current-password'})}<div class="row between"><button type="button" class="txt-btn" data-act="authTab" data-m="reset">Forgot password?</button></div><button class="btn red block lg" type="submit">Log in</button></form><div class="or"><span>or</span></div><button class="btn ghost block" data-act="demoLogin">${ic('zap')} Continue as demo customer</button><p class="muted small center">Demo login: aarav@example.com / demo1234</p></div>`}
function openAuth(mode,after){const ex=layerEl('authp');if(ex){$('.panel',ex).innerHTML=authHTML(mode);return}const el=openLayer(authHTML(mode),{kind:'sheet',cls:'authp sm',label:'Log in or sign up'});el._after=after}
/* ---------- Branch, support ---------- */
function openBranch(){openLayer(`<div class="dr-h"><h2>Choose your branch</h2><button class="x-btn" data-act="closeLayer" aria-label="Close">${ic('x')}</button></div><ul class="pad br-list">${BRANCHES.map(b=>{const o=openInfo(b);return`<li><button class="br-item ${b.id===S.branch?'on':''}" data-act="setBranch" data-id="${b.id}"><span>${ic('pin')}</span><span><b>${b.name}</b><small>${esc(b.addr)}</small><em class="${o.open?'open':'closed'}">${o.text}</em></span>${b.id===S.branch?ic('check'):''}</button></li>`}).join('')}</ul><div class="pad"><a class="txt-btn" href="#/locations" data-act="closeLayer">See all branches on the map ${ic('arrow')}</a></div>`,{kind:'sheet',cls:'sm',label:'Choose branch'})}
function openSupport(oid){openLayer(`<div class="dr-h"><h2>Need help${oid?' with #'+esc(oid):''}?</h2><button class="x-btn" data-act="closeLayer" aria-label="Close">${ic('x')}</button></div><div class="pad support"><a class="sup" href="tel:${BRAND.tel}">${ic('phone')}<span><b>Call us</b><small>${BRAND.phone} · 11 AM – 11 PM</small></span></a><a class="sup" href="https://wa.me/${BRAND.wa}?text=${encodeURIComponent('Hi, I need help'+(oid?' with order '+oid:''))}" target="_blank" rel="noopener">${ic('wa')}<span><b>WhatsApp</b><small>Replies in about 2 minutes</small></span></a>
  <form data-form="support" data-oid="${esc(oid||'')}" class="form" novalidate><div class="fld"><label for="sm">Send us a message</label><textarea id="sm" name="m" rows="3" placeholder="Tell us what went wrong. We’ll fix it fast." required></textarea><span class="err" id="sm-e" role="alert"></span></div><button class="btn red block" type="submit">Send message</button></form></div>`,{kind:'sheet',cls:'sm',label:'Customer support'})}
