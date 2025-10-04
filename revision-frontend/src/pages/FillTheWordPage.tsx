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
  currentBlankIndex: number;
  expectedWordsStack: string[];
}

const FillTheWordPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<RevisionMaterial | null>(null);

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
    currentBlankIndex: 0,
    expectedWordsStack: []
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
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    const lines: ParsedLine[] = [];

    paragraphs.forEach((paragraph, paragraphIndex) => {
      const paragraphLines = paragraph.split('\n').filter(line => line.trim());
      paragraphLines.forEach((line, lineIndex) => {
        const words = line.trim().split(/\s+/).filter(word => word.length > 0);
        if (words.length > 1) {
          lines.push({
            id: `${paragraphIndex}-${lineIndex}`,
            originalText: line.trim(),
            words: words,
            currentDifficulty: 1,
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

    if (lines.length > 0) {
      updateCurrentLineDisplay(lines[0]);
    }
  };

  // ✅ FIXED VERSION — ensures word order stays correct
  const removeWordsFromLine = (line: ParsedLine, count: number) => {
    const words = [...line.words];
    const removedPositions: number[] = [];
    const availablePositions = words.map((_, index) => index);

    for (let i = 0; i < count && availablePositions.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const position = availablePositions[randomIndex];
      availablePositions.splice(randomIndex, 1);
      removedPositions.push(position);
    }

    // ✅ Sort positions left-to-right so blanks appear in reading order
    removedPositions.sort((a, b) => a - b);

    // ✅ Ensure removedWords match blank order
    const removedWords = removedPositions.map(pos => words[pos]);

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

  const updateCurrentLineDisplay = (line: ParsedLine) => {
    const { displayText, removedWords, removedPositions } = removeWordsFromLine(line, line.currentDifficulty);
    setGameState(prev => ({
      ...prev,
      currentDisplayText: displayText,
      currentRemovedWords: removedWords,
      removedPositions,
      userSelections: [],
      targetSelections: [...removedWords],
      currentBlankIndex: 0,
      expectedWordsStack: [...removedWords]
    }));
  };

  const generateWordOptions = (line: ParsedLine, removedWords: string[]) => {
    const options = [...removedWords];
    const otherWords = line.words.filter(word => !removedWords.includes(word));
    const commonWords = ['the', 'and', 'for', 'with', 'this', 'that', 'from', 'they', 'have', 'been', 'are', 'was', 'were', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'shall', 'do', 'does', 'did', 'has', 'had', 'get', 'got', 'make', 'made', 'take', 'took', 'come', 'came', 'go', 'went', 'see', 'saw', 'know', 'knew', 'think', 'thought', 'say', 'said', 'tell', 'told', 'give', 'gave'];
    
    const allDistractors = [...otherWords, ...commonWords];
    
    while (options.length < 8 && allDistractors.length > 0) {
      const randomIndex = Math.floor(Math.random() * allDistractors.length);
      const word = allDistractors.splice(randomIndex, 1)[0];
      if (!options.includes(word)) {
        options.push(word);
      }
    }

    return options.slice(0, 8).sort(() => Math.random() - 0.5);
  };

  const generateHighlightedDisplayText = () => {
    if (!gameState.currentLine) return '';
    const words = gameState.currentLine.words;
    const userSelections = gameState.userSelections;
    const removedPositions = gameState.removedPositions;

    let blankCounter = 0;
    const displayWords = words.map((word, index) => {
      if (removedPositions.includes(index)) {
        const isFilled = blankCounter < userSelections.length;
        if (isFilled) {
          blankCounter++;
          return (
            <span
              key={index}
              className="bg-forest-green bg-opacity-30 px-2 py-1 rounded border-2 border-forest-green text-forest-green font-medium"
            >
              {userSelections[blankCounter - 1]}
            </span>
          );
        } else {
          blankCounter++;
          return (
            <span
              key={index}
              className="bg-soft-orange bg-opacity-30 px-2 py-1 rounded border-2 border-soft-orange border-dashed"
            >
              _____
            </span>
          );
        }
      }
      return word;
    });

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

    const currentSelectionIndex = gameState.userSelections.length;
    const correctWordForThisPosition = gameState.currentRemovedWords[currentSelectionIndex];
    const isCorrect = selectedWord === correctWordForThisPosition;

    if (isCorrect) {
      const newExpectedStack = gameState.expectedWordsStack.slice(1);
      const newUserSelections = [...gameState.userSelections, selectedWord];

      if (newUserSelections.length >= gameState.currentRemovedWords.length) {
        setGameState(prev => ({
          ...prev,
          userSelections: newUserSelections,
          expectedWordsStack: newExpectedStack,
          showResult: true,
          correctWord: 'correct'
        }));

        setTimeout(() => {
          const newDifficulty = line.currentDifficulty + 1;
          const maxDifficulty = Math.max(1, Math.ceil(line.words.length * MAX_DIFFICULTY_FRACTION));

          if (newDifficulty > maxDifficulty) {
            moveToNextLine();
          } else {
            const updatedLine = { ...line, currentDifficulty: newDifficulty };
            setParsedLines(prev =>
              prev.map(l => (l.id === line.id ? updatedLine : l))
            );
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
        setGameState(prev => ({
          ...prev,
          userSelections: newUserSelections
        }));
      }
    } else {
      setGameState(prev => ({
        ...prev,
        showResult: true,
        correctWord: 'incorrect'
      }));

      setTimeout(() => {
        setGameState(prev => ({ ...prev, showFullText: true }));
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            showFullText: false,
            showResult: false,
            userSelections: []
          }));
          updateCurrentLineDisplay(line);
        }, 2000);
      }, 1000);
    }
  };

  const moveToNextLine = () => {
    const nextIndex = gameState.currentLineIndex + 1;
    if (nextIndex >= parsedLines.length) {
      setGameState(prev => ({ ...prev, completedLines: prev.totalLines }));
    } else {
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
      updateCurrentLineDisplay(parsedLines[nextIndex]);
      setParsedLines(prev =>
        prev.map((line, index) =>
          index === gameState.currentLineIndex ? { ...line, completed: true } : line
        )
      );
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
      <div className="max-w-content mx-auto px-4 py-8 text-center py-24">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-h1 font-semibold text-text-primary mb-4">Material Not Found</h1>
        <p className="text-body text-text-secondary mb-6">
          The revision material you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/materials')}
          className="px-6 py-3 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-muted-blue"
        >
          Back to Materials
        </button>
      </div>
    );
  }

  if (gameState.completedLines === gameState.totalLines && gameState.totalLines > 0) {
    return (
      <div className="max-w-content mx-auto px-4 py-8 text-center py-24">
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
    );
  }

  if (!gameState.currentLine) {
    return (
      <div className="max-w-content mx-auto px-4 py-8 text-center py-24">
        <div className="text-6xl mb-4">📝</div>
        <h1 className="text-h1 font-semibold text-text-primary mb-4">No Content Available</h1>
        <p className="text-body text-text-secondary mb-6">
          This material doesn't have enough content to practice with.
        </p>
        <button
          onClick={() => navigate('/materials')}
          className="px-6 py-3 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-muted-blue"
        >
          Back to Materials
        </button>
      </div>
    );
  }

  const handleSkipLine = () => {
    moveToNextLine();
  };

  const wordOptions = generateWordOptions(gameState.currentLine, gameState.currentRemovedWords);

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display font-bold text-text-primary mb-2">Fill the Word</h1>
          <p className="text-body-lg text-text-secondary">{material.name}</p>
        </div>
        <button
          onClick={() => navigate('/materials')}
          className="px-4 py-2 rounded-soft font-medium border border-light-gray text-text-primary transition-gentle hover:opacity-90 bg-transparent"
        >
          ← Back to Materials
        </button>
      </div>

      <div className="mb-8 p-4 rounded-card bg-warm-white border border-light-gray shadow-soft">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body-sm font-medium text-text-primary">Progress</span>
          <span className="text-body-sm text-text-secondary">
            {gameState.completedLines} / {gameState.totalLines} lines completed
          </span>
        </div>
        <div className="w-full bg-light-gray rounded-pill h-2">
          <div
            className="bg-forest-green rounded-pill h-2 transition-gentle"
            style={{
              width: `${(gameState.completedLines / gameState.totalLines) * 100}%`
            }}
          ></div>
        </div>
      </div>

      <div className="bg-warm-white rounded-card border border-light-gray shadow-card p-8">
        <div className="mb-8 text-center p-6 bg-soft-beige rounded-soft border border-light-gray">
          {gameState.showFullText ? (
            <>
              <p className="text-body-lg text-text-primary font-medium mb-2">Original text:</p>
              <p className="text-body text-text-secondary">{gameState.currentLine.originalText}</p>
            </>
          ) : (
            <>
              <p className="text-body-lg text-text-primary font-medium mb-2">Fill in the missing word:</p>
              <p className="text-body text-text-primary font-medium flex flex-wrap gap-1 justify-center">
                {generateHighlightedDisplayText()}
              </p>
              
              {/* Progress Bar for Current Sentence */}
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
            </>
          )}
        </div>

        {!gameState.showFullText && !gameState.showResult && (
          <>
            <div className="mb-4 text-center">
              <p className="text-body-sm text-text-secondary">
                Select {gameState.currentRemovedWords.length - gameState.userSelections.length} more word
                {gameState.currentRemovedWords.length - gameState.userSelections.length > 1 ? 's' : ''}:{' '}
                <span className="font-medium text-text-primary ml-1">
                  {gameState.userSelections.length} / {gameState.currentRemovedWords.length} selected
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
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

            {/* Skip Button */}
            <div className="text-center mt-6">
              <button
                onClick={handleSkipLine}
                className="px-4 py-2 rounded-soft font-medium border border-light-gray text-text-secondary transition-gentle hover:opacity-90 bg-transparent hover:bg-light-gray hover:bg-opacity-50 text-body-sm"
              >
                Skip this line
              </button>
            </div>
          </>
        )}

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

        <div className="text-center mt-6">
          <p className="text-caption text-text-muted">
            Difficulty: {gameState.currentLine.currentDifficulty} word
            {gameState.currentLine.currentDifficulty > 1 ? 's' : ''} removed
          </p>
        </div>
      </div>
    </div>
  );
};

export default FillTheWordPage;
