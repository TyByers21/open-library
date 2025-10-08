'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { coverUrl, fetchWorkDetails } from '@/lib/api'
import type { SearchDoc } from '@/lib/api'
import React, { useEffect, useState } from 'react'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  book: SearchDoc | null
  onToggleSave: (b: SearchDoc) => void
  saved: boolean
}

export default function BookDetailModal({
  open,
  onOpenChange,
  book,
  onToggleSave,
  saved,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !book) {
      setDetails(null)
      setError(null)
      setLoading(false)
      return
    }

    let mounted = true
    setLoading(true)
    setError(null)
    setDetails(null)

    const key = book.key || (book.edition_key && book.edition_key[0]) || ''

    fetchWorkDetails(key)
      .then((d) => {
        if (!mounted) return
        setDetails(d)
      })
      .catch((e) => {
        if (!mounted) return
        setError(String(e))
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [open, book])

  if (!book) return null

  const title = details?.title ?? book.title

  const authorsFromDetails =
    details?.authors?.map((a: any) => a?.name || a?.author?.name).filter(Boolean) ?? []
  const authors = authorsFromDetails.length
    ? authorsFromDetails
    : book.author_name ?? []

  const subjects = details?.subjects ?? book.subject ?? []
  const description =
    (details?.description &&
      (typeof details.description === 'string'
        ? details.description
        : details.description?.value)) ??
    'No description available.'

  const cover = coverUrl(book.cover_i, 'L')

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0
          "
        />

        <Dialog.Content
          className={`fixed z-50 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]
            w-full max-w-3xl p-6 rounded-2xl shadow-xl
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-700
            text-slate-900 dark:text-slate-100
            transition-all duration-300
            data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0
            data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0
          `}
        >
          {/* ✅ Required accessible title */}
          <Dialog.Title className="sr-only">
            {title}
          </Dialog.Title>

          <div className="relative flex flex-col md:flex-row gap-6">
            <Dialog.Close asChild>
              <button
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/60 transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>

            <div className="flex-shrink-0 w-full md:w-1/3">
              <img
                src={cover}
                alt={title}
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
            </div>

            <div className="flex flex-col gap-4 md:w-2/3">
              {/* Keep the visible title separate from the accessible title */}
              <h2 className="text-2xl font-semibold">{title}</h2>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Author{authors.length > 1 ? 's' : ''}
                </h3>
                {authors.length > 0 ? (
                  <p className="text-slate-700 dark:text-slate-200 mt-1">
                    {authors.join(', ')}
                  </p>
                ) : (
                  <p className="italic text-slate-500">Unknown Author</p>
                )}
              </div>

              {book.first_publish_year && (
                <p className="text-sm text-slate-500">
                  First Published: {book.first_publish_year}
                </p>
              )}

              {subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {subjects.slice(0, 6).map((sub: string) => (
                    <span
                      key={sub}
                      className="text-xs px-2 py-1 rounded-full bg-slate-200/60 dark:bg-slate-700/60"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-sm text-slate-700 dark:text-slate-300 max-h-64 overflow-y-auto mt-3 whitespace-pre-line">
                {loading ? (
                  <p className="italic text-slate-500">Loading details...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  description
                )}
              </div>

              <button
                onClick={() => book && onToggleSave(book)}
                className={`mt-4 self-start px-4 py-2 rounded-lg font-medium transition-colors ${
                  saved
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {saved ? 'Saved to Library' : 'Save to Library'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
