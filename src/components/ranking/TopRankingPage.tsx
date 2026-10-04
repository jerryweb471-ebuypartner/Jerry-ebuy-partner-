import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Medal,
  Award,
  Sparkles,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Zap,
} from 'lucide-react';
import { RankingUser } from '../../types';

export const TopRankingPage: React.FC = () => {
  const { rankingUsers, currentUser, currentLevelConfig, formatCurrency } = useApp();
  const [filterCity, setFilterCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cities = ['all', 'New York', 'London', 'Dubai', 'Singapore', 'Sydney', 'Tokyo', 'Toronto', 'Karachi', 'Berlin'];

  const filteredUsers = rankingUsers.filter((user) => {
    const matchesCity = filterCity === 'all' || user.city.toLowerCase() === filterCity.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.levelName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const top3 = rankingUsers.slice(0, 3);

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Live Payout Banner - White + Orange Theme */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-7 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.12)] transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#FFF4ED] rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#F4511E] bg-[#FFF4ED] border border-[#FF8A3D]/30 px-3 py-1 rounded-full uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-[#F4511E]" />
              Official USD ($) Leaderboard
            </span>
            <span className="text-xs font-semibold text-[#666666] bg-gray-100 px-2.5 py-0.5 rounded-full">
              🌐 Verified Payout Ledger
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
            Top Ranking Members & Earnings
          </h1>
          <p className="text-xs text-[#666666] mt-1 max-w-xl leading-relaxed">
            Real-time audit of top-performing members globally. Track total completed product-order tasks, membership levels, and verified Binance / Crypto escrow disbursements in USD ($).
          </p>
        </div>

        {/* User's Current Standing if logged in */}
        {currentUser && (
          <div className="bg-[#FFF8F4] border border-[#FF8A3D]/40 p-4 rounded-xl shrink-0 relative z-10 shadow-2xs">
            <span className="text-[11px] font-bold text-[#E5390B] uppercase tracking-wider block">
              Your Current Status
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-black text-[#171717]">{currentUser.name}</span>
              <span className="text-xs font-bold text-[#F4511E] bg-[#FFF4ED] px-2 py-0.5 rounded-md border border-[#FF8A3D]/30">
                Level {currentUser.level} ({currentLevelConfig?.name})
              </span>
            </div>
            <span className="text-[11px] text-[#666666] mt-1 block">
              Execute daily tasks & upgrade plans to climb higher!
            </span>
          </div>
        )}
      </div>

      {/* TOP 3 PODIUM DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.16)] transition-all duration-300 flex flex-col justify-between order-2 md:order-1 relative overflow-hidden group">
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 text-[#171717] flex items-center justify-center font-black text-sm border border-slate-200 shadow-2xs">
              #2
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3.5">
                <img
                  src={top3[1].avatar}
                  alt={top3[1].name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                />
                <div>
                  <h3 className="font-extrabold text-[#171717] text-sm group-hover:text-[#F4511E] transition-colors">
                    {top3[1].name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-[#666666]">
                    <MapPin className="w-3 h-3 text-[#F4511E]" />
                    <span>{top3[1].city}, {top3[1].country}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF8F4] rounded-xl p-3.5 border border-[#FF8A3D]/20 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Membership Plan:</span>
                  <span className="font-extrabold text-[#F4511E]">{top3[1].levelName} (L{top3[1].level})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Tasks Completed:</span>
                  <span className="font-bold text-[#171717]">{top3[1].tasksCompleted} Products</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-[#FF8A3D]/20">
                  <span className="text-[#666666] font-semibold">Total Withdrawn:</span>
                  <span className="font-black text-[#16A34A] text-sm font-mono">
                    {formatCurrency(top3[1].totalWithdrawn ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3.5 text-[11px] text-[#666666] flex items-center justify-between">
              <span className="font-medium">{top3[1].withdrawalMethod}</span>
              <span className="text-[#16A34A] font-bold font-mono">+{formatCurrency(top3[1].recentWithdrawalAmount ?? 0)} ({top3[1].timeAgo})</span>
            </div>
          </div>
        )}

        {/* 1st Place (Champion) */}
        {top3[0] && (
          <div className="bg-gradient-to-b from-[#FFF4ED] via-white to-[#FFF8F4] rounded-2xl border-2 border-[#FF8A3D] p-5 shadow-[0_8px_25px_rgba(244,81,30,0.16)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.25)] transition-all duration-300 flex flex-col justify-between order-1 md:order-2 relative overflow-hidden group">
            <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gradient-to-r from-[#F4511E] to-[#FF6D00] text-white flex items-center justify-center font-black text-sm shadow-md">
              👑 1
            </div>
            <div>
              <div className="flex items-center gap-3.5 mb-3.5">
                <img
                  src={top3[0].avatar}
                  alt={top3[0].name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#F4511E] shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-[#171717] text-base group-hover:text-[#F4511E] transition-colors">
                      {top3[0].name}
                    </h3>
                    <span className="text-[10px] font-black text-[#E5390B] bg-[#FFF4ED] border border-[#FF8A3D]/40 px-2 py-0.5 rounded-full">
                      #1 Ranked
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#666666] mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F4511E]" />
                    <span className="font-semibold text-[#171717]">{top3[0].city}, {top3[0].country}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-[#FF8A3D]/30 space-y-1.5 text-xs shadow-2xs">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Membership Plan:</span>
                  <span className="font-extrabold text-[#F4511E]">{top3[0].levelName} (L{top3[0].level})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Tasks Completed:</span>
                  <span className="font-bold text-[#171717]">{top3[0].tasksCompleted} Products Added</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-[#FF8A3D]/20">
                  <span className="text-[#666666] font-semibold">Total Withdrawn:</span>
                  <span className="font-black text-[#16A34A] text-base font-mono">
                    {formatCurrency(top3[0].totalWithdrawn ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3.5 text-[11px] text-[#666666] flex items-center justify-between">
              <span className="font-medium">{top3[0].withdrawalMethod}</span>
              <span className="text-[#16A34A] font-bold font-mono">+{formatCurrency(top3[0].recentWithdrawalAmount ?? 0)} ({top3[0].timeAgo})</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.16)] transition-all duration-300 flex flex-col justify-between order-3 relative overflow-hidden group">
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FFF4ED] text-[#F4511E] flex items-center justify-center font-black text-sm border border-[#FF8A3D]/30 shadow-2xs">
              #3
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3.5">
                <img
                  src={top3[2].avatar}
                  alt={top3[2].name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#FF8A3D]/30 shadow-xs"
                />
                <div>
                  <h3 className="font-extrabold text-[#171717] text-sm group-hover:text-[#F4511E] transition-colors">
                    {top3[2].name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-[#666666]">
                    <MapPin className="w-3 h-3 text-[#F4511E]" />
                    <span>{top3[2].city}, {top3[2].country}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF8F4] rounded-xl p-3.5 border border-[#FF8A3D]/20 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Membership Plan:</span>
                  <span className="font-extrabold text-[#F4511E]">{top3[2].levelName} (L{top3[2].level})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Tasks Completed:</span>
                  <span className="font-bold text-[#171717]">{top3[2].tasksCompleted} Products</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-[#FF8A3D]/20">
                  <span className="text-[#666666] font-semibold">Total Withdrawn:</span>
                  <span className="font-black text-[#16A34A] text-sm font-mono">
                    {formatCurrency(top3[2].totalWithdrawn ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3.5 text-[11px] text-[#666666] flex items-center justify-between">
              <span className="font-medium">{top3[2].withdrawalMethod}</span>
              <span className="text-[#16A34A] font-bold font-mono">+{formatCurrency(top3[2].recentWithdrawalAmount ?? 0)} ({top3[2].timeAgo})</span>
            </div>
          </div>
        )}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_8px_25px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setFilterCity(city)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterCity === city
                  ? 'bg-gradient-to-r from-[#F4511E] to-[#FF6D00] text-white shadow-xs'
                  : 'bg-[#FFF8F4] text-[#666666] hover:bg-[#FFF4ED] hover:text-[#171717] border border-[#E5E7EB]'
              }`}
            >
              {city === 'all' ? 'All Global Regions' : city}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member, city, plan..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#171717] focus:outline-hidden focus:border-[#F4511E] focus:ring-2 focus:ring-[#F4511E]/20"
          />
        </div>
      </div>

      {/* FULL LEADERBOARD TABLE */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#FFF8F4]/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#F4511E]" />
            <h2 className="text-sm font-extrabold text-[#171717]">
              Verified Members Leaderboard ({filteredUsers.length})
            </h2>
          </div>
          <span className="text-xs font-bold text-[#F4511E] bg-[#FFF4ED] border border-[#FF8A3D]/30 px-3 py-1 rounded-lg">
            100% Verified Escrow Disbursements in USD ($)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FFF8F4] border-b border-[#E5E7EB] text-[#666666] font-bold">
                <th className="py-3 px-5 w-16 text-center">Rank</th>
                <th className="py-3 px-5">Member Name & Location</th>
                <th className="py-3 px-5">Membership Plan</th>
                <th className="py-3 px-5">Tasks Completed</th>
                <th className="py-3 px-5 text-right">Total Withdrawn</th>
                <th className="py-3 px-5 text-right">Recent Disbursement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredUsers.map((user) => {
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-[#FFF8F4]/50 transition-colors"
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-5 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                        user.rank === 1
                          ? 'bg-[#F4511E] text-white'
                          : user.rank === 2
                          ? 'bg-slate-200 text-[#171717]'
                          : user.rank === 3
                          ? 'bg-[#FFE5D4] text-[#F4511E]'
                          : 'text-[#666666]'
                      }`}>
                        {user.rank}
                      </span>
                    </td>

                    {/* Member */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB]"
                        />
                        <div>
                          <p className="font-bold text-[#171717]">{user.name}</p>
                          <p className="text-[11px] text-[#666666]">{user.city}, {user.country}</p>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-[#F4511E] bg-[#FFF4ED] px-2 py-0.5 rounded border border-[#FF8A3D]/20">
                        {user.levelName} (L{user.level})
                      </span>
                    </td>

                    {/* Tasks */}
                    <td className="py-3.5 px-5 font-medium text-[#171717]">
                      {user.tasksCompleted} Products
                    </td>

                    {/* Total Withdrawn */}
                    <td className="py-3.5 px-5 text-right font-black text-[#16A34A] font-mono">
                      {formatCurrency(user.totalWithdrawn ?? 0)}
                    </td>

                    {/* Recent */}
                    <td className="py-3.5 px-5 text-right">
                      <p className="font-bold text-[#171717] font-mono">+{formatCurrency(user.recentWithdrawalAmount ?? 0)}</p>
                      <p className="text-[10px] text-[#666666]">{user.withdrawalMethod} · {user.timeAgo}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
