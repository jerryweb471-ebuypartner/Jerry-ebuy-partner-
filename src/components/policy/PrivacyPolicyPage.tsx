import React from 'react';
import { ShieldCheck, Lock, FileText, Globe2, Building2, CheckCircle, Scale, Eye, RefreshCw, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF4ED] to-white rounded-3xl border border-[#FFD7C2] p-6 sm:p-10 shadow-xs text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4511E]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FF8A3D]/40 text-[#F4511E] text-xs font-bold mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>Legal, Trust & Compliance Framework</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
          Privacy Policy & Merchant Terms
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] max-w-2xl mx-auto mt-2 leading-relaxed">
          eBuy-Partner Global Enterprise operates under strict corporate multi-jurisdictional licensing as the certified promotional sister entity of eBay Inc. We are committed to transparency, cryptographic asset protection, and guaranteed commission disbursements.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <button
            onClick={() => setCurrentView('company_docs')}
            className="px-4 py-2 text-xs font-bold text-[#F4511E] bg-white border border-[#FF8A3D] hover:bg-[#FFF4ED] rounded-xl transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            View Registration Certificates
          </button>
          <button
            onClick={() => setCurrentView('plans')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-xl transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Explore Verified Plans
          </button>
        </div>
      </div>

      {/* Grid of Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] text-[#F4511E] flex items-center justify-center font-bold mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">Bank-Grade Data Encryption</h3>
          <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
            All user authentication, session tokens, and balance operations are guarded by AES-256 TLS protocols and real-time fraud monitoring.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] text-[#F4511E] flex items-center justify-center font-bold mb-3">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">Strict Escrow Protection</h3>
          <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
            Member security deposits are placed in regulated institutional escrow reserves and cannot be commingled with corporate operational funds.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] text-[#F4511E] flex items-center justify-center font-bold mb-3">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">Global Jurisdictional Vetting</h3>
          <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
            Compliant with SECP (Pakistan), DED (Dubai UAE), Companies House (UK), and US FinCEN MSB international commerce frameworks.
          </p>
        </div>
      </div>

      {/* Comprehensive Policy Sections */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs p-6 sm:p-8 space-y-8 divide-y divide-[#E5E7EB]">
        {/* Section 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#F4511E] text-white text-xs font-bold flex items-center justify-center">1</span>
            <h2 className="text-base font-bold text-[#171717]">Information We Collect & Verification</h2>
          </div>
          <p className="text-xs text-[#666666] leading-relaxed">
            When you register as a commercial partner on the eBuy-Partner platform, we collect your verified identity details including your legal name, corporate or personal email address, phone number, designated country of registration, and cryptographic or bank remittance credentials.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#666666] pt-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Email OTP 2-Factor Authentication</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Immutable Country and Currency Lock</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Device and IP Fraud Audit Logs</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Anti-Money Laundering (AML) Compliance</span>
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="pt-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#F4511E] text-white text-xs font-bold flex items-center justify-center">2</span>
            <h2 className="text-base font-bold text-[#171717]">Task Processing & Automated Commission Payouts</h2>
          </div>
          <p className="text-xs text-[#666666] leading-relaxed">
            Members participate in certified product fulfillment tasks based on their selected tier plan. Commission is calculated instantly and credited directly to the user's available wallet balance upon task verification:
          </p>
          <div className="p-4 rounded-xl bg-[#FFF4ED] border border-[#FFD7C2] text-xs space-y-2">
            <p className="font-bold text-[#171717]">Tier Quota Regulations:</p>
            <p className="text-[#666666] leading-relaxed">
              • <strong>Level 0 Free Trial:</strong> Limited to 3 product tasks per day with accumulated earnings eligible for withdrawal upon tier graduation.
              <br />
              • <strong>Tier Upgrade:</strong> When a user exhausts Level 1 quota (3 products), upgrading to Plan 2 unlocks expanded daily task capacity and increased per-product commissions.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="pt-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#F4511E] text-white text-xs font-bold flex items-center justify-center">3</span>
            <h2 className="text-base font-bold text-[#171717]">Withdrawal Processing & Escrow Guarantees</h2>
          </div>
          <p className="text-xs text-[#666666] leading-relaxed">
            Withdrawals are processed via verified bank transfers (Meezan, HBL, Bank Alfalah, Allied Bank), digital wallets (EasyPaisa, JazzCash, Nayapay, SadaPay), or international wire networks. All payouts are executed in accordance with national central bank regulations and reviewed within standard SLA timelines.
          </p>
        </div>

        {/* Section 4 */}
        <div className="pt-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#F4511E] text-white text-xs font-bold flex items-center justify-center">4</span>
            <h2 className="text-base font-bold text-[#171717]">Data Security & Cookie Policy</h2>
          </div>
          <p className="text-xs text-[#666666] leading-relaxed">
            We do not sell, rent, or monetize your personal or financial data to third-party advertisers. Cookies are strictly utilized to maintain secure session tokens, language/currency preferences, and fraud prevention measures.
          </p>
        </div>
      </div>

      {/* Support CTA */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] text-[#F4511E] flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#171717]">Have questions regarding compliance?</h4>
            <p className="text-[11px] text-[#666666]">Our legal and support officers are available 24/7.</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentView('profile')}
          className="px-4 py-2 text-xs font-bold text-white bg-[#171717] hover:bg-[#333333] rounded-xl transition-colors shrink-0"
        >
          Contact Support in Profile
        </button>
      </div>
    </div>
  );
};
