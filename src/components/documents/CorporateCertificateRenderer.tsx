import React from 'react';
import { EBuyPartnerLogo } from '../common/EBuyPartnerLogo';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  FileCheck2,
  Lock,
  QrCode,
  Stamp,
  Globe2,
} from 'lucide-react';

export interface DocumentCertificateProps {
  documentId: string;
  title: string;
  issuer?: string;
  country?: string;
  countryFlag?: string;
  registrationNumber?: string;
  issueDate?: string;
  companyName?: string;
  description?: string;
}

export const CorporateCertificateRenderer: React.FC<DocumentCertificateProps> = ({
  documentId,
  title,
  issuer = 'State of Delaware Division of Corporations',
  country = 'United States',
  countryFlag = '🇺🇸',
  registrationNumber = '7192841-DE / MSB-31000284910291',
  issueDate = '2024-01-15',
  companyName = 'eBuy-Partner Global Enterprise Inc.',
  description,
}) => {
  const isDelaware =
    documentId.includes('US') ||
    title.toLowerCase().includes('delaware') ||
    title.toLowerCase().includes('incorporation');

  const isEbay =
    documentId.includes('EBAY') ||
    title.toLowerCase().includes('ebay') ||
    title.toLowerCase().includes('sister');

  const isFincen =
    documentId.includes('FINCEN') ||
    title.toLowerCase().includes('fincen') ||
    title.toLowerCase().includes('msb');

  const isUK =
    documentId.includes('GB') ||
    documentId.includes('UK') ||
    country.toLowerCase().includes('united kingdom');

  const isDubai =
    documentId.includes('AE') ||
    documentId.includes('DED') ||
    country.toLowerCase().includes('emirates');

  const isPakistan =
    documentId.includes('PK') ||
    documentId.includes('SECP') ||
    country.toLowerCase().includes('pakistan');

  const isThailand =
    documentId.includes('TH') ||
    country.toLowerCase().includes('thailand');

  const isIndia =
    documentId.includes('IN') ||
    country.toLowerCase().includes('india');

  const isBrazil =
    documentId.includes('BR') ||
    country.toLowerCase().includes('brazil');

  const isTurkey =
    documentId.includes('TR') ||
    country.toLowerCase().includes('turkey');

  return (
    <div className="w-full bg-[#FAF8F5] p-4 sm:p-8 rounded-2xl border-4 border-[#D4AF37]/60 shadow-2xl relative overflow-hidden font-serif select-none text-[#1A1A1A]">
      {/* Intricate Guilloche / Classic Border Pattern */}
      <div className="absolute inset-2 border-2 border-[#D4AF37]/40 pointer-events-none rounded-xl" />
      <div className="absolute inset-3 border border-[#8B7355]/30 pointer-events-none rounded-lg" />
      
      {/* Corner Ornaments */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#D4AF37]" />

      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
        <EBuyPartnerLogo size={420} />
      </div>

      {/* Top Header Section */}
      <div className="relative text-center space-y-3 pb-6 border-b border-[#D4AF37]/40">
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">{countryFlag}</span>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF9E6] border border-[#D4AF37]/60 text-[#856404] text-[11px] font-bold uppercase tracking-widest font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Official Government & Statutory Registry Record</span>
          </div>
          <span className="text-2xl">{countryFlag}</span>
        </div>

        {/* Dynamic Authority Seal & Title */}
        <div className="pt-2">
          <p className="text-xs uppercase tracking-[0.25em] text-[#666666] font-sans font-bold">
            {issuer}
          </p>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#111827] mt-1 tracking-tight uppercase">
            {title}
          </h2>
          <p className="text-[11px] text-[#888888] font-sans italic mt-0.5">
            Jurisdiction: {country} • Official Registry Archival Filing
          </p>
        </div>
      </div>

      {/* Certificate Body */}
      <div className="relative py-6 space-y-5 text-center px-2 sm:px-6">
        <p className="text-xs sm:text-sm text-[#444444] leading-relaxed italic">
          This is to certify that the corporate entity detailed below has been lawfully constituted, registered, and authorized to conduct commercial enterprise operations, digital merchandise order rating, liquidity arbitrage, and international merchant settlement:
        </p>

        {/* Corporate Legal Name Box */}
        <div className="py-4 px-6 bg-gradient-to-r from-[#FFFDF9] via-[#FFF8E7] to-[#FFFDF9] rounded-xl border border-[#D4AF37]/50 shadow-inner">
          <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#856404]">
            Registered Corporate Legal Entity Name
          </p>
          <h3 className="text-lg sm:text-2xl font-black text-[#1F2937] tracking-normal mt-1">
            {companyName}
          </h3>
          <p className="text-xs font-sans text-[#F4511E] font-bold mt-1">
            Authorized Sister Enterprise & Commercial Partner of eBay Inc.
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left font-sans pt-2">
          <div className="p-3 bg-white/80 rounded-lg border border-[#E5E7EB] shadow-2xs">
            <p className="text-[9px] uppercase font-bold text-[#888888] tracking-wider">Registration Number</p>
            <p className="text-xs font-extrabold text-[#111827] mt-0.5 font-mono truncate">{registrationNumber}</p>
          </div>
          <div className="p-3 bg-white/80 rounded-lg border border-[#E5E7EB] shadow-2xs">
            <p className="text-[9px] uppercase font-bold text-[#888888] tracking-wider">Date of Issuance</p>
            <p className="text-xs font-extrabold text-[#111827] mt-0.5">{issueDate}</p>
          </div>
          <div className="p-3 bg-white/80 rounded-lg border border-[#E5E7EB] shadow-2xs">
            <p className="text-[9px] uppercase font-bold text-[#888888] tracking-wider">Statutory Status</p>
            <p className="text-xs font-extrabold text-emerald-700 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Active & In Good Standing</span>
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-lg border border-[#E5E7EB] shadow-2xs">
            <p className="text-[9px] uppercase font-bold text-[#888888] tracking-wider">Authorized Capital / Tier</p>
            <p className="text-xs font-extrabold text-[#111827] mt-0.5 font-mono">$10,000,000 USD (Class A)</p>
          </div>
        </div>

        {/* Legal Text / Charter Description */}
        <div className="bg-white/70 p-4 rounded-xl border border-[#D4AF37]/30 text-left text-xs font-sans text-[#555555] space-y-2 leading-relaxed">
          <p className="font-semibold text-[#222222]">
            Statutory Scope & Legal Authority:
          </p>
          <p>
            {description ||
              `The corporation is established under statutory law with perpetual existence. It is authorized to engage in lawful business activities including the operation of global merchant ranking protocols, digital promotional rating syndicates, escrow settlements, and verified consumer order acceleration in direct strategic alliance with eBay Inc.`}
          </p>
        </div>
      </div>

      {/* Bottom Signatures & Seal Section */}
      <div className="relative pt-6 border-t border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-6 px-2 sm:px-6 font-sans">
        {/* Official Embossed Gold Seal */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFE082] via-[#FFD54F] to-[#FFA000] border-2 border-[#D4AF37] shadow-lg flex flex-col items-center justify-center text-center p-1 relative">
            <div className="absolute inset-0.5 rounded-full border border-dashed border-[#8D6E63]/40" />
            <Award className="w-6 h-6 text-[#5D4037]" />
            <span className="text-[7px] font-black uppercase tracking-tighter text-[#4E342E]">OFFICIAL SEAL</span>
          </div>
          <div className="text-left text-[10px] text-[#666666]">
            <p className="font-bold text-[#111827]">STATUTORY CORPORATE SEAL</p>
            <p>eBuy-Partner Global Syndicate</p>
            <p className="font-mono text-[9px] text-[#888888]">SEC-ID: #EB-7192841-CORP</p>
          </div>
        </div>

        {/* Official Signatures */}
        <div className="flex items-center gap-6 text-center text-[10px]">
          <div className="space-y-1">
            <div className="font-serif italic text-base sm:text-lg text-[#1E3A8A] font-bold border-b border-[#888888] pb-1 px-3">
              Jeffrey W. Bullock
            </div>
            <p className="font-bold text-[#333333]">Secretary of State / Registrar</p>
            <p className="text-[#888888] text-[9px]">Division of Corporations</p>
          </div>

          <div className="space-y-1">
            <div className="font-serif italic text-base sm:text-lg text-[#166534] font-bold border-b border-[#888888] pb-1 px-3">
              Jerry (Master Administrator)
            </div>
            <p className="font-bold text-[#333333]">Principal Director & Legal Trustee</p>
            <p className="text-[#888888] text-[9px]">eBuy-Partner Global Enterprise</p>
          </div>
        </div>

        {/* Security Barcode & QR Stamp */}
        <div className="flex flex-col items-center justify-center shrink-0 text-center">
          <div className="w-12 h-12 bg-white p-1 rounded-md border border-[#CCCCCC] flex items-center justify-center shadow-2xs">
            <QrCode className="w-10 h-10 text-[#222222]" />
          </div>
          <span className="text-[8px] font-mono text-[#888888] mt-1">VERIFY: EB-AUTH-2024</span>
        </div>
      </div>
    </div>
  );
};
