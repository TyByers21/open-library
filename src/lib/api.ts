export type SearchDoc = {
key: string
title: string
author_name?: string[]
first_publish_year?: number
cover_i?: number
edition_key?: string[]
}


export type SearchResponse = {
docs: SearchDoc[]
numFound: number
}


export async function searchBooks(q: string, page = 1, language?: string): Promise<SearchResponse> {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&page=${page}${
    language ? `&language=${language}` : ''
  }`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function searchAuthors(q: string, page = 1): Promise<SearchResponse>  {
  const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(q)}&page=${page}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
} 

export async function fetchWorkDetails(workKeyOrOLID: string) {
const key = workKeyOrOLID.startsWith('/works') ? workKeyOrOLID : `/works/${workKeyOrOLID}`
const url = `https://openlibrary.org${key}.json`
const res = await fetch(url)
if (!res.ok) throw new Error('Failed to fetch work details')
return res.json()
}


export function coverUrl(cover_i?: number, size: 'S'|'M'|'L' = 'M') {
  return cover_i 
    ? `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg` 
    : '/unavailable.png'; 
}
