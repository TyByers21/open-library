'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import type { SearchDoc } from '../lib/api'


type BookshelfContextType = {
books: SearchDoc[]
add: (b: SearchDoc) => void
remove: (key: string) => void
has: (key: string) => boolean
}


const BookshelfContext = createContext<BookshelfContextType | undefined>(undefined)
const STORAGE_KEY = 'ol_bookshelf_v1'


export const BookshelfProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
const [books, setBooks] = useState<SearchDoc[]>(() => {
try {
const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
return raw ? JSON.parse(raw) as SearchDoc[] : []
} catch { return [] }
})


useEffect(() => {
try { localStorage.setItem(STORAGE_KEY, JSON.stringify(books)) } catch {}
}, [books])


function add(b: SearchDoc) {
setBooks(prev => prev.some(x => x.key === b.key) ? prev : [...prev, b])
}
function remove(key: string) {
setBooks(prev => prev.filter(b => b.key !== key))
}
function has(key: string) {
return books.some(b => b.key === key)
}


return (
<BookshelfContext.Provider value={{books, add, remove, has}}>
{children}
</BookshelfContext.Provider>
)
}


export function useBookshelf() {
const ctx = useContext(BookshelfContext)
if (!ctx) throw new Error('useBookshelf must be used within BookshelfProvider')
return ctx
}