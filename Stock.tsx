import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../constants';
import {
  Package,
  Search,
  Plus,
  AlertTriangle,
  MoreHorizontal,
  X
} from 'lucide-react';

interface StockProps {
  products: Product[];
  onAddProduct: (p: Omit<Product, 'id'>) => void;
  theme: 'light' | 'dark';
}

export const Stock: React.FC<StockProps> = ({ products, onAddProduct, theme }) => {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    sku: '',
    unit: 'units',
    quantity: 0,
    lowStockLevel: 5,
    purchasePrice: 0,
    salePrice: 0
  });

  const displayValue = (v: number) => (v === 0 ? '–' : v);

  const filtered = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct(formData);
    setShowModal(false);
    setFormData({
      name: '',
      sku: '',
      unit: 'units',
      quantity: 0,
      lowStockLevel: 5,
      purchasePrice: 0,
      salePrice: 0
    });
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search stock by name or SKU..."
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border ${
              isDark ? 'bg-[#1e1e2d] border-gray-800 text-white' : 'bg-white border-gray-200'
            }`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* STOCK TABLE */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-100'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} text-xs uppercase font-bold text-gray-500`}>
              <tr>
                <th className="px-6 py-4 text-left">Item</th>
                <th className="px-6 py-4 text-center">Qty</th>
                <th className="px-6 py-4 text-center">Unit</th>
                <th className="px-6 py-4 text-center">Low</th>
                <th className="px-6 py-4 text-right">Purchase</th>
                <th className="px-6 py-4 text-right">Sale</th>
                <th className="px-6 py-4 text-right">Stock Value</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map(item => {
                  const isLow = item.quantity <= item.lowStockLevel;
                  const stockValue = item.quantity * item.purchasePrice;

                  return (
                    <tr
                      key={item.id}
                      className={`${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'} transition`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isLow ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            <Package size={16} />
                          </div>
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                          </div>
                        </div>
                      </td>

                      <td className={`px-6 py-4 text-center font-black ${
                        isLow ? 'text-amber-500' : ''
                      }`}>
                        {displayValue(item.quantity)}
                      </td>

                      <td className="px-6 py-4 text-center text-xs font-bold text-gray-500 capitalize">
                        {item.unit}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {isLow ? (
                          <span className="flex justify-center items-center text-amber-500 text-xs font-bold">
                            <AlertTriangle size={14} className="mr-1" /> YES
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">NO</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right font-bold">
                        {item.purchasePrice === 0 ? '–' : formatCurrency(item.purchasePrice)}
                      </td>

                      <td className="px-6 py-4 text-right font-bold">
                        {item.salePrice === 0 ? '–' : formatCurrency(item.salePrice)}
                      </td>

                      <td className="px-6 py-4 text-right font-black">
                        {stockValue === 0 ? '–' : formatCurrency(stockValue)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg hover:bg-gray-500/10 text-gray-500">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PRODUCT MODAL (UNCHANGED LOGIC) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white'} w-full max-w-lg rounded-[2.5rem] border p-8 shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Add New Product</h3>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Product Name" className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <input required placeholder="SKU" className="input" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
              <input type="number" placeholder="Opening Qty" className="input" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: +e.target.value })} />
              <input type="number" placeholder="Low Stock Level" className="input" value={formData.lowStockLevel} onChange={e => setFormData({ ...formData, lowStockLevel: +e.target.value })} />
              <input type="number" placeholder="Purchase Price" className="input" value={formData.purchasePrice} onChange={e => setFormData({ ...formData, purchasePrice: +e.target.value })} />
              <input type="number" placeholder="Sale Price" className="input" value={formData.salePrice} onChange={e => setFormData({ ...formData, salePrice: +e.target.value })} />

              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black">
                SAVE PRODUCT
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
