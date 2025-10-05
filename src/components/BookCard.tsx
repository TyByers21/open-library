'use client'
import React from 'react'
import type { SearchDoc } from '../lib/api'
import { coverUrl } from '../lib/api'


type Props = {
book: SearchDoc
onOpen: (b: SearchDoc) => void
onToggleSave: (b: SearchDoc) => void
saved: boolean
}


export default function BookCard({ book, onOpen, onToggleSave, saved }: Props) {
return (
<div className="flex gap-4 p-4 bg-white rounded shadow hover:shadow-md transition cursor-pointer">
<img
src={coverUrl(book.cover_i) ?? 'https://via.placeholder.com/100x150?text=No+Cover'}
alt={book.title}
className="w-24 h-36 object-cover rounded"
onClick={() => onOpen(book)}
/>
<div className="flex-1">
<h3 className="text-lg font-semibold" onClick={() => onOpen(book)}>{book.title}</h3>
<p className="text-sm text-slate-600">{book.author_name?.join(', ')}</p>
<p className="text-sm text-slate-500">First published: {book.first_publish_year ?? '—'}</p>
<div className="mt-3 flex gap-2">
<button
className={`px-3 py-1 rounded border ${saved ? 'bg-amber-400 text-black' : 'bg-white'}`}
onClick={() => onToggleSave(book)}
>
{saved ? 'Remove' : 'Save'}
</button>
<button className="px-3 py-1 rounded border" onClick={() => onOpen(book)}>Details</button>
</div>
</div>
</div>
)
}