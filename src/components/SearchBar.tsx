'use client'
import React, { useState } from 'react'
import { Search } from 'lucide-react'

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: (searchType: 'title' | 'author') => void
  onSearchTypeChange?: () => void  // New optional callback
  language: string
  onLanguageChange: (v: string) => void
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onSearchTypeChange,
  language,
  onLanguageChange
}: Props) {
  const [searchType, setSearchType] = useState<'title' | 'author'>('title')

  const handleSearchTypeChange = (newType: 'title' | 'author') => {
    setSearchType(newType)
    onChange('')  // Clear the input field
    onSearchTypeChange?.()  // Notify parent to clear results
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(searchType)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-2xl mx-auto"
    >
      {/* Search Type Selector */}
      <div className="flex gap-6 justify-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="searchType"
            value="title"
            checked={searchType === 'title'}
            onChange={() => handleSearchTypeChange('title')}
            className="accent-sky-600"
          />
          <span className="text-slate-700 font-medium">Search by Title</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="searchType"
            value="author"
            checked={searchType === 'author'}
            onChange={() => handleSearchTypeChange('author')}
            className="accent-sky-600"
          />
          <span className="text-slate-700 font-medium">Search by Author</span>
        </label>
      </div>

      {/* Search Field and Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder={
              searchType === 'title'
                ? 'Enter book title...'
                : 'Enter author name...'
            }
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <select
          className="px-3 py-2 rounded-md border border-slate-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="all">All Languages</option>
          <option value="eng">English</option>
          <option value="spa">Spanish</option>
          <option value="fre">French</option>
          <option value="ger">German</option>
          <option value="ita">Italian</option>
          <option value="por">Portuguese</option>
          <option value="rus">Russian</option>
          <option value="jpn">Japanese</option>
          <option value="chi">Chinese</option>
          <option value="ara">Arabic</option>
        </select>

        <button
          type="submit"
          className="px-6 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition"
        >
          Search
        </button>
      </div>
    </form>
  )
}