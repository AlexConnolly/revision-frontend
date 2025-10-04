import React from 'react';
import AppRouter from './router/AppRouter';
import NavBarComponent from './components/NavBarComponent';
import { DialogProvider } from './components/DialogProvider';

function App() {
  // Navigation items
  const navigationItems = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Materials', route: '/materials', icon: '📚' },
    { label: 'Study Sessions', route: '/study', icon: '🎯' },
    { label: 'Flashcards', route: '/flashcards', icon: '🃏' },
    { label: 'Progress', route: '/progress', icon: '📈' },
    { label: 'Settings', route: '/settings', icon: '⚙️' }
  ];

  return (
    <DialogProvider>
      <AppRouter>
        {/* Navigation Bar */}
        <NavBarComponent 
          title="Revision App"
          items={navigationItems}
        />
      </AppRouter>
    </DialogProvider>
  );
}

export default App;
