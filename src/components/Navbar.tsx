
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Menu, X, Heart, PlusCircle, LogIn, LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and site name */}
          <Link to="/" className="flex items-center space-x-2 text-primary">
            <Book className="h-6 w-6" />
            <span className="text-xl font-bold">BookHaven</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/browse" className="text-foreground hover:text-primary transition-colors">
              Browse
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/favorites" className="text-foreground hover:text-primary transition-colors">
                  Favorites
                </Link>
                <Link to="/add-book" className="text-foreground hover:text-primary transition-colors">
                  Add Book
                </Link>
              </>
            )}
          </div>

          {/* Actions area */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">Hello, {user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="flex items-center cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/add-book" className="flex items-center cursor-pointer">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Add Book</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')} className="flex items-center space-x-1">
                <LogIn className="h-4 w-4 mr-1" />
                <span>Login</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3">
            <Link to="/" onClick={closeMenu} className="block text-foreground hover:text-primary py-2">
              Home
            </Link>
            <Link to="/browse" onClick={closeMenu} className="block text-foreground hover:text-primary py-2">
              Browse
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/favorites" onClick={closeMenu} className="block text-foreground hover:text-primary py-2">
                  Favorites
                </Link>
                <Link to="/add-book" onClick={closeMenu} className="block text-foreground hover:text-primary py-2">
                  Add Book
                </Link>
                <div className="pt-2">
                  <p className="text-sm font-medium">Hello, {user?.name}</p>
                  <Button variant="ghost" className="pl-0 pt-1" onClick={() => { logout(); closeMenu(); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-2">
                <Button onClick={() => { navigate('/login'); closeMenu(); }}>
                  <LogIn className="h-4 w-4 mr-2" />
                  <span>Login</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
