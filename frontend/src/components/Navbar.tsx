import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../utils/cn';
import { User, LogOut, Shirt, LayoutPanelTop, PlayCircle, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeHash, setActiveHash] = React.useState(window.location.hash);

  // Sync local hash state with window location
  React.useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener('popstate', handleHashChange);
    return () => window.removeEventListener('popstate', handleHashChange);
  }, []);

  // Update hash when react-router location changes
  React.useEffect(() => {
    setActiveHash(location.hash);
  }, [location.hash]);

  const navLinks = [
    { name: 'Persona', path: '/#persona', icon: UserCircle, protected: true },
    { name: 'Closet', path: '/#closet', icon: Shirt, protected: true },
    { name: 'Outfits', path: '/#outfits', icon: LayoutPanelTop, protected: true },
    { name: 'Demo', path: '/demo', icon: PlayCircle, protected: false, publicOnly: true },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith('/#')) {
      const id = path.replace('/#', '');
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `/#${id}`);
          setActiveHash(`#${id}`);
        }
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel px-8 py-3 rounded-full flex items-center gap-12 border border-white/10 shadow-2xl"
      >
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tighter text-white hover:text-accent transition-colors">
          DIGITAL<span className="text-accent">CLOSET</span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const showLink = link.protected 
              ? isAuthenticated 
              : link.publicOnly 
                ? !isAuthenticated 
                : true;

            const isActive = location.pathname === '/' 
              ? (activeHash === link.path.replace('/', '') || (link.name === 'Persona' && !activeHash))
              : location.pathname === link.path;

            return showLink && (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={cn(
                  "text-sm font-medium transition-all relative py-1",
                  isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4 border-l border-white/10 pl-8">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={logout}
                className="p-2 rounded-full hover:bg-white/5 text-text-secondary hover:text-white transition-all"
              >
                <LogOut size={18} />
              </button>
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-xs font-bold">
                {user?.email[0].toUpperCase()}
              </div>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-accent/20"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
