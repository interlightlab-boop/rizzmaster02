
import React from 'react';
import { Share, PlusSquare, X, ArrowDown } from 'lucide-react';
import { Language } from '../types';

interface InstallGuideProps {
  onClose: () => void;
  language: Language;
}

export const InstallGuide: React.FC<InstallGuideProps> = ({ onClose, language }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (!isIOS) return null;

  // Embedded SVG Icon (Purple Gradient)
  const APP_ICON_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM3YzNhZWQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0ZjQ2ZTUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcng9IjEyOCIgZmlsbD0idXJsKCNhKSIvPjxwYXRoIGQ9Ik0zNTIgMTI4SDE2MGMtMTcuNyAwLTMyIDE0LjMtMzIgMzJ2MTkyYzAgMTcuNyAxNC4zIDMyIDMyIDMyaDU4LjVsNDAuNiA1MC44YzQuNSA1LjYgMTMuMSA1LjYgMTcuNiAwbDQwLjYtNTAuOEgzNTJjMTcuNyAwIDMyLTE0LjMgMzItMzJWMTYwYzAtMTcuNy0xNC4zLTMyLTMyLTMyeiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjMyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMjA4IDIwOGgzMm0zMiAwaDMyIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMzIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border-t border-slate-700 w-full max-w-md p-6 rounded-t-3xl relative shadow-2xl animate-in slide-in-from-bottom-10 duration-500 pb-10">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
        >
            <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center shadow-2xl border border-slate-700 overflow-hidden ring-4 ring-black/50">
                <img 
                    src={APP_ICON_URL} 
                    alt="App Icon" 
                    className="w-full h-full object-cover" 
                />
            </div>

            <h3 className="text-xl font-bold text-white">
                Install App on iPhone
            </h3>
            
            <div className="space-y-4 w-full text-left bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-purple-400 font-bold text-sm shrink-0">1</span>
                    <span className="text-sm text-slate-300 flex items-center gap-1">
                        Tap the <Share className="w-4 h-4 mx-1 text-blue-400" /> <span className="font-bold text-white">Share</span> button
                    </span>
                </div>
                <div className="w-px h-4 bg-slate-700 ml-4"></div>
                <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-purple-400 font-bold text-sm shrink-0">2</span>
                    <span className="text-sm text-slate-300 flex items-center gap-1">
                        Select <PlusSquare className="w-4 h-4 mx-1 text-white" /> <span className="font-bold text-white">Add to Home Screen</span>
                    </span>
                </div>
            </div>
            
            <div className="text-xs text-slate-500 pt-2 flex items-center gap-2 justify-center">
                <ArrowDown className="w-4 h-4 animate-bounce" />
                The Share button is usually at the bottom of Safari
            </div>
        </div>
      </div>
    </div>
  );
};
