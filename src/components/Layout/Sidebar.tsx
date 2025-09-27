import React from 'react';
import {
  Home,
  BookOpen,
  PenTool,
  Briefcase,
  MessageCircle,
  Brain,
} from 'lucide-react';
import { useBizTutor } from '../../contexts/BizTutorContext';
import { useTheme } from '../../contexts/ThemeContext';

const navItems = [
  { id: 'Chat', label: 'Chat', icon: MessageCircle, accent: 'from-pastel-green to-pastel-blue' },
  { id: 'Dashboard', label: 'Dashboard', icon: Home, accent: 'from-pastel-blue to-pastel-purple' },
  { id: 'Learn', label: 'Learn', icon: BookOpen, accent: 'from-pastel-orange to-pastel-yellow' },
  { id: 'Practice', label: 'Practice', icon: PenTool, accent: 'from-pastel-pink to-pastel-orange' },
  { id: 'CaseLab', label: 'CaseLab', icon: Briefcase, accent: 'from-pastel-purple to-pastel-blue' },
  { id: 'Flashcards', label: 'Flashcards', icon: Brain, accent: 'from-pastel-green to-pastel-yellow' },
];

const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab } = useBizTutor();
  const { isDark } = useTheme();

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-4">
        <div className={`p-3 rounded-xl ${
          isDark ? 'glass' : 'bg-white/60 border border-gray-200'
        }`}>
          <p className={`text-sm font-medium font-poppins ${
            isDark ? 'gradient-text' : 'text-gray-800'
          } ${!isDark ? 'drop-shadow-md' : ''}`}>AI Tutor</p>
          <p className={`text-xs ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>Interactive learning suite</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-6">
        <ul className="space-y-1">
          {navItems.map(({ id, label, icon: Icon, accent }) => {
            const active = currentTab === id;
            return (
              <li key={id}>
                <button
                  onClick={() => setCurrentTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                    isDark ? 'glass' : 'bg-white/40 border border-gray-200'
                  } ${
                    active
                      ? isDark ? 'shadow-neon-teal' : 'bg-blue-50 border-blue-200 shadow-glow-blue-soft animate-glow-light'
                      : isDark ? 'hover:shadow-neon-lime' : 'hover:bg-gray-50 hover:shadow-glow-soft'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-md flex items-center justify-center ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.06)] border border-white/10' 
                      : active 
                        ? 'bg-blue-100 border border-blue-300 shadow-glow-blue'
                        : 'bg-gray-100 border border-gray-200'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      isDark ? 'text-neon-teal' : active ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </span>
                  <span className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 pb-4">
        <div className={`rounded-lg p-3 ${
          isDark ? 'glass' : 'bg-white/60 border border-gray-200'
        }`}>
          <p className={`text-xs ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>Tip: Start in Chat to get personalized guidance.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;







