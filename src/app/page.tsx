// app/page.tsx
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
  const [language, setLanguage] = useState('all') // Default to 'all'
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

  // MODIFIED: This handler now clears everything when search type changes
  const handleSearchTypeChange = (newType: 'title' | 'author') => {
    setCurrentSearchType(newType); // Update the state for search type
    setQuery('');                // Clear the input field
    setResults([]);              // Clear any previous results
    setError(null);              // Clear any previous errors
    // No doSearch call here, as it's a full reset.
    // The user will need to type a new query and submit.
  }

  // MODIFIED: This handler now also triggers a search if query is present, AND resets results/error if query is empty
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage); // Update the state
    // If there's an existing query, re-run the search immediately with the new language.
    // This gives responsiveness when changing filters on an active query.
    if (query.trim()) {
      doSearch(currentSearchType, query, newLanguage);
    } else {
      setResults([]); // If query is empty, clear any existing results
      setError(null); // Clear any existing errors
    }
  }

  // The `useEffect` that depends on language, currentSearchType, and query should also be removed
  // if you strictly only want API calls on explicit submit *or* explicit filter changes.
  // The current `handleLanguageChange` and `handleSearchTypeChange` already handle the filter changes.
  // We don't need a passive `useEffect` listening to these states for `doSearch`.
  // Removed the previous useEffect which looked like this:
  /*
  useEffect(() => {
    if (query.trim()) {
      doSearch(currentSearchType, query, language);
    } else {
      setResults([]);
    }
  }, [language, currentSearchType, query, doSearch]);
  */
  // RATIONALE: The explicit handlers (handleLanguageChange, handleSearchTypeChange, handleSubmitSearch)
  // now fully control when doSearch is called. A passive useEffect that re-runs on state changes
  // can conflict with this explicit control or cause unwanted extra fetches.

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
        onSearchTypeChange={handleSearchTypeChange} // This now triggers a full reset
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