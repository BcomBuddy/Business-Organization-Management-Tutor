import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
}

const Flashcards: React.FC = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Sample flashcards data - you can replace this with actual data from your context
  const flashcards: Flashcard[] = [
    {
      id: 1,
      front: "What is organizational behavior?",
      back: "Organizational behavior is the study of how people interact within groups, with the goal of creating more efficient business organizations.",
      category: "Fundamentals"
    },
    {
      id: 2,
      front: "Define corporate culture",
      back: "Corporate culture refers to the beliefs and behaviors that determine how a company's employees and management interact and handle business transactions.",
      category: "Culture"
    },
    {
      id: 3,
      front: "What is SWOT analysis?",
      back: "SWOT analysis is a strategic planning technique used to identify Strengths, Weaknesses, Opportunities, and Threats related to business competition or project planning.",
      category: "Strategy"
    },
    {
      id: 4,
      front: "Define leadership",
      back: "Leadership is the ability of an individual or a group of individuals to influence and guide followers or other members of an organization.",
      category: "Leadership"
    },
    {
      id: 5,
      front: "What is change management?",
      back: "Change management is a systematic approach to dealing with the transition or transformation of an organization's goals, processes, or technologies.",
      category: "Management"
    }
  ];

  const currentCard = flashcards[currentCardIndex];

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Business Flashcards</h1>
          <p className="text-gray-300">Master key business concepts through interactive flashcards</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Progress</span>
            <span className="text-sm text-gray-300">{currentCardIndex + 1} of {flashcards.length}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pastel-blue to-pastel-purple h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <div className="relative">
            <div 
              className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 min-h-[300px] shadow-2xl border border-white/10 transition-all duration-500 transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className={`transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                {/* Front of card */}
                <div className="text-center">
                  <div className="mb-4">
                    <span className="inline-block bg-pastel-blue/20 text-pastel-blue px-3 py-1 rounded-full text-sm font-medium">
                      {currentCard.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-6">Question</h2>
                  <p className="text-xl text-gray-200 leading-relaxed">{currentCard.front}</p>
                </div>
              </div>

              <div className={`absolute inset-0 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                {/* Back of card */}
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="inline-block bg-pastel-green/20 text-pastel-green px-3 py-1 rounded-full text-sm font-medium">
                      Answer
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-6">Answer</h2>
                  <p className="text-xl text-gray-200 leading-relaxed">{currentCard.back}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className={`p-3 rounded-full transition-all ${
              currentCardIndex === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-pastel-blue to-pastel-purple text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleFlip}
            className="px-8 py-3 bg-gradient-to-r from-pastel-green to-pastel-blue text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all"
          >
            {isFlipped ? 'Show Question' : 'Show Answer'}
          </button>

          <button
            onClick={handleNext}
            disabled={currentCardIndex === flashcards.length - 1}
            className={`p-3 rounded-full transition-all ${
              currentCardIndex === flashcards.length - 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-pastel-blue to-pastel-purple text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Beginning
          </button>
        </div>

        {/* Study Tips */}
        <div className="mt-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Study Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-pastel-green mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white mb-1">Active Recall</h4>
                <p className="text-sm text-gray-300">Try to recall the answer before flipping the card</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-pastel-green mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white mb-1">Spaced Repetition</h4>
                <p className="text-sm text-gray-300">Review cards regularly to strengthen memory</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-pastel-green mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white mb-1">Focus Areas</h4>
                <p className="text-sm text-gray-300">Pay attention to cards you find difficult</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-pastel-green mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white mb-1">Regular Practice</h4>
                <p className="text-sm text-gray-300">Study a little bit every day for best results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
