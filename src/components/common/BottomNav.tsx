import React from 'react';
import { useApp, ViewType } from '../../context/AppContext';
import { Home, ShoppingBag, Trophy, CheckSquare, User as UserIcon } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, completedTasksToday, currentLevelConfig } = useApp();

  const remainingTasks = Math.max(
    0,
    (currentLevelConfig?.dailyProductTasks || 3) - completedTasksToday.length
  );

  const navItems: { label: string; view: ViewType; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { label: 'Home', view: 'home', icon: Home },
    { label: 'Products', view: 'products', icon: ShoppingBag },
    { label: 'Top Ranking', view: 'ranking', icon: Trophy },
    {
      label: 'Total Tasks',
      view: 'tasks',
      icon: CheckSquare,
      badge: remainingTasks > 0 ? remainingTasks : undefined,
    },
    { label: 'Profile', view: 'profile', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-2.5 [padding-bottom:max(0.625rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto grid grid-cols-5 h-15 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentView === item.view ||
            (item.view === 'home' && currentView === 'dashboard') ||
            (item.view === 'products' && currentView === 'marketplace');

          return (
            <button
              key={item.label}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center justify-center relative py-1 transition-colors ${
                isActive ? 'text-[#F4511E] font-bold' : 'text-[#666666] hover:text-[#171717]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#F4511E]' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#F4511E] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[64px]">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 bg-[#F4511E] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
