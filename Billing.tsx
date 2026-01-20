import React, { useState, useRef } from "react";
import { Party, TransactionType } from "../types";
import { formatCurrency } from "../constants";
import {
  Plus,
  User,
  Calendar,
  Tag,
  CreditCard,
  Upload,
  Send,
  FileCheck,
} from "lucide-react";
import { parties as dummyParties } from "../data/dummyData";

interface BillingProps {
  parties: Party[];
  onAddTransaction: (t: any) => void;
  theme: "light" | "dark";
}

export const Billing: React.FC<BillingProps> = ({
  parties,
  onAddTransaction,
  theme,
}) => {
  const isDark = theme === "dark";
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 FALLBACK TO DUMMY DATA
  const safeParties = parties.length > 0 ? parties : dummyParties;

  const [type, setType] = useState<TransactionType>("CREDIT");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    partyId: "",
    amount: "",
    category: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.partyId || !formData.amount) return;

    onAddTransaction({
      ...formData,
      type,
      amount: parseFloat(formData.amount),
      billUrl: selectedFile
        ? URL.createObjectURL(selectedFile)
        : undefined,
    });

    setFormData({
      partyId: "",
      amount: "",
      category: "",
      note: "",
      date: new Date().toISOString().split("T")[0],
    });
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* TYPE SWITCH */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setType("CREDIT")}
          className={`py-4 rounded-2xl font-black text-lg border-2 ${
            type === "CREDIT"
              ? "bg-green-500 text-white border-green-500 shadow-xl shadow-green-500/30"
              : isDark
              ? "bg-[#1e1e2d] border-gray-800 text-gray-500"
              : "bg-white border-gray-100 text-gray-400"
          }`}
        >
          CASH IN
        </button>

        <button
          onClick={() => setType("DEBIT")}
          className={`py-4 rounded-2xl font-black text-lg border-2 ${
            type === "DEBIT"
              ? "bg-red-500 text-white border-red-500 shadow-xl shadow-red-500/30"
              : isDark
              ? "bg-[#1e1e2d] border-gray-800 text-gray-500"
              : "bg-white border-gray-100 text-gray-400"
          }`}
        >
          CASH OUT
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-[2rem] border space-y-6 ${
          isDark
            ? "bg-[#1e1e2d] border-gray-800"
            : "bg-white border-gray-100"
        }`}
      >
        {/* PARTY + AMOUNT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
              <User size={14} className="mr-2" /> Select Party
            </label>
            <select
              required
              className={`w-full p-4 rounded-2xl border ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-200"
              }`}
              value={formData.partyId}
              onChange={(e) =>
                setFormData({ ...formData, partyId: e.target.value })
              }
            >
              <option value="">Choose a party...</option>
              {safeParties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Bal: {formatCurrency(p.balance)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
              <CreditCard size={14} className="mr-2" /> Amount (₹)
            </label>
            <input
              required
              type="number"
              className={`w-full p-4 rounded-2xl border text-2xl font-black ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-200"
              }`}
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>
        </div>

        {/* DATE + CATEGORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="date"
            className={`p-4 rounded-2xl border ${
              isDark
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-gray-50 border-gray-200"
            }`}
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Category (Sales, Rent...)"
            className={`p-4 rounded-2xl border ${
              isDark
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-gray-50 border-gray-200"
            }`}
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
        </div>

        {/* NOTES */}
        <textarea
          rows={3}
          placeholder="Additional notes..."
          className={`w-full p-4 rounded-2xl border ${
            isDark
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-gray-50 border-gray-200"
          }`}
          value={formData.note}
          onChange={(e) =>
            setFormData({ ...formData, note: e.target.value })
          }
        />

        {/* FILE + SUBMIT */}
        <div className="flex gap-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 p-4 rounded-2xl border border-dashed ${
              selectedFile
                ? "border-green-500 text-green-500"
                : isDark
                ? "border-gray-700 text-gray-400"
                : "border-gray-300 text-gray-500"
            }`}
          >
            {selectedFile ? <FileCheck /> : <Upload />}
            <span className="ml-2">
              {selectedFile ? selectedFile.name : "Attach Bill"}
            </span>
          </button>

          <button
            type="submit"
            className="flex-[2] p-4 rounded-2xl bg-blue-600 text-white font-black"
          >
            <Send className="inline mr-2" /> SAVE TRANSACTION
          </button>
        </div>
      </form>
    </div>
  );
};
