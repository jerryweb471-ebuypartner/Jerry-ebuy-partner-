import React, { useState } from 'react';
import { EBuyPartnerLogo } from './EBuyPartnerLogo';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Download,
  Printer,
  X,
  FileCheck2,
  Globe2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  BadgeCheck,
  Building2,
  Stamp,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EbayLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

export const EbayLicenseModal: React.FC<EbayLicenseModalProps> = ({
  isOpen,
  onClose,
  initialPage = 1,
}) => {
  const { showToast } = useApp();
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const totalPages = 6;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      showToast(
        'Statutory 6-Page Corporate Dossier (#EB-PARTNER-2024-884920-US) downloaded successfully.',
        'success'
      );
    }, 800);
  };

  const pageTitles = [
    { num: 1, title: 'Delaware Certificate of Incorporation & Good Standing', short: 'Incorporation' },
    { num: 2, title: 'eBay Inc. Strategic Sister Entity Joint Venture Deed', short: 'eBay Partnership' },
    { num: 3, title: 'FinCEN MSB & Anti-Money Laundering (AML/CFT) Charter', short: 'AML/FinCEN' },
    { num: 4, title: 'Cross-Border Logistics & Merchant Rating Framework', short: 'Merchant Network' },
    { num: 5, title: 'Digital Escrow, Smart Contract & Liquidity Assurance Deed', short: 'Escrow & Audit' },
    { num: 6, title: 'Master Executive Signature & Notarial Attestation Deed', short: 'Signatures & Notary' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-[#1C1C1E] text-white rounded-3xl max-w-5xl w-full shadow-2xl border border-neutral-700 overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#141416] border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          {/* Logo & Entity Meta */}
          <div className="flex items-center gap-3">
            <EBuyPartnerLogo size={36} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-white tracking-tight">
                  eBuy<span className="text-[#F4511E]">-Partner</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  eBay Sister Company
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  Delaware File #7192841-DE
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono">
                Official 6-Page Statutory Legal & Partnership Dossier
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setViewMode('single')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  viewMode === 'single'
                    ? 'bg-[#F4511E] text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Page by Page
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  viewMode === 'all'
                    ? 'bg-[#F4511E] text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All 6 Pages
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
              title="Print official document dossier"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Dossier</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-3.5 py-1.5 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              title="Download official PDF package"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Exporting...' : 'Save PDF'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-1"
              aria-label="Close document viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page Navigation Tabs (Single Mode) */}
        <div className="bg-[#18181A] px-4 py-2 border-b border-neutral-800 overflow-x-auto flex items-center gap-2 print:hidden scrollbar-none">
          {pageTitles.map((p) => {
            const isActive = viewMode === 'single' && currentPage === p.num;
            return (
              <button
                key={p.num}
                onClick={() => {
                  setViewMode('single');
                  setCurrentPage(p.num);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-white text-[#171717] shadow-sm ring-2 ring-amber-400'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isActive ? 'bg-[#F4511E] text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {p.num}
                </span>
                <span>{p.short}</span>
              </button>
            );
          })}
        </div>

        {/* Document Viewing Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 bg-neutral-900/60 print:p-0 print:bg-white print:overflow-visible space-y-8">
          {/* Render Page 1 */}
          {(viewMode === 'all' || currentPage === 1) && <PageOneIncorporation />}

          {/* Render Page 2 */}
          {(viewMode === 'all' || currentPage === 2) && <PageTwoEbayAgreement />}

          {/* Render Page 3 */}
          {(viewMode === 'all' || currentPage === 3) && <PageThreeFinCENCompliance />}

          {/* Render Page 4 */}
          {(viewMode === 'all' || currentPage === 4) && <PageFourLogisticsSettlement />}

          {/* Render Page 5 */}
          {(viewMode === 'all' || currentPage === 5) && <PageFiveEscrowSmartContract />}

          {/* Render Page 6 (Master Signatures & Notary Attestation) */}
          {(viewMode === 'all' || currentPage === 6) && <PageSixExecutiveSignatures />}
        </div>

        {/* Bottom Pagination Controller (Single Mode, Hidden in Print) */}
        {viewMode === 'single' && (
          <div className="px-4 sm:px-6 py-3 bg-[#141416] border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 print:hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-white">Page {currentPage}</span>
              <span>of</span>
              <span>{totalPages}</span>
              <span className="hidden sm:inline-block text-neutral-600">|</span>
              <span className="hidden sm:inline-block text-neutral-300 font-sans">
                {pageTitles[currentPage - 1]?.title}
              </span>
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 rounded-xl bg-[#F4511E] hover:bg-[#E5390B] text-white font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// PAGE 1: DELAWARE CERTIFICATE OF INCORPORATION
// ==========================================
const PageOneIncorporation: React.FC = () => (
  <div className="bg-[#FAF8F5] text-[#171717] rounded-2xl shadow-xl border-4 border-amber-300/80 p-6 sm:p-10 max-w-3xl mx-auto relative font-serif print:shadow-none print:border-2 print:max-w-none print:rounded-none print:page-break-after-always">
    {/* Guilloche Corner Ornaments */}
    <div className="absolute top-3 left-3 text-amber-600 text-lg">❖</div>
    <div className="absolute top-3 right-3 text-amber-600 text-lg">❖</div>
    <div className="absolute bottom-3 left-3 text-amber-600 text-lg">❖</div>
    <div className="absolute bottom-3 right-3 text-amber-600 text-lg">❖</div>

    {/* Header & Official Delaware State Seal */}
    <div className="text-center space-y-2 border-b-2 border-amber-300/80 pb-6">
      <div className="flex items-center justify-center gap-3">
        <DelawareStateSealSvg />
      </div>
      <h3 className="text-xs font-mono font-bold tracking-[0.25em] text-neutral-600 uppercase">
        State of Delaware · Division of Corporations
      </h3>
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171717] uppercase">
        Certificate of Incorporation & Good Standing
      </h1>
      <p className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100/80 inline-block px-3 py-0.5 rounded-full border border-amber-300">
        Authentication File Number: #7192841-DE · SR 20248839102
      </p>
    </div>

    {/* Statutory Certificate Body */}
    <div className="my-6 space-y-4 text-xs sm:text-[13px] leading-relaxed text-[#2A2A2A]">
      <p>
        <strong>I, JEFFREY W. BULLOCK, SECRETARY OF STATE OF THE STATE OF DELAWARE</strong>, DO HEREBY CERTIFY THAT{' '}
        <span className="font-sans font-black text-[#F4511E] bg-[#FFF4ED] px-1 py-0.5 rounded">
          eBuy-Partner Global Enterprise Inc.
        </span>{' '}
        IS DULY INCORPORATED UNDER THE LAWS OF THE STATE OF DELAWARE AND IS IN GOOD STANDING AND HAS A LEGAL CORPORATE EXISTENCE SO FAR AS THE RECORDS OF THIS OFFICE SHOW, AS OF THE FIFTEENTH DAY OF JANUARY, A.D. 2024.
      </p>

      <p>
        AND I DO HEREBY FURTHER CERTIFY THAT THE AFORESAID CORPORATION IS AN AUTHORIZED COMMERCIAL ENTITY AND PRINCIPAL GLOBAL AFFILIATE OPERATING IN ALLIANCE WITH <strong>EBAY INC.</strong> PURSUANT TO STATUTORY MERCHANDISE PROMOTION AND CARRIER CLEARING AGREEMENTS.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 font-sans text-xs bg-white p-4 rounded-xl border border-amber-200/80 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">Entity Legal Name</span>
          <strong className="text-xs text-[#171717]">eBuy-Partner Global Enterprise Inc.</strong>
        </div>
        <div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">Entity File Number</span>
          <strong className="text-xs text-[#F4511E] font-mono">7192841-DE</strong>
        </div>
        <div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">Registered Office Address</span>
          <span className="text-xs text-[#171717]">1209 North Orange Street, Wilmington, DE 19801</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">Authorized Capital Stock</span>
          <strong className="text-xs text-emerald-700 font-mono">$10,000,000.00 USD (Common / Class A)</strong>
        </div>
      </div>

      <p>
        AND I DO HEREBY FURTHER CERTIFY THAT ALL ANNUAL FRANCHISE TAXES AND STATUTORY ASSESSMENTS HAVE BEEN PAID TO DATE, AND THAT NO ARTICLES OF DISSOLUTION HAVE BEEN FILED.
      </p>
    </div>

    {/* Verification Barcode & Registrar Signature */}
    <div className="pt-4 border-t-2 border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="space-y-1 text-center sm:text-left">
        <BarcodeSvg />
        <p className="text-[9px] font-mono text-neutral-500">
          Verify via corp.delaware.gov/verify/7192841-DE
        </p>
      </div>

      <div className="text-center sm:text-right space-y-1">
        <SecretarySignatureSvg />
        <p className="text-xs font-bold text-[#171717]">Jeffrey W. Bullock</p>
        <p className="text-[10px] text-neutral-600">Secretary of State, Delaware</p>
      </div>
    </div>
  </div>
);

// ==========================================
// PAGE 2: EBAY INC. STRATEGIC SISTER ENTITY AGREEMENT
// ==========================================
const PageTwoEbayAgreement: React.FC = () => (
  <div className="bg-[#FAF8F5] text-[#171717] rounded-2xl shadow-xl border-4 border-slate-300 p-6 sm:p-10 max-w-3xl mx-auto relative font-serif print:shadow-none print:border-2 print:max-w-none print:rounded-none print:page-break-after-always">
    {/* Corner Ornaments */}
    <div className="absolute top-3 left-3 text-slate-400 text-lg">❖</div>
    <div className="absolute top-3 right-3 text-slate-400 text-lg">❖</div>

    {/* Joint Header */}
    <div className="text-center space-y-2 border-b-2 border-slate-300 pb-6">
      <div className="flex items-center justify-center gap-4">
        <EBuyPartnerLogo size={48} />
        <div className="h-8 w-px bg-slate-300" />
        <div className="text-left font-sans">
          <span className="text-2xl font-black text-[#0064D2]">
            <span className="text-[#E53238]">e</span>
            <span className="text-[#0064D2]">b</span>
            <span className="text-[#F5AF02]">a</span>
            <span className="text-[#86B817]">y</span>
          </span>
          <span className="block text-[9px] font-bold text-neutral-500 tracking-wider uppercase">
            Global Partner Syndicate
          </span>
        </div>
      </div>
      <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-neutral-600 uppercase">
        Statutory Commercial Alliance Deed #EB-PARTNER-2024-884920-US
      </h3>
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171717] uppercase">
        Strategic Sister Entity & Cart Rating Master Agreement
      </h1>
      <p className="text-[11px] font-mono text-neutral-600">
        Effective: January 15, 2024 · Governing Law: State of Delaware & California, USA
      </p>
    </div>

    {/* Agreement Clauses */}
    <div className="my-6 space-y-3.5 text-xs sm:text-[13px] leading-relaxed text-[#2A2A2A]">
      <p>
        This Strategic Execution Instrument (the <strong>"Agreement"</strong>) is entered into by and between <strong>eBay Inc.</strong>, a Delaware Corporation headquartered at 2025 Hamilton Avenue, San Jose, CA 95125 (<strong>"Principal"</strong>), and <strong>eBuy-Partner Global Enterprise Inc.</strong>, a Delaware Corporation (<strong>"Sister Company & Affiliate"</strong>).
      </p>

      <div className="space-y-2.5 font-sans bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <div className="border-b border-slate-100 pb-2">
          <strong className="text-[#F4511E] block">1. Grant of Sister Entity Commercial Status:</strong>
          <span className="text-neutral-700">
            Principal hereby appoints and ratifies eBuy-Partner as an authorized Sister Entity and international ratings clearing network for certified merchant product inventories across 8 regional global jurisdictions.
          </span>
        </div>

        <div className="border-b border-slate-100 pb-2">
          <strong className="text-[#F4511E] block">2. Daily USD Commission Settlement Mandate:</strong>
          <span className="text-neutral-700">
            eBuy-Partner is authorized to conduct high-frequency algorithmic catalog evaluation, user star ratings, order boost acceleration, and direct reward distribution in United States Dollars ($ USD).
          </span>
        </div>

        <div>
          <strong className="text-[#F4511E] block">3. Capital Escrow & Liquidity Underwriting:</strong>
          <span className="text-neutral-700">
            Principal maintains an active multi-signatory liquidity backstop deed guaranteeing participant deposits and commission disbursements with 100% reserve verification.
          </span>
        </div>
      </div>

      <p>
        IN WITNESS OF STATUTORY AUTHORITY, this commercial covenant is registered under global e-commerce regulatory compliance deeds with perpetual validity across all recognized subsidiary nodes.
      </p>
    </div>

    {/* Footer Stamp */}
    <div className="pt-4 border-t-2 border-slate-300 flex items-center justify-between text-xs">
      <div className="font-mono text-[10px] text-neutral-500">
        Deed Hash: 0x8f72...b910e4 • Audited Active
      </div>
      <div className="flex items-center gap-2">
        <EbaySealStampSvg />
      </div>
    </div>
  </div>
);

// ==========================================
// PAGE 3: FINCEN MSB & AML/CFT REGULATORY CHARTER
// ==========================================
const PageThreeFinCENCompliance: React.FC = () => (
  <div className="bg-[#FAF8F5] text-[#171717] rounded-2xl shadow-xl border-4 border-emerald-300/80 p-6 sm:p-10 max-w-3xl mx-auto relative font-serif print:shadow-none print:border-2 print:max-w-none print:rounded-none print:page-break-after-always">
    <div className="text-center space-y-2 border-b-2 border-emerald-300/80 pb-6">
      <div className="flex items-center justify-center gap-3">
        <TreasurySealSvg />
      </div>
      <h3 className="text-xs font-mono font-bold tracking-[0.25em] text-emerald-800 uppercase">
        U.S. Department of the Treasury · FinCEN
      </h3>
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171717] uppercase">
        Money Services Business (MSB) & AML/CFT Compliance Charter
      </h1>
      <p className="text-[11px] font-mono font-bold text-emerald-900 bg-emerald-100/80 inline-block px-3 py-0.5 rounded-full border border-emerald-300">
        MSB Registration Number: #31000289410928
      </p>
    </div>

    <div className="my-6 space-y-4 text-xs sm:text-[13px] leading-relaxed text-[#2A2A2A]">
      <p>
        The Financial Crimes Enforcement Network (FinCEN) hereby confirms the registration of <strong>eBuy-Partner Global Enterprise Inc.</strong> as an active Money Services Business (MSB) pursuant to Title 31 of the Code of Federal Regulations (CFR) § 1022.380.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">MSB Activity Categories</span>
          <strong className="text-xs text-[#171717]">Dealer in Foreign Exchange · Money Transmitter · Digital Escrow Node</strong>
        </div>
        <div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">Compliance Jurisdiction</span>
          <strong className="text-xs text-[#171717]">United States & Global Cross-Border Corridors</strong>
        </div>
        <div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">Sanctions Screening Standard</span>
          <strong className="text-xs text-emerald-700">OFAC Real-Time Screening & PEP Validation</strong>
        </div>
        <div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">Audit Verification Cycle</span>
          <strong className="text-xs text-[#171717]">Continuous SOC 2 Type II & BSA Independent Audits</strong>
        </div>
      </div>

      <p>
        This charter confirms full adherence to the Bank Secrecy Act (BSA), the USA PATRIOT Act, and Financial Action Task Force (FATF) Recommendation 16 for cryptographic and fiat transaction disclosures.
      </p>
    </div>

    <div className="pt-4 border-t-2 border-emerald-300/80 flex items-center justify-between text-xs">
      <div className="font-mono text-[10px] text-neutral-500">
        Registration Status: ACTIVE & VERIFIED IN GOOD STANDING
      </div>
      <div className="font-sans text-right">
        <span className="text-[10px] font-bold text-neutral-500 uppercase block">Compliance Officer</span>
        <strong className="text-xs text-[#171717]">Marcus Vance, CAMS Certified</strong>
      </div>
    </div>
  </div>
);

// ==========================================
// PAGE 4: CROSS-BORDER LOGISTICS & MERCHANT NETWORK
// ==========================================
const PageFourLogisticsSettlement: React.FC = () => (
  <div className="bg-[#FAF8F5] text-[#171717] rounded-2xl shadow-xl border-4 border-blue-300/80 p-6 sm:p-10 max-w-3xl mx-auto relative font-serif print:shadow-none print:border-2 print:max-w-none print:rounded-none print:page-break-after-always">
    <div className="text-center space-y-2 border-b-2 border-blue-300/80 pb-6">
      <div className="flex items-center justify-center gap-3">
        <Globe2 className="w-10 h-10 text-blue-600" />
      </div>
      <h3 className="text-xs font-mono font-bold tracking-[0.25em] text-blue-800 uppercase">
        eBay Merchant Rating & Fulfillment Syndicate
      </h3>
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171717] uppercase">
        Global Multi-Jurisdiction Merchant Clearing Network
      </h1>
      <p className="text-[11px] font-mono text-blue-900 bg-blue-100/80 inline-block px-3 py-0.5 rounded-full border border-blue-300">
        Standard ISO/IEC 27001 Certified Cross-Border Hubs
      </p>
    </div>

    <div className="my-6 space-y-3.5 text-xs sm:text-[13px] leading-relaxed text-[#2A2A2A]">
      <p>
        The eBuy-Partner merchant logistics protocol synchronizes 8 global corporate operating nodes with eBay's real-time merchant product catalog to accelerate verified user product evaluations and instant commissions.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-sans text-[11px] bg-white p-3.5 rounded-xl border border-blue-200">
        <div className="p-2 bg-slate-50 rounded-lg">
          <strong className="block text-[#171717]">🇺🇸 United States</strong>
          <span className="text-[9px] text-neutral-500 font-mono">Delaware #7192841</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <strong className="block text-[#171717]">🇬🇧 United Kingdom</strong>
          <span className="text-[9px] text-neutral-500 font-mono">UK Co. #14920412</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <strong className="block text-[#171717]">🇩🇪 Germany / EU</strong>
          <span className="text-[9px] text-neutral-500 font-mono">HRB 910482 Frankfurt</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <strong className="block text-[#171717]">🇧🇷 Brazil (LATAM)</strong>
          <span className="text-[9px] text-neutral-500 font-mono">CNPJ 51.982.314/0001</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <strong className="block text-[#171717]">🇦🇪 UAE / MENA</strong>
          <span className="text-[9px] text-neutral-500 font-mono">DIFC Lic. #CL-5829</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <strong className="block text-[#171717]">🇯🇵 Japan (APAC)</strong>
          <span className="text-[9px] text-neutral-500 font-mono">JCN 0100-01-209412</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <strong className="block text-[#171717]">🇦🇺 Australia</strong>
          <span className="text-[9px] text-neutral-500 font-mono">ACN 659 104 882</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <strong className="block text-[#171717]">🇸🇬 Singapore</strong>
          <span className="text-[9px] text-neutral-500 font-mono">UEN 202319402G</span>
        </div>
      </div>

      <p className="text-xs">
        All clearing nodes execute automated multi-tier escrow settlement guarantees with zero settlement default risk for participating retail partners.
      </p>
    </div>

    <div className="pt-4 border-t-2 border-blue-300/80 flex items-center justify-between text-xs">
      <div className="font-mono text-[10px] text-neutral-500">
        Audited Node Uptime: 99.998% SLA
      </div>
      <div className="font-sans text-right">
        <span className="text-[10px] font-bold text-neutral-500 uppercase block">Infrastructure Lead</span>
        <strong className="text-xs text-[#171717]">Dr. Raymond H. Chen</strong>
      </div>
    </div>
  </div>
);

// ==========================================
// PAGE 5: DIGITAL ESCROW, SMART CONTRACT & LIQUIDITY AUDIT
// ==========================================
const PageFiveEscrowSmartContract: React.FC = () => (
  <div className="bg-[#FAF8F5] text-[#171717] rounded-2xl shadow-xl border-4 border-purple-300/80 p-6 sm:p-10 max-w-3xl mx-auto relative font-serif print:shadow-none print:border-2 print:max-w-none print:rounded-none print:page-break-after-always">
    <div className="text-center space-y-2 border-b-2 border-purple-300/80 pb-6">
      <div className="flex items-center justify-center gap-3">
        <CertikAuditSealSvg />
      </div>
      <h3 className="text-xs font-mono font-bold tracking-[0.25em] text-purple-800 uppercase">
        Smart Contract & Proof of Reserve Audit
      </h3>
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171717] uppercase">
        Proof of Reserve (PoR) & Liquidity Escrow Assurance
      </h1>
      <p className="text-[11px] font-mono font-bold text-purple-900 bg-purple-100/80 inline-block px-3 py-0.5 rounded-full border border-purple-300">
        CertiK & OpenZeppelin Formal Security Audit #CK-2024-88319
      </p>
    </div>

    <div className="my-6 space-y-4 text-xs sm:text-[13px] leading-relaxed text-[#2A2A2A]">
      <p>
        This formal attestation certifies that the <strong>eBuy-Partner Escrow & Settlement Engine</strong> has undergone thorough cryptographic source-code verification, reentrancy audits, multi-signature key ceremony review, and real-time Proof of Reserves validation.
      </p>

      <div className="space-y-2.5 font-sans bg-white p-4 rounded-xl border border-purple-200 text-xs">
        <div className="flex items-center justify-between border-b border-purple-100 pb-2">
          <span className="font-bold text-neutral-600">Total Backed Liquidity Underwriting:</span>
          <span className="font-mono font-black text-emerald-700 text-sm">$50,000,000.00 USD</span>
        </div>
        <div className="flex items-center justify-between border-b border-purple-100 pb-2">
          <span className="font-bold text-neutral-600">Smart Contract Escrow Address:</span>
          <span className="font-mono text-[#F4511E] text-[11px]">0x7192841DE42A9801...EBuyPartnerCore</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-neutral-600">Security Score & Vulnerability Index:</span>
          <span className="font-mono font-bold text-purple-700">99.4 / 100 (Tier 1 Institutional Grade)</span>
        </div>
      </div>

      <p>
        Participant wallet funds, pending orders, and commission claims are secured by multi-party computation (MPC) cold storage custody vaults.
      </p>
    </div>

    <div className="pt-4 border-t-2 border-purple-300/80 flex items-center justify-between text-xs">
      <div className="font-mono text-[10px] text-neutral-500">
        Merkle Proof Root: 0x9a83...4c18f2
      </div>
      <div className="font-sans text-right">
        <span className="text-[10px] font-bold text-neutral-500 uppercase block">Lead Security Auditor</span>
        <strong className="text-xs text-[#171717]">CertiK Senior Audit Syndicate</strong>
      </div>
    </div>
  </div>
);

// ==========================================
// PAGE 6: MASTER EXECUTIVE SIGNATURES & NOTARIAL ATTESTATION (ULTRA-REALISTIC HANDWRITING)
// ==========================================
const PageSixExecutiveSignatures: React.FC = () => (
  <div className="bg-[#FAF8F5] text-[#171717] rounded-2xl shadow-xl border-4 border-amber-400 p-6 sm:p-10 max-w-3xl mx-auto relative font-serif print:shadow-none print:border-2 print:max-w-none print:rounded-none">
    {/* Decorative corner accents */}
    <div className="absolute top-3 left-3 text-amber-600 text-lg">❖</div>
    <div className="absolute top-3 right-3 text-amber-600 text-lg">❖</div>
    <div className="absolute bottom-3 left-3 text-amber-600 text-lg">❖</div>
    <div className="absolute bottom-3 right-3 text-amber-600 text-lg">❖</div>

    {/* Header */}
    <div className="text-center space-y-2 border-b-2 border-amber-300 pb-5">
      <div className="flex items-center justify-center gap-3">
        <EBuyPartnerLogo size={44} />
      </div>
      <h3 className="text-xs font-mono font-bold tracking-[0.25em] text-neutral-600 uppercase">
        Statutory Execution & Notarial Attestation Page
      </h3>
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171717] uppercase">
        Master Executive Endorsement & Official Seal
      </h1>
      <p className="text-[11px] font-mono text-neutral-600">
        Dossier Reference: #EB-PARTNER-2024-884920-US · Execution Date: January 15, 2024
      </p>
    </div>

    {/* Formal Witness Statement */}
    <div className="my-5 text-xs sm:text-[13px] leading-relaxed text-[#2A2A2A] space-y-2">
      <p>
        <strong>IN WITNESS WHEREOF</strong>, the Parties hereto have caused this Master Sister Entity & Global Commercial Partnership Charter to be executed by their duly authorized executive officers as of January 15, 2024.
      </p>
      <p className="text-[11px] text-neutral-600 font-sans italic">
        Each signature below constitutes an authentic, legally binding statutory execution under the Uniform Electronic Transactions Act (UETA) and Delaware General Corporation Law.
      </p>
    </div>

    {/* 3 Real Hand-Written Fountain Pen Signatures Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 font-sans">
      {/* Signature 1: David M. Wenig (eBay Inc.) */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-left space-y-1 relative shadow-2xs">
        <span className="text-[9px] font-bold text-neutral-400 uppercase block">Principal Signatory (eBay)</span>
        <div className="h-16 flex items-end pb-1 border-b-2 border-slate-300">
          <HandwrittenDavidSignatureSvg />
        </div>
        <p className="text-xs font-bold text-[#171717] pt-1">David M. Wenig</p>
        <p className="text-[10px] text-neutral-600 leading-tight">Director & VP of Global Alliances</p>
        <p className="text-[9px] font-bold text-[#0064D2]">eBay Inc. Commercial Division</p>
      </div>

      {/* Signature 2: Alexander J. Vance (eBuy-Partner) */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-left space-y-1 relative shadow-2xs">
        <span className="text-[9px] font-bold text-neutral-400 uppercase block">Chief Executive Officer</span>
        <div className="h-16 flex items-end pb-1 border-b-2 border-slate-300">
          <HandwrittenAlexanderSignatureSvg />
        </div>
        <p className="text-xs font-bold text-[#171717] pt-1">Alexander J. Vance</p>
        <p className="text-[10px] text-neutral-600 leading-tight">Chief Executive Officer & Chairman</p>
        <p className="text-[9px] font-bold text-[#F4511E]">eBuy-Partner Global Enterprise Inc.</p>
      </div>

      {/* Signature 3: Elena Rostova, Esq. (Legal Counsel) */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-left space-y-1 relative shadow-2xs">
        <span className="text-[9px] font-bold text-neutral-400 uppercase block">Chief Legal Officer</span>
        <div className="h-16 flex items-end pb-1 border-b-2 border-slate-300">
          <HandwrittenElenaSignatureSvg />
        </div>
        <p className="text-xs font-bold text-[#171717] pt-1">Elena Rostova, Esq.</p>
        <p className="text-[10px] text-neutral-600 leading-tight">General Counsel & Secretary</p>
        <p className="text-[9px] font-bold text-neutral-700">Corporate Bar Reg. #DE-49201</p>
      </div>
    </div>

    {/* DELAWARE NOTARIAL CERTIFICATE & EMBOSSED GOLD FOIL SEAL */}
    <div className="mt-6 pt-5 border-t-2 border-amber-300/80 bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Notary Text & Handwritten Notary Signature */}
      <div className="flex-1 text-left space-y-2 text-xs text-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <Stamp className="w-4 h-4 text-amber-700" />
          <span className="font-bold text-[11px] font-sans text-amber-950 uppercase tracking-wider">
            State of Delaware · County of New Castle
          </span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Subscribed and sworn to before me this <strong>15th day of January, 2024</strong>, by David M. Wenig, Alexander J. Vance, and Elena Rostova, who proved to me on the basis of satisfactory evidence to be the persons who appeared before me.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="space-y-0.5">
            <HandwrittenNotarySignatureSvg />
            <p className="text-[10px] font-bold text-[#171717] font-sans">Sarah Jenkins, Notary Public</p>
            <p className="text-[9px] text-neutral-500 font-mono">Commission Expiry: Nov 14, 2028 · Reg #DE-892401</p>
          </div>

          <div className="p-2 bg-amber-50 rounded-lg border border-amber-300 font-mono text-[9px] text-amber-900">
            [OFFICIAL NOTARIAL SEAL • STATE OF DELAWARE]
          </div>
        </div>
      </div>

      {/* 3D Embossed Scalloped Gold Foil Corporate Seal */}
      <div className="shrink-0 flex flex-col items-center">
        <EmbossedGoldFoilSealSvg />
      </div>
    </div>
  </div>
);

// ==========================================
// REALISTIC SIGNATURE AND SEAL VECTOR ASSETS
// ==========================================

const HandwrittenDavidSignatureSvg: React.FC = () => (
  <svg viewBox="0 0 240 60" className="w-full h-14 overflow-visible">
    <path
      d="M 12 38 C 22 14, 28 8, 38 18 C 45 28, 32 46, 48 38 C 60 30, 72 20, 85 24 C 95 28, 90 40, 105 32 C 120 22, 130 14, 145 20 C 158 26, 150 42, 168 34 C 185 24, 200 12, 220 22"
      fill="none"
      stroke="#1E3A8A"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-xs"
    />
    <path
      d="M 20 48 C 65 44, 130 46, 215 42"
      fill="none"
      stroke="#1E3A8A"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const HandwrittenAlexanderSignatureSvg: React.FC = () => (
  <svg viewBox="0 0 240 60" className="w-full h-14 overflow-visible">
    <path
      d="M 15 42 C 26 10, 36 6, 44 26 C 50 42, 62 40, 75 22 C 85 8, 98 12, 108 30 C 118 45, 135 15, 155 25 C 170 34, 185 18, 205 28 C 218 35, 228 20, 235 25"
      fill="none"
      stroke="#0F172A"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-xs"
    />
    <path
      d="M 30 50 C 90 45, 160 48, 225 44"
      fill="none"
      stroke="#0F172A"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const HandwrittenElenaSignatureSvg: React.FC = () => (
  <svg viewBox="0 0 240 60" className="w-full h-14 overflow-visible">
    <path
      d="M 10 32 C 20 18, 30 12, 42 22 C 55 35, 45 48, 65 30 C 80 15, 95 10, 110 25 C 122 38, 138 20, 155 28 C 172 36, 190 14, 210 22 C 220 27, 230 35, 238 32"
      fill="none"
      stroke="#1D4ED8"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-xs"
    />
  </svg>
);

const HandwrittenNotarySignatureSvg: React.FC = () => (
  <svg viewBox="0 0 200 45" className="w-48 h-10 overflow-visible">
    <path
      d="M 8 28 C 18 12, 28 8, 38 22 C 48 35, 60 15, 75 26 C 90 36, 110 12, 130 22 C 148 30, 165 16, 185 24"
      fill="none"
      stroke="#1E40AF"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const SecretarySignatureSvg: React.FC = () => (
  <svg viewBox="0 0 180 45" className="w-40 h-10 overflow-visible">
    <path
      d="M 10 30 C 25 10, 40 8, 55 24 C 70 38, 85 14, 110 26 C 130 36, 150 12, 170 20"
      fill="none"
      stroke="#1E3A8A"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const DelawareStateSealSvg: React.FC = () => (
  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center">
    <div className="w-full h-full rounded-full border-2 border-dashed border-amber-100 flex flex-col items-center justify-center text-center p-1">
      <Award className="w-6 h-6 text-white" />
      <span className="text-[7px] font-black text-amber-50 tracking-tighter uppercase leading-none mt-0.5">
        STATE OF DELAWARE
      </span>
      <span className="text-[6px] font-bold text-amber-200">1787</span>
    </div>
  </div>
);

const BarcodeSvg: React.FC = () => (
  <div className="flex items-center gap-0.5 h-7">
    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2].map((w, i) => (
      <div key={i} className="bg-neutral-800 h-full" style={{ width: `${w * 1.5}px` }} />
    ))}
  </div>
);

const EbaySealStampSvg: React.FC = () => (
  <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-center p-1 text-slate-700">
    <ShieldCheck className="w-4 h-4 text-[#0064D2]" />
    <span className="text-[7px] font-black uppercase tracking-tighter leading-none mt-0.5">
      EBAY SISTER
    </span>
    <span className="text-[6px] font-mono">VERIFIED</span>
  </div>
);

const TreasurySealSvg: React.FC = () => (
  <div className="w-14 h-14 rounded-full bg-emerald-700 text-white flex flex-col items-center justify-center p-1 shadow-md border-2 border-emerald-300">
    <ShieldCheck className="w-6 h-6 text-emerald-200" />
    <span className="text-[7px] font-black uppercase tracking-tighter leading-none">FinCEN MSB</span>
  </div>
);

const CertikAuditSealSvg: React.FC = () => (
  <div className="w-14 h-14 rounded-full bg-purple-700 text-white flex flex-col items-center justify-center p-1 shadow-md border-2 border-purple-300">
    <Award className="w-6 h-6 text-purple-200" />
    <span className="text-[7px] font-black uppercase tracking-tighter leading-none">CERTIK AUDIT</span>
  </div>
);

const EmbossedGoldFoilSealSvg: React.FC = () => (
  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-1.5 shadow-xl flex items-center justify-center text-center">
    <div className="w-full h-full rounded-full border-2 border-dashed border-amber-100/90 flex flex-col items-center justify-center p-1 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 text-white shadow-inner">
      <Award className="w-6 h-6 text-amber-50 mb-0.5" />
      <span className="text-[8px] font-black uppercase tracking-tight text-white leading-none">
        OFFICIAL SEAL
      </span>
      <span className="text-[6px] font-bold text-amber-100 mt-0.5 uppercase tracking-wider">
        EBAY SISTER DEED
      </span>
      <span className="text-[5px] font-mono text-amber-200 mt-0.5">2024–2028</span>
    </div>
  </div>
);
