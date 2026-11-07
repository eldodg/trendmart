(()=>{
const C=window.TM,$=s=>document.querySelector(s);
const live=!C.SUPABASE_URL.includes('YOUR-');
const sb=live?supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY):null;
const L={
ar:{shop:'المتجر',about:'من نحن',contact:'تواصل معنا',cart:'السلة',h1:'مكتبتك الرقمية للكتب وقصص الأطفال والمطبوعات',sub:'تحميل فوري بعد تأكيد الدفع. ادفع بالمحفظة من داخل مصر أو بالدولار من أي مكان.',browse:'تصفح المنتجات',search:'ابحث عن منتج…',all:'الكل',books:'كتب',stories:'قصص',coloring:'تلوين',activities:'أنشطة',templates:'قوالب',buy:'اشترِ الآن',add:'أضف للسلة',details:'التفاصيل',pages:'صفحة',empty:'السلة فارغة',total:'الإجمالي',eg:'من داخل مصر',intl:'من خارج مصر',method:'طريقة الدفع',email:'البريد الإلكتروني',phone:'رقم واتساب (اختياري)',tx:'رقم العملية / هاش التحويل',receipt:'صورة الإيصال',submit:'تأكيد الطلب',sending:'جارٍ الإرسال…',need:'أرفق صورة الإيصال أو اكتب رقم العملية.',ok:'تم استلام طلبك',okp:'سنراجع الدفع ونرسل لك رابط التحميل. أرسل تفاصيل الطلب على واتساب لتسريع التأكيد.',wa:'أرسل الطلب على واتساب',tg:'تيليجرام',status:'تحقق من حالة طلبك',payto:'حوّل المبلغ إلى',openpay:'افتح رابط الدفع',copy:'نسخ',copied:'تم النسخ',instapay:'إنستا باي',vodafone:'فودافون كاش',usdt:'USDT (TRC20)',paypal:'PayPal',kofi:'Ko-fi',err:'تعذّر إرسال الطلب. حاول مرة أخرى أو راسلنا على واتساب.',
testi:'آراء العملاء',t1:'التحميل كان سريعًا والملفات بجودة ممتازة للطباعة.',n1:'عميلة — القاهرة',t2:'الدفع بإنستا باي كان سهلًا وتأكد الطلب بسرعة.',n2:'عميل — الإسكندرية',t3:'قصص مناسبة لأطفالي وبالعربي والإنجليزي.',n3:'عميلة — الجيزة',
aboutP:'TrendMart متجر مصري للمنتجات الرقمية: كتب، قصص أطفال، أوراق تلوين، أنشطة تعليمية وقوالب جاهزة للطباعة والاستخدام.',f1:'تسليم رقمي آمن برابط مؤقت',f2:'دفع محلي بالمحافظ ودفع دولي بالدولار',f3:'دعم مباشر على واتساب وتيليجرام',
cur:'ج.م'},
en:{shop:'Shop',about:'About',contact:'Contact',cart:'Cart',h1:'Your digital library of books, kids stories and printables',sub:'Instant download once payment is confirmed. Pay by wallet in Egypt or in USD from anywhere.',browse:'Browse products',search:'Search products…',all:'All',books:'Books',stories:'Stories',coloring:'Coloring',activities:'Activities',templates:'Templates',buy:'Buy now',add:'Add to cart',details:'Details',pages:'pages',empty:'Your cart is empty',total:'Total',eg:'Inside Egypt',intl:'Outside Egypt',method:'Payment method',email:'Email',phone:'WhatsApp number (optional)',tx:'Transaction ID / hash',receipt:'Receipt image',submit:'Confirm order',sending:'Sending…',need:'Attach a receipt image or enter the transaction ID.',ok:'Order received',okp:'We will verify the payment and send your download link. Send the order details on WhatsApp to speed things up.',wa:'Send order on WhatsApp',tg:'Telegram',status:'Check your order status',payto:'Send the amount to',openpay:'Open payment link',copy:'Copy',copied:'Copied',instapay:'InstaPay',vodafone:'Vodafone Cash',usdt:'USDT (TRC20)',paypal:'PayPal',kofi:'Ko-fi',err:'Could not send the order. Try again or message us on WhatsApp.',
testi:'Customer reviews',t1:'Fast download and print-ready quality.',n1:'Customer — Cairo',t2:'Paying with InstaPay was easy and the order was confirmed quickly.',n2:'Customer — Alexandria',t3:'Great bilingual stories for my kids.',n3:'Customer — Giza',
aboutP:'TrendMart is an Egyptian store for digital products: books, kids stories, coloring sheets, learning activities and print-ready templates.',f1:'Secure digital delivery via expiring link',f2:'Local wallets and international USD payments',f3:'Direct support on WhatsApp and Telegram',cur:'EGP'}
};
const DEMO=[{id:'demo-1',title_ar:'رحلة سُكَّر في أرض الفراعنة',title_en:"Sukkar's Journey Through Egypt",description_ar:'كتاب أطفال مطبوع ثنائي اللغة (4–8 سنوات) يزور فيه القط سُكَّر أشهر معالم مصر.',description_en:'A bilingual printable kids book (ages 4–8) following Sukkar the cat through Egypt\'s landmarks.',category:'books',price_egp:199,price_usd:5,pages:32},
{id:'demo-2',title_ar:'أوراق تلوين الحيوانات',title_en:'Animal Coloring Sheets',description_ar:'٢٠ ورقة تلوين جاهزة للطباعة.',description_en:'20 print-ready coloring sheets.',category:'coloring',price_egp:99,price_usd:3,pages:20},
{id:'demo-3',title_ar:'أنشطة الحروف العربية',title_en:'Arabic Letters Activities',description_ar:'أنشطة تعليمية لتعلم الحروف.',description_en:'Learning activities for Arabic letters.',category:'activities',price_egp:129,price_usd:4,pages:24}];
let lang=localStorage.lang||'ar',products=[],cat='all',cart=JSON.parse(localStorage.cart||'[]'),region=null,method=null;
const t=k=>L[lang][k]||k;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const title=p=>lang==='ar'?p.title_ar:p.title_en,desc=p=>(lang==='ar'?p.description_ar:p.description_en)||'';
const hue=id=>[...String(id)].reduce((a,c)=>(a*31+c.charCodeAt(0))%360,7);
const price=p=>lang==='ar'?`${p.price_egp} ${t('cur')}`:`$${p.price_usd}`;
const cover=p=>p.cover_url?`<img src="${esc(p.cover_url)}" alt="" loading="lazy" class="w-full h-full object-cover">`:`<div class="w-full h-full flex items-end p-3 font-bold text-white text-sm leading-snug" style="background:linear-gradient(150deg,hsl(${hue(p.id)} 55% 36%),hsl(${(hue(p.id)+60)%360} 60% 24%))">${esc(title(p))}</div>`;

function applyLang(){
  document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(e=>e.placeholder=t(e.dataset.i18nPh));
  $('#langBtn').textContent=lang==='ar'?'EN':'عربي';render();
}
function applyTheme(){document.documentElement.classList.toggle('dark',localStorage.theme==='dark')}
function render(){
  const cats=['all','books','stories','coloring','activities','templates'];
  $('#cats').innerHTML=cats.map(c=>`<button class="chip ${c===cat?'on':''}" data-c="${c}">${t(c)}</button>`).join('');
  const q=$('#q').value.trim().toLowerCase();
  const list=products.filter(p=>(cat==='all'||p.category===cat)&&(!q||(p.title_ar+p.title_en).toLowerCase().includes(q)));
  $('#grid').innerHTML=list.map(p=>`<article class="card rounded-xl overflow-hidden flex flex-col">
    <button class="aspect-[3/4] block w-full" data-d="${esc(p.id)}" aria-label="${esc(title(p))}">${cover(p)}</button>
    <div class="p-3 flex flex-col gap-2 flex-1"><h3 class="font-semibold text-sm leading-snug">${esc(title(p))}</h3>
    <div class="mute text-sm">${price(p)}</div>
    <button class="btn text-sm mt-auto" data-q="${esc(p.id)}">${t('buy')}</button></div></article>`).join('');
  $('#heroStack').innerHTML=products.slice(0,3).map((p,i)=>`<div class="w-36 h-52 rounded-xl overflow-hidden shadow-xl ${i?'-ms-14':''}" style="transform:rotate(${(i-1)*6}deg);z-index:${3-i}">${cover(p)}</div>`).join('');
  $('#cartN').textContent=cart.length;
}
async function load(){
  products=DEMO;render();
  if(!live)return;
  const {data,error}=await sb.from('products').select('*').eq('is_active',true).order('created_at',{ascending:false});
  if(!error&&data&&data.length){products=data;render()}
}
const save=()=>{localStorage.cart=JSON.stringify(cart);$('#cartN').textContent=cart.length};
const open=h=>{$('#mbody').innerHTML=`<button class="absolute top-3 end-4 text-2xl" data-x aria-label="Close">×</button>${h}`;$('#modal').classList.remove('hidden')};
const close=()=>$('#modal').classList.add('hidden');
const byId=id=>products.find(p=>p.id===id);

function detail(id){
  const p=byId(id);
  open(`<div class="flex gap-4"><div class="w-32 h-44 shrink-0 rounded-lg overflow-hidden">${cover(p)}</div>
  <div><h3 class="text-xl font-bold">${esc(title(p))}</h3><p class="mute text-sm mt-1">${t(p.category)}${p.pages?` · ${p.pages} ${t('pages')}`:''}</p>
  <p class="mt-3 text-sm leading-relaxed">${esc(desc(p))}</p></div></div>
  ${p.preview_url?`<img src="${esc(p.preview_url)}" alt="" class="mt-4 rounded-lg w-full" loading="lazy">`:''}
  <div class="grid grid-cols-2 gap-3 mt-5">
    <button class="btn" data-go="eg" data-id="${esc(p.id)}">${t('eg')}<br><small>${p.price_egp} ${L.ar.cur}</small></button>
    <button class="btn gold" data-go="intl" data-id="${esc(p.id)}">${t('intl')}<br><small>$${p.price_usd}</small></button></div>
  <button class="btn alt w-full mt-3" data-add="${esc(p.id)}">${t('add')}</button>`);
}
function checkout(){
  const items=cart.map(byId).filter(Boolean);
  if(!items.length)return open(`<p class="py-10 text-center mute">${t('empty')}</p>`);
  region=region||(lang==='ar'?'eg':'intl');
  const eg=region==='eg',total=items.reduce((s,p)=>s+Number(eg?p.price_egp:p.price_usd),0);
  const ms=eg?['instapay','vodafone']:['usdt','paypal','kofi'];
  if(!ms.includes(method))method=ms[0];
  open(`<form id="co" class="space-y-4">
  <div class="flex gap-2"><button type="button" class="chip ${eg?'on':''}" data-r="eg">${t('eg')}</button><button type="button" class="chip ${eg?'':'on'}" data-r="intl">${t('intl')}</button></div>
  <ul class="text-sm space-y-1">${items.map(p=>`<li class="flex justify-between gap-2"><span>${esc(title(p))}</span><span>${eg?p.price_egp+' '+L.ar.cur:'$'+p.price_usd} <button type="button" data-rm="${esc(p.id)}" class="mute" aria-label="Remove">×</button></span></li>`).join('')}</ul>
  <div class="font-bold flex justify-between border-t line pt-3"><span>${t('total')}</span><span>${eg?total+' '+L.ar.cur:'$'+total}</span></div>
  <div><label class="text-sm mute">${t('method')}</label><div class="flex flex-wrap gap-2 mt-1">${ms.map(m=>`<button type="button" class="chip ${m===method?'on':''}" data-m="${m}">${t(m)}</button>`).join('')}</div></div>
  <div class="card rounded-lg p-3 text-sm" id="pinfo">${payInfo()}</div>
  <input name="email" type="email" required placeholder="${t('email')}" autocomplete="email">
  <input name="phone" type="tel" placeholder="${t('phone')}" dir="ltr">
  <input name="tx" placeholder="${t('tx')}" dir="ltr">
  <div><label class="text-sm mute">${t('receipt')}</label><input name="receipt" type="file" accept="image/*,.pdf"></div>
  <p id="cerr" class="text-red-500 text-sm"></p>
  <button class="btn w-full" id="csub">${t('submit')}</button></form>`);
}
function payInfo(){
  const v=C.PAY[method];
  if(/^https?:/.test(v))return `<a class="btn gold inline-block" href="${esc(v)}" target="_blank" rel="noopener">${t('openpay')}</a>`;
  return `${t('payto')}:<div class="flex items-center gap-2 mt-1"><code dir="ltr" class="break-all flex-1">${esc(v)}</code><button type="button" class="chip" data-copy="${esc(v)}">${t('copy')}</button></div>`;
}
async function submit(e){
  e.preventDefault();
  const f=new FormData(e.target),file=f.get('receipt'),tx=(f.get('tx')||'').trim(),err=$('#cerr');
  if(!(file&&file.size)&&!tx)return err.textContent=t('need');
  const btn=$('#csub');btn.disabled=true;btn.textContent=t('sending');
  const eg=region==='eg',items=cart.map(byId).filter(Boolean),email=f.get('email').trim().toLowerCase(),phone=(f.get('phone')||'').trim();
  const ids=[];
  try{
    if(live){
      let receiptPath=null;const batch=crypto.randomUUID();
      if(file&&file.size){
        receiptPath=`${batch}/${file.name.replace(/[^\w.\-]/g,'_')}`;
        const up=await sb.storage.from('receipts').upload(receiptPath,file);if(up.error)throw up.error;
      }
      for(const p of items){
        const id=crypto.randomUUID();ids.push(id);
        const r=await sb.from('orders').insert({id,customer_email:email,customer_phone:phone||null,product_id:p.id,currency:eg?'EGP':'USD',amount:eg?p.price_egp:p.price_usd,payment_method:method,receipt_url:receiptPath,tx_ref:tx||null});
        if(r.error)throw r.error;
      }
    }
    const total=items.reduce((s,p)=>s+Number(eg?p.price_egp:p.price_usd),0);
    const msg=`TrendMart ${lang==='ar'?'طلب جديد':'New order'}\n${items.map(p=>'- '+title(p)).join('\n')}\n${t('total')}: ${eg?total+' EGP':total+' USD'}\n${t('method')}: ${t(method)}\n${tx?t('tx')+': '+tx+'\n':''}Email: ${email}\n${ids.length?'ID: '+ids.join(', '):''}`;
    cart=[];save();
    open(`<h3 class="text-xl font-bold">${t('ok')}</h3><p class="mute mt-2 text-sm leading-relaxed">${t('okp')}</p>
    <div class="grid gap-3 mt-5"><a class="btn" target="_blank" rel="noopener" href="https://wa.me/${C.WHATSAPP}?text=${encodeURIComponent(msg)}">${t('wa')}</a>
    <a class="btn alt" target="_blank" rel="noopener" href="https://t.me/${C.TELEGRAM_PHONE}">${t('tg')}</a>
    <a class="btn alt" href="download.html${ids[0]?`?order=${ids[0]}&email=${encodeURIComponent(email)}`:''}">${t('status')}</a></div>`);
  }catch(x){console.error(x);err.textContent=t('err');btn.disabled=false;btn.textContent=t('submit')}
}
document.addEventListener('click',e=>{
  const g=a=>e.target.closest(`[${a}]`);let el;
  if(g('data-x')||e.target.id==='modal')close();
  else if(el=g('data-c')){cat=el.dataset.c;render()}
  else if(el=g('data-d'))detail(el.dataset.d);
  else if(el=g('data-q')){if(!cart.includes(el.dataset.q))cart.push(el.dataset.q);save();region=null;checkout()}
  else if(el=g('data-add')){if(!cart.includes(el.dataset.add))cart.push(el.dataset.add);save();close()}
  else if(el=g('data-go')){if(!cart.includes(el.dataset.id))cart.push(el.dataset.id);save();region=el.dataset.go;checkout()}
  else if(el=g('data-r')){region=el.dataset.r;checkout()}
  else if(el=g('data-m')){method=el.dataset.m;checkout()}
  else if(el=g('data-rm')){cart=cart.filter(i=>i!==el.dataset.rm);save();checkout()}
  else if(el=g('data-copy')){navigator.clipboard.writeText(el.dataset.copy);el.textContent=t('copied')}
});
document.addEventListener('submit',e=>{if(e.target.id==='co')submit(e)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
$('#langBtn').onclick=()=>{lang=lang==='ar'?'en':'ar';localStorage.lang=lang;applyLang()};
$('#themeBtn').onclick=()=>{localStorage.theme=localStorage.theme==='dark'?'light':'dark';applyTheme()};
$('#cartBtn').onclick=()=>{region=null;checkout()};
$('#q').oninput=render;
$('#waLink').href=`https://wa.me/${C.WHATSAPP}`;$('#tgLink').href=`https://t.me/${C.TELEGRAM_PHONE}`;
$('#fbLink').href=C.FACEBOOK;$('#igLink').href=C.INSTAGRAM;$('#yr').textContent=new Date().getFullYear();
if(!localStorage.theme)localStorage.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
applyTheme();applyLang();load();
})();
