
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">BookHaven</h3>
            <p className="text-sm opacity-80">
              Your digital sanctuary for discovering and sharing literary treasures.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm opacity-80 hover:opacity-100">Home</Link></li>
              <li><Link to="/browse" className="text-sm opacity-80 hover:opacity-100">Browse Books</Link></li>
              <li><Link to="/login" className="text-sm opacity-80 hover:opacity-100">Login / Register</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent-foreground" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent-foreground" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent-foreground" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent-foreground" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-70">
          <p>&copy; {new Date().getFullYear()} 22K-4105_AR118. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
