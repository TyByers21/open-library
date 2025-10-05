import './globals.css'
import { BookshelfProvider } from '../context/BookshelfProvider'
import Link from 'next/link'


export const metadata = {
	title: 'The Book Nook',
	description: 'Search books and save to your bookshelf',
	icons: {
		icon: '/book.png',
	},
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<BookshelfProvider>
					<header className="bg-white border-b p-4">
						<div className="max-w-6xl mx-auto flex justify-between items-center">
							<Link href="/" className="text-xl font-bold">
								<img src="book nook2.png" className="w-60" alt="book nook logo" />
							</Link>
							<nav className="flex gap-4">
								<Link href="/">Search</Link>
								<Link href="/bookshelf">My Bookshelf</Link>
							</nav>
						</div>
					</header>

					<main className="max-w-6xl mx-auto p-4">{children}</main>

					<footer className="p-4 text-center text-sm text-slate-500">Search the world's most comprehensive index of full-text books.</footer>
				</BookshelfProvider>
			</body>
		</html>
	)
}