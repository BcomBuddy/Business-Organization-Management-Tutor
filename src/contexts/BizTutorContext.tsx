import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { seedData } from '../data/seedData';
import type { 
  Lesson, 
  Question, 
  CaseScenario, 
  Flashcard, 
  AttemptLog, 
  ChatMessage, 
  ProgressByTopic 
} from '../types/index';

interface BizTutorState {
  lessons: Lesson[];
  questions: Question[];
  cases: CaseScenario[];
  flashcards: Flashcard[];
  attemptLogs: AttemptLog[];
  chatMessages: ChatMessage[];
  progress: Record<string, ProgressByTopic>;
  currentTab: string;
}

interface BizTutorContextType extends BizTutorState {
  dispatch: React.Dispatch<BizTutorAction>;
  setCurrentTab: (tab: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  addAttemptLog: (log: AttemptLog) => void;
  updateFlashcard: (cardId: string, updates: Partial<Flashcard>) => void;
  updateProgress: (topic: string, correct: boolean, timeSec: number) => void;
}

type BizTutorAction = 
  | { type: 'SET_TAB'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'ADD_ATTEMPT_LOG'; payload: AttemptLog }
  | { type: 'UPDATE_FLASHCARD'; payload: { id: string; updates: Partial<Flashcard> } }
  | { type: 'UPDATE_PROGRESS'; payload: { topic: string; correct: boolean; timeSec: number } }
  | { type: 'LOAD_STATE'; payload: Partial<BizTutorState> };

const initialState: BizTutorState = {
  lessons: seedData.lessons,
  questions: seedData.questions,
  cases: seedData.cases,
  flashcards: [],
  attemptLogs: [],
  chatMessages: [],
  progress: {},
  currentTab: 'Chat'
};

function bizTutorReducer(state: BizTutorState, action: BizTutorAction): BizTutorState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, currentTab: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'ADD_ATTEMPT_LOG':
      return { ...state, attemptLogs: [...state.attemptLogs, action.payload] };
    case 'UPDATE_FLASHCARD':
      return {
        ...state,
        flashcards: state.flashcards.map(card =>
          card.front === action.payload.id ? { ...card, ...action.payload.updates } : card
        )
      };
    case 'UPDATE_PROGRESS':
      const { topic, correct, timeSec } = action.payload;
      const current = state.progress[topic] || { attempts: 0, correct: 0, timeSec: 0 };
      return {
        ...state,
        progress: {
          ...state.progress,
          [topic]: {
            attempts: current.attempts + 1,
            correct: current.correct + (correct ? 1 : 0),
            timeSec: current.timeSec + timeSec
          }
        }
      };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const BizTutorContext = createContext<BizTutorContextType | undefined>(undefined);

export const useBizTutor = () => {
  const context = useContext(BizTutorContext);
  if (!context) {
    throw new Error('useBizTutor must be used within a BizTutorProvider');
  }
  return context;
};

export const BizTutorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bizTutorReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('biztutor-state');
      if (saved) {
        const parsedState = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Failed to load saved state:', error);
    }
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem('biztutor-state', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, [state]);

  const setCurrentTab = (tab: string) => {
    dispatch({ type: 'SET_TAB', payload: tab });
  };

  const addChatMessage = (message: ChatMessage) => {
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message });
  };

  const addAttemptLog = (log: AttemptLog) => {
    dispatch({ type: 'ADD_ATTEMPT_LOG', payload: log });
  };

  const updateFlashcard = (cardId: string, updates: Partial<Flashcard>) => {
    dispatch({ type: 'UPDATE_FLASHCARD', payload: { id: cardId, updates } });
  };

  const updateProgress = (topic: string, correct: boolean, timeSec: number) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: { topic, correct, timeSec } });
  };

  const contextValue: BizTutorContextType = {
    ...state,
    dispatch,
    setCurrentTab,
    addChatMessage,
    addAttemptLog,
    updateFlashcard,
    updateProgress
  };

  return (
    <BizTutorContext.Provider value={contextValue}>
      {children}
    </BizTutorContext.Provider>
  );
};