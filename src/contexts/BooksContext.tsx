import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/components/ui/use-toast';

export interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  coverUrl: string;
  genre: string;
  description: string;
  reviews: Review[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface BooksContextType {
  books: Book[];
  favoriteBookIds: string[];
  isLoading: boolean;
  addBook: (book: Omit<Book, 'id' | 'reviews'>) => void;
  addReview: (bookId: string, review: Omit<Review, 'id' | 'date'>) => void;
  toggleFavorite: (bookId: string) => void;
  searchBooks: (query: string) => Book[];
  getBookById: (id: string) => Book | undefined;
}

const initialBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'Mohammad Ali',
    year: '1925',
    coverUrl: 'https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg',
    genre: 'Classic',
    description: 'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
    reviews: [
      {
        id: '101',
        userName: 'Ayesha Khan',
        rating: 5,
        comment: 'A timeless classic. Highly recommended for all literature lovers!',
        date: '2023-04-15'
      },
      {
        id: '102',
        userName: 'Sana Mirza',
        rating: 4,
        comment: 'A beautifully written story with a tragic ending.',
        date: '2023-04-20'
      }
    ]
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Ahmed Raza',
    year: '1960',
    coverUrl: 'https://m.media-amazon.com/images/I/81aY1lxk+9L._AC_UF1000,1000_QL80_.jpg',
    genre: 'Classic',
    description: 'The story of a young girl confronting racial injustice in a small Southern town during the Great Depression as she observes her father, a lawyer, defend a Black man falsely accused of raping a white woman.',
    reviews: [
      {
        id: '103',
        userName: 'Ali Hassan',
        rating: 5,
        comment: 'One of the most profound novels ever written.',
        date: '2023-05-20'
      },
      {
        id: '104',
        userName: 'Zara Siddiqui',
        rating: 4,
        comment: 'A strong narrative on justice and morality. The themes are still relevant today.',
        date: '2023-05-25'
      }
    ]
  },
  {
    id: '3',
    title: '1984',
    author: 'Farhan Khan',
    year: '1949',
    coverUrl: 'https://m.media-amazon.com/images/I/91SZSW8qSsL._AC_UF1000,1000_QL80_.jpg',
    genre: 'Dystopian',
    description: 'A dystopian novel set in a totalitarian society where independent thinking is persecuted and there is constant surveillance of citizens.',
    reviews: [
      {
        id: '105',
        userName: 'Umer Shah',
        rating: 5,
        comment: 'A chilling prediction of our future. Thought-provoking!',
        date: '2023-03-10'
      },
      {
        id: '106',
        userName: 'Nida Imran',
        rating: 4,
        comment: 'A disturbing look at surveillance and freedom. Worth reading.',
        date: '2023-03-12'
      }
    ]
  },
  {
    id: '4',
    title: 'The Hobbit',
    author: 'Bilal Ahmed',
    year: '1937',
    coverUrl: 'https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg',
    genre: 'Fantasy',
    description: 'Bilbo Baggins, a comfort-loving hobbit, is whisked away on an unexpected journey by Gandalf the Grey and a company of dwarves seeking to reclaim their ancestral home from the dragon Smaug.',
    reviews: [
      {
        id: '107',
        userName: 'Omar Ali',
        rating: 5,
        comment: 'A magical adventure. A must-read for fantasy lovers.',
        date: '2023-01-05'
      },
      {
        id: '108',
        userName: 'Hassan Malik',
        rating: 4,
        comment: 'Tolkien’s world-building is unparalleled. A delightful story.',
        date: '2023-01-10'
      }
    ]
  },
  {
    id: '5',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell, Peter Norvig',
    year: '2020',
    coverUrl: 'https://m.media-amazon.com/images/I/51-S9Z+w96L._SX440_BO1,204,203,200_.jpg',
    genre: 'Computer Science',
    description: 'The leading textbook in Artificial Intelligence, used in over 1500 universities. It provides a comprehensive overview of the field, from machine learning to robotics, computer vision, and beyond.',
    reviews: [
      {
        id: '109',
        userName: 'Fatima Ali',
        rating: 5,
        comment: 'Comprehensive, well-organized, and accessible. The best AI textbook.',
        date: '2023-06-12'
      },
      {
        id: '110',
        userName: 'Raza Khan',
        rating: 4,
        comment: 'An essential read for anyone entering the AI field. Very detailed.',
        date: '2023-06-15'
      }
    ]
  },
  {
    id: '6',
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    year: '2016',
    coverUrl: 'https://m.media-amazon.com/images/I/615uJgswMHL._SX258_BO1,204,203,200_.jpg',
    genre: 'Computer Science',
    description: 'The first comprehensive textbook on deep learning, written by leading experts in the field. It covers mathematical and conceptual background, deep learning techniques, and research perspectives.',
    reviews: [
      {
        id: '111',
        userName: 'Umar Farooq',
        rating: 5,
        comment: 'An excellent resource for deep learning enthusiasts. Must-have for the library.',
        date: '2023-07-18'
      },
      {
        id: '112',
        userName: 'Sara Javed',
        rating: 5,
        comment: 'Perfect balance of theory and practical application. Great for both beginners and experts.',
        date: '2023-07-22'
      }
    ]
  },
];

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useLocalStorage<Book[]>('bookhaven-books', initialBooks);
  const [favoriteBookIds, setFavoriteBookIds] = useLocalStorage<string[]>('bookhaven-favorites', []);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const addBook = (book: Omit<Book, 'id' | 'reviews'>) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      reviews: []
    };
    
    setBooks([...books, newBook]);
    toast({
      title: "Book added",
      description: `${book.title} has been added to the collection.`,
    });
  };

  const addReview = (bookId: string, review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    setBooks(books.map(book => 
      book.id === bookId
        ? { ...book, reviews: [...book.reviews, newReview] }
        : book
    ));
    
    toast({
      title: "Review added",
      description: "Your review has been published. Thank you for your feedback!",
    });
  };

  const toggleFavorite = (bookId: string) => {
    if (favoriteBookIds.includes(bookId)) {
      setFavoriteBookIds(favoriteBookIds.filter(id => id !== bookId));
      toast({
        title: "Removed from favorites",
        description: "This book has been removed from your favorites.",
      });
    } else {
      setFavoriteBookIds([...favoriteBookIds, bookId]);
      toast({
        title: "Added to favorites",
        description: "This book has been added to your favorites.",
      });
    }
  };

  const searchBooks = (query: string) => {
    if (!query.trim()) return books;
    
    const searchTerm = query.toLowerCase().trim();
    return books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) || 
      book.author.toLowerCase().includes(searchTerm) ||
      book.genre.toLowerCase().includes(searchTerm)
    );
  };

  const getBookById = (id: string) => books.find(book => book.id === id);

  return (
    <BooksContext.Provider value={{ 
      books,
      favoriteBookIds,
      isLoading,
      addBook,
      addReview,
      toggleFavorite,
      searchBooks,
      getBookById
    }}>
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
}
