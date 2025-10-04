import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  route: string;
  icon?: string;
}

interface NavBarComponentProps {
  title?: string;
  items?: NavItem[];
}

const NavBarComponent: React.FC<NavBarComponentProps> = ({
  title = "Revision App",
  items = []
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-nav px-4 py-3 border-b border-light-gray bg-warm-white">
        <div className="flex items-center justify-between max-w-content mx-auto">
          {/* App Title */}
          <h1 className="text-h3 font-semibold text-text-primary">
            {title}
          </h1>

          {/* Burger Menu Button */}
          <button
            onClick={toggleMenu}
            className={`p-2 rounded-soft transition-gentle hover:opacity-80 ${
              isMenuOpen ? 'bg-light-gray' : 'bg-transparent'
            }`}
            aria-label="Toggle navigation menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center space-y-1">
              <span 
                className={`block w-full h-0.5 transition-gentle ${
                  isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                } bg-text-primary`}
              ></span>
              <span 
                className={`block w-full h-0.5 transition-gentle ${
                  isMenuOpen ? 'opacity-0' : ''
                } bg-text-primary`}
              ></span>
              <span 
                className={`block w-full h-0.5 transition-gentle ${
                  isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                } bg-text-primary`}
              ></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 transition-opacity duration-200"
          style={{ backgroundColor: 'rgba(44, 44, 44, 0.5)' }}
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Menu Panel */}
          <div 
            className="fixed top-0 right-0 h-full w-80 max-w-sm shadow-elevated transform transition-transform duration-200 ease-in-out bg-warm-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-light-gray">
              <h2 className="text-h2 font-semibold text-text-primary">
                Menu
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-soft transition-gentle hover:opacity-80 bg-light-gray"
                aria-label="Close menu"
              >
                <svg 
                  className="w-4 h-4 text-text-primary" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <div className="py-4">
              {items.length > 0 ? (
                <nav className="space-y-1">
                  {items.map((item, index) => (
                    <Link
                      key={index}
                      to={item.route}
                      onClick={() => setIsMenuOpen(false)}
                      className={`w-full flex items-center px-6 py-4 text-left transition-gentle hover:opacity-80 ${
                        isActiveRoute(item.route) 
                          ? 'bg-light-gray text-text-primary' 
                          : 'bg-transparent text-text-primary hover:bg-light-gray hover:bg-opacity-50'
                      }`}
                    >
                      {item.icon && (
                        <span className="mr-3 text-lg">{item.icon}</span>
                      )}
                      <span className="font-medium">{item.label}</span>
                      {isActiveRoute(item.route) && (
                        <span className="ml-auto text-xs text-muted-blue">●</span>
                      )}
                    </Link>
                  ))}
                </nav>
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-body-sm text-text-secondary">
                    No navigation items available
                  </p>
                </div>
              )}
            </div>

            {/* Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-light-gray">
              <div className="text-center">
                <p className="text-caption text-text-muted">
                  Revision App v1.0
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default NavBarComponent;
