
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooks, Book } from '@/contexts/BooksContext';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { books, searchBooks } = useBooks();
  const [searchResults, setSearchResults] = useState<Book[]>(books);
  
  const handleSearch = (query: string) => {
    const results = searchBooks(query);
    setSearchResults(results);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="hero-gradient text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to BookHaven</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
            Discover your next favorite book from our extensive collection of literary treasures
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Featured Books Section */}
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Books</h2>
          <Link to="/browse">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
      
      {/* Categories Section */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Classic', 'Fantasy', 'Mystery', 'Science Fiction', 'Romance', 'Dystopian', 'Non-Fiction', 'Biography'].map((genre) => (
              <Link 
                key={genre} 
                to={`/browse?genre=${genre}`}
                className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors p-4 rounded-lg text-center shadow-sm"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">About BookHaven</h2>
          <p className="text-muted-foreground mb-8">
          Welcome to BookHaven – where books come to life! More than just an online bookstore, we’re a community of passionate readers, a haven for book lovers, and the perfect place to discover your next great read. Join us and immerse yourself in the magic of storytelling!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link to="/browse">Browse Books</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
