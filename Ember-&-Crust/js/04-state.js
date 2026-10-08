/* ============ State, seed data & business logic ============ */
const KEY='ember_crust_v1';
const TIERS=[{n:'Regular',min:0,free:499,bonus:0,c:'#8A6F5E'},{n:'Silver',min:500,free:449,bonus:.05,c:'#9AA4B0'},{n:'Gold',min:1500,free:349,bonus:.1,c:'#E0A21B'},{n:'VIP',min:3000,free:0,bonus:.2,c:'#B4121B'}];
const STAGE_MS={new:5000,confirmed:8000,preparing:16000,ready:9000,out:18000};
const SEED_CUST=[['Rahul Verma','98450 1xxxx',12,5160,2,1240],['Sneha Iyer','98860 2xxxx',9,3710,5,890],['Aman Gupta','99001 3xxxx',21,8820,1,2410],['Pooja Nair','97400 4xxxx',6,2280,9,470],['Imran Sheikh','98800 5xxxx',15,6135,3,1530],['Divya Rao','98450 6xxxx',4,1490,14,320],['Nikhil Joshi','99720 7xxxx',18,7460,2,1980],['Kavya Menon','97390 8xxxx',8,3050,6,640],['Siddharth Jain','98860 9xxxx',27,11240,1,3120],['Lakshmi Prasad','99640 1xxxx',5,1880,11,380],['Farhan Ali','98450 2xxxx',11,4570,4,1010],['Tara Bose','97400 3xxxx',7,2690,8,560]];
let S;
function prod(id){return S.products.find(p=>p.id===id)}
function blankState(){return{v:3,products:JSON.parse(JSON.stringify(PRODUCTS0)),cats:JSON.parse(JSON.stringify(CATS0)),coupons:JSON.parse(JSON.stringify(COUPONS0)),xtops:[],cart:[],coupon:'',user:null,
 users:[{id:'u_demo',name:'Aarav Mehta',email:'aarav@example.com',phone:'9876543210',pw:hash('demo1234'),pts:860,life:1210,created:Date.now()-120*DAY}],
 orders:[],favs:{guest:[],u_demo:['p4','b2','f3']},addrs:{guest:[],u_demo:[{id:'a1',label:'Home',house:'B-204, Prestige Woods',street:'5th Cross, 1st Block',area:'Koramangala',city:'Bengaluru',state:'Karnataka',pin:'560034',landmark:'Opp. Forum Mall'},{id:'a2',label:'Work',house:'3rd Floor, Embassy Tech Square',street:'Outer Ring Road',area:'Marathahalli',city:'Bengaluru',state:'Karnataka',pin:'560103',landmark:'Near Kadubeesanahalli signal'}]},
 notifs:[{id:'n1',ts:Date.now()-2*HOUR,type:'offer',title:'New offer: Buy 1 Get 1 on Margherita',body:'Two medium Margheritas for ₹329 today. Tap to grab the deal.',read:false,link:'#/offers/bogo'},{id:'n2',ts:Date.now()-5*HOUR,type:'coupon',title:'Coupon reminder: WELCOME20',body:'Take 20% off your first order (up to ₹150). Apply it in your cart.',read:false,link:'#/menu'}],
 reviews:seedReviews(),branch:'kor',subs:[],msgs:[],seq:1048,auto:true,adminAuth:false,seedDay:'',checkout:{type:'delivery'},theme:''}}
function load(){try{const j=JSON.parse(localStorage.getItem(KEY));if(j&&j.v===3)return j}catch(e){}return null}
let saveT;function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){/* storage full or blocked */}},250)}
S=load()||blankState();
function seedDemoHistory(){
  if(S.orders.some(o=>o.uid==='u_demo'))return;
  const mk=(daysAgo,items,type)=>{const it=items.map(([pid,qty,sel])=>{const p=PRODUCTS0.find(x=>x.id===pid);return{pid,name:p.name,qty,unit:p.price+selPrice(p,sel),sel,summary:selSummary(p,sel),art:p.art}});const sub=it.reduce((a,i)=>a+i.unit*i.qty,0),fee=sub>=499?0:40,tax=Math.round(sub*.05);const t=Date.now()-daysAgo*DAY;return{id:'EC-'+(S.seq++),uid:'u_demo',cust:{name:'Aarav Mehta',phone:'9876543210',email:'aarav@example.com'},items:it,sub,disc:0,fee,tax,total:sub+fee+tax,coupon:'',type,addr:S.addrs.u_demo[0],branch:'kor',pay:'UPI',status:'delivered',created:t,stageAt:t+45*MIN,note:'',auto:false,seed:false,mine:false,pts:Math.floor((sub+fee+tax)/10)}};
  S.orders.push(mk(3,[['p4',1,{size:'M',crust:'cb',xc:1,tops:['jal'],sauces:['garlic']}],['s1',1,null],['d1',2,null]],'delivery'),mk(9,[['b2',2,{patty:'cchick',count:'1',cheese:'slice',tops:['jal'],sauces:['peri'],adds:['fries']}],['f3',1,null]],'delivery'),mk(16,[['p3',1,{size:'L',crust:'reg',xc:0,tops:['oli'],sauces:[]}],['t1',2,null]],'pickup'))}
function ensureToday(){
  seedDemoHistory();
  const ds=new Date().toDateString();if(S.seedDay===ds)return;
  S.orders=S.orders.filter(o=>!o.seed);S.seedDay=ds;
  const now=Date.now(),el=Math.max(now-dayStart(),2*HOUR),n=clamp(Math.round(el/HOUR*3.4),8,44),R=rng(hash(ds));
  const pool=S.products.filter(p=>p.cat!=='combos'||R()>.5);
  for(let i=0;i<n;i++){
    const age=i<3?R()*8*MIN:R()*el,c=SEED_CUST[Math.floor(R()*SEED_CUST.length)];
    const items=Array.from({length:1+Math.floor(R()*3)},()=>{const p=pool[Math.floor(R()*pool.length)],sel=defSel(p);return{pid:p.id,name:p.name,qty:1+Math.floor(R()*2),unit:p.price+selPrice(p,sel),sel,summary:selSummary(p,sel),art:p.art}});
    const sub=items.reduce((a,x)=>a+x.unit*x.qty,0),type=R()>.2?'delivery':'pickup',fee=type==='pickup'||sub>=499?0:40,tax=Math.round(sub*.05),am=age/MIN;
    let st=am<3?'new':am<9?'confirmed':am<20?'preparing':am<28?'ready':am<45?(type==='pickup'?'ready':'out'):'delivered';
    S.orders.push({id:'EC-'+(S.seq++),uid:'c_'+i,cust:{name:c[0],phone:c[1].replace('xxxx','0'+(i+10)),email:slug(c[0]).replace('-','.')+'@example.com'},items,sub,disc:0,fee,tax,total:sub+fee+tax,coupon:'',type,addr:type==='delivery'?{house:'Flat '+(100+i*7),street:'Main Road',area:BRANCHES[i%4].name,city:'Bengaluru',state:'Karnataka',pin:'5600'+(20+i)}:null,branch:BRANCHES[i%4].id,pay:['UPI','Card','COD','Wallet'][i%4],status:st,created:now-age,stageAt:now-Math.max(0,age-3*MIN),note:i%5===0?'Please make it extra spicy':i%7===0?'No onions, please':'',auto:false,seed:true,mine:false,pts:0});
  }
  S.orders.sort((a,b)=>b.created-a.created);save();
}
/* ---------- Auth / user ---------- */
const me=()=>S.users.find(u=>u.id===S.user)||null;
const ukey=()=>S.user||'guest';
const tierOf=life=>{let t=TIERS[0];TIERS.forEach(x=>{if(life>=x.min)t=x});return t};
const tierIdx=life=>TIERS.indexOf(tierOf(life));
const favs=()=>S.favs[ukey()]||(S.favs[ukey()]=[]);
const addrs=()=>S.addrs[ukey()]||(S.addrs[ukey()]=[]);
/* ---------- Hours ---------- */
const fmtMin=m=>{m=((m%1440)+1440)%1440;const h=Math.floor(m/60),mm=m%60;return(h%12||12)+(mm?':'+String(mm).padStart(2,'0'):'')+' '+(h<12?'AM':'PM')};
const branch=id=>BRANCHES.find(b=>b.id===(id||S.branch))||BRANCHES[0];
const hrsFor=(b,wd)=>b.hrs[wd===5||wd===6?'we':'wd'];
function openInfo(b=branch()){
  const d=new Date(),wd=d.getDay(),m=d.getHours()*60+d.getMinutes(),[o,c]=hrsFor(b,wd),pv=hrsFor(b,(wd+6)%7);
  if(pv[1]>1440&&m<pv[1]-1440)return{open:true,text:'Open now · closes at '+fmtMin(pv[1]),short:'Open now'};
  if(m>=o&&m<c)return{open:true,text:'Open now · closes at '+fmtMin(c),short:'Open now'};
  if(m<o)return{open:false,text:'Closed · opens at '+fmtMin(o),short:'Closed'};
  return{open:false,text:'Closed · opens tomorrow at '+fmtMin(hrsFor(b,(wd+1)%7)[0]),short:'Closed'}}
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const hrsText=(b,wd)=>{const[o,c]=hrsFor(b,wd);return fmtMin(o)+' – '+fmtMin(c)};
function dist(a,b){const R=6371,r=x=>x*Math.PI/180,dl=r(b.lat-a.lat),dg=r(b.lng-a.lng),h=Math.sin(dl/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dg/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
let userPos={lat:12.9716,lng:77.5946,real:false};
/* ---------- Products ---------- */
const catOf=id=>S.cats.find(c=>c.id===id)||{id,name:id,emoji:'🍽️'};
const outOf=p=>p.oos||p.stock<=0;
const lowStock=p=>!outOf(p)&&p.stock<=5;
const discPct=p=>p.mrp>p.price?Math.round((1-p.price/p.mrp)*100):0;
const inCart=pid=>S.cart.filter(l=>l.pid===pid).reduce((a,l)=>a+l.qty,0);
function lineInfo(l){
  if(l.bundle)return{name:l.bundle.name,unit:l.bundle.unit,mrp:l.bundle.mrp,summary:l.bundle.inc,art:l.bundle.art,p:null,seed:hash(l.bundle.name)};
  const p=prod(l.pid);if(!p)return null;const add=selPrice(p,l.sel);
  return{name:p.name,unit:l.reward?0:p.price+add,mrp:l.reward?0:Math.max(p.mrp,p.price)+add,summary:selSummary(p,l.sel),art:p.art,p,seed:hash(p.id)}}
/* ---------- Cart ---------- */
function coupon(code){return S.coupons.find(c=>c.code===String(code).trim().toUpperCase())}
function couponCheck(c,sub){
  if(!c)return'That code isn’t valid. Check the spelling and try again.';
  if(!c.active)return c.code+' is not active right now.';
  if(c.exp&&new Date(c.exp+'T23:59:59')<new Date())return c.code+' expired on '+fmtDate(new Date(c.exp));
  if(sub<c.min)return'Add '+inr(c.min-sub)+' more to use '+c.code+' (minimum order '+inr(c.min)+').';
  return''}
function totals(lines=S.cart,type){
  type=type||S.checkout.type||'delivery';
  let sub=0,mrp=0;lines.forEach(l=>{const i=lineInfo(l);if(!i)return;sub+=i.unit*l.qty;mrp+=i.mrp*l.qty});
  const c=coupon(S.coupon),err=S.coupon?couponCheck(c,sub):'';let disc=0,ship=false;
  if(S.coupon&&!err){if(c.type==='pct'){disc=Math.round(sub*c.value/100);if(c.max)disc=Math.min(disc,c.max)}else if(c.type==='flat')disc=c.value;else ship=true}
  const u=me(),free=u?tierOf(u.life).free:TIERS[0].free,freeAt=free;
  const baseFee=type==='pickup'?0:(sub>=freeAt?0:BRAND.fee),fee=ship?0:baseFee,tax=Math.round((sub-disc)*BRAND.gst),total=Math.max(0,sub-disc+fee+tax);
  const saved=Math.max(0,mrp-sub)+disc+(baseFee&&ship?baseFee:0)+(type==='delivery'&&sub>=freeAt&&sub>0?BRAND.fee:0);
  return{sub,mrp,disc,fee,tax,total,saved,err,freeAt,toFree:Math.max(0,freeAt-sub),ship,count:lines.reduce((a,l)=>a+l.qty,0),coupon:c,type}}
const lineKey=(pid,sel,instr)=>pid+'|'+JSON.stringify(sel||'')+'|'+(instr||'');
function addLine(pid,{sel,qty=1,instr='',reward=0,silent}={}){
  const p=prod(pid);if(!p)return false;
  if(outOf(p)){toast(p.name+' is out of stock right now.','error');return false}
  if(inCart(pid)+qty>p.stock&&!reward){toast('Only '+p.stock+' of '+p.name+' left.','warn');return false}
  const k=lineKey(pid,sel,instr),ex=S.cart.find(l=>!l.bundle&&!l.reward&&!reward&&l.k===k);
  if(ex)ex.qty+=qty;else S.cart.push({id:uid('l'),k,pid,sel:sel||null,qty,instr,reward});
  save();refreshCart();if(!silent)toast(p.name+' added to cart','ok',{label:'View cart',act:'cart'});return true}
function addBundle(o){const ex=S.cart.find(l=>l.bundle&&l.bundle.id===o.id);if(ex)ex.qty++;else S.cart.push({id:uid('l'),bundle:{id:o.id,name:o.title,unit:o.price,mrp:o.orig,inc:o.inc,art:o.art},qty:1});save();refreshCart();toast(o.title+' added to cart','ok',{label:'View cart',act:'cart'})}
function setQty(id,d){const l=S.cart.find(x=>x.id===id);if(!l)return;const p=prod(l.pid);if(d>0&&p&&!l.reward&&inCart(l.pid)+d>p.stock){toast('Only '+p.stock+' available.','warn');return}l.qty+=d;if(l.qty<=0)return removeLine(id);save();refreshCart()}
function removeLine(id){const l=S.cart.find(x=>x.id===id);if(!l)return;if(l.reward&&me()){me().pts+=l.reward*l.qty}S.cart=S.cart.filter(x=>x.id!==id);save();refreshCart()}
function clearCart(){S.cart.forEach(l=>{if(l.reward&&me())me().pts+=l.reward*l.qty});S.cart=[];S.coupon='';save();refreshCart()}
function pairFor(p){const map={pizza:['s1','d1'],burgers:['f1','d1'],fries:['b1','d1'],wraps:['f2','d1'],sides:['d1','t1'],beverages:['f1','s1'],desserts:['d2','f1'],combos:['t1','d4']};return(map[p.cat]||['f1','d1']).map(prod).filter(x=>x&&!outOf(x)&&x.id!==p.id)}
function recos(){
  const cats=new Set(S.cart.map(l=>prod(l.pid)?.cat).filter(Boolean)),ids=new Set(S.cart.map(l=>l.pid)),out=[];
  const add=id=>{const p=prod(id);if(p&&!ids.has(id)&&!outOf(p)&&!out.includes(p))out.push(p)};
  if(cats.has('pizza')){add('s1');add('d1');add('t1')}if(cats.has('burgers')){add('f1');add('d1');add('s3')}
  ['f3','d2','s4','t2','f2'].forEach(add);return out.slice(0,4)}
/* ---------- Notifications ---------- */
function notify(type,title,body,link){S.notifs.unshift({id:uid('n'),ts:Date.now(),type,title,body,read:false,link:link||''});S.notifs=S.notifs.slice(0,40);save();refreshBell()}
/* ---------- Orders ---------- */
const STEPS_D=[['confirmed','Order confirmed','We’ve accepted your order','check'],['preparing','Preparing','Fresh from the oven and grill','flame'],['out','Out for delivery','Your rider is on the way','bike'],['delivered','Delivered','Enjoy your meal!','gift']];
const STEPS_P=[['confirmed','Order confirmed','We’ve accepted your order','check'],['preparing','Preparing','Fresh from the oven and grill','flame'],['ready','Ready for pickup','Show your order number at the counter','bag'],['delivered','Picked up','Enjoy your meal!','gift']];
const STATUS_LABEL={new:'New',confirmed:'Confirmed',preparing:'Preparing',ready:'Ready',out:'Out for delivery',delivered:'Delivered',rejected:'Rejected'};
const order=id=>S.orders.find(o=>o.id===id);
const flow=o=>o.type==='pickup'?['new','confirmed','preparing','ready','delivered']:['new','confirmed','preparing','ready','out','delivered'];
const nextStatus=o=>{const f=flow(o),i=f.indexOf(o.status);return i>=0&&i<f.length-1?f[i+1]:null};
function stepIndex(o){const s=o.status;if(s==='new')return 0;const st=o.type==='pickup'?STEPS_P:STEPS_D;let i=st.findIndex(x=>x[0]===s);if(i<0&&s==='ready')i=1;return i}
function setStatus(o,st){
  if(o.status===st)return;o.status=st;o.stageAt=Date.now();
  const n='#'+o.id;
  if(o.mine){
    const T={confirmed:['Order accepted','The kitchen accepted order '+n+'.'],preparing:['Food preparation started','Your order '+n+' is being freshly prepared.'],ready:[o.type==='pickup'?'Order ready for pickup':'Order packed','Order '+n+(o.type==='pickup'?' is ready at the counter.':' is packed and waiting for the rider.')],out:['Out for delivery','Ravi K. is on the way with order '+n+'.'],delivered:[o.type==='pickup'?'Order picked up':'Order delivered','Enjoy your meal! You earned '+o.pts+' reward points.'],rejected:['Order cancelled','Sorry, the kitchen couldn’t accept order '+n+'. Any payment will be refunded within 5–7 days.']};
    if(T[st]){notify('order',T[st][0],T[st][1],'#/track/'+o.id);toast(T[st][0]+' · '+n,st==='rejected'?'error':'ok')}}
  if(st==='delivered'&&o.uid!=='guest'){const u=S.users.find(x=>x.id===o.uid);if(u&&!o.credited){o.credited=1;u.pts+=o.pts;u.life+=o.pts}}
  save();emit('orders')}
function tickOrders(){const now=Date.now();let ch=0;S.orders.forEach(o=>{if(!S.auto||!o.auto)return;const nx=nextStatus(o);if(!nx)return;if(now-o.stageAt>(STAGE_MS[o.status]||8000)){setStatus(o,nx);ch++}})}
function pointsFor(total,u){const b=u?tierOf(u.life).bonus:0;return Math.floor(total/10*(1+b))}
/* ---------- Payments adapter (Razorpay-ready) ---------- */
const PAYMENTS={provider:'mock',
  async createOrder(amount,receipt){/* Production: POST /api/payments/razorpay/order {amount,receipt} → {id,amount,currency} */return{id:'order_'+uid(),amount:amount*100,currency:'INR',receipt}},
  async charge({amount,method,receipt,customer,card}){
    const ord=await this.createOrder(amount,receipt);
    if(this.provider==='razorpay'&&window.Razorpay){
      return new Promise((res,rej)=>{const rz=new window.Razorpay({key:'RAZORPAY_KEY_ID',amount:ord.amount,currency:'INR',order_id:ord.id,name:BRAND.name,prefill:{name:customer.name,email:customer.email,contact:customer.phone},handler:r=>res({ok:true,ref:r.razorpay_payment_id}),modal:{ondismiss:()=>rej(new Error('Payment cancelled'))}});rz.open()})}
    await new Promise(r=>setTimeout(r,method==='cod'?500:1900));
    if(method==='card'&&/0002$/.test((card||'').replace(/\s/g,'')))throw new Error('Your bank declined this card. Try another card or pay with UPI.');
    return{ok:true,ref:method==='cod'?'COD':'pay_'+uid().toUpperCase()}}};
/* ---------- Pub/sub ---------- */
const listeners={};const on=(e,f)=>(listeners[e]=listeners[e]||[]).push(f);const emit=e=>(listeners[e]||[]).forEach(f=>f());
/* ---------- Image upload (resized to keep storage small) ---------- */
function readImage(file,max=320){return new Promise((res,rej)=>{if(!file||!/^image\//.test(file.type))return rej(new Error('Please choose an image file.'));const fr=new FileReader();fr.onerror=()=>rej(new Error('Could not read that file.'));fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.72))};im.onerror=()=>rej(new Error('That image could not be opened.'));im.src=fr.result};fr.readAsDataURL(file)})}
/* ---------- WhatsApp ---------- */
function waLink(lines,name){const t=totals(lines),body=lines.map(l=>{const i=lineInfo(l);return i?`• ${l.qty} × ${i.name}${i.summary&&!l.bundle?' ('+i.summary+')':''} — ${inr(i.unit*l.qty)}`:''}).filter(Boolean).join('\n');const msg=`Hi ${BRAND.name}! I'd like to place an order:\n\n${body}\n\nTotal: ${inr(t.total)} (incl. taxes${t.fee?' & delivery':''})\nName: ${name||'—'}\nOrder type: ${t.type==='pickup'?'Pickup':'Delivery'}`;return'https://wa.me/'+BRAND.wa+'?text='+encodeURIComponent(msg)}
/* ---------- Analytics seed ---------- */
function salesHist(){
  const days=[],t0=dayStart(),fw=[.85,.8,.85,.92,1.08,1.3,1.38];
  for(let i=364;i>=0;i--){const ts=t0-i*DAY,d=new Date(ts),R=rng(hash(d.toDateString()));const g=.72+.28*(364-i)/364,o=Math.round(168*fw[d.getDay()]*g*(.9+R()*.2)),aov=385+R()*75;days.push({ts,orders:o,sales:Math.round(o*aov)})}
  const today=S.orders.filter(o=>o.created>=t0&&o.status!=='rejected');days[364]={ts:t0,orders:today.length,sales:today.reduce((a,o)=>a+o.total,0)};return days}
