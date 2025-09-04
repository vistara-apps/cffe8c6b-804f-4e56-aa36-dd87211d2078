'use client';

import { ReactNode } from 'react';
import { Heart, List, Search, Home } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  activeTab?: 'home' | 'lists' | 'saved';
  onTabChange?: (tab: 'home' | 'lists' | 'saved') => void;
}

export function AppShell({ children, activeTab = 'home', onTabChange }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface shadow-sm border-b border-gray-200">
        <div className="container max-w-md mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CL</span>
              </div>
              <h1 className="display text-text-primary">CraveLocal</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200">
        <div className="container max-w-md mx-auto">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => onTabChange?.('home')}
              className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'home'
                  ? 'text-primary bg-blue-50'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Home size={20} />
              <span className="text-xs font-medium">Search</span>
            </button>

            <button
              onClick={() => onTabChange?.('lists')}
              className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'lists'
                  ? 'text-primary bg-blue-50'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <List size={20} />
              <span className="text-xs font-medium">Lists</span>
            </button>

            <button
              onClick={() => onTabChange?.('saved')}
              className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'saved'
                  ? 'text-primary bg-blue-50'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Heart size={20} />
              <span className="text-xs font-medium">Saved</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
