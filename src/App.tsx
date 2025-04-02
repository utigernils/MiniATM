import React, { useState } from 'react';
import { Account } from './types';
import AccountList from './components/AccountList';
import PinPad from './components/PinPad';
import Dashboard from './components/Dashboard';

function App() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setSelectedAccount(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      {!selectedAccount && (
        <AccountList onSelectAccount={setSelectedAccount} />
      )}
      {selectedAccount && !isAuthenticated && (
        <PinPad
          account={selectedAccount}
          onSuccess={() => setIsAuthenticated(true)}
          onBack={() => setSelectedAccount(null)}
        />
      )}
      {selectedAccount && isAuthenticated && (
        <Dashboard
          account={selectedAccount}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;