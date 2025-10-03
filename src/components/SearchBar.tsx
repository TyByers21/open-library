import React from 'react'


type Props = {
value: string
onChange: (v: string) => void
onSubmit: () => void
}


export default function SearchBar({ value, onChange, onSubmit }: Props) {
return (
<form
className="flex gap-2"
onSubmit={(e) => { e.preventDefault(); onSubmit() }}
>
<input
className="flex-1 px-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2"
placeholder="Search books, authors, subjects..."
value={value}
onChange={(e) => onChange(e.target.value)}
/>
<button className="px-4 py-2 rounded-md bg-sky-600 text-white" type="submit">Search</button>
</form>
)
}