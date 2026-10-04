import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, ShieldCheck, CheckCircle2, Clock, Info } from 'lucide-react';

export const CommissionPage: React.FC = () => {
  const {
    userCommissions,
    commissionRules,
    currentUser,
    userLevels,
    userWallet,
  } = useApp();

  const userLevel = currentUser?.level || 1;
  const currentTier = userLevels.find((l) => l.level === userLevel);

  const totalCredited = userCommissions
    .filter((c) => c.status === 'credited')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const totalPending = userCommissions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Partner Commission Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Transparent, formulaic distribution rules based strictly on verified merchandise order delivery
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Legitimate Commercial Sales Model</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Cumulative Credited</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            PKR {(userWallet?.totalCommission ?? 0).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Written to available balance ledger</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Pending Delivery Release</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-800 font-mono tabular-nums">
            PKR {(totalPending ?? 0).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Fulfillment validation in progress</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Current Tier Base Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {currentTier?.commissionRatePercent}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Tier {userLevel} ({currentTier?.name})</p>
        </div>
      </div>

      {/* Explanatory Rule Box */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Commission Calculation Specification</span>
        </div>
        <p className="leading-relaxed">
          The eBuy-Partner platform calculates commissions deterministically using the following formula:
          <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-900 font-semibold ml-1">
            Reward = Order Line Item Value × Max(Product Base %, Category Incentive %, Partner Tier %)
          </span>
          . All rewards require delivery receipt validation before funds are formally added to your available ledger.
        </p>
      </div>

      {/* Active System Commission Rules */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Active Platform Commission Schedule</h3>
          <p className="text-xs text-slate-500 mt-0.5">Rules configured by platform administration</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Rule Name & Code</th>
                <th className="px-6 py-3.5">Classification</th>
                <th className="px-6 py-3.5">Target Scope</th>
                <th className="px-6 py-3.5">Reward Value</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {commissionRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                    {rule.name}
                    <span className="block text-[11px] text-slate-400 font-normal">
                      {rule.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 capitalize text-slate-700">
                    {rule.type.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {rule.targetCategory || (rule.targetLevel ? `Tier Level ${rule.targetLevel}` : 'Universal')}
                  </td>
                  <td className="px-6 py-4 font-bold font-mono text-emerald-700 tabular-nums">
                    +{rule.value}%
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[11px] font-semibold ${
                        rule.isActive ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {rule.isActive ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs leading-relaxed">
                    {rule.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Commission Records Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Your Commission Records</h3>
          <p className="text-xs text-slate-500 mt-0.5">Itemized rewards linked to verified orders</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Record ID</th>
                <th className="px-6 py-3.5">Merchandise Item</th>
                <th className="px-6 py-3.5">Order ID</th>
                <th className="px-6 py-3.5">Order Amount</th>
                <th className="px-6 py-3.5">Applied Rate</th>
                <th className="px-6 py-3.5">Reward Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date Credited</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userCommissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    No commission records found for this account.
                  </td>
                </tr>
              ) : (
                userCommissions.map((rec) => {
                  const isCredited = rec.status === 'credited';
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                        {rec.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {rec.productName}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600">
                        {rec.orderId}
                      </td>
                      <td className="px-6 py-4 font-mono tabular-nums text-slate-700">
                        PKR {(rec.orderAmount ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-mono tabular-nums text-indigo-700 font-semibold">
                        {rec.commissionRate}%
                      </td>
                      <td className="px-6 py-4 font-bold font-mono tabular-nums text-emerald-700">
                        +PKR {(rec.commissionAmount ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCredited ? 'bg-emerald-600' : 'bg-amber-600'
                            }`}
                          />
                          <span className="capitalize font-medium text-slate-700">
                            {rec.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono tabular-nums text-slate-500">
                        {rec.creditedAt || 'Pending Delivery'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
