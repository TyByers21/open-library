'use client'
import React from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  language: string
  onLanguageChange: (v: string) => void
}

export default function SearchBar({ value, onChange, onSubmit, language, onLanguageChange }: Props) {
  return (
    <form className="flex gap-2 flex-wrap" onSubmit={(e)=>{e.preventDefault(); onSubmit()}}>
      <input
        className="flex-1 px-4 py-2 w-64 rounded-md border border-slate-300 focus:outline-none focus:ring-2"
        placeholder="Search any book title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <select
        className="px-3 py-2 rounded-md border border-slate-300"
        value={language}
        onChange={(e)=> onLanguageChange(e.target.value)}
      >
        <option value="eng">English</option>
        <option value="spa">Spanish</option>
        <option value="fre">French</option>
        <option value="ger">German</option>
        <option value="">Any</option>
      </select>
      <button className="px-4 py-2 rounded-md bg-sky-600 text-white" type="submit">Search</button>
    </form>
  )
}