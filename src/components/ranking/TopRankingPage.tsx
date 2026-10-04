import React, { useState, useEffect, useMemo } from 'react';
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
  RefreshCw,
  Flame,
  ArrowUp,
  Clock,
  Globe2,
} from 'lucide-react';
import { RankingUser } from '../../types';

export const TopRankingPage: React.FC = () => {
  const { rankingUsers, currentUser, currentLevelConfig, formatCurrency } = useApp();
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(10);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isAutoRotatePaused, setIsAutoRotatePaused] = useState<boolean>(false);

  // Maintain local active list for 10-second live shuffle/rotation
  const [displayUsers, setDisplayUsers] = useState<RankingUser[]>(() => {
    return rankingUsers && rankingUsers.length > 0 ? rankingUsers : [];
  });

  // Sync if rankingUsers prop changes
  useEffect(() => {
    if (rankingUsers && rankingUsers.length > 0 && displayUsers.length === 0) {
      setDisplayUsers(rankingUsers);
    }
  }, [rankingUsers, displayUsers.length]);

  // 10-Second Live Shuffle / Upward Rotation Timer
  useEffect(() => {
    if (isAutoRotatePaused) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Trigger smooth upward rotation: shift items up
          setIsRotating(true);
          setDisplayUsers((prevUsers) => {
            if (prevUsers.length < 2) return prevUsers;
            const updated = [...prevUsers];
            // Rotate top 2 items to the bottom, moving lower earners up to the top stream
            const first = updated.shift();
            if (first) {
              // Simulate small real-time payout increment
              first.recentWithdrawalAmount = Math.round((first.recentWithdrawalAmount || 120) * (1 + Math.random() * 0.05));
              first.timeAgo = 'Just now';
              updated.push(first);
            }
            return updated.map((u, idx) => ({ ...u, rank: idx + 1 }));
          });

          setTimeout(() => setIsRotating(false), 700);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoRotatePaused]);

  // 15 Registered Countries List
  const countryFilters = [
    { code: 'all', label: 'All 15 Countries', flag: '🌐' },
    { code: 'US', label: 'United States', flag: '🇺🇸' },
    { code: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', label: 'Canada', flag: '🇨🇦' },
    { code: 'AE', label: 'UAE (Dubai)', flag: '🇦🇪' },
    { code: 'SA', label: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'PK', label: 'Pakistan', flag: '🇵🇰' },
    { code: 'IN', label: 'India', flag: '🇮🇳' },
    { code: 'DE', label: 'Germany', flag: '🇩🇪' },
    { code: 'AU', label: 'Australia', flag: '🇦🇺' },
    { code: 'SG', label: 'Singapore', flag: '🇸🇬' },
    { code: 'JP', label: 'Japan', flag: '🇯🇵' },
    { code: 'MY', label: 'Malaysia', flag: '🇲🇾' },
    { code: 'TH', label: 'Thailand', flag: '🇹🇭' },
    { code: 'BR', label: 'Brazil', flag: '🇧🇷' },
    { code: 'TR', label: 'Turkey', flag: '🇹🇷' },
  ];

  const filteredUsers = useMemo(() => {
    return displayUsers.filter((user) => {
      const matchesCountry =
        filterCountry === 'all' ||
        user.countryCode?.toUpperCase() === filterCountry.toUpperCase() ||
        user.country?.toLowerCase().includes(filterCountry.toLowerCase());
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.city.toLowerCase().includes(query) ||
        (user.country && user.country.toLowerCase().includes(query)) ||
        user.levelName.toLowerCase().includes(query) ||
        `#${user.rank}`.includes(query);
      return matchesCountry && matchesSearch;
    });
  }, [displayUsers, filterCountry, searchQuery]);

  const top3 = displayUsers.slice(0, 3);

  const handleManualShuffle = () => {
    setIsRotating(true);
    setDisplayUsers((prevUsers) => {
      const shuffled = [...prevUsers];
      const first = shuffled.shift();
      if (first) shuffled.push(first);
      return shuffled.map((u, idx) => ({ ...u, rank: idx + 1 }));
    });
    setCountdown(10);
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-20 font-sans max-w-7xl mx-auto">
      {/* 1. LIVE PAYOUT LEADERBOARD HEADER BANNER */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-7 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#FFF4ED] rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-[11px] font-black text-[#F4511E] bg-[#FFF4ED] border border-[#FF8A3D]/40 px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-[#F4511E]" />
              Top 100 Global Earners Leaderboard
            </span>

            {/* 10-Second Live Shuffle Counter Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Shuffle in: <strong className="font-mono text-emerald-900">{countdown}s</strong></span>
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-[#171717] tracking-tight">
            Top 100 Ranking Members & USD ($) Earnings
          </h1>
          <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
            Real-time audited rankings across our 15 international member hubs. Ranks and live task settlements auto-rotate every 10 seconds with 100% verified Binance Pay & multi-chain crypto escrow.
          </p>
        </div>

        {/* Live Controls & User Standings */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
          <button
            type="button"
            onClick={handleManualShuffle}
            className="px-3.5 py-2.5 bg-[#FFF4ED] hover:bg-[#FFE5D4] text-[#F4511E] border border-[#FF8A3D]/40 rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>Shuffle Now</span>
          </button>

          {currentUser && (
            <div className="bg-[#FFF8F4] border border-[#FF8A3D]/40 p-3.5 rounded-2xl shadow-2xs">
              <span className="text-[10px] font-bold text-[#E5390B] uppercase tracking-wider block">
                Your Live Standing
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm font-black text-[#171717]">{currentUser.name}</span>
                <span className="text-[11px] font-bold text-[#F4511E] bg-[#FFF4ED] px-2 py-0.5 rounded-md border border-[#FF8A3D]/30">
                  Level {currentUser.level}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. TOP 3 PODIUM CARDS (Responsive & Mobile-Stacked) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 shadow-sm flex flex-col justify-between order-2 md:order-1 relative overflow-hidden group">
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs border border-slate-200 shadow-2xs">
              🥈 #2
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={top3[1].avatar}
                  alt={top3[1].name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200 shadow-xs flex-shrink-0"
                />
                <div>
                  <h3 className="font-extrabold text-[#171717] text-sm group-hover:text-[#F4511E] transition-colors line-clamp-1">
                    {top3[1].name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#666666] mt-0.5">
                    <span>{top3[1].countryFlag || '🌍'}</span>
                    <span className="font-medium">{top3[1].city}, {top3[1].country}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF8F4] rounded-xl p-3 border border-[#FF8A3D]/20 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Tier:</span>
                  <span className="font-extrabold text-[#F4511E]">{top3[1].levelName} (L{top3[1].level})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Tasks Done:</span>
                  <span className="font-bold text-[#171717]">{top3[1].tasksCompleted} Products</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#FF8A3D]/20">
                  <span className="text-[#666666] font-semibold">Total Withdrawn:</span>
                  <span className="font-black text-[#16A34A] font-mono">
                    {formatCurrency(top3[1].totalWithdrawn ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-[#666666] flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="font-medium truncate">{top3[1].withdrawalMethod}</span>
              <span className="text-[#16A34A] font-bold font-mono shrink-0">+{formatCurrency(top3[1].recentWithdrawalAmount ?? 0)} ({top3[1].timeAgo})</span>
            </div>
          </div>
        )}

        {/* 1st Place (Champion) */}
        {top3[0] && (
          <div className="bg-gradient-to-b from-[#FFF4ED] via-white to-[#FFF8F4] rounded-2xl border-2 border-[#FF8A3D] p-4 sm:p-5 shadow-md flex flex-col justify-between order-1 md:order-2 relative overflow-hidden group">
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#F4511E] to-[#FF6D00] text-white flex items-center gap-1 font-black text-xs shadow-xs">
              <span>👑 #1 RANK</span>
            </div>
            <div>
              <div className="flex items-center gap-3.5 mb-3.5">
                <img
                  src={top3[0].avatar}
                  alt={top3[0].name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#F4511E] shadow-sm flex-shrink-0"
                />
                <div>
                  <h3 className="font-black text-[#171717] text-base group-hover:text-[#F4511E] transition-colors line-clamp-1">
                    {top3[0].name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#666666] mt-0.5">
                    <span className="text-base leading-none">{top3[0].countryFlag || '🌍'}</span>
                    <span className="font-bold text-[#171717]">{top3[0].city}, {top3[0].country}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-[#FF8A3D]/30 space-y-1.5 text-xs shadow-2xs">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Tier:</span>
                  <span className="font-black text-[#F4511E]">{top3[0].levelName} (L{top3[0].level})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Tasks Done:</span>
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

            <div className="mt-3 text-[11px] text-[#666666] flex items-center justify-between pt-2 border-t border-orange-100">
              <span className="font-bold text-[#171717] truncate">{top3[0].withdrawalMethod}</span>
              <span className="text-[#16A34A] font-black font-mono shrink-0">+{formatCurrency(top3[0].recentWithdrawalAmount ?? 0)} ({top3[0].timeAgo})</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 shadow-sm flex flex-col justify-between order-3 relative overflow-hidden group">
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center font-black text-xs border border-amber-200 shadow-2xs">
              🥉 #3
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={top3[2].avatar}
                  alt={top3[2].name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-200 shadow-xs flex-shrink-0"
                />
                <div>
                  <h3 className="font-extrabold text-[#171717] text-sm group-hover:text-[#F4511E] transition-colors line-clamp-1">
                    {top3[2].name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#666666] mt-0.5">
                    <span>{top3[2].countryFlag || '🌍'}</span>
                    <span className="font-medium">{top3[2].city}, {top3[2].country}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF8F4] rounded-xl p-3 border border-[#FF8A3D]/20 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Tier:</span>
                  <span className="font-extrabold text-[#F4511E]">{top3[2].levelName} (L{top3[2].level})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Tasks Done:</span>
                  <span className="font-bold text-[#171717]">{top3[2].tasksCompleted} Products</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#FF8A3D]/20">
                  <span className="text-[#666666] font-semibold">Total Withdrawn:</span>
                  <span className="font-black text-[#16A34A] font-mono">
                    {formatCurrency(top3[2].totalWithdrawn ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-[#666666] flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="font-medium truncate">{top3[2].withdrawalMethod}</span>
              <span className="text-[#16A34A] font-bold font-mono shrink-0">+{formatCurrency(top3[2].recentWithdrawalAmount ?? 0)} ({top3[2].timeAgo})</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. 15 COUNTRIES FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member, country, city, or rank..."
              className="w-full pl-10 pr-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#171717] font-semibold focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#666666] self-start sm:self-auto">
            <span>Showing: <strong className="text-[#F4511E]">{filteredUsers.length}</strong> / 100 Earners</span>
          </div>
        </div>

        {/* 15 Country Filter Pills (Horizontal Scrollable on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {countryFilters.map((c) => {
            const isSelected = filterCountry === c.code || (c.code === 'all' && filterCountry === 'all');
            return (
              <button
                key={c.code}
                onClick={() => setFilterCountry(c.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-[#F4511E] text-white shadow-2xs'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#FFF4ED] hover:text-[#171717] border border-[#E2E8F0]'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. 100 TOP EARNERS LIST — 100% MOBILE-FRIENDLY VERTICAL STACK */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#FFF8F4]/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#F4511E]" />
            <h2 className="text-sm font-extrabold text-[#171717]">
              Verified Global Leaderboard (100 Members)
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#F4511E] bg-white border border-[#FFD7C2] px-2.5 py-0.5 rounded-full shadow-2xs">
            Auto-rotates upwards every 10s
          </span>
        </div>

        {/* MOBILE-FIRST VERTICAL LIST (No horizontal scrolling or rotation needed) */}
        <div className={`divide-y divide-[#E2E8F0] transition-opacity duration-300 ${isRotating ? 'opacity-70' : 'opacity-100'}`}>
          {filteredUsers.map((user) => {
            const isTop3 = user.rank <= 3;
            return (
              <div
                key={user.id}
                className={`p-3.5 sm:p-4.5 hover:bg-[#FFFDFB] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  user.rank === 1
                    ? 'bg-[#FFF8F4]/40 border-l-4 border-l-[#F4511E]'
                    : user.rank === 2
                    ? 'bg-slate-50/40 border-l-4 border-l-slate-400'
                    : user.rank === 3
                    ? 'bg-amber-50/30 border-l-4 border-l-amber-400'
                    : ''
                }`}
              >
                {/* Left Side: Rank, Avatar, Name, Flag, City, Country */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Badge */}
                  <div
                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                      user.rank === 1
                        ? 'bg-[#F4511E] text-white'
                        : user.rank === 2
                        ? 'bg-slate-200 text-slate-800'
                        : user.rank === 3
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-gray-100 text-[#475569]'
                    }`}
                  >
                    #{user.rank}
                  </div>

                  {/* Avatar */}
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-[#E2E8F0] shadow-2xs shrink-0"
                  />

                  {/* Member Name & Country Location */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-extrabold text-sm text-[#0F172A] truncate">
                        {user.name}
                      </p>
                      <span className="text-xs font-bold text-[#F4511E] bg-[#FFF4ED] px-2 py-0.2 rounded border border-[#FFD7C2] shrink-0 text-[10px]">
                        L{user.level} · {user.levelName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-0.5">
                      <span className="text-sm leading-none">{user.countryFlag || '🌍'}</span>
                      <span className="truncate">{user.city}, {user.country}</span>
                      <span>·</span>
                      <span className="font-semibold text-[#171717] shrink-0">{user.tasksCompleted} Tasks</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Total Withdrawn & Recent Payout */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Recent Payout Tag */}
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#94A3B8] font-bold block uppercase tracking-wider">
                      Recent Payout
                    </span>
                    <span className="text-xs font-bold text-[#0F172A] font-mono">
                      +{formatCurrency(user.recentWithdrawalAmount ?? 0)}
                    </span>
                    <span className="text-[10px] text-[#64748B] block">
                      {user.withdrawalMethod.split(' ')[0]} · {user.timeAgo}
                    </span>
                  </div>

                  {/* Total Withdrawn Highlight */}
                  <div className="text-right bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                    <span className="text-[10px] text-emerald-800 font-bold block uppercase tracking-wider">
                      Total Withdrawn
                    </span>
                    <span className="text-sm sm:text-base font-black text-[#16A34A] font-mono">
                      {formatCurrency(user.totalWithdrawn ?? 0)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
