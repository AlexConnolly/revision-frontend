import React from 'react';
import AppRouter from './router/AppRouter';
import NavBarComponent from './components/NavBarComponent';
import { DialogProvider } from './components/DialogProvider';

function App() {
  // Navigation items
  const navigationItems = [
    { label: 'Materials', route: '/materials', icon: '📚' }
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
