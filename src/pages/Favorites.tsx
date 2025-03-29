
import { useNavigate } from 'react-router-dom';
import { useBooks } from '@/contexts/BooksContext';
import { useAuth } from '@/contexts/AuthContext';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const navigate = useNavigate();
  const { books, favoriteBookIds } = useBooks();
  const { isAuthenticated } = useAuth();
  
  // Guard: Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  const favoriteBooks = books.filter(book => favoriteBookIds.includes(book.id));
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Favorite Books</h1>
      
      {favoriteBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favoriteBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex justify-center items-center w-20 h-20 bg-muted rounded-full mb-4">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't added any books to your favorites yet. Browse our collection and mark books you love.
          </p>
          <Button onClick={() => navigate('/browse')}>Browse Books</Button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
