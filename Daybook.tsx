import React, { useState, useMemo } from 'react';
import { Transaction, Party } from '../types';
import { formatCurrency, formatDate } from '../constants';
import { Search, Calendar } from 'lucide-react';

interface DaybookProps {
  transactions: Transaction[];
  parties: Party[];
  theme: 'light' | 'dark';
}

export const Daybook: React.FC<DaybookProps> = ({ transactions, parties, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const isDark = theme === 'dark';

  /** FILTER + SORT */
  const filtered = useMemo(() => {
    return transactions
      .filter(t => {
        const party = parties.find(p => p.id === t.partyId);
        const matchesSearch =
          t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          party?.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = !dateFilter || t.date.startsWith(dateFilter);
        return matchesSearch && matchesDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions, parties, searchTerm, dateFilter]);

  /** LEDGER CALCULATION */
  let runningBalance = 0;

  const ledgerRows = filtered.map(tx => {
    const credit = tx.type === 'CREDIT' ? tx.amount : 0;
    const debit = tx.type === 'DEBIT' ? tx.amount : 0;
    runningBalance += credit - debit;

    return {
      ...tx,
      credit,
      debit,
      balance: runningBalance
    };
  });

  const displayAmount = (value: number) =>
    value === 0 ? '–' : formatCurrency(value);

  return (
    <div className="space-y-6">

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search party or category..."
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border ${
              isDark ? 'bg-[#1e1e2d] border-gray-800 text-white' : 'bg-white border-gray-200'
            }`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
          isDark ? 'bg-[#1e1e2d] border-gray-800 text-gray-300' : 'bg-white border-gray-200'
        }`}>
          <Calendar size={16} />
          <input
            type="date"
            className="bg-transparent outline-none text-sm"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* LEDGER TABLE */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-100'
      }`}>

        {/* HEADER */}
        <div className="grid grid-cols-6 px-4 py-3 text-xs font-bold uppercase bg-gray-500/10">
          <div>Date</div>
          <div>Party</div>
          <div>Category</div>
          <div className="text-right text-red-500">Debit</div>
          <div className="text-right text-green-500">Credit</div>
          <div className="text-right">Balance</div>
        </div>

        {/* ROWS */}
        {ledgerRows.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          ledgerRows.map(tx => {
            const party = parties.find(p => p.id === tx.partyId);
            return (
              <div
                key={tx.id}
                className={`grid grid-cols-6 px-4 py-3 text-sm border-t ${
                  isDark ? 'border-gray-800 hover:bg-gray-800/30' : 'border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div>{formatDate(tx.date)}</div>
                <div className="font-semibold">{party?.name || 'Self'}</div>
                <div className="text-gray-500">{tx.category}</div>

                <div className="text-right text-red-500">
                  {displayAmount(tx.debit)}
                </div>

                <div className="text-right text-green-500">
                  {displayAmount(tx.credit)}
                </div>

                <div className={`text-right font-bold ${
                  tx.balance >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatCurrency(tx.balance)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
