import React, { useState, useEffect } from 'react';
import { X, Delete, Check } from 'lucide-react';
import { Account } from '../types';
import { NotificationContainer } from './ui/Notification';
import { addNotification, Notification } from '../utils/notifications';

interface Props {
  account: Account;
  onSuccess: () => void;
  onBack: () => void;
}

export default function PinPad({ account, onSuccess, onBack }: Props) {
  const [pin, setPin] = useState('');

  const handleNumberClick = (number: number) => {
    if (pin.length < 4) {
      setPin(prev => prev + number);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin === account.pin) {
      addNotification('Successfully logged in', 'success');
      onSuccess();
    } else {
      setPin('');
      addNotification('Invalid PIN', 'error');
    }
  };

  // Tastatur-Eingabe behandeln
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9' && pin.length < 4) {
        setPin(prev => prev + e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pin, account.pin]); // Abhängigkeiten hinzufügen

  return (
    <div className="p-8 max-w-md mx-auto">
      <NotificationContainer />
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Enter PIN for {account.name}</h2>
        <button onClick={onBack} className="text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6 mb-6">
        <div className="flex justify-center mb-6">
          {[1,2,3,4].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 mx-2 rounded-full ${
                pin.length > i ? 'bg-blue-400' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1,2,3,4,5,6,7,8,9].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberClick(number)}
              className="bg-slate-700/50 hover:bg-slate-600/50 text-white text-2xl font-bold rounded-lg p-4 transition-colors"
            >
              {number}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg p-4 transition-colors flex items-center justify-center"
          >
            <Delete className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNumberClick(0)}
            className="bg-slate-700/50 hover:bg-slate-600/50 text-white text-2xl font-bold rounded-lg p-4 transition-colors"
          >
            0
          </button>
            <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-4 transition-colors flex items-center justify-center"
            >
            <Check className="w-6 h-6" />
            </button>
        </div>
      </div>
    </div>
  );
}