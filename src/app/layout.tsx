import './globals.css'
import type { Metadata } from 'next'
import LayoutWithDrawer from '@/components/LayoutWithDrawer'
import { BookshelfProvider } from '@/context/BookshelfProvider' 

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
        <BookshelfProvider>
          <LayoutWithDrawer>{children}</LayoutWithDrawer>
        </BookshelfProvider>
      </body>
    </html>
  )
}
