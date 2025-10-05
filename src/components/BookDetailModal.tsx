'use client'
import React, { useEffect, useState } from 'react'
import { fetchWorkDetails, coverUrl } from '../lib/api'
import type { SearchDoc } from '../lib/api'


export default function BookDetailModal({ book, onClose }: { book: SearchDoc | null, onClose: () => void }) {
const [loading, setLoading] = useState(false)
const [details, setDetails] = useState<any | null>(null)
const [error, setError] = useState<string | null>(null)


useEffect(() => {
if (!book) return
let mounted = true
setLoading(true)
setError(null)
setDetails(null)


const key = book.key || (book.edition_key && book.edition_key[0]) || ''
fetchWorkDetails(key)
.then(d => { if (mounted) setDetails(d) })
.catch(e => { if (mounted) setError(String(e)) })
.finally(() => { if (mounted) setLoading(false) })


return () => { mounted = false }
}, [book])


if (!book) return null


return (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
<div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-auto">
<div className="flex justify-between items-start">
<h2 className="text-2xl font-bold">{book.title}</h2>
<button onClick={onClose} className="text-slate-600">Close</button>
</div>
<div className="mt-4 flex gap-6">
<img src={coverUrl(book.cover_i,'L') ?? 'https://via.placeholder.com/200x300'} className="w-40 h-60 object-cover rounded" />
<div>
<p className="font-semibold">Authors: {book.author_name?.join(', ') ?? '—'}</p>
<p className="text-sm text-slate-600">First published: {book.first_publish_year ?? '—'}</p>
<div className="mt-4">
{loading ? <p>Loading details...</p> : error ? <p className="text-red-600">{error}</p> : (
<>
<p className="text-sm">Subjects: {details?.subjects ? details.subjects.slice(0,6).join(', ') : '—'}</p>
<div className="mt-3 text-sm leading-relaxed">
<p>{details?.description?.value ?? details?.description ?? 'No description available.'}</p>
</div>
</>
)}
</div>
</div>
</div>
</div>
</div>
)
}