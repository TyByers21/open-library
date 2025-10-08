import './globals.css'
import ThemeProvider from '@/context/ThemeProvider'
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
     <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-500 bg-background text-foreground" suppressHydrationWarning>

        <ThemeProvider>
          <BookshelfProvider>
            <LayoutWithDrawer>{children}</LayoutWithDrawer>
          </BookshelfProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}