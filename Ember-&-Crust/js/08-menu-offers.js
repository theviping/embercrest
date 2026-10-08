/* ============ Menu + Offers ============ */
const M={cat:'all',q:'',veg:0,nonveg:0,spicy:0,best:0,offers:0,min:0,max:1300,rating:0,sort:'popular',loaded:false};
function matchQ(p,q){if(!q)return true;const hay=(p.name+' '+p.desc+' '+p.ing.join(' ')+' '+catOf(p.cat).name+(p.cat==='pizza'?' cheese':'')).toLowerCase();return q.toLowerCase().split(/\s+/).filter(Boolean).every(t=>{const s=t.replace(/(ies|es|s)$/,m=>m==='ies'?'y':'');return hay.includes(t)||hay.includes(s)})}
function filtered(){let l=S.products.filter(p=>(M.cat==='all'||(M.cat==='best'?p.tag==='best':p.cat===M.cat))&&matchQ(p,M.q)&&!(M.veg&&!p.veg)&&!(M.nonveg&&p.veg)&&!(M.spicy&&p.spice<1)&&!(M.best&&p.tag!=='best')&&!(M.offers&&!(p.mrp>p.price))&&p.price>=M.min&&p.price<=M.max&&p.rating>=M.rating);
  const s={popular:(a,b)=>b.sold*(b.cat==='beverages'?.35:1)-a.sold*(a.cat==='beverages'?.35:1),lh:(a,b)=>a.price-b.price,hl:(a,b)=>b.price-a.price,rating:(a,b)=>b.rating-a.rating||b.rev-a.rev,new:(a,b)=>(b.tag==='new')-(a.tag==='new')||b.created-a.created||b.sold-a.sold}[M.sort];return l.sort(s)}
function filterPanel(){
  const tg=(k,l,i)=>`<label class="tgl"><input type="checkbox" data-mf="${k}" ${M[k]?'checked':''}><span class="tgl-t">${i||''} ${l}</span></label>`;
  return`<div class="fp"><h3>Filters</h3><div class="fp-g"><h4>Diet</h4>${tg('veg','Vegetarian','<i class="vm veg"></i>')}${tg('nonveg','Non-vegetarian','<i class="vm nv"></i>')}</div>
  <div class="fp-g"><h4>Taste</h4>${tg('spicy','Spicy',ic('flame','on'))}${tg('best','Bestseller',ic('flame'))}${tg('offers','Offers & discounts',ic('tag'))}</div>
  <div class="fp-g"><h4>Price range</h4><div class="rng"><label>Min <b>${inr(M.min)}</b><input type="range" min="0" max="1300" step="10" value="${M.min}" data-mr="min" aria-label="Minimum price"></label><label>Max <b>${inr(M.max)}</b><input type="range" min="0" max="1300" step="10" value="${M.max}" data-mr="max" aria-label="Maximum price"></label></div></div>
  <div class="fp-g"><h4>Rating</h4><div class="chips">${[0,4,4.5,4.7].map(r=>`<button class="chip ${M.rating===r?'on':''}" data-act="mRating" data-r="${r}" aria-pressed="${M.rating===r}">${r?r+'+ ★':'Any'}</button>`).join('')}</div></div>
  <button class="btn ghost block" data-act="mReset">Reset filters</button></div>`}
const filtersActive=()=>M.veg+M.nonveg+M.spicy+M.best+M.offers+(M.min>0)+(M.max<1300)+(M.rating>0);
PAGES.menu=r=>{
  const c=r.seg[0]||'all';if(c!=='all'||!M.loaded)M.cat=S.cats.some(x=>x.id===c)||c==='best'?c:'all';if(r.q.get('q')!=null)M.q=r.q.get('q');
  const cat=M.cat==='best'?{name:'Best Sellers',emoji:'⭐'}:M.cat==='all'?{name:'Full menu',emoji:'🍽️'}:catOf(M.cat);
  setMeta(`${cat.name==='Full menu'?'Menu':cat.name} — Order Pizza & Burger Online | Ember & Crust`,'Browse our full menu of pizzas, burgers, fries, wraps, sides, beverages, desserts and combos. Customise, filter by veg or spicy and order for delivery or pickup.');
  const chips=[['all','All','🍽️'],...S.cats.map(x=>[x.id,x.name,x.emoji]),['best','Best Sellers','⭐']].map(([id,n,e])=>`<button class="chip cat ${M.cat===id?'on':''}" data-act="mCat" data-c="${id}" aria-pressed="${M.cat===id}"><span aria-hidden="true">${e}</span> ${n}</button>`).join('');
  const sugg=['cheese pizza','chicken burger','fries','paneer','brownie'].map(s=>`<button class="chip sm" data-act="mSugg" data-q="${s}">${s}</button>`).join('');
  const first=!M.loaded;
  return`${pageHead('Our menu','Made to order. Customise pizzas and burgers your way.')}<div class="wrap menu-wrap"><div class="menu-top"><form class="search" role="search" data-form="noop"><span class="s-ic">${ic('search')}</span><label class="sr" for="msearch">Search the menu</label><input id="msearch" type="search" placeholder="Search “cheese pizza”, “chicken burger”, “fries”…" value="${esc(M.q)}" autocomplete="off"><button type="button" class="s-x" data-act="mClear" aria-label="Clear search" ${M.q?'':'hidden'}>${ic('x')}</button></form><div class="chips sugg" aria-label="Search suggestions">${sugg}</div><div class="cat-row" role="group" aria-label="Categories">${chips}</div></div>
  <div class="menu-body"><aside class="filters" aria-label="Filters" id="fside">${filterPanel()}</aside><div class="menu-main"><div class="toolbar"><p id="mcount" aria-live="polite"></p><div class="row"><button class="btn ghost sm show-m" data-act="mFilters">${ic('sliders')} Filters <span class="cnt-i" id="fcnt"></span></button><label class="sel"><span class="sr">Sort by</span><select id="msort" aria-label="Sort by">${[['popular','Popular'],['lh','Price: Low to High'],['hl','Price: High to Low'],['rating','Rating'],['new','New Arrivals']].map(([v,l])=>`<option value="${v}" ${M.sort===v?'selected':''}>${l}</option>`).join('')}</select></label></div></div><div class="grid" id="menu-grid">${first?skeletonCards(8):''}</div></div></div></div>`};
function paintMenu(skipPanel){
  const g=$('#menu-grid');if(!g)return;const l=filtered();M.loaded=true;
  g.innerHTML=l.length?l.map(card).join(''):`<div class="span-all">${emptyState('search','No dishes match those filters','Try a different search, or clear a filter or two.','<button class="btn red" data-act="mReset">Clear filters</button>')}</div>`;
  $('#mcount').innerHTML=`<b>${l.length}</b> ${l.length===1?'dish':'dishes'}${M.q?` for “${esc(M.q)}”`:''}`;const fc=filtersActive();$('#fcnt').textContent=fc||'';$('#fcnt').hidden=!fc;
  $$('.cat-row .chip').forEach(c=>{const on=c.dataset.c===M.cat;c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)});
  const x=$('.s-x');if(x)x.hidden=!M.q;if(!skipPanel)$$('.fp').forEach(p=>p.parentElement.innerHTML=filterPanel());setMenuLD(l)}
AFTER.menu=r=>{const first=!M.loaded;if(first){setTimeout(()=>{if(route().name==='menu')paintMenu()},420)}else paintMenu();
  const slugP=r.seg[1];if(slugP){const p=S.products.find(x=>slug(x.name)===slugP);if(p)openProduct(p.id)}
  const cat=r.seg[0];if(cat&&$('.cat-row'))$('.cat-row').querySelector('.on')?.scrollIntoView({inline:'center',block:'nearest'})};
PAGES.product=r=>{const p=S.products.find(x=>slug(x.name)===r.seg[0]||x.id===r.seg[0]);if(p){M.cat=p.cat;M.loaded=false;setTimeout(()=>{openProduct(p.id)},60);return PAGES.menu({seg:[p.cat],q:new URLSearchParams()})}return PAGES.notfound()};
AFTER.product=()=>{AFTER.menu({seg:[],q:new URLSearchParams()})};
document.addEventListener('input',e=>{const t=e.target;
  if(t.id==='msearch'){clearTimeout(t._d);t._d=setTimeout(()=>{M.q=t.value;if(M.q&&M.cat!=='all')M.cat='all';paintMenu()},160)}
  if(t.dataset.mr){const k=t.dataset.mr;M[k]=+t.value;if(M.min>M.max){if(k==='min')M.max=M.min;else M.min=M.max}clearTimeout(t._d);t._d=setTimeout(()=>paintMenu(true),120);$$(`[data-mr]`).forEach(x=>{x.value=M[x.dataset.mr];x.closest('label').querySelector('b').textContent=inr(M[x.dataset.mr])})}});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset.mf){M[t.dataset.mf]=t.checked?1:0;if(t.dataset.mf==='veg'&&t.checked)M.nonveg=0;if(t.dataset.mf==='nonveg'&&t.checked)M.veg=0;paintMenu()}if(t.id==='msort'){M.sort=t.value;paintMenu()}});
A.mCat=b=>{M.cat=b.dataset.c;history.replaceState(null,'','#/menu'+(M.cat==='all'?'':'/'+M.cat));const t=$('.page-head h1');paintMenu()};
A.mSugg=b=>{M.q=b.dataset.q;M.cat='all';const i=$('#msearch');if(i)i.value=M.q;paintMenu()};
A.mClear=()=>{M.q='';const i=$('#msearch');if(i){i.value='';i.focus()}paintMenu()};
A.mRating=b=>{M.rating=+b.dataset.r;paintMenu()};
A.mReset=b=>{Object.assign(M,{veg:0,nonveg:0,spicy:0,best:0,offers:0,min:0,max:1300,rating:0,q:''});const i=$('#msearch');if(i)i.value='';paintMenu();if(b.closest('.layer'))closeLayer(b.closest('.layer'))};
A.mFilters=()=>{const el=openLayer(`<div class="dr-h"><h2>Filters</h2><button class="x-btn" data-act="closeLayer" aria-label="Close filters">${ic('x')}</button></div><div class="pad" id="fsheet">${filterPanel()}</div><div class="dr-f"><button class="btn red block lg" data-act="closeLayer">Show results</button></div>`,{kind:'sheet',cls:'sm',label:'Filters'})};
FORMS.noop=()=>{};
/* Offers */
PAGES.offers=r=>{
  setMeta('Deals & Offers — Pizza Combos, BOGO, Family Packs | Ember & Crust','Today’s deals, pizza and burger combos, family packs, student offers, Buy 1 Get 1 and weekend specials. Save more on every order.');
  const chips=OFFER_SECS.map(([k,n])=>`<a class="chip" href="#/offers/${k}">${n}</a>`).join('')+'<a class="chip" href="#/offers/codes">Coupon codes</a>';
  const sec=OFFER_SECS.map(([k,n])=>`<section class="sec-o" id="off-${k}"><h2>${n}</h2><div class="offers">${OFFERS.filter(o=>o.cat===k).map(offerCard).join('')}</div></section>`).join('');
  const codes=S.coupons.filter(c=>c.active).map(c=>`<div class="code"><div><b>${c.code}</b><span>${esc(c.desc)}</span><small>Min order ${inr(c.min)} · valid till ${fmtDate(new Date(c.exp))}</small></div><div class="row"><button class="btn ghost sm" data-act="copyCode" data-code="${c.code}">${ic('copy')} Copy</button><button class="btn ink sm" data-act="applyCode" data-code="${c.code}">Apply</button></div></div>`).join('');
  return`<section class="off-hero"><div class="wrap"><div><h1>Deals that hit different</h1><p>Combos, BOGOs and weekend feasts. Fresh offers drop every day.</p><p class="off-cd">Today’s deals end in ${cd(endsAt('day'))}</p></div><span class="off-art" aria-hidden="true">${artSVG(['combo','family'],21,'')}</span></div></section>
  <div class="wrap"><div class="chips sticky-c" aria-label="Jump to section">${chips}</div>${sec}<section class="sec-o" id="off-codes"><h2>Coupon codes</h2><div class="codes">${codes}</div></section></div>`};
function offerCard(o){const bg=ART_BG[o.art[0]],sv=o.orig-o.price;return`<article class="offer" style="--a:${bg[0]};--b:${bg[1]}"><div class="offer-art"><span class="badge fire">${esc(o.badge)}</span>${artSVG(o.art,hash(o.id),o.title)}</div><div class="offer-b"><h3>${esc(o.title)}</h3><p>${esc(o.desc)}</p><small class="inc">${esc(o.inc)}</small><div class="offer-price"><b>${inr(o.price)}</b><s>${inr(o.orig)}</s><span class="save">Save ${inr(sv)}</span></div><div class="offer-f"><span class="ends">${ic('clock')} ${o.ends==='we'?'Ends Sunday':'Ends in'} ${cd(endsAt(o.ends))}</span><button class="btn orange" data-act="offerAdd" data-id="${o.id}">Add deal</button></div></div></article>`}
AFTER.offers=r=>{const k=r.seg[0];if(k){const el=$('#off-'+k);el&&setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),100)}};
A.offerAdd=b=>addBundle(OFFERS.find(o=>o.id===b.dataset.id));
FORMS.coupon=f=>{applyCoupon(f.code.value)};
function applyCoupon(code){code=String(code||'').trim().toUpperCase();if(!code){toast('Enter a coupon code first.','warn');return}const c=coupon(code),t=totals();
  if(!S.cart.length){if(!c||!c.active){toast('That code isn’t valid.','error');return}S.coupon=c.code;save();toast(c.code+' saved. It will apply when you add items.','ok');return}
  const err=couponCheck(c,t.sub);if(err){toast(err,'error');if(c&&c.active&&err.startsWith('Add')){S.coupon=c.code;save();refreshCart()}return}
  S.coupon=c.code;save();refreshCart();const n=totals();toast(`${c.code} applied. You save ${inr(n.disc+(n.ship?BRAND.fee:0))}!`,'ok')}
A.applyCode=b=>applyCoupon(b.dataset.code);
A.rmCoupon=()=>{S.coupon='';save();refreshCart();emit('coupon')};
A.copyCode=b=>{const c=b.dataset.code;(navigator.clipboard?navigator.clipboard.writeText(c):Promise.reject()).then(()=>toast('Code '+c+' copied','ok')).catch(()=>toast('Your code is '+c,'ok'))};
A.otype=b=>{S.checkout.type=b.dataset.t;save();refreshCart()};
