import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { revisionMaterialRepository } from '../repositories/RevisionMaterialRepository';
import { RevisionMaterial } from '../types/RevisionMaterial';

interface ParsedSentence {
  text: string;
  words: string[];
  visibleWords: string[];
  hiddenWords: string[];
}

const SayItOutLoudPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<RevisionMaterial | null>(null);
  const [sentences, setSentences] = useState<ParsedSentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/materials');
      return;
    }

    const foundMaterial = revisionMaterialRepository.getById(id);
    if (!foundMaterial) {
      navigate('/materials');
      return;
    }

    setMaterial(foundMaterial);
    parseSentences(foundMaterial.extract);
  }, [id, navigate]);

  const parseSentences = (text: string) => {
    // Split by periods and clean up
    const rawSentences = text
      .split('.')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const parsed = rawSentences.map(sentence => {
      const words = sentence.split(/\s+/).filter(word => word.length > 0);
      const visibleWords = words.slice(0, 3);
      const hiddenWords = words.slice(3);

      return {
        text: sentence,
        words,
        visibleWords,
        hiddenWords
      };
    });

    setSentences(parsed);
  };

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(prev => prev - 1);
      setIsRevealing(false);
    }
  };

  const handleNext = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
      setIsRevealing(false);
    }
  };

  const handleMouseDown = () => {
    setIsRevealing(true);
  };

  const handleMouseUp = () => {
    setIsRevealing(false);
  };

  const handleTouchStart = () => {
    setIsRevealing(true);
  };

  const handleTouchEnd = () => {
    setIsRevealing(false);
  };

  if (!material || sentences.length === 0) {
    return (
      <div className="max-w-content mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center">
            <span className="loader mb-4" />
            <span className="text-body text-text-secondary">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const currentSentence = sentences[currentSentenceIndex];

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display font-bold text-text-primary mb-2">Say It Out Loud</h1>
          <p className="text-body-lg text-text-secondary">{material.name}</p>
        </div>
        <button
          onClick={() => navigate('/materials')}
          className="px-4 py-2 rounded-soft font-medium border border-light-gray text-text-primary transition-gentle hover:opacity-90 bg-transparent"
        >
          ← Back to Materials
        </button>
      </div>

      {/* Progress */}
      <div className="mb-8 p-4 rounded-card bg-warm-white border border-light-gray shadow-soft">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body-sm font-medium text-text-primary">Progress</span>
          <span className="text-body-sm text-text-secondary">
            Sentence {currentSentenceIndex + 1} of {sentences.length}
          </span>
        </div>
        <div className="w-full bg-light-gray rounded-pill h-2">
          <div 
            className="bg-muted-blue rounded-pill h-2 transition-gentle"
            style={{ 
              width: `${((currentSentenceIndex + 1) / sentences.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8 p-6 rounded-card bg-warm-white border border-light-gray shadow-soft">
        <div className="text-center mb-6">
          <h3 className="text-h2 font-medium text-text-primary mb-4">
            Say this sentence out loud:
          </h3>
          
          {/* Sentence Display */}
          <div className="relative p-6 rounded-soft bg-warm-gray border border-light-gray min-h-[120px] flex items-center justify-center">
            <div className="text-body-lg leading-relaxed">
              {/* Visible words */}
              <span className="text-text-primary">
                {currentSentence.visibleWords.join(' ')}
              </span>
              
              {/* Hidden words with individual word overlays */}
              {currentSentence.hiddenWords.length > 0 && (
                <span className="inline">
                  {currentSentence.hiddenWords.map((word, index) => (
                    <span key={index} className="relative inline-block mr-1">
                      <span className={isRevealing ? "text-text-primary" : "text-warm-gray"}>
                        {word}
                      </span>
                      {!isRevealing && (
                        <div className="absolute inset-0 bg-gray-600 rounded-sm" />
                      )}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Reveal Button */}
        <div className="text-center mb-6">
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="px-8 py-4 rounded-soft font-medium text-warm-white bg-forest-green hover:opacity-90 transition-gentle text-body-lg shadow-card"
          >
            {isRevealing ? '👁️ Showing Full Text' : '👁️ Press to Reveal'}
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center text-body-sm text-text-secondary">
          <p>Press and hold the button above to see the full sentence</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentSentenceIndex === 0}
          className="px-6 py-3 rounded-soft font-medium border border-light-gray text-text-primary transition-gentle hover:opacity-90 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div className="text-center">
          <span className="text-body-sm text-text-secondary">
            {currentSentenceIndex + 1} / {sentences.length}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentSentenceIndex === sentences.length - 1}
          className="px-6 py-3 rounded-soft font-medium border border-light-gray text-text-primary transition-gentle hover:opacity-90 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default SayItOutLoudPage;
