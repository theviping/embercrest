/* ============ Illustrated food art (inline SVG, 200x200 space) ============ */
const spiral=(n,rad,R,j=6)=>Array.from({length:n},(_,i)=>{const a=i*2.39996+R()*.6,d=Math.sqrt((i+.55)/n)*rad;return[100+Math.cos(a)*d+(R()-.5)*j,100+Math.sin(a)*d+(R()-.5)*j,a*57.3]});
const G=(x,y,s,inner,rot=0)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${inner}</g>`;
function pizzaArt(v,seed){
  const R=rng(seed);let s='';
  s+='<circle cx="100" cy="100" r="93" fill="#D2832C"/><circle cx="100" cy="100" r="89" fill="#F2B75E"/><circle cx="100" cy="100" r="80" fill="#C4301C"/><circle cx="100" cy="100" r="76" fill="#FBD36B"/>';
  for(let i=0;i<14;i++){const a=R()*6.28,d=Math.sqrt(R())*62;s+=`<ellipse cx="${100+Math.cos(a)*d}" cy="${100+Math.sin(a)*d}" rx="${8+R()*9}" ry="${6+R()*7}" fill="${R()>.5?'#FFE7A3':'#F3BC4C'}" opacity=".75"/>`}
  const P=(n,r=60)=>spiral(n,r,R);
  if(v==='pepperoni')P(10).forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="11" fill="#B0231A"/><circle cx="${x-3}" cy="${y-3}" r="3" fill="#D4463A" opacity=".7"/><circle cx="${x+4}" cy="${y+3}" r="1.6" fill="#7E120C"/><circle cx="${x-4}" cy="${y+4}" r="1.3" fill="#7E120C"/>`);
  if(v==='margherita'){P(6,52).forEach(([x,y],i)=>s+=`<circle cx="${x}" cy="${y}" r="11" fill="#F7F1E2"/>`);P(5,50).forEach(([x,y])=>s+=`<circle cx="${x+9}" cy="${y-6}" r="8" fill="#D63A25"/><circle cx="${x+9}" cy="${y-6}" r="3" fill="#F26B4E"/>`);P(7,58).forEach(([x,y,a])=>s+=`<ellipse cx="${x}" cy="${y}" rx="8" ry="4.5" transform="rotate(${a} ${x} ${y})" fill="#2F8F3A"/><path d="M${x-7} ${y}h14" stroke="#1F6B2B" stroke-width="1" transform="rotate(${a} ${x} ${y})"/>`)}
  if(v==='veg'){P(9,60).forEach(([x,y,a])=>s+=`<path d="M${x-9} ${y}a9 9 0 0 1 18 0" fill="none" stroke="#3E9B3A" stroke-width="4" stroke-linecap="round" transform="rotate(${a} ${x} ${y})"/>`);P(7,56).forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#B4478F" stroke-width="3" opacity=".9"/>`);P(8,58).forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="5" fill="#2A2523"/><circle cx="${x}" cy="${y}" r="2" fill="#FBD36B"/>`);P(16,62).forEach(([x,y])=>s+=`<ellipse cx="${x}" cy="${y}" rx="3" ry="2.2" fill="#FFD230"/>`);P(5,50).forEach(([x,y])=>s+=`<ellipse cx="${x}" cy="${y}" rx="8" ry="6" fill="#B79B84"/><ellipse cx="${x}" cy="${y-2}" rx="6" ry="3" fill="#E4D3C0"/>`)}
  if(v==='paneer'){P(11,60).forEach(([x,y,a])=>s+=`<rect x="${x-7}" y="${y-7}" width="14" height="14" rx="3" fill="#FFF0C6" stroke="#EE9B2D" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`);P(6,52).forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="#B4478F" stroke-width="3"/>`);P(20,62).forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="2" fill="#2F8F3A"/>`)}
  if(v==='chicken'||v==='bbq'){P(11,60).forEach(([x,y,a])=>s+=`<path d="M${x-8} ${y-3}q8-7 16 0q3 6-3 8q-8 3-13-2z" fill="#A85A2A" stroke="#6E3417" stroke-width="1.5" transform="rotate(${a} ${x} ${y})"/>`);P(7,54).forEach(([x,y,a])=>s+=`<path d="M${x-8} ${y}a8 8 0 0 1 16 0" fill="none" stroke="#3E9B3A" stroke-width="3.5" stroke-linecap="round" transform="rotate(${a} ${x} ${y})"/>`);if(v==='bbq')s+='<path d="M40 70q20-10 30 0t30 0t30 0t20 10M38 100q20-10 30 0t30 0t30 0t28 6M46 130q20-10 30 0t30 0t30 0" fill="none" stroke="#4A2010" stroke-width="4" stroke-linecap="round" opacity=".85"/>'}
  if(v==='cheese'){for(let i=0;i<16;i++){const a=R()*6.28,d=Math.sqrt(R())*60;s+=`<ellipse cx="${100+Math.cos(a)*d}" cy="${100+Math.sin(a)*d}" rx="${9+R()*8}" ry="${6+R()*5}" fill="${['#FFF6D0','#FFE38A','#FFC94A'][i%3]}" stroke="#F0B03A" stroke-width="1.2"/>`}P(22,62).forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="1.8" fill="#3E9B3A"/>`)}
  if(v==='peri'){P(9,58).forEach(([x,y,a])=>s+=`<path d="M${x-8} ${y}a8 8 0 0 1 16 0" fill="none" stroke="#3E9B3A" stroke-width="4" stroke-linecap="round" transform="rotate(${a} ${x} ${y})"/>`);P(9,58).forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="#7DBB3C" stroke-width="3"/><circle cx="${x}" cy="${y}" r="2" fill="#F5E6A0"/>`);P(9,56).forEach(([x,y,a])=>s+=`<ellipse cx="${x}" cy="${y}" rx="7" ry="2.6" fill="#E5301F" transform="rotate(${a} ${x} ${y})"/>`);s+='<path d="M50 80q25 14 50 0t50 6M46 118q25 14 50 0t54 4" fill="none" stroke="#E8461E" stroke-width="3" opacity=".8" stroke-linecap="round"/>'}
  for(let i=0;i<8;i++){const a=i*Math.PI/4+.39;s+=`<line x1="100" y1="100" x2="${100+Math.cos(a)*89}" y2="${100+Math.sin(a)*89}" stroke="#7A3A0E" stroke-opacity=".38" stroke-width="1.6"/>`}
  return s}
function burgerArt(v,seed,dbl){
  const R=rng(seed);
  const pat={veg:'#7A5A2E',aloo:'#B98A3D',chicken:'#D9963A',beef:'#5B2E1C',paneer:'#EBBB68',mushroom:'#6B4A3A',spicy:'#D9682A'}[v]||'#7A5A2E';
  let s='<ellipse cx="100" cy="176" rx="72" ry="8" fill="#000" opacity=".12"/>';
  s+='<rect x="38" y="146" width="124" height="26" rx="13" fill="#D98A2B"/><rect x="40" y="146" width="120" height="8" rx="4" fill="#E8A54B"/>';
  const patty=y=>`<rect x="30" y="${y}" width="140" height="22" rx="11" fill="${pat}"/>`+(v==='chicken'||v==='spicy'||v==='paneer'||v==='aloo'?Array.from({length:14},(_,i)=>`<circle cx="${40+i*9.4}" cy="${y+8+R()*8}" r="${1.5+R()*1.6}" fill="#fff" opacity=".28"/>`).join(''):`<path d="M40 ${y+7}h120" stroke="#000" opacity=".12" stroke-width="2"/>`);
  s+=patty(126);
  s+='<path d="M30 130h140l-6 6h-18l-8 14-8-14H36z" fill="#FFC72C"/>';
  if(dbl){s+=patty(106);s+='<path d="M30 110h140l-6 6h-20l-6 12-8-12H36z" fill="#FFB81C"/>'}
  const y0=dbl?-20:0;
  s+=`<rect x="36" y="${112+y0}" width="128" height="11" rx="5.5" fill="#D9412B"/>`;
  s+=`<path d="M26 ${114+y0} q10 -14 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 v8 H26z" fill="#62B34B"/>`;
  if(v==='spicy')s+=`<path d="M40 ${112+y0}q15 12 30 0t30 0t30 0" fill="none" stroke="#C81E1E" stroke-width="5" stroke-linecap="round"/>`;
  const t=dbl?-20:0;
  s+=`<path d="M32 ${102+t}C32 ${62+t} 68 ${42+t} 100 ${42+t}C132 ${42+t} 168 ${62+t} 168 ${102+t}Z" fill="#E39A3A"/><path d="M44 ${76+t}C52 ${58+t} 76 ${50+t} 100 ${50+t}" fill="none" stroke="#F4C273" stroke-width="7" stroke-linecap="round" opacity=".8"/><rect x="30" y="${98+t}" width="140" height="10" rx="5" fill="#D98A2B"/>`;
  for(let i=0;i<13;i++){const x=56+R()*88,y=(58+R()*30)+t;s+=`<ellipse cx="${x}" cy="${y}" rx="4" ry="2.2" fill="#FFF3D6" transform="rotate(${R()*180} ${x} ${y})"/>`}
  return dbl?G(0,14,1,s):s}
function friesArt(v,seed){
  const R=rng(seed);let s='<ellipse cx="100" cy="182" rx="56" ry="7" fill="#000" opacity=".12"/>';
  const n=v==='wedges'?9:16;
  for(let i=0;i<n;i++){const x=54+i*(92/n)+R()*4,h=50+R()*34,rot=(i/n-.5)*34+R()*6,w=v==='wedges'?15:9;s+=`<g transform="rotate(${rot} ${x} 120)"><rect x="${x-w/2}" y="${118-h}" width="${w}" height="${h+10}" rx="3" fill="${v==='wedges'?'#D89B3B':'#FFC83D'}"/><rect x="${x-w/2}" y="${118-h}" width="${w*.35}" height="${h+10}" rx="2" fill="#FFE082"/></g>`}
  if(v==='loaded')s+='<path d="M56 70q10 18 22 4t24 8t24-6t18 10v20H56z" fill="#FFAD1F"/><path d="M62 74q6 14 12 24M96 82q4 14 4 26M126 76q-4 14-4 26" stroke="#FFAD1F" stroke-width="6" stroke-linecap="round"/>'+Array.from({length:9},()=>`<circle cx="${60+R()*80}" cy="${70+R()*26}" r="2.4" fill="#3E9B3A"/>`).join('');
  if(v==='peri')s+=Array.from({length:26},()=>`<circle cx="${58+R()*84}" cy="${60+R()*54}" r="1.8" fill="#D8281B"/>`).join('');
  s+='<path d="M50 112L150 112L142 178Q100 186 58 178Z" fill="#D61F26"/><path d="M50 112h100l-1.5 12H51.5z" fill="#A9141B"/><path d="M76 132h48M80 146h40" stroke="#FFD34E" stroke-width="5" stroke-linecap="round"/>';
  return s}
function wrapArt(v,seed){
  const R=rng(seed);let s='<ellipse cx="100" cy="178" rx="62" ry="7" fill="#000" opacity=".12"/>';
  s+='<g transform="rotate(-32 100 110)"><rect x="34" y="82" width="136" height="60" rx="30" fill="#E9C27E"/><rect x="34" y="82" width="136" height="20" rx="10" fill="#F3D69C" opacity=".8"/>';
  for(let i=0;i<5;i++)s+=`<rect x="${60+i*20}" y="88" width="4" height="46" rx="2" fill="#B6832F" opacity=".55"/>`;
  s+='<ellipse cx="42" cy="112" rx="14" ry="28" fill="#F7E3B4"/><ellipse cx="42" cy="112" rx="10" ry="22" fill="#E8B96A"/>';
  s+=`<circle cx="42" cy="100" r="6" fill="#62B34B"/><circle cx="40" cy="114" r="6" fill="${v==='nv'?'#B6602C':'#F6E7C1'}"/><circle cx="44" cy="124" r="5" fill="#D9412B"/><circle cx="38" cy="106" r="4" fill="#B4478F"/>`;
  s+='<path d="M96 76L176 76L176 148L96 148Q106 112 96 76Z" fill="#CDD3DB"/><path d="M96 76q6 36 0 72" stroke="#fff" stroke-width="2" opacity=".6" fill="none"/><path d="M110 76v72M126 76v72M142 76v72M158 76v72" stroke="#fff" stroke-opacity=".35"/></g>';
  return s}
function cupArt(v,seed){
  const R=rng(seed);
  const C={cola:['#3A1A10','#5A2A18'],coffee:['#B98052','#E3C39C'],mojito:['#BFE8A8','#7CC65A'],mango:['#FFC23D','#FF9A1F'],lime:['#EDF6B5','#CFE571']}[v]||['#FFC23D','#FF9A1F'];
  let s='<ellipse cx="100" cy="182" rx="40" ry="6" fill="#000" opacity=".12"/>';
  s+='<rect x="106" y="8" width="8" height="64" rx="4" fill="#F2D54A" transform="rotate(14 110 40)"/>';
  s+=`<path d="M64 62L136 62L126 176Q100 182 74 176Z" fill="${C[0]}"/><path d="M68 100L132 100L126 176Q100 182 74 176Z" fill="${C[1]}" opacity=".9"/>`;
  s+='<path d="M64 62L136 62L134 74L66 74Z" fill="#fff" opacity=".28"/><rect x="58" y="50" width="84" height="14" rx="7" fill="#2A2422"/><rect x="62" y="52" width="76" height="4" rx="2" fill="#4A403C"/>';
  for(let i=0;i<5;i++)s+=`<rect x="${74+R()*40}" y="${82+R()*70}" width="16" height="16" rx="4" fill="#fff" opacity=".35" transform="rotate(${R()*40} 100 120)"/>`;
  if(v==='cola')s+='<path d="M70 120q15-14 30 0t30 0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/><circle cx="100" cy="146" r="10" fill="#D61F26"/>';
  if(v==='mojito')s+='<ellipse cx="82" cy="76" rx="12" ry="6" fill="#2F8F3A" transform="rotate(-30 82 76)"/><ellipse cx="118" cy="74" rx="12" ry="6" fill="#3E9B3A" transform="rotate(30 118 74)"/>';
  if(v==='lime')s+='<circle cx="100" cy="128" r="18" fill="#9CC93B"/><circle cx="100" cy="128" r="14" fill="#DDF07A"/><path d="M100 114v28M86 128h28M90 118l20 20M110 118 90 138" stroke="#9CC93B" stroke-width="1.5"/>';
  if(v==='coffee')s+='<path d="M72 88q14 14 28 0t28 0" fill="none" stroke="#FFF3E0" stroke-width="8" stroke-linecap="round"/>';
  if(v==='mango')s+='<path d="M80 128q20-26 40 0q-20 22-40 0z" fill="#FFE07A" opacity=".9"/>';
  return s}
function sideArt(v,seed){
  const R=rng(seed);let s='<ellipse cx="100" cy="176" rx="70" ry="8" fill="#000" opacity=".12"/>';
  if(v==='garlic')[[52,110,-14],[86,96,-6],[120,104,8],[152,116,16]].forEach(([x,y,r],i)=>{s+=`<g transform="rotate(${r} ${x} ${y})"><rect x="${x-24}" y="${y-30}" width="48" height="80" rx="20" fill="#D9963A"/><rect x="${x-20}" y="${y-26}" width="40" height="72" rx="17" fill="#F0BE62"/><path d="M${x-14} ${y-10}q14 8 28 0M${x-14} ${y+10}q14 8 28 0" stroke="#FFE9A8" stroke-width="5" fill="none" stroke-linecap="round"/>${Array.from({length:6},()=>`<circle cx="${x-14+R()*28}" cy="${y-20+R()*60}" r="1.8" fill="#3E9B3A"/>`).join('')}</g>`});
  if(v==='nuggets')[[58,110],[100,90],[142,112],[78,146],[124,148]].forEach(([x,y],i)=>s+=`<path d="M${x-20} ${y}q0-22 20-22q26 0 24 20q-2 22-24 22q-20 0-20-20z" fill="#D9963A" transform="rotate(${i*40} ${x} ${y})"/><path d="M${x-14} ${y-2}q2-14 14-14" fill="none" stroke="#F4C273" stroke-width="4" stroke-linecap="round" transform="rotate(${i*40} ${x} ${y})"/>`);
  if(v==='rings')[[70,110],[124,104],[98,148]].forEach(([x,y],i)=>s+=`<circle cx="${x}" cy="${y}" r="26" fill="none" stroke="#D9963A" stroke-width="16"/><circle cx="${x}" cy="${y}" r="26" fill="none" stroke="#F0BE62" stroke-width="7" stroke-dasharray="40 30"/>`);
  if(v==='poppers')[[62,112],[104,94],[142,116],[86,148],[124,150]].forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="22" fill="#D9963A"/><circle cx="${x-5}" cy="${y-6}" r="12" fill="#F0BE62" opacity=".8"/><circle cx="${x+9}" cy="${y+6}" r="5" fill="#7DBB3C"/><path d="M${x-4} ${y+16}q3 8 6 0" stroke="#FFC72C" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  if(v==='wings')[[60,110,-20],[112,92,10],[100,142,-6]].forEach(([x,y,r])=>s+=`<g transform="rotate(${r} ${x} ${y})"><rect x="${x+20}" y="${y-5}" width="34" height="10" rx="5" fill="#F7EBD3"/><circle cx="${x+56}" cy="${y-5}" r="6" fill="#F7EBD3"/><circle cx="${x+56}" cy="${y+5}" r="6" fill="#F7EBD3"/><ellipse cx="${x}" cy="${y}" rx="34" ry="24" fill="#B5471F"/><ellipse cx="${x-8}" cy="${y-8}" rx="18" ry="8" fill="#DB7B3C" opacity=".8"/><circle cx="${x+10}" cy="${y+8}" r="2" fill="#2F8F3A"/></g>`);
  return s}
function dessertArt(v,seed){
  let s='<ellipse cx="100" cy="178" rx="66" ry="8" fill="#000" opacity=".12"/>';
  if(v==='lava')s+='<ellipse cx="100" cy="150" rx="74" ry="16" fill="#F5EFE6"/><path d="M52 150q0-56 48-56t48 56z" fill="#4A2317"/><path d="M70 112q30-14 60 0" stroke="#7B4230" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/><path d="M84 150q-4 14 6 14t2-14M112 150q-4 18 8 18t2-18" fill="#2C120B"/><ellipse cx="100" cy="98" rx="14" ry="5" fill="#2C120B"/><circle cx="100" cy="86" r="8" fill="#D33A3A"/>';
  if(v==='sundae')s+='<path d="M60 96h80l-10 62q-30 10-60 0z" fill="#fff" opacity=".55" stroke="#C9D3DC" stroke-width="3"/><rect x="92" y="156" width="16" height="16" fill="#C9D3DC"/><rect x="72" y="170" width="56" height="8" rx="4" fill="#C9D3DC"/><circle cx="82" cy="94" r="20" fill="#F9DDE4"/><circle cx="118" cy="94" r="20" fill="#F5E6C4"/><circle cx="100" cy="76" r="20" fill="#5A2E1E"/><path d="M84 86q16 16 32 0q-4 22-16 22t-16-22z" fill="#3A1B10"/><circle cx="100" cy="54" r="7" fill="#D33A3A"/><path d="M66 112h68M70 128h60" stroke="#5A2E1E" stroke-width="6" stroke-linecap="round" opacity=".8"/>';
  if(v==='churros'){[[62,70,-18],[92,60,-8],[122,64,6],[148,74,16]].forEach(([x,y,r])=>s+=`<g transform="rotate(${r} ${x} ${y})"><rect x="${x-9}" y="${y}" width="18" height="86" rx="9" fill="#D9963A"/>${[0,1,2,3,4,5].map(i=>`<path d="M${x-9} ${y+8+i*14}h18" stroke="#B36F1E" stroke-width="2"/>`).join('')}<rect x="${x-9}" y="${y}" width="6" height="86" rx="3" fill="#F0BE62"/></g>`);s+='<ellipse cx="100" cy="156" rx="34" ry="12" fill="#3A1B10"/><path d="M66 156q34 34 68 0v-10q-34 14-68 0z" fill="#F5EFE6"/><ellipse cx="100" cy="146" rx="34" ry="10" fill="#4A2317"/>'}
  if(v==='brownie')s+='<rect x="42" y="112" width="116" height="50" rx="10" fill="#3B1C10"/><rect x="42" y="112" width="116" height="16" rx="8" fill="#5A2E1E"/><circle cx="100" cy="98" r="24" fill="#F5E6C4"/><path d="M84 92q16 14 32 0q-2 22-16 22t-16-22z" fill="#4A2317"/><circle cx="118" cy="82" r="4" fill="#D33A3A"/>';
  return s}
function comboArt(v,seed){
  const b=G(-6,26,.66,burgerArt('chicken',seed)),f=G(96,30,.62,friesArt('classic',seed+1)),c=G(120,-4,.6,cupArt('cola',seed+2));
  if(v==='solo')return c+b+f;
  if(v==='pizza')return G(-8,-2,.86,pizzaArt('pepperoni',seed))+G(108,52,.52,sideArt('garlic',seed))+G(112,-10,.5,cupArt('cola',seed));
  if(v==='family')return G(-14,-6,.74,pizzaArt('veg',seed))+G(70,-10,.7,pizzaArt('pepperoni',seed+3))+G(6,78,.5,burgerArt('chicken',seed))+G(72,82,.46,friesArt('loaded',seed))+G(126,72,.5,sideArt('wings',seed));
  if(v==='duo')return G(-16,20,.7,burgerArt('chicken',seed))+G(62,10,.7,burgerArt('veg',seed+1))+G(44,88,.5,friesArt('classic',seed))+G(112,86,.5,friesArt('peri',seed));
  if(v==='couple')return G(-16,-4,.74,pizzaArt('paneer',seed))+G(64,18,.74,pizzaArt('pepperoni',seed+2))+G(6,86,.44,sideArt('garlic',seed))+G(110,84,.46,cupArt('cola',seed))+G(140,82,.46,cupArt('cola',seed+1));
  return c+b+f}
function artSVG(a,seed,name){
  const [t,v,x]=a||['pizza','margherita'];let inner='';
  if(t==='pizza')inner=pizzaArt(v,seed);else if(t==='burger')inner=burgerArt(v,seed,x==='dbl');else if(t==='fries')inner=friesArt(v,seed);else if(t==='wrap')inner=wrapArt(v,seed);else if(t==='cup')inner=cupArt(v,seed);else if(t==='side')inner=sideArt(v,seed);else if(t==='dessert')inner=dessertArt(v,seed);else inner=comboArt(v,seed);
  return `<svg class="art" viewBox="0 0 200 200" role="img" aria-label="${esc(name||'Illustration of '+t)}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`}
const ART_BG={pizza:['#FFD9A8','#FF9F45'],burger:['#FFE3B8','#FFB25A'],fries:['#FFF0B8','#FFCB4A'],wrap:['#FFE7C2','#F4A95A'],cup:['#FFE0D0','#FF9B7A'],side:['#FFE9C4','#F7B95E'],dessert:['#F4D9CF','#D99B7E'],combo:['#FFD6C2','#FF8A4A']};
