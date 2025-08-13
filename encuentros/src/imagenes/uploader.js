// Helper para front: usa el endpoint /upload (proxyeado) con FormData
export async function uploadImage(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('upload_error')
  return await res.json() // {url, public_id}
}
