import React, { useRef } from 'react';
import { CorporateCertificateRenderer } from './CorporateCertificateRenderer';
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Lock,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CorporateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: {
    id: string;
    title: string;
    issuer?: string;
    country?: string;
    countryFlag?: string;
    registrationNumber?: string;
    issueDate?: string;
    companyName?: string;
    description?: string;
    fileUrl?: string;
    fileType?: string;
  } | null;
}

export const CorporateDocumentModal: React.FC<CorporateDocumentModalProps> = ({
  isOpen,
  onClose,
  documentData,
}) => {
  const { showToast } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !documentData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Document verification link copied to clipboard!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#E5E7EB]">
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#171717] via-[#262626] to-[#171717] text-white flex items-center justify-between border-b border-[#333333]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                  {documentData.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Authenticated</span>
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {documentData.countryFlag} {documentData.country || 'Global'} • {documentData.issuer || 'Official Statutory Registry'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5"
              title="Share Verification"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate View Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F3F4F6]" ref={printRef}>
          <CorporateCertificateRenderer
            documentId={documentData.id}
            title={documentData.title}
            issuer={documentData.issuer}
            country={documentData.country}
            countryFlag={documentData.countryFlag}
            registrationNumber={documentData.registrationNumber}
            issueDate={documentData.issueDate}
            companyName={documentData.companyName || 'eBuy-Partner Global Enterprise Inc.'}
            description={documentData.description}
          />
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-5 py-3.5 bg-white border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 text-xs text-[#666666]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-[#171717]">
              Official eBay Sister Entity Statutory Record
            </span>
            <span className="text-[#888888]">|</span>
            <span className="font-mono text-[11px] text-[#555555]">
              Doc ID: {documentData.id}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#F4511E] hover:bg-[#E64A19] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Deed</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#171717] font-bold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
