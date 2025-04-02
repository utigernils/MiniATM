import React, { useState } from 'react';
import { PlusCircle, CreditCard } from 'lucide-react';
import { Account } from '../types';
import { addAccount, getAccounts } from '../utils/storage';

interface Props {
  onSelectAccount: (account: Account) => void;
}

export default function AccountList({ onSelectAccount }: Props) {
  const [accounts, setAccounts] = useState<Account[]>(getAccounts());
  const [showNewAccount, setShowNewAccount] = useState(false);
  const [newAccountData, setNewAccountData] = useState({ name: '', pin: '' });

  const handleCreateAccount = () => {
    const account: Account = {
      id: crypto.randomUUID(),
      name: newAccountData.name,
      pin: newAccountData.pin,
      balance: 0,
      transactions: []
    };
    addAccount(account);
    setAccounts(getAccounts());
    setShowNewAccount(false);
    setNewAccountData({ name: '', pin: '' });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-400 mb-8">ATM Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <button
            key={account.id}
            onClick={() => onSelectAccount(account)}
            className="p-6 rounded-xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 hover:bg-slate-700/50 transition-all"
          >
            <CreditCard className="w-8 h-8 text-blue-400 mb-3" />
            <h2 className="text-xl font-semibold text-white mb-2">{account.name}</h2>
            <p className="text-slate-400">Click to access</p>
          </button>
        ))}
        
        <button
          onClick={() => setShowNewAccount(true)}
          className="p-6 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-400 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-blue-400"
        >
          <PlusCircle className="w-8 h-8 mb-2" />
          <span>Create New Account</span>
        </button>
      </div>

      {showNewAccount && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-800/90 p-6 rounded-xl border border-slate-700 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Account</h2>
            <input
              type="text"
              placeholder="Account Name"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 mb-3 text-white"
              value={newAccountData.name}
              onChange={(e) => setNewAccountData({ ...newAccountData, name: e.target.value })}
            />
            <input
              type="password"
              placeholder="PIN"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 mb-4 text-white"
              value={newAccountData.pin}
              onChange={(e) => setNewAccountData({ ...newAccountData, pin: e.target.value })}
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreateAccount}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-3 transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={() => setShowNewAccount(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg p-3 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}