"use client";
import { useBookshelf } from "@/context/BookshelfProvider";
import { BookOpen } from "lucide-react";
import BookCard from '../components/BookCard'
import BookDetailModal from '../components/BookDetailModal'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import type { SearchDoc } from "@/lib/api";
import { useState } from "react";

interface BookshelfDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewDetails: (book: SearchDoc) => void;
}

export const BookshelfDrawer = ({
  open,
  onOpenChange,
  onViewDetails,
}: BookshelfDrawerProps) => {

  const { books, remove, has } = useBookshelf()
  const [selected, setSelected] = useState(null as any)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="h-6 w-6" />
            My Bookshelf
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4 overflow-y-auto h-[calc(100vh-8rem)]">
          {books.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Your bookshelf is empty. Start adding books!
              </p>
            </div>
          ) : (
          <div className="mt-4 grid grid-cols-1 ">
          {books.map(b => (
          <BookCard
          key={b.key}
          book={b}
          onOpen={(book) => setSelected(book)}
          onToggleSave={() => remove(b.key)}
          saved={true}
          />
          ))}
          </div>
          )}
          
          
          <BookDetailModal book={selected} onClose={() => setSelected(null)} />
          </div>
      </SheetContent>
    </Sheet>
  );
};
