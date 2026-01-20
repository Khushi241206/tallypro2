import { Transaction, Product, Party } from '../types';

/* =========================
   PARTIES
========================= */

export const parties: Party[] = [
  {
    id: 'p1',
    name: 'Ramesh Traders',
    phone: '9876543210',
    type: 'CUSTOMER',
    balance: 12500
  },
  {
    id: 'p2',
    name: 'Suresh Suppliers',
    phone: '9123456789',
    type: 'SUPPLIER',
    balance: -8200
  },
  {
    id: 'p3',
    name: 'Walk-in Customer',
    phone: '',
    type: 'CUSTOMER',
    balance: 0
  }
];

/* =========================
   PRODUCTS / STOCK
========================= */

export const products: Product[] = [
  {
    id: 'pr1',
    name: 'Notebook A4',
    sku: 'NB-A4-001',
    unit: 'units',
    quantity: 120,
    lowStockLevel: 20,
    purchasePrice: 35,
    salePrice: 50
  },
  {
    id: 'pr2',
    name: 'Ball Pen Blue',
    sku: 'BP-BL-010',
    unit: 'units',
    quantity: 15,
    lowStockLevel: 25,
    purchasePrice: 5,
    salePrice: 10
  },
  {
    id: 'pr3',
    name: 'Printer Paper (500)',
    sku: 'PP-500',
    unit: 'units',
    quantity: 60,
    lowStockLevel: 10,
    purchasePrice: 220,
    salePrice: 280
  }
];

/* =========================
   TRANSACTIONS / LEDGER
========================= */

export const transactions: Transaction[] = [
  {
    id: 't1',
    type: 'CREDIT',
    amount: 4500,
    date: '2025-01-05',
    category: 'Sales',
    partyId: 'p1',
    description: 'Notebook sale'
  },
  {
    id: 't2',
    type: 'DEBIT',
    amount: 2200,
    date: '2025-01-07',
    category: 'Purchase',
    partyId: 'p2',
    description: 'Stationery purchase'
  },
  {
    id: 't3',
    type: 'DEBIT',
    amount: 1500,
    date: '2025-01-10',
    category: 'Rent',
    partyId: '',
    description: 'Shop rent'
  },
  {
    id: 't4',
    type: 'CREDIT',
    amount: 3200,
    date: '2025-01-12',
    category: 'Sales',
    partyId: 'p3',
    description: 'Walk-in sale'
  },
  {
    id: 't5',
    type: 'DEBIT',
    amount: 800,
    date: '2025-01-15',
    category: 'Electricity',
    partyId: '',
    description: 'Electric bill'
  }
];
