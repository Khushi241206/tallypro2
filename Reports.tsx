import React, { useState, useMemo } from 'react';
import { Transaction, Party, Product } from '../types';
import { formatCurrency, downloadAsCSV } from '../constants';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  Download,
  PieChart,
  Calendar,
  Users,
  X
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface ReportsProps {
  transactions: Transaction[];
  parties: Party[];
  products: Product[];
  theme: 'light' | 'dark';
}

export const Reports: React.FC<ReportsProps> = ({
  transactions = [],
  parties = [],
  products = [],
  theme
}) => {
  const isDark = theme === 'dark';
  const [showForecast, setShowForecast] = useState(false);

  const safeAmount = (v: number) => (v === 0 ? '—' : formatCurrency(v));

  /* ================= TOTALS ================= */

  const grossSales = useMemo(
    () => transactions.filter(t => t.type === 'CREDIT').reduce((a, b) => a + b.amount, 0),
    [transactions]
  );

  const expenses = useMemo(
    () => transactions.filter(t => t.type === 'DEBIT').reduce((a, b) => a + b.amount, 0),
    [transactions]
  );

  const netEarnings = grossSales - expenses;

  const inventoryValue = useMemo(
    () => products.reduce((a, b) => a + b.quantity * b.purchasePrice, 0),
    [products]
  );

  /* ================= PARTY PERFORMANCE ================= */

  const revenueByParty = useMemo(() => {
    return parties.map(p => ({
      name: p.name,
      amount: transactions
        .filter(t => t.partyId === p.id && t.type === 'CREDIT')
        .reduce((a, b) => a + b.amount, 0)
    })).filter(p => p.amount > 0);
  }, [parties, transactions]);

  /* ================= INVENTORY MIX ================= */

  const topProducts = useMemo(() => {
    return [...products]
      .map(p => ({ ...p, value: p.salePrice * p.quantity }))
      .filter(p => p.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [products]);

  /* ================= EXPORT ================= */

  const handleExportCSV = () => {
    downloadAsCSV(
      [
        { Metric: 'Gross Sales', Value: grossSales },
        { Metric: 'Net Earnings', Value: netEarnings },
        { Metric: 'Total Expenses', Value: expenses },
        { Metric: 'Inventory Value', Value: inventoryValue }
      ],
      'tallypro_report'
    );
  };

  /* ================= FORECAST ================= */

  const forecastData = [
    { month: 'Jun', projected: 45000 },
    { month: 'Jul', projected: 53000 },
    { month: 'Aug', projected: 58000 },
    { month: 'Sep', projected: 64000 },
    { month: 'Oct', projected: 72000 },
    { month: 'Nov', projected: 85000 },
    { month: 'Dec', projected: 98000 }
  ];

  return (
    <div className="space-y-10 pb-20">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black">Financial Reports</h2>
          <p className="text-xs text-gray-500 font-bold uppercase">Ledger-based Analytics</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-2"
        >
          <Download size={18} /> EXPORT CSV
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Gross Sales" icon={<BarChart3 />} value={safeAmount(grossSales)} />
        <StatCard title="Net Earnings" icon={<TrendingUp />} value={safeAmount(netEarnings)} />
        <StatCard title="Expenses" icon={<TrendingDown />} value={safeAmount(expenses)} />
        <StatCard title="Inventory Value" icon={<Package />} value={safeAmount(inventoryValue)} />
      </div>

      {/* PARTY PERFORMANCE */}
      <Section title="Top Parties" icon={<Users />}>
        {revenueByParty.length === 0 ? (
          <Empty text="No party transactions yet" />
        ) : (
          revenueByParty.map(p => (
            <Row key={p.name} label={p.name} value={formatCurrency(p.amount)} />
          ))
        )}
      </Section>

      {/* INVENTORY MIX */}
      <Section title="Inventory Mix" icon={<PieChart />}>
        {topProducts.length === 0 ? (
          <Empty text="No stock movement yet" />
        ) : (
          topProducts.map(p => (
            <Row key={p.id} label={p.name} value={formatCurrency(p.value)} />
          ))
        )}
      </Section>

      {/* FORECAST */}
      <div className="text-center">
        <button
          onClick={() => setShowForecast(true)}
          className="px-10 py-4 bg-blue-600 text-white rounded-3xl font-black"
        >
          SHOW FORECAST
        </button>
      </div>

      {showForecast && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full relative">
            <button onClick={() => setShowForecast(false)} className="absolute top-6 right-6">
              <X />
            </button>

            <h3 className="text-2xl font-black mb-6">2026 Growth Forecast</h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="projected" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= REUSABLE UI ================= */

const StatCard = ({ title, icon, value }: any) => (
  <div className="p-6 rounded-3xl border bg-white">
    <div className="flex items-center gap-3 text-blue-500 mb-2">
      {icon}
      <span className="text-xs font-bold uppercase">{title}</span>
    </div>
    <p className="text-2xl font-black">{value}</p>
  </div>
);

const Section = ({ title, icon, children }: any) => (
  <div className="p-6 rounded-3xl border bg-white space-y-4">
    <div className="flex items-center gap-3 font-black">
      {icon} {title}
    </div>
    {children}
  </div>
);

const Row = ({ label, value }: any) => (
  <div className="flex justify-between font-bold">
    <span>{label}</span>
    <span className="text-blue-600">{value}</span>
  </div>
);

const Empty = ({ text }: any) => (
  <p className="text-gray-400 text-sm font-bold text-center py-6">{text}</p>
);
