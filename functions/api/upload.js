export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const bucketType = formData.get('bucket'); // 'covers' أو 'files'

    if (!file) {
      return new Response(JSON.stringify({ error: 'الملف غير موجود' }), { status: 400 });
    }

    // اختيار خزنة R2 الصحيحة بناءً على نوع الملف
    const bucket = bucketType === 'covers' ? env.COVERS_BUCKET : env.FILES_BUCKET;
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    // رفع الملف إلى R2
    await bucket.put(fileName, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    return new Response(JSON.stringify({ success: true, path: fileName }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}