import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, Clock
} from 'lucide-react';
import { Transaction, Product, Party } from '../types';
import { formatCurrency } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
  products: Product[];
  parties: Party[];
  theme: 'light' | 'dark';
  onViewAll?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  transactions = [],
  products = [],
  parties = [],
  theme,
  onViewAll
}) => {
  const isDark = theme === 'dark';

  const safeAmount = (v: number) => (v === 0 ? '—' : formatCurrency(v));

  /* ================= KPI STATS ================= */

  const stats = useMemo(() => {
    const cashIn = transactions
      .filter(t => t.type === 'CREDIT')
      .reduce((a, b) => a + b.amount, 0);

    const cashOut = transactions
      .filter(t => t.type === 'DEBIT')
      .reduce((a, b) => a + b.amount, 0);

    const balance = cashIn - cashOut;

    const lowStockCount = products.filter(
      p => p.quantity <= p.lowStockLevel
    ).length;

    return { cashIn, cashOut, balance, lowStockCount };
  }, [transactions, products]);

  /* ================= MONTHLY CHART ================= */

  const monthlyData = useMemo(() => {
    const map: any = {};

    transactions.forEach(tx => {
      const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
      if (!map[month]) map[month] = { name: month, revenue: 0, expenses: 0 };
      tx.type === 'CREDIT'
        ? (map[month].revenue += tx.amount)
        : (map[month].expenses += tx.amount);
    });

    return Object.values(map);
  }, [transactions]);

  /* ================= EXPENSE PIE ================= */

  const expenseData = useMemo(() => {
    const map: any = {};

    transactions
      .filter(t => t.type === 'DEBIT')
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  /* ================= CARD ================= */

  const Card = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className={`${isDark ? 'bg-[#1e1e2d]' : 'bg-white'} p-6 rounded-2xl border shadow-sm`}>
      <div className="flex justify-between mb-3">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon size={22} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-bold flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-black">{value}</h3>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Cash In" value={safeAmount(stats.cashIn)} icon={TrendingUp} color="text-green-500" />
        <Card title="Cash Out" value={safeAmount(stats.cashOut)} icon={TrendingDown} color="text-red-500" />
        <Card title="Balance" value={safeAmount(stats.balance)} icon={Wallet} color="text-blue-500" />
        <Card title="Low Stock" value={stats.lowStockCount || '—'} icon={Clock} color="text-amber-500" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* MONTHLY */}
        <div className={`${isDark ? 'bg-[#1e1e2d]' : 'bg-white'} p-6 rounded-2xl border`}>
          <h3 className="font-bold mb-4">Monthly Performance</h3>

          {monthlyData.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No transaction data</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                  <Bar dataKey="expenses" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* EXPENSE PIE */}
        <div className={`${isDark ? 'bg-[#1e1e2d]' : 'bg-white'} p-6 rounded-2xl border`}>
          <h3 className="font-bold mb-4">Expense Distribution</h3>

          {expenseData.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No expense data</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseData} dataKey="value" innerRadius={60} outerRadius={90}>
                    {expenseData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* RECENT */}
      <div className={`${isDark ? 'bg-[#1e1e2d]' : 'bg-white'} rounded-2xl border`}>
        <div className="p-6 flex justify-between">
          <h3 className="font-bold">Recent Activity</h3>
          <button onClick={onViewAll} className="text-blue-500 text-sm">View All</button>
        </div>

        {transactions.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No recent transactions</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {transactions.slice(0, 5).map(tx => (
                <tr key={tx.id} className="border-t">
                  <td className="px-6 py-4">{tx.category}</td>
                  <td className="px-6 py-4">
                    {parties.find(p => p.id === tx.partyId)?.name || 'Walk-in'}
                  </td>
                  <td className="px-6 py-4">{tx.date}</td>
                  <td className={`px-6 py-4 font-bold ${tx.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};
