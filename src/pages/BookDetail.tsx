
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useBooks } from '@/contexts/BooksContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Star, StarHalf, Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookById, addReview, favoriteBookIds, toggleFavorite } = useBooks();
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  
  const book = getBookById(id || '');
  const isFavorite = favoriteBookIds.includes(id || '');
  
  if (!book) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
        <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/browse')}>Browse Books</Button>
      </div>
    );
  }
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    addReview(book.id, {
      userName: user.name,
      rating,
      comment
    });
    
    setComment('');
    setRating(5);
  };
  
  // Calculate average rating
  const averageRating = book.reviews.length 
    ? book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length 
    : 0;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6 gap-1" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover and Actions */}
        <div className="md:col-span-1">
          <div className="rounded-lg overflow-hidden border aspect-[2/3] mb-4">
            <img
              src={book.coverUrl}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {isAuthenticated && (
            <Button
              variant={isFavorite ? "default" : "outline"}
              className="w-full mb-4 gap-2"
              onClick={() => toggleFavorite(book.id)}
            >
              <Heart className={cn("h-5 w-5", isFavorite ? "fill-primary-foreground" : "")} />
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          )}
        </div>
        
        {/* Book Details */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center gap-1 mr-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-5 w-5",
                    star <= Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : star - 0.5 <= averageRating
                      ? "fill-yellow-400/50 text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              ))}
              <span className="ml-1 text-sm">
                ({averageRating.toFixed(1)})
              </span>
            </div>
            
            <span className="text-muted-foreground text-sm flex items-center">
              <User className="h-4 w-4 mr-1" />
              {book.author}
            </span>
            
            <span className="text-muted-foreground text-sm ml-4 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {book.year}
            </span>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{book.description}</p>
          </div>
          
          <Separator className="my-8" />
          
          {/* Reviews Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Reader Reviews</h2>
            
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Your Review</CardTitle>
                    <CardDescription>Share your thoughts about this book</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star className={cn(
                              "h-6 w-6 transition-colors",
                              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            )} />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Review</label>
                      <Textarea
                        placeholder="Write your thoughts about this book..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={comment.trim() === ''}>
                      Submit Review
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            ) : (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Please <Button variant="link" onClick={() => navigate('/login')} className="p-0">login</Button> to leave a review.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {book.reviews.length > 0 ? (
              <div className="space-y-4">
                {book.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{review.userName}</CardTitle>
                          <CardDescription>{review.date}</CardDescription>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-4 w-4",
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                No reviews yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
