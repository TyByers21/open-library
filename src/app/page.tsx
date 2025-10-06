'use client'
import React, { useState } from 'react'
import SearchBar from '../components/SearchBar'
import { searchAuthors, searchBooks } from '../lib/api'
import BookCard from '../components/BookCard'
import BookDetailModal from '../components/BookDetailModal'
import type { SearchDoc } from '../lib/api'
import { useBookshelf } from '../context/BookshelfProvider'
import Image from 'next/image'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('eng')
  const [results, setResults] = useState<SearchDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<SearchDoc | null>(null)

  const { add, remove, has } = useBookshelf()

  // Clear results when search type changes
  const handleSearchTypeChange = () => {
    setResults([])
    setError(null)
  }

  async function doSearch(searchType: 'title' | 'author') {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    
    try {
      let data
      if (searchType === 'author') {
        data = await searchAuthors(query.trim(), 1, language)
      } else {
        data = await searchBooks(query.trim(), 1, language)
      }
      setResults(data.docs)
    } catch (e: any) {
      setError(e.message ?? 'Search error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <div className="pb-4">
        <Image
          src="/book-nook-main.png"
          alt="Book Nook"
          width={420}
          height={240}
          className="mx-auto"
          priority
        />
      </div>
      <SearchBar 
        value={query} 
        onChange={setQuery} 
        onSubmit={doSearch}
        onSearchTypeChange={handleSearchTypeChange} 
        language={language}            
        onLanguageChange={setLanguage}  
      />

      <div className="mt-6">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p className="text-slate-500">No results yet — try a search.</p>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((r) => (
            <BookCard
              key={r.key}
              book={r}
              onOpen={(b) => setSelected(b)}
              onToggleSave={(b) => has(b.key) ? remove(b.key) : add(b)}
              saved={has(r.key)}
            />
          ))}
        </div>
      </div>

      <BookDetailModal book={selected} onClose={() => setSelected(null)} />
    </div>
  )
}