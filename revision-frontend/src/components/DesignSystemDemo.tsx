import React from 'react';

const DesignSystemDemo: React.FC = () => {
  return (
    <div className="max-w-content mx-auto px-4 py-8">
      <h2 className="text-h1 font-semibold mb-6 text-text-primary">
        Tailwind Configuration Benefits
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Before - Inline Styles */}
        <div 
          className="p-6 rounded-card border shadow-soft"
          style={{ backgroundColor: '#FEFCF9', borderColor: '#E8E5E0' }}
        >
          <h3 className="text-h3 font-medium mb-4" style={{ color: '#2C2C2C' }}>
            Before: Inline Styles
          </h3>
          <p className="text-body-sm mb-4" style={{ color: '#6B7C93' }}>
            Using inline styles requires repeating hex codes everywhere:
          </p>
          <code className="text-caption bg-light-gray px-2 py-1 rounded-soft block">
            style=&#123;&#123; backgroundColor: '#FEFCF9', color: '#2C2C2C' &#125;&#125;
          </code>
        </div>

        {/* After - Tailwind Classes */}
        <div className="p-6 rounded-card border shadow-soft bg-warm-white border-light-gray">
          <h3 className="text-h3 font-medium mb-4 text-text-primary">
            After: Tailwind Classes
          </h3>
          <p className="text-body-sm mb-4 text-text-secondary">
            Clean, semantic classes that follow our design system:
          </p>
          <code className="text-caption bg-light-gray px-2 py-1 rounded-soft block text-text-primary">
            className="bg-warm-white text-text-primary"
          </code>
        </div>
      </div>

      {/* Component Examples */}
      <div className="space-y-6">
        <div>
          <h3 className="text-h3 font-medium mb-4 text-text-primary">
            Button Components
          </h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 rounded-soft font-medium text-white transition-gentle hover:opacity-90 bg-muted-blue">
              Primary Button
            </button>
            <button className="px-6 py-3 rounded-soft font-medium border border-light-gray text-text-primary transition-gentle hover:opacity-90 bg-transparent">
              Secondary Button
            </button>
            <button className="px-6 py-3 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-soft-orange">
              Accent Button
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-h3 font-medium mb-4 text-text-primary">
            Card Components
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-card border shadow-card bg-warm-white border-light-gray">
              <h4 className="text-h3 font-medium mb-3 text-text-primary">
                Study Session
              </h4>
              <p className="text-body-sm mb-4 text-text-secondary">
                Review your flashcards and practice questions for today's study session.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-caption text-text-muted">45 minutes</span>
                <div className="w-16 h-2 rounded-pill bg-light-gray">
                  <div className="w-10 h-2 rounded-pill bg-soft-orange"></div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-card border shadow-card bg-warm-white border-light-gray">
              <h4 className="text-h3 font-medium mb-3 text-text-primary">
                Progress Review
              </h4>
              <p className="text-body-sm mb-4 text-text-secondary">
                Check your learning progress and identify areas for improvement.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-caption text-text-muted">Complete</span>
                <div className="w-4 h-4 rounded-pill bg-forest-green"></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-h3 font-medium mb-4 text-text-primary">
            Input Components
          </h3>
          <div className="max-w-md space-y-4">
            <input 
              type="text" 
              placeholder="Enter your study topic..."
              className="w-full px-4 py-3 rounded-soft border border-light-gray bg-warm-white text-text-primary placeholder-text-placeholder focus:outline-none focus:border-muted-blue transition-gentle"
            />
            <textarea 
              placeholder="Add notes about your revision..."
              rows={3}
              className="w-full px-4 py-3 rounded-soft border border-light-gray bg-warm-white text-text-primary placeholder-text-placeholder focus:outline-none focus:border-muted-blue transition-gentle resize-none"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemDemo;
