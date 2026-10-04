import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export const TotalTasksPage: React.FC = () => {
  const {
    currentUser,
    completedTasksToday,
    productTasks,
    currentLevelConfig,
    setCurrentView,
    setSelectedLevelForModal,
    formatCurrency,
  } = useApp();

  const quota = currentLevelConfig?.dailyProductTasks || 3;
  const completedCount = completedTasksToday.length;
  const remaining = Math.max(0, quota - completedCount);
  const rewardPerProduct = currentLevelConfig?.earningPerProduct || 60;
  const earnedToday = completedCount * rewardPerProduct;
  const maxToday = currentLevelConfig?.dailyTotalEarning || (quota * rewardPerProduct);
  const isAllCompleted = completedCount >= quota;
  const progressPercent = Math.min(100, Math.round((completedCount / quota) * 100));

  // Filter tasks for this user
  const userTasks = productTasks.filter(
    (t) => !currentUser || t.userId === currentUser.id
  );

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header Banner - White + Orange Theme */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-7 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.12)] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#FFF4ED] rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-3 py-1 rounded-full border border-[#FF8A3D]/30 inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#F4511E]" />
              Daily Task Execution Hub
            </span>
            <span className="text-xs font-semibold text-[#666666] bg-gray-100 px-2.5 py-0.5 rounded-full">
              {currentLevelConfig?.name || `Level ${currentUser?.level ?? 1}`} · USD ($)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] mt-2 tracking-tight">
            Total Tasks & Daily Progress
          </h1>
          <p className="text-xs text-[#666666] mt-1 max-w-2xl leading-relaxed">
            Execute your allocated daily product order tasks. Each item added to cart automatically settles instant rewards directly to your withdrawable balance.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          {!isAllCompleted ? (
            <button
              onClick={() => {
                setCurrentView('products');
                window.location.hash = '#products';
              }}
              className="px-5 py-3 bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white rounded-xl text-xs font-bold shadow-[0_4px_15px_rgba(244,81,30,0.3)] transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Tasks ({remaining} Remaining)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentView('plans');
                window.location.hash = '#plans';
              }}
              className="px-5 py-3 bg-gradient-to-r from-[#16A34A] to-emerald-600 hover:from-emerald-700 hover:to-[#16A34A] text-white rounded-xl text-xs font-bold shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>All Tasks Done! Upgrade Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* METRICS DECK - 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* You Have Earned Card */}
        <div className="bg-gradient-to-br from-[#FFF4ED] via-[#FFF8F4] to-white rounded-2xl border border-[#FF8A3D]/40 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.16)] transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#E5390B] uppercase tracking-wider">
              Earned Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F4511E]/10 flex items-center justify-center text-[#F4511E]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F4511E] mt-2 tracking-tight">
            {formatCurrency(earnedToday)}
          </div>
          <span className="text-[11px] text-[#666666] font-medium block mt-1">
            Max potential: <strong className="text-[#171717]">{formatCurrency(maxToday)}</strong>
          </span>
        </div>

        {/* Task Quota Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.12)] transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
              Today's Task Quota
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF4ED] flex items-center justify-center text-[#F4511E]">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-[#171717]">
              {completedCount}
            </span>
            <span className="text-[#666666] font-semibold text-sm">
              / {quota} Products ({progressPercent}%)
            </span>
          </div>
          {/* Orange Progress Bar */}
          <div className="w-full bg-[#FFF4ED] h-2.5 rounded-full mt-2.5 overflow-hidden border border-[#FF8A3D]/20">
            <div
              className="bg-gradient-to-r from-[#F4511E] to-[#FF6D00] h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Reward Per Item */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.12)] transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
              Rate Per Product
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#16A34A]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#16A34A] mt-2 tracking-tight">
            +{formatCurrency(rewardPerProduct)}
          </div>
          <span className="text-[11px] text-[#666666] font-medium block mt-1">
            Tier Level {currentUser?.level ?? 1} guaranteed rate
          </span>
        </div>

        {/* Reset Countdown */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.12)] transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
              Batch Refresh Cycle
            </span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-[#666666]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#171717] mt-2 font-mono">
            05h 42m 18s
          </div>
          <span className="text-[11px] text-[#666666] block mt-1">
            Daily reset at midnight 00:00 UTC
          </span>
        </div>
      </div>

      {/* Action Notification Banner */}
      {isAllCompleted ? (
        <div className="bg-gradient-to-r from-emerald-50 via-[#FFF8F4] to-emerald-50 rounded-2xl border-2 border-emerald-300/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center shrink-0 shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-emerald-950">
                Congratulations! You finished all {quota} tasks for today!
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Total <strong>{formatCurrency(earnedToday)}</strong> settled to your available balance. Upgrade your tier plan to unlock more tasks and higher per-product commissions.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentView('plans');
              window.location.hash = '#plans';
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white rounded-xl text-xs font-bold shadow-[0_4px_15px_rgba(244,81,30,0.3)] whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            Upgrade Membership Plan
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#FFF4ED] via-white to-[#FFF8F4] rounded-2xl border border-[#FF8A3D]/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F4511E] to-[#FF6D00] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#171717]">
                {remaining} Product Tasks Waiting For You Today
              </h4>
              <p className="text-xs text-[#666666] mt-0.5">
                Complete remaining items to earn another <strong className="text-[#16A34A] font-bold">+{formatCurrency(remaining * rewardPerProduct)}</strong> before midnight!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentView('products');
              window.location.hash = '#products';
            }}
            className="px-5 py-2.5 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl text-xs font-bold shadow-[0_4px_15px_rgba(244,81,30,0.25)] whitespace-nowrap flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Go to Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TASK LOG TABLE - White + Orange Accent Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#FFF8F4]/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FFF4ED] text-[#F4511E] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#171717]">
                Completed Tasks Activity Log
              </h2>
              <p className="text-[11px] text-[#666666]">
                Real-time timestamped escrow records for product order verifications
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#F4511E] bg-[#FFF4ED] border border-[#FF8A3D]/30 px-3 py-1 rounded-lg">
            {userTasks.length} Logged Executions
          </span>
        </div>

        {userTasks.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF4ED] text-[#F4511E] flex items-center justify-center mx-auto border border-[#FF8A3D]/30">
              <CheckSquare className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-[#171717]">No Tasks Completed Yet Today</h3>
            <p className="text-xs text-[#666666] max-w-sm mx-auto">
              Click below to view the catalog. Simply click "Add to Cart" on any product to complete your task and earn commission.
            </p>
            <button
              onClick={() => {
                setCurrentView('products');
                window.location.hash = '#products';
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(244,81,30,0.3)] cursor-pointer hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Start Task 1 of {quota}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FFF8F4] border-b border-[#E5E7EB] text-[#666666] font-bold">
                  <th className="py-3 px-5">Task ID</th>
                  <th className="py-3 px-5">Product Details</th>
                  <th className="py-3 px-5">Order Value</th>
                  <th className="py-3 px-5">Tier Level</th>
                  <th className="py-3 px-5 text-right">Commission Credited</th>
                  <th className="py-3 px-5 text-right">Status & Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {userTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-[#FFF8F4]/50 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-[#171717]">
                      {task.id}
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={task.productImage}
                          alt={task.productName}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E5E7EB] shadow-2xs"
                        />
                        <span className="font-bold text-[#171717] line-clamp-1 max-w-xs">
                          {task.productName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 font-bold text-[#666666]">
                      {formatCurrency(task.productPrice ?? 0)}
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF4ED] text-[#F4511E] border border-[#FF8A3D]/30">
                        Level {task.levelAtCompletion}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <span className="font-extrabold text-[#16A34A] text-sm">
                        +{formatCurrency(task.rewardEarned ?? rewardPerProduct)}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                        Settled
                      </span>
                      <span className="text-[10px] text-[#666666] block mt-0.5">
                        {task.completedAt}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
