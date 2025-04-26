
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Research", path: "/research" },
    { name: "RNA Structure", path: "/rna-structure" },
    // { name: "Predict", path: "/Predict" },

  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    return path !== "/" && location.pathname.startsWith(path);
  };

  return (  
    <nav className="bg-[#500096] border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-lg font-bold">RH</span>
            </div>
            <span className="font-bold text-xl text-white">RNA HUB</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                  ? "bg-[#7566d2] text-primary-foreground"
                  : "text-white hover:bg-[#b8aef6]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="ml-4"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-white" />
              ) : (
                <Sun className="h-5 w-5 text-white" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-white" />
              ) : (
                <Sun className="h-5 w-5 text-white" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-1 fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                  ? "bg-[#7566d2] text-primary-foreground"
                  : "text-white hover:bg-[#b8aef6]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
