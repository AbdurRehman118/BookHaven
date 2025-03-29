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
    author: 'Faiz Ahmed Faiz',
    year: '1925',
    coverUrl: 'https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg',
    genre: 'Classic',
    description: 'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
    reviews: [
      {
        id: '101',
        userName: 'Ali Khan',
        rating: 5,
        comment: 'Timeless',
        date: '2023-04-15'
      }
    ]
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Nasim Hijazi',
    year: '1960',
    coverUrl: 'https://m.media-amazon.com/images/I/81aY1lxk+9L._AC_UF1000,1000_QL80_.jpg',
    genre: 'Classic',
    description: 'The story of a young girl confronting racial injustice in a small Southern town during the Great Depression as she observes her father, a lawyer, defend a Black man falsely accused of raping a white woman.',
    reviews: [
      {
        id: '102',
        userName: 'Ayesha Tariq',
        rating: 5,
        comment: 'Powerful',
        date: '2023-05-20'
      }
    ]
  },
  {
    id: '3',
    title: '1984',
    author: 'Ahmed Raza',
    year: '1949',
    coverUrl: 'https://m.media-amazon.com/images/I/91SZSW8qSsL._AC_UF1000,1000_QL80_.jpg',
    genre: 'Dystopian',
    description: 'A dystopian novel set in a totalitarian society where independent thinking is persecuted and there is constant surveillance of citizens.',
    reviews: [
      {
        id: '103',
        userName: 'Sana Malik',
        rating: 4,
        comment: 'Prescient',
        date: '2023-03-10'
      }
    ]
  },
  {
    id: '4',
    title: 'The Hobbit',
    author: 'Jamil Ahmed',
    year: '1937',
    coverUrl: 'https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg',
    genre: 'Fantasy',
    description: 'Bilbo Baggins, a comfort-loving hobbit, is whisked away on an unexpected journey by Gandalf the Grey and a company of dwarves seeking to reclaim their ancestral home from the dragon Smaug.',
    reviews: [
      {
        id: '104',
        userName: 'Bilal Ahmed',
        rating: 5,
        comment: 'Amazing world-building',
        date: '2023-01-05'
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
        id: '105',
        userName: 'Farah Khan',
        rating: 5,
        comment: 'Comprehensive',
        date: '2023-06-12'
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
        id: '106',
        userName: 'Usman Ali',
        rating: 5,
        comment: 'Must-read',
        date: '2023-07-18'
      }
    ]
  },
  {
    id: '7',
    title: 'The Age of AI: And Our Human Future',
    author: 'Henry Kissinger, Eric Schmidt, Daniel Huttenlocher',
    year: '2021',
    coverUrl: 'https://m.media-amazon.com/images/I/71zRkpn+MYL._SY160.jpg',
    genre: 'Computer Science',
    description: 'An essential roadmap to our present and our future, The Age of AI explores how AI is challenging the very essence of what it means to be human, transforming our societies, our politics, and our economies.',
    reviews: [
      {
        id: '107',
        userName: 'Zara Siddiqui',
        rating: 4,
        comment: 'Thoughtful',
        date: '2023-09-02'
      }
    ]
  },
  {
    id: '8',
    title: 'Human Compatible: Artificial Intelligence and the Problem of Control',
    author: 'Stuart Russell',
    year: '2019',
    coverUrl: 'https://m.media-amazon.com/images/I/71cSl7jGZ9L._SY160.jpg',
    genre: 'Computer Science',
    description: 'In the popular imagination, AI systems are racing toward superintelligence, humans will be overtaken, and a sci-fi dystopia will follow. Russell argues that this scenario can be avoided and outlines a path to a more harmonious future.',
    reviews: [
      {
        id: '108',
        userName: 'Hassan Qureshi',
        rating: 5,
        comment: 'Profound',
        date: '2023-05-14'
      }
    ]
  }
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
