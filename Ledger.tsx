import React, { useState } from "react";
import { Party, Transaction } from "../types";
import { formatCurrency } from "../constants";
import { Plus, Search, ChevronRight } from "lucide-react";
import { ledgerData } from "../data/dummyData";

interface LedgerProps {
  parties: Party[];
  transactions: Transaction[];
  onAddParty: (party: Omit<Party, "id">) => void;
  onUpdateParty: (party: Party) => void;
  onDeleteParty: (id: string) => void;
  theme: "light" | "dark";
}

export const Ledger: React.FC<LedgerProps> = ({
  parties,
  transactions,
  onAddParty,
  onUpdateParty,
  onDeleteParty,
  theme,
}) => {
  const isDark = theme === "dark";

  // 🔥 FALLBACK TO DUMMY DATA
  const safeParties = parties.length > 0 ? parties : ledgerData.parties;
  const safeTransactions =
    transactions.length > 0 ? transactions : ledgerData.transactions;

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    balance: 0,
  });

  const filtered = safeParties.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCr = safeParties.reduce(
    (a, b) => a + (b.balance > 0 ? b.balance : 0),
    0
  );

  const totalDr = safeParties.reduce(
    (a, b) => a + (b.balance < 0 ? Math.abs(b.balance) : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="flex flex-col md:flex-row gap-6">
        <div
          className={`flex-1 p-6 rounded-[2rem] border ${
            isDark
              ? "bg-red-500/10 border-red-500/20"
              : "bg-red-50 border-red-100"
          }`}
        >
          <p className="text-xs font-black uppercase text-red-500">
            Cash Out (To Give)
          </p>
          <h2 className="text-4xl font-black text-red-500">
            {formatCurrency(totalDr)}
          </h2>
        </div>

        <div
          className={`flex-1 p-6 rounded-[2rem] border ${
            isDark
              ? "bg-green-500/10 border-green-500/20"
              : "bg-green-50 border-green-100"
          }`}
        >
          <p className="text-xs font-black uppercase text-green-500">
            Cash In (To Get)
          </p>
          <h2 className="text-4xl font-black text-green-500">
            {formatCurrency(totalCr)}
          </h2>
        </div>
      </div>

      {/* SEARCH + ADD */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search parties..."
            className={`w-full pl-12 pr-6 py-4 rounded-3xl border outline-none ${
              isDark
                ? "bg-[#1e1e2d] border-gray-800 text-white"
                : "bg-white border-gray-200"
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-8 py-4 bg-blue-600 text-white font-black rounded-3xl"
        >
          <Plus /> ADD PARTY
        </button>
      </div>

      {/* LEDGER LIST */}
      <div
        className={`rounded-[2.5rem] border overflow-hidden ${
          isDark ? "bg-[#1e1e2d] border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        {filtered.map((party) => (
          <div
            key={party.id}
            className="p-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/40"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl">
                {party.name.charAt(0)}
              </div>
              <div>
                <h4
                  className={`font-black ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {party.name}
                </h4>
                <p className="text-xs text-gray-500">{party.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p
                  className={`text-xl font-black ${
                    party.balance >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {formatCurrency(Math.abs(party.balance))}
                </p>
                <p className="text-[10px] uppercase font-bold text-gray-500">
                  {party.balance >= 0 ? "To Get" : "To Give"}
                </p>
              </div>
              <ChevronRight />
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md p-8 rounded-[3rem] ${
              isDark ? "bg-[#1e1e2d]" : "bg-white"
            }`}
          >
            <h3 className="text-2xl font-black mb-6">New Party</h3>

            <input
              className="w-full p-4 rounded-xl border mb-4"
              placeholder="Party Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              className="w-full p-4 rounded-xl border mb-4"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full p-4 rounded-xl border mb-6"
              placeholder="Opening Balance"
              value={formData.balance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  balance: Number(e.target.value),
                })
              }
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onAddParty(formData);
                  setShowModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
