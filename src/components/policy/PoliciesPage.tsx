import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  FileText,
  Lock,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { PolicyDocument } from '../../types';

export const PoliciesPage: React.FC = () => {
  const { policies, setCurrentView } = useApp();
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(policies[0]?.id || 'POL-01');

  const activePolicy: PolicyDocument =
    policies.find((p) => p.id === selectedPolicyId) || policies[0];

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto font-sans">
      {/* Header Banner - White + Orange */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-9 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.12)] transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFF4ED] rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FF8A3D]/40 text-[#F4511E] text-xs font-bold mb-3 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#F4511E]" />
            <span>Official Legal Governance & Compliance</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#171717] tracking-tight">
            Legal Documents & Platform Policies
          </h1>

          <p className="text-xs sm:text-sm text-[#666666] mt-2 leading-relaxed">
            Read our statutory operating terms, transparent escrow refund charter, withdrawal regulations, and member rights across all 15 active jurisdictions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Policy Directory */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
            <span className="text-xs font-black text-[#171717] uppercase tracking-wider block px-1">
              Policy Directory
            </span>

            <div className="space-y-1.5">
              {policies.map((pol) => {
                const isSelected = pol.id === selectedPolicyId;
                return (
                  <button
                    key={pol.id}
                    onClick={() => setSelectedPolicyId(pol.id)}
                    className={`w-full text-left p-3.5 rounded-xl text-xs transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#F4511E] text-white shadow-xs font-bold'
                        : 'bg-[#FFFDFB] text-[#171717] hover:bg-[#FFF4ED] border border-[#E5E7EB]'
                    }`}
                  >
                    <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-white' : 'text-[#F4511E]'}`} />
                    <div className="overflow-hidden flex-1">
                      <div className="font-extrabold truncate">{pol.title}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-[#666666]'}`}>
                        {pol.category}
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? 'text-white' : 'text-[#666666]'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Active Policy Reader */}
        <div className="lg:col-span-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
              <div>
                <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider bg-[#FFF4ED] px-2.5 py-0.5 rounded-md border border-[#FFD7C2]">
                  {activePolicy.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#171717] mt-1.5">
                  {activePolicy.title}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#666666] shrink-0">
                <Calendar className="w-3.5 h-3.5 text-[#F4511E]" />
                <span>Last Updated: <strong>{activePolicy.lastUpdated}</strong></span>
              </div>
            </div>

            <div className="bg-[#FFF8F4] p-4 rounded-xl border border-[#FFD7C2] text-xs text-[#171717]">
              <span className="font-bold block text-[#F4511E] mb-0.5">Executive Summary:</span>
              <p className="text-[#666666] leading-relaxed">{activePolicy.summary}</p>
            </div>

            <div className="prose prose-sm max-w-none text-xs leading-relaxed text-[#171717] space-y-4 whitespace-pre-line font-sans">
              {activePolicy.content}
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#666666]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Legally Certified & Enforceable</span>
              </div>

              <button
                onClick={() => setCurrentView('home')}
                className="font-bold text-[#F4511E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Return to Home</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
