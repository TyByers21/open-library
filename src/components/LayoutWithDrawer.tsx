// src/components/LayoutWithDrawer.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookshelfDrawer } from '@/components/BookshelfDrawer'
import { SearchDoc } from '@/lib/api' // Assuming SearchDoc is used directly or indirectly
import { useBookshelf } from '@/context/BookshelfProvider'
import ThemeToggle from '@/components/ThemeToggle'

export default function LayoutWithDrawer({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false) // Initial state: false
  const { books } = useBookshelf()
  const bookCount = books.length

  useEffect(() => {
    // This effect runs ONLY on the client after initial render/hydration
    setMounted(true) // Set to true once the component has mounted on the client
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900/1 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 p-4 shadow-sm transition-colors duration-500">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              className="w-60"
              alt="Book Nook logo"
            />
          </Link>

          <div className="flex items-center gap-4">
            {mounted && <ThemeToggle />} {/* ThemeToggle already uses `mounted` */}

            <button
              className="relative px-3 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition"
              onClick={() => setDrawerOpen(true)}
            >
              My Bookshelf
              {/* Only render the book count span AFTER the component has mounted on the client */}
              {mounted && bookCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {bookCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 transition-colors duration-500">
        {children}
      </main>

      <footer className="p-4 text-center text-sm text-slate-500 dark:text-slate-400 transition-colors duration-500">
        Search the largest collection of free books and texts.
      </footer>

      <BookshelfDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onViewDetails={(book: SearchDoc) => console.log('View details', book)}
      />
    </>
  )
}