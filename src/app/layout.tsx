import './globals.css'
import type { Metadata } from 'next'
import LayoutWithDrawer from '@/components/LayoutWithDrawer'
import { BookshelfProvider } from '@/context/BookshelfProvider'  // ✅ import this

export const metadata: Metadata = {
  title: 'The Book Nook',
  description: 'Search books and save to your bookshelf',
  icons: {
    icon: '/book.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Wrap your entire app in the BookshelfProvider */}
        <BookshelfProvider>
          <LayoutWithDrawer>{children}</LayoutWithDrawer>
        </BookshelfProvider>
      </body>
    </html>
  )
}
