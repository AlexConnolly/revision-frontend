import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { revisionMaterialRepository } from '../repositories/RevisionMaterialRepository';
import { RevisionMaterial } from '../types/RevisionMaterial';

interface ParsedLine {
  id: string;
  originalText: string;
  words: string[];
  currentDifficulty: number; // How many words are currently removed
  completed: boolean;
}


interface GameState {
  currentLineIndex: number;
  totalLines: number;
  completedLines: number;
  currentLine: ParsedLine | null;
  showFullText: boolean;
  selectedWords: string[];
  correctWord: string | null;
  showResult: boolean;
  currentRemovedWords: string[];
  currentDisplayText: string;
  userSelections: string[];
  targetSelections: string[];
  filledWords: { [position: number]: string };
  removedPositions: number[];
  currentBlankIndex: number; // Which blank position user is currently selecting for
}

const FillTheWordPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<RevisionMaterial | null>(null);
  
  // Configuration: What fraction of words should be the maximum difficulty (1/4 = 0.25, 1/2 = 0.5, etc.)
  const MAX_DIFFICULTY_FRACTION = 0.25; // 1/4 of words
  const [parsedLines, setParsedLines] = useState<ParsedLine[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    currentLineIndex: 0,
    totalLines: 0,
    completedLines: 0,
    currentLine: null,
    showFullText: false,
    selectedWords: [],
    correctWord: null,
    showResult: false,
    currentRemovedWords: [],
    currentDisplayText: '',
    userSelections: [],
    targetSelections: [],
    filledWords: {},
    removedPositions: [],
    currentBlankIndex: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadMaterial();
    }
  }, [id]);

  const loadMaterial = () => {
    setIsLoading(true);
    try {
      const loadedMaterial = revisionMaterialRepository.getById(id!);
      if (loadedMaterial) {
        setMaterial(loadedMaterial);
        parseText(loadedMaterial.extract);
      } else {
        // Material not found, redirect to materials page
        navigate('/materials');
      }
    } catch (error) {
      console.error('Error loading material:', error);
      navigate('/materials');
    } finally {
      setIsLoading(false);
    }
  };

  const parseText = (text: string) => {
    // Split into paragraphs, then into lines
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    const lines: ParsedLine[] = [];
    
    paragraphs.forEach((paragraph, paragraphIndex) => {
      const paragraphLines = paragraph.split('\n').filter(line => line.trim());
      paragraphLines.forEach((line, lineIndex) => {
        const words = line.trim().split(/\s+/).filter(word => word.length > 0);
        if (words.length > 1) { // Only include lines with more than one word
          lines.push({
            id: `${paragraphIndex}-${lineIndex}`,
            originalText: line.trim(),
            words: words,
            currentDifficulty: 1, // Start by removing 1 word
            completed: false
          });
        }
      });
    });

    setParsedLines(lines);
    setGameState(prev => ({
      ...prev,
      totalLines: lines.length,
      currentLine: lines[0] || null
    }));
    
    // Initialize display for first line
    if (lines.length > 0) {
      updateCurrentLineDisplay(lines[0]);
    }
  };

  const updateCurrentLineDisplay = (line: ParsedLine) => {
    const { displayText, removedWords, removedPositions } = removeWordsFromLine(line, line.currentDifficulty);
    setGameState(prev => ({
      ...prev,
      currentDisplayText: displayText,
      currentRemovedWords: removedWords,
      removedPositions,
      userSelections: [],
      targetSelections: [...removedWords],
      currentBlankIndex: 0
    }));
  };

  const generateWordOptions = (line: ParsedLine, removedWords: string[]) => {
    // Get all words from the line that are not in the removed words
    const allWords = line.words.filter(word => !removedWords.includes(word));
    
    // Create options: all removed words + random words from the text
    const options = [...removedWords];
    
    // Add random words from the line
    const shuffled = allWords.sort(() => Math.random() - 0.5);
    const additionalOptions = shuffled.slice(0, Math.max(0, 4 - removedWords.length));
    options.push(...additionalOptions);
    
    // If we need more options, add common words
    const commonWords = ['the', 'and', 'for', 'with', 'this', 'that', 'from', 'they', 'have', 'been'];
    while (options.length < 4 && commonWords.length > 0) {
      const randomWord = commonWords.splice(Math.floor(Math.random() * commonWords.length), 1)[0];
      if (!options.includes(randomWord)) {
        options.push(randomWord);
      }
    }
    
    // Shuffle the final options
    return options.sort(() => Math.random() - 0.5);
  };

  const removeWordsFromLine = (line: ParsedLine, count: number) => {
    const words = [...line.words];
    const removedWords: string[] = [];
    const removedPositions: number[] = [];
    
    // Randomly select positions to remove words
    const availablePositions = words.map((_, index) => index);
    
    for (let i = 0; i < count && availablePositions.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const position = availablePositions[randomIndex];
      
      removedWords.push(words[position]);
      removedPositions.push(position);
      availablePositions.splice(randomIndex, 1);
    }
    
    // Create the display text with blanks
    const displayWords = words.map((word, index) => {
      if (removedPositions.includes(index)) {
        return '_____';
      }
      return word;
    });
    
    return {
      displayText: displayWords.join(' '),
      removedWords,
      removedPositions
    };
  };

  const generateHighlightedDisplayText = () => {
    if (!gameState.currentLine) return '';
    
    const words = gameState.currentLine.words;
    const userSelections = gameState.userSelections;
    const removedPositions = gameState.removedPositions;
    const currentBlankIndex = gameState.currentBlankIndex;
    
    let blankCounter = 0;
    const displayWords = words.map((word, index) => {
      if (removedPositions.includes(index)) {
        const isCurrentBlank = blankCounter === currentBlankIndex;
        const isFilled = blankCounter < userSelections.length;
        
        if (isFilled) {
          blankCounter++;
          return userSelections[blankCounter - 1];
        } else if (isCurrentBlank) {
          blankCounter++;
          return (
            <span key={index} className="bg-soft-orange bg-opacity-30 px-2 py-1 rounded border-2 border-soft-orange border-dashed">
              _____
            </span>
          );
        } else {
          blankCounter++;
          return '_____';
        }
      }
      return word;
    });
    
    // Add spaces between elements
    const elementsWithSpaces = [];
    for (let i = 0; i < displayWords.length; i++) {
      elementsWithSpaces.push(displayWords[i]);
      if (i < displayWords.length - 1) {
        elementsWithSpaces.push(' ');
      }
    }
    
    return elementsWithSpaces;
  };

  const handleWordSelection = (selectedWord: string) => {
    if (!gameState.currentLine) return;
    
    const line = gameState.currentLine;
    
    // Check if the selected word is one of the correct words that needs to be filled
    const isCorrect = gameState.currentRemovedWords.includes(selectedWord);
    
    if (isCorrect) {
      // Correct word selected - add to selections and move to next blank
      const newUserSelections = [...gameState.userSelections, selectedWord];
      
      // Check if user has selected all required words
      if (newUserSelections.length >= gameState.currentRemovedWords.length) {
        // All words selected correctly - move to next round or next line
        setGameState(prev => ({
          ...prev,
          userSelections: newUserSelections,
          showResult: true,
          correctWord: 'correct'
        }));
        
        setTimeout(() => {
          const newDifficulty = line.currentDifficulty + 1;
          
          const maxDifficulty = Math.max(1, Math.ceil(line.words.length * MAX_DIFFICULTY_FRACTION));
          if (newDifficulty > maxDifficulty) {
            // Line completed, move to next line
            moveToNextLine();
          } else {
            // Continue with same line, increased difficulty
            const updatedLine = { ...line, currentDifficulty: newDifficulty };
            
            setParsedLines(prev => prev.map(l => 
              l.id === line.id 
                ? updatedLine
                : l
            ));
            
            // Reset and update display for new difficulty
            setGameState(prev => ({
              ...prev,
              showResult: false,
              userSelections: [],
              currentLine: updatedLine
            }));
            
            updateCurrentLineDisplay(updatedLine);
          }
        }, 1500);
      } else {
        // More words to select - move to next blank
        setGameState(prev => ({
          ...prev,
          userSelections: newUserSelections,
          currentBlankIndex: prev.currentBlankIndex + 1
        }));
      }
    } else {
      // Wrong word selected - fail immediately
      setGameState(prev => ({
        ...prev,
        showResult: true,
        correctWord: 'incorrect'
      }));
      
      // Show full text briefly and try again
      setTimeout(() => {
        setGameState(prev => ({ ...prev, showFullText: true }));
        
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            showFullText: false,
            showResult: false,
            userSelections: []
          }));
          
          // Reset the display for the same difficulty
          updateCurrentLineDisplay(line);
        }, 2000);
      }, 1000);
    }
  };

  const moveToNextLine = () => {
    const nextIndex = gameState.currentLineIndex + 1;
    
    if (nextIndex >= parsedLines.length) {
      // Game completed
      setGameState(prev => ({ ...prev, completedLines: prev.totalLines }));
    } else {
      // Move to next line
      setGameState(prev => ({
        ...prev,
        currentLineIndex: nextIndex,
        currentLine: parsedLines[nextIndex],
        showResult: false,
        selectedWords: [],
        showFullText: false,
        completedLines: prev.completedLines + 1,
        userSelections: []
      }));
      
      // Update display for new line
      updateCurrentLineDisplay(parsedLines[nextIndex]);
      
      // Mark current line as completed
      setParsedLines(prev => prev.map((line, index) => 
        index === gameState.currentLineIndex 
          ? { ...line, completed: true }
          : line
      ));
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-content mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center">
            <span className="loader mb-4" />
            <span className="text-body text-text-secondary">Loading material...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="max-w-content mx-auto px-4 py-8">
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-h1 font-semibold text-text-primary mb-4">Material Not Found</h1>
          <p className="text-body text-text-secondary mb-6">The revision material you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/materials')}
            className="px-6 py-3 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-muted-blue"
          >
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  // Game completed
  if (gameState.completedLines === gameState.totalLines && gameState.totalLines > 0) {
    return (
      <div className="max-w-content mx-auto px-4 py-8">
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-h1 font-semibold text-text-primary mb-4">Congratulations!</h1>
          <p className="text-body text-text-secondary mb-6">
            You've completed all {gameState.totalLines} lines in "{material.name}"
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/materials')}
              className="px-6 py-3 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-muted-blue"
            >
              Back to Materials
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-soft font-medium border border-light-gray text-text-primary transition-gentle hover:opacity-90 bg-transparent"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState.currentLine) {
    return (
      <div className="max-w-content mx-auto px-4 py-8">
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-h1 font-semibold text-text-primary mb-4">No Content Available</h1>
          <p className="text-body text-text-secondary mb-6">This material doesn't have enough content to practice with.</p>
          <button
            onClick={() => navigate('/materials')}
            className="px-6 py-3 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-muted-blue"
          >
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  const wordOptions = generateWordOptions(gameState.currentLine, gameState.currentRemovedWords);

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display font-bold text-text-primary mb-2">
            Fill the Word
          </h1>
          <p className="text-body-lg text-text-secondary">
            {material.name}
          </p>
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
          <span className="text-body-sm font-medium text-text-primary">
            Progress
          </span>
          <span className="text-body-sm text-text-secondary">
            {gameState.completedLines} / {gameState.totalLines} lines completed
          </span>
        </div>
        <div className="w-full bg-light-gray rounded-pill h-2">
          <div 
            className="bg-forest-green rounded-pill h-2 transition-gentle"
            style={{ width: `${(gameState.completedLines / gameState.totalLines) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-warm-white rounded-card border border-light-gray shadow-card p-8">
        {/* Line Display */}
        <div className="mb-8">
          {gameState.showFullText ? (
            <div className="text-center p-6 bg-soft-beige rounded-soft border border-light-gray">
              <p className="text-body-lg text-text-primary font-medium mb-2">Original text:</p>
              <p className="text-body text-text-secondary">{gameState.currentLine.originalText}</p>
            </div>
          ) : (
            <div className="text-center p-6 bg-soft-beige rounded-soft border border-light-gray">
              <p className="text-body-lg text-text-primary font-medium mb-2">Fill in the missing word:</p>
              <p className="text-body text-text-primary font-medium flex flex-wrap gap-1">
                {generateHighlightedDisplayText()}
              </p>
              
              {/* Progress Bar for Current Cumulative Text */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-caption text-text-secondary">
                    Progress: {gameState.currentLine.currentDifficulty} / {Math.max(1, Math.ceil(gameState.currentLine.words.length * MAX_DIFFICULTY_FRACTION))} difficulty levels
                  </span>
                  <span className="text-caption text-text-muted">
                    {Math.round((gameState.currentLine.currentDifficulty / Math.max(1, Math.ceil(gameState.currentLine.words.length * MAX_DIFFICULTY_FRACTION))) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-light-gray rounded-pill h-2">
                  <div 
                    className="bg-muted-blue rounded-pill h-2 transition-gentle"
                    style={{ 
                      width: `${Math.min(100, (gameState.currentLine.currentDifficulty / Math.max(1, Math.ceil(gameState.currentLine.words.length * MAX_DIFFICULTY_FRACTION))) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        {!gameState.showFullText && !gameState.showResult && (
          <div className="mb-4 text-center">
            <p className="text-body-sm text-text-secondary">
              Select word {gameState.currentBlankIndex + 1} of {gameState.currentRemovedWords.length}: 
              <span className="font-medium text-text-primary ml-1">
                {gameState.userSelections.length} / {gameState.currentRemovedWords.length} selected
              </span>
            </p>
          </div>
        )}

        {/* Word Options */}
        {!gameState.showFullText && !gameState.showResult && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {wordOptions.map((word, index) => (
              <button
                key={index}
                onClick={() => handleWordSelection(word)}
                className="p-4 rounded-soft font-medium text-text-primary border border-light-gray bg-transparent transition-gentle hover:opacity-90 hover:bg-light-gray hover:bg-opacity-50"
              >
                {word}
              </button>
            ))}
          </div>
        )}

        {/* Result Display */}
        {gameState.showResult && (
          <div className="text-center p-6 rounded-soft border">
            {gameState.correctWord === 'correct' ? (
              <div className="text-forest-green">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-body font-medium">Correct! Well done!</p>
              </div>
            ) : (
              <div className="text-muted-red">
                <div className="text-4xl mb-2">❌</div>
                <p className="text-body font-medium">Not quite right. Here's the full text...</p>
              </div>
            )}
          </div>
        )}

        {/* Current Difficulty Indicator */}
        <div className="text-center mt-6">
          <p className="text-caption text-text-muted">
            Difficulty: {gameState.currentLine.currentDifficulty} word{gameState.currentLine.currentDifficulty > 1 ? 's' : ''} removed
          </p>
        </div>
      </div>
    </div>
  );
};

export default FillTheWordPage;
