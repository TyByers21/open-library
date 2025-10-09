'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SearchDoc } from '../lib/api'
import { coverUrl, fetchWorkDetails } from '../lib/api'

type Props = {
  book: SearchDoc | null
  isOpen: boolean
  onClose: () => void
}

export default function BookDetailModal({ book, isOpen, onClose }: Props) {
  const [details, setDetails] = useState<{ description?: string | { value: string } }>({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !book) return

    const key = book.key || (book.edition_key && book.edition_key[0])
    if (!key) return

    setLoading(true)
    setError(null)

    fetchWorkDetails(key)
      .then((data) => {
        setDetails(data)
      })
      .catch((err) => {
        console.error(err)
        setError('Failed to load details')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [isOpen, book])

  if (!book) return null

const description =
  typeof details?.description === 'string'
    ? details.description
    : details?.description?.value || 'No description available.';


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl p-6 overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={coverUrl(book.cover_i) ?? '/unavailable.png'}
                alt={book.title}
                className="w-40 h-56 object-cover rounded-lg shadow-md self-center sm:self-start"
              />

              <div className="flex-1">
                <motion.h2
                  className="text-2xl font-semibold text-slate-900 dark:text-slate-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  {book.title}
                </motion.h2>

                <motion.p
                  className="text-md text-slate-700 dark:text-slate-300 mt-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
                >
                  {book.author_name?.join(', ') || 'Unknown Author'}
                </motion.p>

                <motion.p
                  className="text-sm text-slate-500 dark:text-slate-400 mt-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut', delay: 0.2 }}
                >
                  First published: {book.first_publish_year ?? '—'}
                </motion.p>

                <motion.div
                  className="mt-4 space-y-2 text-slate-700 dark:text-slate-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
                >
                  {book.subject && (
                    <p>
                      <span className="font-medium">Subjects:</span>{' '}
                      {book.subject.slice(0, 8).join(', ')}
                      {book.subject.length > 8 ? '…' : ''}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed max-h-60 overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.35 }}
                >
                  {loading ? (
                    <p className="italic text-slate-500">Loading description…</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <p>{description}</p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
