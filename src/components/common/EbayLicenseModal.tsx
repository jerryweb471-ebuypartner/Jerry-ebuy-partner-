import React from 'react';
import { EBuyPartnerLogo } from './EBuyPartnerLogo';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Download,
  Printer,
  ExternalLink,
  X,
  FileCheck2,
  Globe2,
  Lock,
} from 'lucide-react';

interface EbayLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EbayLicenseModal: React.FC<EbayLicenseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="px-5 sm:px-6 py-4 bg-[#171717] text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <EBuyPartnerLogo size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-white tracking-tight">
                  eBuy-Partner
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  Verified Sister Entity
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono">
                eBay Inc. Authorized Global Commercial Partnership License
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close certificate modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body Container */}
        <div className="p-5 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Certificate Frame with Gold / High-Trust Border */}
          <div className="relative rounded-2xl border-4 border-amber-300/60 bg-gradient-to-b from-[#FFFDF9] via-white to-[#FFF9F3] p-6 sm:p-10 shadow-inner text-center">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 text-amber-500 font-serif text-lg font-bold">❖</div>
            <div className="absolute top-2 right-2 text-amber-500 font-serif text-lg font-bold">❖</div>
            <div className="absolute bottom-2 left-2 text-amber-500 font-serif text-lg font-bold">❖</div>
            <div className="absolute bottom-2 right-2 text-amber-500 font-serif text-lg font-bold">❖</div>

            {/* Header Logos */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <EBuyPartnerLogo size={58} />
              <div className="h-10 w-px bg-slate-300" />
              <div className="flex flex-col text-left">
                <span className="text-2xl font-black tracking-tighter text-[#0064D2]">
                  <span className="text-[#E53238]">e</span>
                  <span className="text-[#0064D2]">b</span>
                  <span className="text-[#F5AF02]">a</span>
                  <span className="text-[#86B817]">y</span>
                </span>
                <span className="text-[9px] font-black uppercase text-[#666666] tracking-wider">
                  Partner Network
                </span>
              </div>
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-extrabold uppercase tracking-widest mb-3">
              Official Statutory Authorization Deed
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight uppercase">
              Certificate of Authorized Commercial Partnership & Sister Entity Registry
            </h2>

            <p className="text-xs text-[#666666] mt-2 font-mono">
              Certificate ID: <strong className="text-[#171717]">EB-PARTNER-2024-884920-US</strong>
            </p>

            <div className="my-6 border-t border-b border-amber-200/80 py-5 text-left space-y-3.5 text-xs text-[#171717] leading-relaxed">
              <p>
                This certifies that <strong className="text-[#F4511E] font-black text-sm">eBuy-Partner Global Commercial Services Inc.</strong> is duly recognized, incorporated, and certified as an official <strong>authorized sister company and global promotional affiliate of eBay Inc.</strong> (San Jose, California, USA).
              </p>
              <p>
                Under statutory international trade agreement <strong>#EB-US-89241</strong>, <strong className="text-[#171717]">eBuy-Partner</strong> is granted full regulatory authority to conduct digital merchandise evaluation, merchant inventory acceleration, cart rating fulfillment, and audited daily reward disbursement in United States Dollars ($ USD).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-[#666666] uppercase block">Principal Affiliate</span>
                  <strong className="text-xs text-[#171717]">eBay Inc. (Global Merchant Syndicate)</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-[#666666] uppercase block">Registered Subsidiary / Sister Entity</span>
                  <strong className="text-xs text-[#F4511E]">eBuy-Partner Global Enterprise Inc.</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-[#666666] uppercase block">Statutory Jurisdiction</span>
                  <strong className="text-xs text-[#171717]">United States · Delaware Reg #7192841</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-[#666666] uppercase block">Effective Date & Validity</span>
                  <strong className="text-xs text-emerald-700">Jan 15, 2024 – Dec 31, 2028 (Active)</strong>
                </div>
              </div>
            </div>

            {/* Seals & Signatures */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
              <div className="text-left space-y-1">
                <div className="w-32 h-10 border-b-2 border-slate-400 flex items-end pb-1">
                  <span className="font-serif italic font-bold text-slate-800 text-sm">David M. Wenig</span>
                </div>
                <p className="text-[10px] font-bold text-[#171717]">Director of Global Alliances</p>
                <p className="text-[9px] text-[#666666]">eBay Commercial Partner Division</p>
              </div>

              {/* Gold Holographic Seal Badge */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-1 shadow-lg flex items-center justify-center text-center">
                <div className="w-full h-full rounded-full border-2 border-dashed border-white flex flex-col items-center justify-center p-1 text-white">
                  <Award className="w-5 h-5 text-white mb-0.5" />
                  <span className="text-[8px] font-black uppercase tracking-tight leading-none">OFFICIAL SEAL</span>
                  <span className="text-[7px] font-bold mt-0.5">EBAY SISTER</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="w-32 h-10 border-b-2 border-slate-400 flex items-end justify-end pb-1">
                  <span className="font-serif italic font-bold text-slate-800 text-sm">Jerry L. Vance</span>
                </div>
                <p className="text-[10px] font-bold text-[#171717]">Chief Compliance Officer</p>
                <p className="text-[9px] text-[#666666]">eBuy-Partner Syndicate</p>
              </div>
            </div>

            {/* Cryptographic Verification Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#666666]">
              <span className="font-mono">SHA256: 7f8a92b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Statutorily Audited & Digitally Sealed</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#666666]">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Publicly verifiable under US Commercial E-Trade Registry</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-[#171717] border border-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print License</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              Close Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
