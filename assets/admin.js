(()=>{
const C=window.TM,sb=supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY),$=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ext=f=>(f.name.split('.').pop()||'bin').toLowerCase().replace(/[^a-z0-9]/g,'');
async function init(){const {data}=await sb.auth.getSession();data.session?show():($('#login').classList.remove('hidden'),$('#app').classList.add('hidden'))}
function show(){$('#login').classList.add('hidden');$('#app').classList.remove('hidden');loadProducts();loadOrders()}
$('#lf').onsubmit=async e=>{e.preventDefault();const {error}=await sb.auth.signInWithPassword({email:$('#le').value,password:$('#lp').value});error?$('#lerr').textContent='بيانات الدخول غير صحيحة':show()};
$('#out').onclick=async()=>{await sb.auth.signOut();init()};
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===b));$('#products').classList.toggle('hidden',b.dataset.t!=='products');$('#orders').classList.toggle('hidden',b.dataset.t!=='orders')});

async function uploadToR2(file, bucketName) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucketName);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const result = await res.json();
  if (!res.ok || result.error) throw new Error(result.error || 'فشل الرفع إلى الخزنة');
  return result;
}

$('#pf').onsubmit=async e=>{
  e.preventDefault();const f=new FormData(e.target),err=$('#perr'),btn=$('#psub');btn.disabled=true;err.textContent='جارٍ الرفع إلى Cloudflare R2…';
  try{
    const id=crypto.randomUUID(),cover=f.get('cover'),file=f.get('file'),prev=f.get('preview');
    
    // 1. رفع صورة الغلاف والحصول على الرابط المباشر
    const coverRes = await uploadToR2(cover, 'covers');
    const cover_url = coverRes.url;

    // 2. رفع صورة المعاينة (اختياري)
    let preview_url = null;
    if (prev && prev.size) {
      const prevRes = await uploadToR2(prev, 'covers');
      preview_url = prevRes.url;
    }

    // 3. رفع ملف المنتج الأصلي (PDF/ZIP)
    const fileRes = await uploadToR2(file, 'files');
    const file_path = fileRes.path;

    // 4. حفظ البيانات في Supabase
    const row={id,cover_url,preview_url,file_path,pages:f.get('pages')?+f.get('pages'):null};
    ['title_ar','title_en','description_ar','description_en','category'].forEach(k=>row[k]=f.get(k));
    row.price_egp=+f.get('price_egp');row.price_usd=+f.get('price_usd');
    
    const r=await sb.from('products').insert(row);if(r.error)throw r.error;
    e.target.reset();err.textContent='تم نشر المنتج بنجاح ✓';loadProducts();
  }catch(x){console.error(x);err.textContent='فشل: '+(x.message||x)}
  btn.disabled=false;
};

async function loadProducts(){
  const {data}=await sb.from('products').select('*').order('created_at',{ascending:false});
  $('#plist').innerHTML=(data||[]).map(p=>`<div class="card p-3 flex items-center gap-3"><img src="${esc(p.cover_url)}" alt="" class="w-12 h-16 object-cover rounded">
  <div class="flex-1"><div class="font-semibold">${esc(p.title_ar)}</div><div class="text-sm text-gray-500">${p.price_egp} EGP · $${p.price_usd} · ${p.is_active?'ظاهر':'مخفي'}</div></div>
  <button class="btn g" data-tg="${p.id}" data-v="${p.is_active}">${p.is_active?'إخفاء':'إظهار'}</button>
  <button class="btn r" data-del="${p.id}" data-fp="${esc(p.file_path)}">حذف</button></div>`).join('')||'<p class="text-gray-500">لا توجد منتجات بعد.</p>';
}

async function loadOrders(){
  const {data}=await sb.from('orders').select('*, products(title_ar)').order('created_at',{ascending:false}).limit(100);
  const rank={pending:0,approved:1,rejected:2};
  $('#olist').innerHTML=(data||[]).sort((a,b)=>rank[a.status]-rank[b.status]).map(o=>{
    const link=`${location.origin}/download.html?t=${o.download_token}`;
    const wa=o.customer_phone?`https://wa.me/${o.customer_phone.replace(/\D/g,'')}?text=${encodeURIComponent('شكرًا لشرائك من TrendMart. رابط تحميل '+(o.products?.title_ar||'')+':\n'+link)}`:'';
    return `<div class="card p-4 text-sm space-y-2"><div class="flex flex-wrap gap-2 justify-between"><b>${esc(o.products?.title_ar||'—')}</b><span>${o.amount} ${o.currency} · ${esc(o.payment_method)} · <b>${o.status}</b></span></div>
    <div dir="ltr" class="text-gray-600">${esc(o.customer_email)} ${esc(o.customer_phone||'')} ${o.tx_ref?'· tx: '+esc(o.tx_ref):''}<br><small>${o.id}</small></div>
    <div class="flex flex-wrap gap-2">${o.receipt_url?`<button class="btn g" data-rc="${esc(o.receipt_url)}">عرض الإيصال</button>`:''}
    ${o.status==='pending'?`<button class="btn" data-ap="${o.id}">قبول</button><button class="btn r" data-rj="${o.id}">رفض</button>`:''}
    ${o.status==='approved'?`<button class="btn g" data-cp="${esc(link)}">نسخ رابط التحميل</button>${wa?`<a class="btn" target="_blank" rel="noopener" href="${wa}">إرسال واتساب</a>`:''}`:''}</div></div>`}).join('')||'<p class="text-gray-500">لا توجد طلبات.</p>';
}

document.addEventListener('click',async e=>{
  const g=a=>e.target.closest(`[${a}]`);let el;
  if(el=g('data-tg')){await sb.from('products').update({is_active:el.dataset.v!=='true'}).eq('id',el.dataset.tg);loadProducts()}
  else if(el=g('data-del')){if(!confirm('حذف المنتج وملفه نهائيًا؟'))return;await sb.from('products').delete().eq('id',el.dataset.del);loadProducts()}
  else if(el=g('data-ap')){await sb.from('orders').update({status:'approved',download_expires_at:new Date(Date.now()+30*864e5).toISOString()}).eq('id',el.dataset.ap);loadOrders()}
  else if(el=g('data-rj')){await sb.from('orders').update({status:'rejected'}).eq('id',el.dataset.rj);loadOrders()}
  else if(el=g('data-rc')){window.open(el.dataset.rc,'_blank','noopener')}
  else if(el=g('data-cp')){navigator.clipboard.writeText(el.dataset.cp);el.textContent='تم النسخ ✓'}
});
init();
})();