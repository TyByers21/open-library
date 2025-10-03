'use client'
import React, { useState } from 'react'
import SearchBar from '../components/SearchBar'
import { searchBooks } from '../lib/api.ts'
import type { SearchDoc } from '../lib/api.ts'



export default function SearchPage() {
const [query, setQuery] = useState('')
const [results, setResults] = useState<SearchDoc[]>([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
const [selected, setSelected] = useState<SearchDoc | null>(null)

async function doSearch() {
if (!query.trim()) return
setLoading(true)
setError(null)
try {
const data = await searchBooks(query.trim(), 1)
setResults(data.docs)
} catch (e: any) {
setError(e.message ?? 'Search error')
} finally {
setLoading(false)
}
}


return (
<div className="p-6">
<SearchBar value={query} onChange={setQuery} onSubmit={doSearch} />


<div className="mt-6">
{loading && <p>Loading...</p>}
{error && <p className="text-red-600">{error}</p>}
{!loading && !error && results.length === 0 && <p className="text-slate-500">No results yet — try a search.</p>}



</div>


</div>
)
}