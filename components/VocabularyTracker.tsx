"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, X, Trash2, Download } from 'lucide-react';

export type VocabWord = {
  id: string;
  word: string;
  translation?: string;
  timestamp: number;
};

interface VocabularyTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  words: VocabWord[];
  onRemoveWord: (id: string) => void;
  onClearAll: () => void;
}

const VocabularyTracker = ({ isOpen, onClose, words, onRemoveWord, onClearAll }: VocabularyTrackerProps) => {
  if (!isOpen) return null;

  const exportVocab = () => {
    if (words.length === 0) return;
    const content = words.map(w => `${w.word}${w.translation ? ` - ${w.translation}` : ''}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.body.appendChild(document.createElement('a'));
    a.href = url;
    a.download = `vocabulary-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <div className="fixed right-4 bottom-20 bg-gray-900 border border-gray-700 text-white rounded-xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden z-50 transition-all">
      <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-800">
        <h3 className="font-medium flex items-center gap-2">
          <Bookmark size={16} className="text-emerald-500" />
          Vocabulary Tracker
          <span className="bg-emerald-600/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">
            {words.length} Words
          </span>
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full hover:bg-gray-700 text-gray-300">
          <X size={16} />
        </Button>
      </div>

      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3">
        {words.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-70">
            <Bookmark size={32} className="mb-2 opacity-50 text-emerald-500" />
            <p className="text-center text-sm">No words saved yet</p>
            <p className="text-center text-xs mt-1 text-gray-500">Tap the bookmark icon in the transcript to save new words.</p>
          </div>
        ) : (
          words.map(word => (
            <div key={word.id} className="bg-gray-800 border border-gray-700 p-3 rounded-lg group relative hover:border-emerald-500/50 transition-colors">
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <span className="font-bold text-emerald-400">{word.word}</span>
                  {word.translation && <span className="text-xs text-gray-400 italic mt-1">{word.translation}</span>}
                </div>
                <button 
                  onClick={() => onRemoveWord(word.id)}
                  className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-700 bg-gray-800 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 h-9 border-gray-600 text-gray-300 hover:bg-gray-700" 
          onClick={onClearAll}
          disabled={words.length === 0}
        >
          Clear All
        </Button>
        <Button 
          size="sm" 
          className="flex-1 h-9 bg-emerald-700 hover:bg-emerald-600 text-white" 
          onClick={exportVocab}
          disabled={words.length === 0}
        >
          <Download size={14} className="mr-1.5" /> Export
        </Button>
      </div>
    </div>
  );
};

export default VocabularyTracker;
