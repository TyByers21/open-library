'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="
        flex gap-4 p-4 rounded-lg shadow-sm cursor-pointer
        bg-white dark:bg-slate-800/80 
        border border-slate-200 dark:border-slate-700
        hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/80
        transition-all duration-300
      "
    >
      <motion.img
        src={coverUrl(book.cover_i) ?? '/unavailable.png'}
        alt={book.title}
        loading="lazy"
        onClick={() => onOpen(book)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        className="w-24 h-36 object-cover rounded shadow-sm"
      />

      <div className="flex-1 flex flex-col justify-between">
        <div onClick={() => onOpen(book)} className="space-y-1">
          <motion.h3
            className="text-lg font-semibold text-slate-900 dark:text-slate-100"
            whileHover={{ color: 'rgb(14, 165, 233)' }} // sky-500
            transition={{ duration: 0.2 }}
          >
            {book.title}
          </motion.h3>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {book.author_name?.join(', ')}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            First published: {book.first_publish_year ?? '—'}
          </p>
        </div>

        <div className="mt-3 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className={`px-3 py-1 rounded border font-medium transition-colors duration-200 
              ${
                saved
                  ? 'bg-amber-400 text-black border-amber-400 hover:bg-amber-300'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
              }
            `}
            onClick={() => onToggleSave(book)}
          >
            {saved ? 'Remove' : 'Save'}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
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
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
