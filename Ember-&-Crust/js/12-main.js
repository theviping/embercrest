/* ============ Boot, global events, theme ============ */
function applyTheme(){document.documentElement.setAttribute('data-theme',S.theme||'');const b=$('#themeBtn');if(b)b.innerHTML=ic(S.theme==='dark'?'star':'star')}
A.toggleTheme=()=>{S.theme=S.theme==='dark'?'':'dark';save();applyTheme();$$('[data-act=toggleTheme]').forEach(b=>b.innerHTML=(S.theme==='dark'?ic('star'):ic('star')));const b=document.activeElement;if(b)b.setAttribute('aria-pressed',S.theme==='dark')};
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]');if(!t)return;
  const act=t.dataset.act;if(act==='cart'){e.preventDefault();openCart();return}if(act==='bell'){e.preventDefault();if(layerEl('bellp'))return;openLayer(bellHTML(),{kind:'sheet',cls:'bellp sm',label:'Notifications'});return}
  if(t.tagName==='A'&&!['closeLayer','toCheckout'].includes(act)){/* allow nav links with data-act too, still follow href */}
  if(A[act])A[act](t,e)});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset.pm)CHG.pm(t);if(t.dataset.co)CHG.co(t)});
document.addEventListener('submit',e=>{const f=e.target.closest('form[data-form]');if(!f)return;e.preventDefault();const fn=FORMS[f.dataset.form];fn&&fn(f)});
A.readAll=()=>{S.notifs.forEach(n=>n.read=true);save();refreshBell()};
A.clearNotifs=()=>{S.notifs=[];save();refreshBell()};
A.openNotif=b=>{const n=S.notifs.find(x=>x.id===b.dataset.id);if(n)n.read=true;save();refreshBell();const l=layerEl('bellp');l&&closeLayer(l)};
A.rm=b=>removeLine(b.dataset.id);
A.qty=b=>setQty(b.dataset.id,+b.dataset.d);
window.addEventListener('hashchange',()=>render());
window.addEventListener('resize',()=>{});
setInterval(()=>{tickCd();tickOrders()},1000);
setInterval(()=>{ensureToday();if(route().name==='admin'||route().name==='kitchen')refreshAdmin()},60000);
function boot(){
  ensureToday();
  $('#toasts')||document.body.insertAdjacentHTML('beforeend','<div id="toasts" aria-live="polite" aria-atomic="false"></div>');
  applyTheme();
  render();
  // simulate live incoming orders for kitchen/admin realism
  setInterval(()=>{if(Math.random()<.14&&(route().name==='kitchen'||route().name==='admin')&&S.adminAuth){}},45000);
}
document.addEventListener('DOMContentLoaded',boot);
