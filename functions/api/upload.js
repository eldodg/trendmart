export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const bucketType = formData.get('bucket'); // 'covers' أو 'files'

    if (!file) {
      return new Response(JSON.stringify({ error: 'الملف غير موجود' }), { status: 400 });
    }

    const bucket = bucketType === 'covers' ? env.COVERS_BUCKET : env.FILES_BUCKET;
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    await bucket.put(fileName, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    // رابط R2 المباشر العام لخزنة الأغلفة والصور
    let publicUrl = null;
    if (bucketType === 'covers') {
      publicUrl = `https://pub-30f1c766b09341b39065f20279ae048e.r2.dev/${fileName}`;
    }

    return new Response(JSON.stringify({ success: true, path: fileName, url: publicUrl }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}