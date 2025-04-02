import React, { useState } from 'react';
import { PlusCircle, CreditCard, QrCode, Scan } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Account } from '../types';
import { addAccount, getAccounts } from '../utils/storage';
import { NotificationContainer } from './ui/Notification';
import { addNotification, Notification } from '../utils/notifications';
interface Props {
  onSelectAccount: (account: Account) => void;
}

export default function AccountList({ onSelectAccount }: Props) {
  const [accounts, setAccounts] = useState<Account[]>(getAccounts());
  const [showNewAccount, setShowNewAccount] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [newAccountData, setNewAccountData] = useState({ name: '', pin: '' });

  const handleCreateAccount = () => {
    if (!newAccountData.name.trim() || !newAccountData.pin.trim()) {
      addNotification('Name and PIN cannot be empty', 'error');
      return;
    }

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

  React.useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    
    if (showScanner) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      
      scanner.render((decodedText) => {
        console.log('Decoded Text:', decodedText);
        const account = accounts.find(acc => acc.id === decodedText);
        if (account !== undefined) {
          setShowScanner(false);
          scanner?.clear();
          onSelectAccount(account);
        } else {
          setShowScanner(false);
          addNotification('Invalid QR Code', 'error');
        }
      }, () => {});
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [showScanner, accounts, onSelectAccount]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
     <NotificationContainer />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-400">MiniAtm</h1>
        <button
          onClick={() => setShowScanner(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          <Scan className="w-5 h-5" />
          <span>Scan QR Code</span>
        </button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="p-6 rounded-xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 hover:bg-slate-700/50 transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <CreditCard className="w-8 h-8 text-blue-400" />
              <h2 className="text-xl font-semibold text-white mb-2">{account.name}</h2>
            </div>
            <button
              onClick={() => onSelectAccount(account)}
              className="w-full mt-2 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors"
            >
              Access Account
            </button>
          </div>
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
              onChange={(e) => {
              var pin = e.target.value;
              if (/^\d{0,4}$/.test(pin)) {
                setNewAccountData({ ...newAccountData, pin });
              } else {
                console.log('PIN must be a 4-digit number');
                addNotification('PIN must be a 4-digit number', 'error');
              }
              }}
            />
            <NotificationContainer />
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

      {showScanner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-800/90 p-6 rounded-xl border border-slate-700 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Scan Account QR Code</h2>
            <div id="qr-reader" className="overflow-hidden rounded-lg mb-4" />
            <button
              onClick={() => setShowScanner(false)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-lg p-3 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}