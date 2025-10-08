'use client'
import React, { useState, useEffect, useCallback } from 'react'
import SearchBar from '../components/SearchBar'
import { searchAuthors, searchBooks } from '../lib/api'
import BookCard from '../components/BookCard'
import BookDetailModal from '../components/BookDetailModal'
import type { SearchDoc } from '../lib/api'
import { useBookshelf } from '../context/BookshelfProvider'
import Image from 'next/image'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('all')
  const [currentSearchType, setCurrentSearchType] = useState<'title' | 'author'>('title')
  const [results, setResults] = useState<SearchDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<SearchDoc | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { add, remove, has } = useBookshelf()

  const doSearch = useCallback(async (searchType: 'title' | 'author', currentQuery: string, currentLanguage: string) => {
    const trimmedQuery = currentQuery.trim();
    if (!trimmedQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      const effectiveLanguage = currentLanguage === 'all' ? undefined : currentLanguage;

      if (searchType === 'author') {
        data = await searchAuthors(trimmedQuery, 1, effectiveLanguage);
      } else {
        data = await searchBooks(trimmedQuery, 1, effectiveLanguage);
      }
      setResults(data.docs);
    } catch (e: any) {
      setError(e.message ?? 'Search error');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmitSearch = (searchTypeFromSearchBar: 'title' | 'author') => {
    setCurrentSearchType(searchTypeFromSearchBar);
    doSearch(searchTypeFromSearchBar, query, language);
  };

 
  const handleSearchTypeChange = (newType: 'title' | 'author') => {
    setCurrentSearchType(newType); 
    setQuery('');             
    setResults([]);          
    setError(null);           

  }

   const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage); 

    if (query.trim()) {
      doSearch(currentSearchType, query, newLanguage);
    } else {
      setResults([]); 
      setError(null); 
    }
  }

  function handleToggleSave(book: SearchDoc) {
    if (has(book.key)) remove(book.key)
    else add(book)
  }

  function handleOpenDetails(book: SearchDoc) {
    setSelected(book)
    setModalOpen(true)
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
        onSubmit={handleSubmitSearch}
        onSearchTypeChange={handleSearchTypeChange} 
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      <div className="mt-6 w-full max-w-5xl">
        {loading && <p className="text-center text-slate-500">Loading...</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
        {/* Adjusted conditional message for clarity */}
        {!loading && !error && results.length === 0 && query.trim() && (
          <p className="text-slate-500 text-center">No results found for "{query}" in {language === 'all' ? 'all languages' : language}.</p>
        )}
        {!loading && !error && results.length === 0 && !query.trim() && (
            <p className="text-center text-slate-500">No results yet — try a search.</p>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((r) => (
            <BookCard
              key={r.key}
              book={r}
              onOpen={handleOpenDetails}
              onToggleSave={handleToggleSave}
              saved={has(r.key)}
            />
          ))}
        </div>
      </div>

      <BookDetailModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setSelected(null)
        }}
        book={selected}
        onToggleSave={handleToggleSave}
        saved={selected ? has(selected.key) : false}
      />
    </div>
  )
}