import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Daybook } from './components/Daybook';
import { Reports } from './components/Reports';
// import { Ledger } from './components/Ledger';
// import { Stock } from './components/Stock';

import { transactions, products, parties } from './data/dummyData';

type Page = 'dashboard' | 'daybook' | 'reports';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [page, setPage] = useState<Page>('dashboard');

  return (
    <div className={theme === 'dark' ? 'dark bg-[#121212] min-h-screen' : 'bg-gray-50 min-h-screen'}>
      
      {/* ===== Header ===== */}
      <header className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-800">
        <h1 className="text-xl font-black text-blue-600">TallyPro</h1>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>

          <nav className="flex space-x-2">
            <button onClick={() => setPage('dashboard')} className="nav-btn">Dashboard</button>
            <button onClick={() => setPage('daybook')} className="nav-btn">Daybook</button>
            <button onClick={() => setPage('reports')} className="nav-btn">Reports</button>
          </nav>
        </div>
      </header>

      {/* ===== Page Content ===== */}
      <main className="p-6">
        {page === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            products={products}
            parties={parties}
            theme={theme}
            onViewAll={() => setPage('daybook')}
          />
        )}

        {page === 'daybook' && (
          <Daybook
            transactions={transactions}
            parties={parties}
            theme={theme}
          />
        )}

        {page === 'reports' && (
          <Reports
            transactions={transactions}
            parties={parties}
            products={products}
            theme={theme}
          />
        )}
      </main>

      {/* ===== Inline CSS ===== */}
      <style jsx>{`
        .nav-btn {
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          font-weight: 700;
          background: #e5e7eb;
        }
        .dark .nav-btn {
          background: #1f2937;
          color: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default App;
