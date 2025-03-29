
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Book } from '@/contexts/BooksContext';
import { useBooks } from '@/contexts/BooksContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { favoriteBookIds, toggleFavorite } = useBooks();
  const { isAuthenticated } = useAuth();
  const isFavorite = favoriteBookIds.includes(book.id);

  return (
    <div className="book-card rounded-lg overflow-hidden border bg-card transition-all duration-200">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Link to={`/book/${book.id}`}>
          <img 
            src={book.coverUrl} 
            alt={`${book.title} cover`} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </Link>
        <Badge className="absolute top-2 right-2">{book.genre}</Badge>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/book/${book.id}`} className="hover:underline">
              <h3 className="font-bold truncate">{book.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">{book.author}</p>
            <p className="text-xs text-muted-foreground mt-1">{book.year}</p>
          </div>
          
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(book.id)}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="p-1 h-8 w-8"
            >
              <Heart className={cn("h-5 w-5", isFavorite ? "fill-primary text-primary" : "")} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
