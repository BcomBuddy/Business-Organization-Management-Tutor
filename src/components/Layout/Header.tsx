import React from 'react';
import { Moon, Sun, GraduationCap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`px-6 py-4 ${
      isDark ? 'glass' : 'bg-white/80 border-b border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDark 
              ? 'bg-[rgba(255,255,255,0.06)] border border-white/10 shadow-neon-teal animate-float'
              : 'bg-blue-100 border border-blue-200 shadow-glow-blue animate-glow-light'
          }`}>
            <GraduationCap className={`w-5 h-5 ${
              isDark ? 'text-neon-teal' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h1 className={`text-xl font-bold font-poppins ${
              isDark ? 'gradient-text' : 'text-gray-800'
            } ${!isDark ? 'drop-shadow-lg' : ''}`}>Business Organization & Management</h1>
            <p className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>B.Com Buddy • AI Tutor</p>
          </div>
        </div>
        
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            isDark 
              ? 'bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] border border-white/10'
              : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber" />
          ) : (
            <Moon className="w-5 h-5 text-blue-600" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;