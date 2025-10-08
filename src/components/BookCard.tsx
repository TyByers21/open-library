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
    <div
      className="
        flex gap-4 p-4 rounded-lg shadow-sm hover:shadow-md transition 
        cursor-pointer 
        bg-white dark:bg-slate-800/80 
        border border-slate-200 dark:border-slate-700
        hover:bg-slate-50 dark:hover:bg-slate-700/80
      "
    >
      <img
        src={coverUrl(book.cover_i) ?? '/unavailable.png'}
        alt={book.title}
        className="w-24 h-36 object-cover rounded"
        onClick={() => onOpen(book)}
      />

      <div className="flex-1 flex flex-col justify-between">
        <div onClick={() => onOpen(book)}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {book.title}
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {book.author_name?.join(', ')}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            First published: {book.first_publish_year ?? '—'}
          </p>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            className={`px-3 py-1 rounded border transition-colors duration-200 
              ${
                saved
                  ? 'bg-amber-400 text-black border-amber-400 hover:bg-amber-300'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
              }
            `}
            onClick={() => onToggleSave(book)}
          >
            {saved ? 'Remove' : 'Save'}
          </button>

          <button
            className="
              px-3 py-1 rounded border border-slate-300 dark:border-slate-600 
              bg-white dark:bg-slate-800 
              text-slate-700 dark:text-slate-200 
              hover:bg-slate-100 dark:hover:bg-slate-700
              transition-colors duration-200
            "
            onClick={() => onOpen(book)}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  )
}
