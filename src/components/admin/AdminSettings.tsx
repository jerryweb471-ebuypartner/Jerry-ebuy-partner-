import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PlatformSettings } from '../../types';
import {
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  RotateCcw,
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  FileJson,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetDemoData,
    showToast,
    exportDataBackup,
    importDataBackup,
    users,
    wallets,
    deposits,
    withdrawals,
  } = useApp();

  const [formData, setFormData] = useState<PlatformSettings>({ ...settings });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    try {
      const backupJson = exportDataBackup();
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `nexora_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Database backup exported successfully! Save this file for GitHub deployments.', 'success');
    } catch {
      showToast('Failed to export backup.', 'error');
    }
  };

  // Handle File Upload for Restore
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportJsonText(content);
        setIsImportModalOpen(true);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Confirm Import
  const handleConfirmImport = () => {
    if (!importJsonText.trim()) {
      showToast('Please provide valid JSON backup data.', 'error');
      return;
    }
    const success = importDataBackup(importJsonText);
    if (success) {
      setIsImportModalOpen(false);
      setImportJsonText('');
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl font-sans">
      <div className="pb-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2]">
            System Governance & Persistence
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#171717]">
          Global System Governance & Database Backup
        </h1>
        <p className="text-xs text-[#666666] mt-0.5">
          Configure financial clearance policies, automated ledger hooks, and backup client accounts for GitHub publishing.
        </p>
      </div>

      {/* =========================================================================
          SECTION: GITHUB MIGRATION & PERMANENT CLIENT DATA BACKUP
         ========================================================================= */}
      <div className="p-6 bg-gradient-to-br from-[#FFF9F5] via-white to-[#FFF4ED] rounded-2xl border-2 border-[#FF8A3D] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#FFD7C2]">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#F4511E]" />
              <h2 className="text-base font-black text-[#171717]">
                Permanent Client Data & GitHub Migration Control
              </h2>
            </div>
            <p className="text-xs text-[#666666] mt-1 leading-relaxed">
              Whenever you change code in AI Studio and publish to GitHub, client accounts, wallet balances, and registered Gmails stay safely preserved on backend disk storage. You can also download or restore full JSON backups anytime.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#16A34A] text-xs font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>Live Server Disk Persistence Active</span>
          </div>
        </div>

        {/* Real-time stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#FFD7C2] shadow-2xs">
            <span className="text-[10px] font-bold text-[#666666] uppercase block">Saved Clients</span>
            <span className="text-base font-black text-[#171717]">{users.length} Accounts</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#FFD7C2] shadow-2xs">
            <span className="text-[10px] font-bold text-[#666666] uppercase block">Active Wallets</span>
            <span className="text-base font-black text-[#F4511E]">{Object.keys(wallets).length} Wallets</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#FFD7C2] shadow-2xs">
            <span className="text-[10px] font-bold text-[#666666] uppercase block">Deposits Logged</span>
            <span className="text-base font-black text-[#171717]">{deposits.length} Records</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#FFD7C2] shadow-2xs">
            <span className="text-[10px] font-bold text-[#666666] uppercase block">Disbursements</span>
            <span className="text-base font-black text-[#16A34A]">{withdrawals.length} Payouts</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportBackup}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl text-xs font-extrabold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
          >
            <Download className="w-4 h-4" />
            <span>Export Database Backup (.JSON)</span>
          </button>

          <label className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-[#FFF4ED] text-[#171717] hover:text-[#F4511E] border border-[#E5E7EB] hover:border-[#FF8A3D] rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-[#F4511E]" />
            <span>Restore / Upload JSON Backup</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* =========================================================================
          SECTION: PLATFORM RULES FORM
         ========================================================================= */}
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Minimum Withdrawal Floor (USD)
            </label>
            <input
              type="number"
              required
              value={formData.minWithdrawal}
              onChange={(e) => setFormData({ ...formData, minWithdrawal: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] font-mono focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Standard Withdrawal Flat Fee (USD)
            </label>
            <input
              type="number"
              step="0.5"
              required
              value={formData.fixedWithdrawalFee}
              onChange={(e) => setFormData({ ...formData, fixedWithdrawalFee: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] font-mono focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Platform Entity Legal Name
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Compliance Support Email
            </label>
            <input
              type="email"
              required
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
          <label className="flex items-center gap-3 cursor-pointer text-xs text-[#171717]">
            <input
              type="checkbox"
              checked={formData.manualDepositProofRequired}
              onChange={(e) => setFormData({ ...formData, manualDepositProofRequired: e.target.checked })}
              className="rounded text-[#F4511E] focus:ring-[#F4511E] w-4 h-4"
            />
            <span className="font-bold">
              Mandate Binance / Crypto TxID & Screenshot on Deposits
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-xs text-[#171717]">
            <input
              type="checkbox"
              checked={formData.registrationOpen}
              onChange={(e) => setFormData({ ...formData, registrationOpen: e.target.checked })}
              className="rounded text-[#F4511E] focus:ring-[#F4511E] w-4 h-4"
            />
            <span className="font-bold">
              Accept Public Inbound Commercial Partner Registrations
            </span>
          </label>
        </div>

        <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
          <button
            type="button"
            onClick={resetDemoData}
            className="px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-black text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-[1.01]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* RESTORE MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#E5E7EB] overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-[#F4511E]" />
                <h3 className="text-base font-black text-[#171717]">Restore Database Backup</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-[#666666] hover:text-[#171717] text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-[#666666]">
              Review the JSON backup payload below. Restoring will restore all registered clients, wallet balances, tasks, and settings to both server storage and the browser.
            </p>

            <textarea
              rows={10}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full p-3 font-mono text-[11px] bg-slate-50 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              placeholder="Paste JSON backup here..."
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#171717] bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-5 py-2 text-xs font-black text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-xl shadow-xs"
              >
                Confirm & Restore All Accounts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
