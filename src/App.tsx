
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { BooksProvider } from "@/contexts/BooksContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Browse from "@/pages/Browse";
import BookDetail from "@/pages/BookDetail";
import Login from "@/pages/Login";
import Favorites from "@/pages/Favorites";
import AddBook from "@/pages/AddBook";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <BooksProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/book/:id" element={<BookDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/add-book" element={<AddBook />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </BooksProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
