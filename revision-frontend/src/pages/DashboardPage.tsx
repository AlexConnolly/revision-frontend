import React from 'react';
import DesignSystemDemo from '../components/DesignSystemDemo';

const DashboardPage: React.FC = () => {
  return (
    <>
      {/* Header */}
      <div className="text-center py-12 px-4">
        <h1 className="text-display font-bold mb-4 text-text-primary">
          Revision App Dashboard
        </h1>
        <p className="text-body-lg text-text-secondary">
          Your personal study companion for effective learning
        </p>
      </div>

      <div className="max-w-content mx-auto px-4 pb-12">
        {/* Design System Demo */}
        <DesignSystemDemo />
      </div>
    </>
  );
};

export default DashboardPage;
