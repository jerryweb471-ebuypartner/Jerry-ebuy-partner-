import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../context/AppContext';
import {
  Bell,
  Check,
  Filter,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Sparkles,
  Award,
  Trash2,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    userNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentView,
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredNotifs = userNotifications.filter((n) => {
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'commission':
        return <Sparkles className="w-3.5 h-3.5 text-[#F4511E]" />;
      case 'deposit':
        return <ArrowDownLeft className="w-3.5 h-3.5 text-[#16A34A]" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600" />;
      case 'level':
        return <Award className="w-3.5 h-3.5 text-amber-500" />;
      case 'order':
        return <ShoppingBag className="w-3.5 h-3.5 text-[#F4511E]" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-[#666666]" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-16 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-[#171717] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#F4511E]" />
            <span>Activity & Notifications</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-[#666666] mt-0.5">
            Real-time updates regarding order tasks, rewards credited, deposits, and level upgrades
          </p>
        </div>

        {userNotifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-[11px] sm:text-xs font-bold text-[#F4511E] hover:text-[#E5390B] bg-[#FFF4ED] hover:bg-[#FFE5D6] px-3 py-1.5 rounded-xl transition-colors self-start sm:self-auto flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'commission', 'order', 'deposit', 'withdrawal', 'level'].map((type) => {
          const isActive = typeFilter === type;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 text-[11px] sm:text-xs font-bold rounded-xl capitalize whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#F4511E] text-white shadow-2xs'
                  : 'bg-white text-[#666666] border border-[#E5E7EB] hover:bg-[#FFF4ED]'
              }`}
            >
              {type === 'all' ? 'All Activity' : `${type}s`}
            </button>
          );
        })}
      </div>

      {/* Notifications list: Mobile Friendly */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs divide-y divide-[#E5E7EB] overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-xs text-[#666666]">
            <Bell className="w-8 h-8 text-[#FFD7C2] mx-auto mb-2" />
            <p className="font-bold text-[#171717]">No notifications recorded</p>
            <p className="text-[11px] mt-1">Your new rewards and ledger activities will appear here.</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.link) setCurrentView(n.link as ViewType);
              }}
              className={`p-3.5 sm:p-4.5 flex items-start gap-3 hover:bg-[#FFF8F4]/70 cursor-pointer transition-colors ${
                !n.read ? 'bg-[#FFF4ED]/40' : ''
              }`}
            >
              {/* Type Icon Badge */}
              <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                {getIconForType(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-[#171717] truncate">
                    {n.title}
                  </h3>
                  <span className="text-[10px] text-[#666666] font-mono tabular-nums shrink-0">
                    {n.createdAt}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#666666] mt-0.5 leading-relaxed">
                  {n.message}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                  <span className="capitalize font-semibold text-[#F4511E] bg-[#FFF4ED] px-2 py-0.5 rounded-md border border-[#FFD7C2]">
                    {n.type}
                  </span>
                  {!n.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F4511E]" />
                  )}
                  {n.link && (
                    <span className="text-[#F4511E] font-bold hover:underline">
                      Inspect View →
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
