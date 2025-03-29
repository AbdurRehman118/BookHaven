
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBooks, Book } from '@/contexts/BooksContext';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

const Browse = () => {
  const location = useLocation();
  const { books, searchBooks, isLoading } = useBooks();
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  
  // Extract unique genres from books
  const genres = ["all", ...Array.from(new Set(books.map(book => book.genre)))];
  
  // Parse URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const genreParam = queryParams.get('genre');
    
    if (genreParam && genres.includes(genreParam)) {
      setSelectedGenre(genreParam);
    }
    
    filterAndSortBooks();
  }, [location.search, books]);
  
  const handleSearch = (query: string) => {
    const results = searchBooks(query);
    filterAndSortBooks(results);
  };
  
  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
    filterAndSortBooks(undefined, value);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    filterAndSortBooks(undefined, undefined, value);
  };
  
  const filterAndSortBooks = (
    booksToFilter: Book[] = books,
    genre: string = selectedGenre, 
    sort: string = sortBy
  ) => {
    // Filter by genre
    let filtered = booksToFilter;
    if (genre && genre !== "all") {
      filtered = filtered.filter(book => book.genre === genre);
    }
    
    // Sort books
    let sorted = [...filtered];
    switch (sort) {
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "author":
        sorted.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "year":
        sorted.sort((a, b) => parseInt(a.year) - parseInt(b.year));
        break;
      case "yearDesc":
        sorted.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        break;
      default:
        break;
    }
    
    setSearchResults(sorted);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading books...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Browse Books</h1>
      
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium mb-1">Filter by Genre</label>
          <Select value={selectedGenre} onValueChange={handleGenreChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map(genre => (
                <SelectItem key={genre} value={genre}>
                  {genre === "all" ? "All Genres" : genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium mb-1">Sort by</label>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="author">Author (A-Z)</SelectItem>
              <SelectItem value="year">Year (Oldest First)</SelectItem>
              <SelectItem value="yearDesc">Year (Newest First)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {searchResults.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No books found matching your criteria.</p>
          <Button onClick={() => {
            setSelectedGenre("all");
            setSortBy("title");
            filterAndSortBooks(books, "all", "title");
          }}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Browse;
