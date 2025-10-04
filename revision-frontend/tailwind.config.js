/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      // Custom color palette based on our design guidelines
      colors: {
        // Primary colors
        'warm-gray': '#F8F6F3',
        'soft-beige': '#F5F2ED',
        'charcoal': '#2C2C2C',
        'muted-blue': '#6B7C93',
        'forest-green': '#5A7C65',
        
        // Secondary colors
        'light-gray': '#E8E5E0',
        'warm-white': '#FEFCF9',
        'soft-orange': '#D4A574',
        'muted-red': '#B85C57',
        
        // Text colors
        'text-primary': '#2C2C2C',
        'text-secondary': '#6B7C93',
        'text-muted': '#9CA3AF',
        'text-placeholder': '#D1D5DB',
      },
      
      // Custom spacing system (base unit: 4px)
      spacing: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        '2xl': '3rem',     // 48px
        '3xl': '4rem',     // 64px
      },
      
      // Custom typography scale
      fontSize: {
        'display': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],      // 32px
        'h1': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '600' }],       // 28px
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],           // 24px
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }],       // 20px
        'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }], // 18px
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],         // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 14px
        'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],     // 12px
      },
      
      // Custom font family
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      
      // Custom font weights
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      
      // Custom border radius for soft, library feel
      borderRadius: {
        'soft': '0.5rem',   // 8px
        'card': '0.75rem',  // 12px
        'pill': '9999px',
      },
      
      // Custom shadows for gentle elevation
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(44, 44, 44, 0.1), 0 1px 2px 0 rgba(44, 44, 44, 0.06)',
        'card': '0 4px 6px -1px rgba(44, 44, 44, 0.1), 0 2px 4px -1px rgba(44, 44, 44, 0.06)',
        'elevated': '0 10px 15px -3px rgba(44, 44, 44, 0.1), 0 4px 6px -2px rgba(44, 44, 44, 0.05)',
      },
      
      // Custom animation durations for gentle interactions
      transitionDuration: {
        'gentle': '200ms',
        'smooth': '300ms',
      },
      
      // Custom easing curves
      transitionTimingFunction: {
        'gentle': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      
      // Custom max widths for content
      maxWidth: {
        'content': '1200px',
      },
      
      // Custom z-index scale
      zIndex: {
        'nav': '50',
        'modal': '100',
        'tooltip': '200',
      },
    },
  },
  plugins: [],
}
