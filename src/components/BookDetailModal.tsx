'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { coverUrl, fetchWorkDetails } from '@/lib/api'
import type { SearchDoc } from '@/lib/api'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  book: SearchDoc | null
  onToggleSave: (b: SearchDoc) => void
  saved: boolean
}

// Define variants for the modal container
const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
      when: 'beforeChildren', // Animate parent first, then children
      staggerChildren: 0.08, // Stagger children by 0.08 seconds
      delayChildren: 0.1, // Delay the start of children animations slightly
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 20,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
      when: 'afterChildren', // Animate children first, then parent on exit
      staggerChildren: 0.05,
      staggerDirection: -1, // Stagger in reverse order on exit
    },
  },
}

// Define variants for individual content items inside the modal
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 5 }, // Added exit for consistency
}

// Variants for the overlay
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
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
        : details.description?.value)) ?? 'No description available.'

  const cover = book.cover_i ? coverUrl(book.cover_i, 'L') : '/placeholder-book.svg' // Added a placeholder for missing cover_i

  return (
    <AnimatePresence>
      {open && (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <Dialog.Portal forceMount>
            {/* The Dialog.Overlay now uses the overlayVariants */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                variants={overlayVariants} // Use overlay variants
                initial="hidden"
                animate="visible"
                exit="exit"
              />
            </Dialog.Overlay>

            {/* The Dialog.Content is now the main animated container for the content */}
            <Dialog.Content asChild>
              <motion.div
                variants={modalVariants} // Use the combined modal variants
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`fixed z-50 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]
                  w-[92%] sm:w-full max-w-3xl p-5 sm:p-6 rounded-2xl shadow-xl
                  bg-white/95 dark:bg-slate-900/85
                  border border-slate-200 dark:border-slate-700
                  text-slate-900 dark:text-slate-100`}
              >
                <Dialog.Title className="sr-only">{title}</Dialog.Title>

                <Dialog.Close asChild>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: false, duration: 0.2 }}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/60 transition"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </Dialog.Close>

                {/* Responsive Layout - each direct child will now use itemVariants */}
                <div className="flex flex-row gap-4 sm:gap-6 items-start">
                  {/* Book Cover */}
                  <motion.div
                    variants={itemVariants}
                    className="flex-shrink-0 w-[90px] sm:w-1/3"
                  >
                    <img
                      src={cover}
                      alt={title}
                      className="w-full h-auto rounded-md shadow-md object-cover"
                      loading="lazy"
                    />
                  </motion.div>

                  {/* Details */}
                  <div className="flex flex-col gap-3 sm:gap-4 flex-1 overflow-hidden">
                    <motion.h2
                      className="text-lg sm:text-2xl font-semibold leading-tight"
                      layout
                      variants={itemVariants} 
                    >
                      {title}
                    </motion.h2>

                    <motion.div variants={itemVariants}> 
                      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Author{authors.length > 1 ? 's' : ''}
                      </h3>

                      {authors.length > 0 ? (
                        <motion.p
                          variants={itemVariants} 
                          className="text-slate-700 dark:text-slate-200 mt-1 text-sm sm:text-base"
                        >
                          {authors.join(', ')}
                        </motion.p>
                      ) : (
                        <motion.p
                          variants={itemVariants}
                          className="italic text-slate-500 text-sm"
                        >
                          Unknown Author
                        </motion.p>
                      )}
                    </motion.div>

                    {book.first_publish_year && (
                      <motion.p
                        className="text-xs sm:text-sm text-slate-500"
                        layout
                        variants={itemVariants}
                      >
                        First Published: {book.first_publish_year}
                      </motion.p>
                    )}

                    {subjects.length > 0 && (
                      <motion.div
                        variants={itemVariants} 
                        className="flex flex-wrap gap-1.5 sm:gap-2 mt-2"
                      >
                        {subjects.slice(0, 5).map((sub: string) => (
                          <motion.span
                            key={sub}
                            variants={itemVariants} 
                            className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700/60"
                          >
                            {sub}
                          </motion.span>
                        ))}
                      </motion.div>
                    )}

                    <motion.div
                      className="text-sm text-slate-700 dark:text-slate-300 max-h-40 sm:max-h-64 overflow-y-auto mt-2 sm:mt-3 whitespace-pre-line"
                      variants={itemVariants}
                    >
                      {loading ? (
                        <p className="italic text-slate-500">Loading details...</p>
                      ) : error ? (
                        <p className="text-red-500">{error}</p>
                      ) : (
                        description
                      )}
                    </motion.div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ y: -2 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      onClick={() => book && onToggleSave(book)}
                      className={`mt-3 sm:mt-4 self-start px-3 cursor-pointer sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors ${
                        saved
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-300 text-black hover:bg-blue-700'
                      }`}
                      variants={itemVariants}
                    >
                      {saved ? 'Saved to Library' : 'Save to Library'}
                    </motion.button>
                  </div> {/* End of Details flex column */}
                </div> {/* End of Responsive Layout flex row */}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  )
}