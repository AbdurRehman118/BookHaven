1| 
2| import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
3| import { useLocalStorage } from '@/hooks/use-local-storage';
4| import { useToast } from '@/components/ui/use-toast';
5| 
6| export interface Book {
7|   id: string;
8|   title: string;
9|   author: string;
10|   year: string;
11|   coverUrl: string;
12|   genre: string;
13|   description: string;
14|   reviews: Review[];
15| }
16| 
17| export interface Review {
18|   id: string;
19|   userName: string;
20|   rating: number;
21|   comment: string;
22|   date: string;
23| }
24| 
25| interface BooksContextType {
26|   books: Book[];
27|   favoriteBookIds: string[];
28|   isLoading: boolean;
29|   addBook: (book: Omit<Book, 'id' | 'reviews'>) => void;
30|   addReview: (bookId: string, review: Omit<Review, 'id' | 'date'>) => void;
31|   toggleFavorite: (bookId: string) => void;
32|   searchBooks: (query: string) => Book[];
33|   getBookById: (id: string) => Book | undefined;
34| }
35| 
36| const initialBooks: Book[] = [
37|   {
38|     id: '1',
39|     title: 'The Great Gatsby',
40|     author: 'F. Scott Fitzgerald',
41|     year: '1925',
42|     coverUrl: 'https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg',
43|     genre: 'Classic',
44|     description: 'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
45|     reviews: [
46|       {
47|         id: '101',
48|         userName: 'Ayesha Khan',
49|         rating: 5,
50|         comment: 'A timeless classic that captures the essence of the Roaring Twenties.',
51|         date: '2023-04-15'
52|       }
53|     ]
54|   },
55|   {
56|     id: '2',
57|     title: 'To Kill a Mockingbird',
58|     author: 'Harper Lee',
59|     year: '1960',
60|     coverUrl: 'https://m.media-amazon.com/images/I/81aY1lxk+9L._AC_UF1000,1000_QL80_.jpg',
61|     genre: 'Classic',
62|     description: 'The story of a young girl confronting racial injustice in a small Southern town during the Great Depression as she observes her father, a lawyer, defend a Black man falsely accused of raping a white woman.',
63|     reviews: [
64|       {
65|         id: '102',
66|         userName: 'Ahmed Raza',
67|         rating: 5,
68|         comment: 'One of the most impactful novels about social justice ever written.',
69|         date: '2023-05-20'
70|       }
71|     ]
72|   },
73|   {
74|     id: '3',
75|     title: '1984',
76|     author: 'George Orwell',
77|     year: '1949',
78|     coverUrl: 'https://m.media-amazon.com/images/I/91SZSW8qSsL._AC_UF1000,1000_QL80_.jpg',
79|     genre: 'Dystopian',
80|     description: 'A dystopian novel set in a totalitarian society where independent thinking is persecuted and there is constant surveillance of citizens.',
81|     reviews: [
82|       {
83|         id: '103',
84|         userName: 'Sana Malik',
85|         rating: 4,
86|         comment: 'Eerily prescient in many ways. A must-read for understanding modern surveillance issues.',
87|         date: '2023-03-10'
88|       }
89|     ]
90|   },
91|   {
92|     id: '4',
93|     title: 'The Hobbit',
94|     author: 'J.R.R. Tolkien',
95|     year: '1937',
96|     coverUrl: 'https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg',
97|     genre: 'Fantasy',
98|     description: 'Bilbo Baggins, a comfort-loving hobbit, is whisked away on an unexpected journey by Gandalf the Grey and a company of dwarves seeking to reclaim their ancestral home from the dragon Smaug.',
99|     reviews: [
100|       {
101|         id: '104',
102|         userName: 'Bilal Ahmed',
103|         rating: 5,
104|         comment: 'The perfect gateway into fantasy literature. Tolkien\'s world-building is unmatched.',
105|         date: '2023-01-05'
106|       }
107|     ]
108|   },
109|   {
110|     id: '5',
111|     title: 'Artificial Intelligence: A Modern Approach',
112|     author: 'Stuart Russell, Peter Norvig',
113|     year: '2020',
114|     coverUrl: 'https://m.media-amazon.com/images/I/51-S9Z+w96L._SX440_BO1,204,203,200_.jpg',
115|     genre: 'Computer Science',
116|     description: 'The leading textbook in Artificial Intelligence, used in over 1500 universities. It provides a comprehensive overview of the field, from machine learning to robotics, computer vision, and beyond.',
117|     reviews: [
118|       {
119|         id: '105',
120|         userName: 'Fatima Ali',
121|         rating: 5,
122|         comment: 'The definitive AI textbook. Comprehensive, well-structured, and accessible to both beginners and experts.',
123|         date: '2023-06-12'
124|       }
125|     ]
126|   },
127|   {
128|     id: '6',
129|     title: 'Deep Learning',
130|     author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
131|     year: '2016',
132|     coverUrl: 'https://m.media-amazon.com/images/I/615uJgswMHL._SX258_BO1,204,203,200_.jpg',
133|     genre: 'Computer Science',
134|     description: 'The first comprehensive textbook on deep learning, written by leading experts in the field. It covers mathematical and conceptual background, deep learning techniques, and research perspectives.',
135|     reviews: [
136|       {
137|         id: '106',
138|         userName: 'Umar Farooq',
139|         rating: 5,
140|         comment: 'Essential reading for anyone serious about deep learning. The best balance of theory and practical insights available.',
141|         date: '2023-07-18'
142|       }
143|     ]
144|   },
145|   {
146|     id: '7',
147|     title: 'The Age of AI: And Our Human Future',
148|     author: 'Henry Kissinger, Eric Schmidt, Daniel Huttenlocher',
149|     year: '2021',
150|     coverUrl: 'https://m.media-amazon.com/images/I/71zRkpn+MYL._SY160.jpg',
151|     genre: 'Computer Science',
152|     description: 'An essential roadmap to our present and our future, The Age of AI explores how AI is challenging the very essence of what it means to be human, transforming our societies, our politics, and our economies.',
153|     reviews: [
154|       {
155|         id: '107',
156|         userName: 'Zara Siddiqui',
157|         rating: 4,
158|         comment: 'A thoughtful analysis of AI\'s societal implications, written from a policy and strategic perspective rather than a technical one.',
159|         date: '2023-09-02'
160|       }
161|     ]
162|   },
163|   {
164|     id: '8',
165|     title: 'Human Compatible: Artificial Intelligence and the Problem of Control',
166|     author: 'Stuart Russell',
167|     year: '2019',
168|     coverUrl: 'https://m.media-amazon.com/images/I/71cSl7jGZ9L._SY160.jpg',
169|     genre: 'Computer Science',
170|     description: 'In the popular imagination, AI systems are racing toward superintelligence, humans will be overtaken, and a sci-fi dystopia will follow. Russell argues that this scenario can be avoided and outlines a path to a more harmonious future.',
171|     reviews: [
172|       {
173|         id: '108',
174|         userName: 'Hassan Qureshi',
175|         rating: 5,
176|         comment: 'A profound book that tackles the existential questions of AI with clarity and depth. Essential reading for understanding AI safety.',
177|         date: '2023-05-14'
178|       }
179|     ]
180|   }
181| ];
182| 
183| const BooksContext = createContext<BooksContextType | undefined>(undefined);
184| 
185| export function BooksProvider({ children }: { children: ReactNode }) {
186|   const [books, setBooks] = useLocalStorage<Book[]>('bookhaven-books', initialBooks);
187|   const [favoriteBookIds, setFavoriteBookIds] = useLocalStorage<string[]>('bookhaven-favorites', []);
188|   const [isLoading, setIsLoading] = useState(true);
189|   const { toast } = useToast();
190| 
191|   useEffect(() => {
192|     // Simulate loading data
193|     const timer = setTimeout(() => {
194|       setIsLoading(false);
195|     }, 1000);
196|     
197|     return () => clearTimeout(timer);
198|   }, []);
199| 
200|   const addBook = (book: Omit<Book, 'id' | 'reviews'>) => {
201|     const newBook: Book = {
202|       ...book,
203|       id: Date.now().toString(),
204|       reviews: []
205|     };
206|     
207|     setBooks([...books, newBook]);
208|     toast({
209|       title: "Book added",
210|       description: `${book.title} has been added to the collection.`,
211|     });
212|   };
213| 
214|   const addReview = (bookId: string, review: Omit<Review, 'id' | 'date'>) => {
215|     const newReview: Review = {
216|       ...review,
217|       id: Date.now().toString(),
218|       date: new Date().toISOString().split('T')[0]
219|     };
220|     
221|     setBooks(books.map(book => 
222|       book.id === bookId
223|         ? { ...book, reviews: [...book.reviews, newReview] }
224|         : book
225|     ));
226|     
227|     toast({
228|       title: "Review added",
229|       description: "Your review has been published. Thank you for your feedback!",
230|     });
231|   };
232| 
233|   const toggleFavorite = (bookId: string) => {
234|     if (favoriteBookIds.includes(bookId)) {
235|       setFavoriteBookIds(favoriteBookIds.filter(id => id !== bookId));
236|       toast({
237|         title: "Removed from favorites",
238|         description: "This book has been removed from your favorites.",
239|       });
240|     } else {
241|       setFavoriteBookIds([...favoriteBookIds, bookId]);
242|       toast({
243|         title: "Added to favorites",
244|         description: "This book has been added to your favorites.",
245|       });
246|     }
247|   };
248| 
249|   const searchBooks = (query: string) => {
250|     if (!query.trim()) return books;
251|     
252|     const searchTerm = query.toLowerCase().trim();
253|     return books.filter(book => 
254|       book.title.toLowerCase().includes(searchTerm) || 
255|       book.author.toLowerCase().includes(searchTerm) ||
256|       book.genre.toLowerCase().includes(searchTerm)
257|     );
258|   };
259| 
260|   const getBookById = (id: string) => books.find(book => book.id === id);
261| 
262|   return (
263|     <BooksContext.Provider value={{ 
264|       books,
265|       favoriteBookIds,
266|       isLoading,
267|       addBook,
268|       addReview,
269|       toggleFavorite,
270|       searchBooks,
271|       getBookById
272|     }}>
273|       {children}
274|     </BooksContext.Provider>
275|   );
276| }
277| 
278| export function useBooks() {
279|   const context = useContext(BooksContext);
280|   if (context === undefined) {
281|     throw new Error('useBooks must be used within a BooksProvider');
282|   }
283|   return context;
284| }
285| 
