import React, { useState } from 'react'
import { useBookshelf } from '../context/BookshelfContext'
import BookCard from '../components/BookCard'
import BookDetailModal from '../components/BookDetailModal'


export default function BookshelfPage() {
const { books, remove, has } = useBookshelf()
const [selected, setSelected] = useState(null as any)


return (
<div className="p-6">
<h2 className="text-2xl font-bold">My Bookshelf</h2>
{books.length === 0 ? (
<p className="mt-4 text-slate-500">No saved books yet.</p>
) : (
<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
{books.map(b => (
<BookCard
key={b.key}
book={b}
onOpen={(book) => setSelected(book)}
onToggleSave={() => remove(b.key)}
saved={true}
/>
))}
</div>
)}


<BookDetailModal book={selected} onClose={() => setSelected(null)} />
</div>
)
}