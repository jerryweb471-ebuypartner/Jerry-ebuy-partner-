import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HERO_IMAGE, HEADPHONE_IMAGE, WATCH_IMAGE, BAG_IMAGE } from '../../data/initialData';
import { EBuyPartnerLogo } from '../common/EBuyPartnerLogo';
import { EbayLicenseModal } from '../common/EbayLicenseModal';
import {
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  CheckCircle2,
  TrendingUp,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Globe2,
  Building2,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { setCurrentView, products } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);

  const faqs = [
    {
      q: 'What is eBuy-Partner and how is it affiliated with eBay?',
      a: 'eBuy-Partner is an authorized commercial sister company and global promotional affiliate of eBay Inc. (San Jose, California, USA) operating under statutory commercial partnership license #EB-PARTNER-2024-884920-US. We provide verified merchant evaluations, cart task acceleration, and audited USD reward payouts.',
    },
    {
      q: 'How are partner commissions calculated and credited?',
      a: 'Commissions are calculated as a transparent percentage of verified merchandise order volume or guaranteed per-task rates (from $20/item on Basic Trial up to $50,910/item on Apex tiers). Rewards are credited immediately to your USD wallet ledger in real time.',
    },
    {
      q: 'Is this an investment program or does it guarantee financial returns?',
      a: 'No. eBuy-Partner is strictly an authorized merchandise promotional and merchant rating network. There are no passive profit guarantees or investment pools. Earnings stem exclusively from legitimate promotional rating activities and order placements.',
    },
    {
      q: 'How does the wallet and double-entry ledger system work?',
      a: 'Every transaction—including refundable deposits, order ratings, task commissions, and Binance/crypto withdrawals—is written to an immutable double-entry ledger denominated in United States Dollars ($ USD).',
    },
    {
      q: 'What are the withdrawal channels and processing speeds?',
      a: 'Withdrawals are disbursed in USD via instant crypto channels and Binance Pay (TRC20, BEP20, ERC20). Standard payouts are cleared in 5 to 30 minutes upon automated validation.',
    },
  ];

  return (
    <div className="bg-white font-sans">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-100 overflow-hidden bg-gradient-to-b from-amber-50/20 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full shadow-2xs">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Authorized eBay Sister Company & Certified Partner</span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <EBuyPartnerLogo size={52} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                    eBuy-Partner
                  </h2>
                  <p className="text-xs font-bold text-[#0064D2]">
                    Official eBay Promotional Sister Network
                  </p>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-balance">
                Global Commerce with Transparent Partner Rewards in USD.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Accelerate merchant product ratings, evaluate premier electronics, fine horology, and commercial hardware. Receive guaranteed tier task commissions in United States Dollars ($ USD) with verified instant settlements.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-6 py-3.5 text-sm font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Apply for Partner Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsLicenseModalOpen(true)}
                  className="px-5 py-3.5 text-sm font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-2 shadow-2xs"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Inspect eBay License</span>
                </button>
              </div>

              {/* Trust Metrics Adjacency */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 max-w-md">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
                    $4.2M+
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Verified Volume</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#16A34A] font-mono tabular-nums">
                    USD ($)
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Single Currency</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-amber-600 font-mono tabular-nums">
                    eBay Partner
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Certified Sister Entity</p>
                </div>
              </div>
            </div>

            {/* Right Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl border border-amber-200/80 bg-white p-4 shadow-xl relative overflow-hidden">
                <img
                  src={HERO_IMAGE}
                  alt="eBuy-Partner Global Commerce"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EBuyPartnerLogo size={36} />
                    <div>
                      <p className="text-xs font-bold text-slate-900">eBay Sister Entity Verified</p>
                      <p className="text-[10px] text-slate-500 font-mono">License #EB-PARTNER-2024</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-[#F4511E] uppercase tracking-wider">
              Architecture & Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              eBuy-Partner Verified Infrastructure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <Award className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Official eBay Inc. Alliance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Certified promotional partner charter under statutory US commercial licensing deed #EB-PARTNER-2024-884920-US.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-8 h-8 text-[#F4511E] mb-4" />
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                USD Double-Entry Balance Ledger
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero arbitrary balance increments. Every reward credit and withdrawal is paired with a verifiable ledger receipt.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <Globe2 className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                8 Registered Jurisdictions
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full statutory corporate presence with certified local business licenses across USA, UK, UAE, Thailand, India, Pakistan, Brazil, and Turkey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent FAQ Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[#F4511E] uppercase tracking-wider">
              Transparency & Compliance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4"
                  >
                    <span className="text-sm font-semibold text-slate-900">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed pr-8">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <EBuyPartnerLogo size={32} />
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-900 text-sm">
                  eBuy-Partner Commercial Services Inc.
                </span>
                <span className="text-[10px] text-slate-400">
                  Authorized Sister Company & Promotional Affiliate of eBay Inc.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setCurrentView('plans')}
                className="hover:text-slate-900 transition-colors"
              >
                Deposit Plans
              </button>
              <button
                onClick={() => setCurrentView('company_docs')}
                className="hover:text-slate-900 transition-colors"
              >
                Company Docs
              </button>
              <button
                onClick={() => setIsLicenseModalOpen(true)}
                className="text-amber-800 hover:text-amber-950 font-bold transition-colors"
              >
                eBay License
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="hover:text-slate-900 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2024–2026 eBuy-Partner Global Commercial Services Inc. All rights reserved.</p>
            <p className="text-[11px] text-slate-400">
              Statutory License #EB-PARTNER-2024-884920-US · Single USD ($) Currency Architecture.
            </p>
          </div>
        </div>
      </footer>

      {/* Official eBay License Modal */}
      <EbayLicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      />
    </div>
  );
};
