import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppDownloadConfig } from '../../types';
import {
  Smartphone,
  Download,
  Upload,
  Save,
  CheckCircle2,
  HardDrive,
  Link2,
  FileCode,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const AdminAppDownload: React.FC = () => {
  const { appDownloadConfig, updateAppDownloadConfig, showToast } = useApp();

  const [formState, setFormState] = useState<AppDownloadConfig>(appDownloadConfig);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppDownloadConfig(formState);
  };

  const handleSimulateApkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        const sizeMb = Number((file.size / (1024 * 1024)).toFixed(1)) || 19.2;
        const newUrl = `https://storage.googleapis.com/ebuy-partner-releases/apk/${encodeURIComponent(file.name)}`;
        setFormState((prev) => ({
          ...prev,
          apkFileName: file.name,
          apkDownloadUrl: newUrl,
          apkSizeMb: sizeMb,
          uploadDate: new Date().toISOString().split('T')[0],
        }));
        setIsUploading(false);
        showToast(`APK file "${file.name}" uploaded successfully!`, 'success');
      }, 700);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2]">
              Mobile Distribution Management
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#171717]">
            App Download Settings & APK Management
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Manage the direct Android APK file distribution and Google Drive download links presented on the home page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${formState.activeStatus ? 'bg-emerald-50 text-[#16A34A] border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
            {formState.activeStatus ? '● App Distribution Active' : '○ Distribution Disabled'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Option 1: Direct APK File Management */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] text-[#F4511E] flex items-center justify-center border border-[#FFD7C2]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#171717]">
                  Option 1: Direct APK Download Configuration
                </h3>
                <p className="text-xs text-[#666666]">
                  Allows clients to download the official Android application package directly
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-[#171717] cursor-pointer">
              <input
                type="checkbox"
                checked={formState.directDownloadEnabled}
                onChange={(e) => setFormState({ ...formState, directDownloadEnabled: e.target.checked })}
                className="rounded text-[#F4511E] focus:ring-[#F4511E]"
              />
              <span>Enable Direct APK Button</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Upload New APK File
              </label>
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#FFD7C2] bg-[#FFFDFB] rounded-xl cursor-pointer hover:bg-[#FFF4ED] transition-colors">
                <Upload className="w-6 h-6 text-[#F4511E] mb-1" />
                <span className="font-bold text-[#171717] text-xs">
                  {isUploading ? 'Uploading APK Package...' : 'Click to Upload / Replace .apk'}
                </span>
                <span className="text-[11px] text-[#666666] mt-0.5">Android Binary Package (.apk)</span>
                <input
                  type="file"
                  accept=".apk,application/vnd.android.package-archive"
                  onChange={handleSimulateApkUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-[#171717] mb-1">
                  Active APK File Name
                </label>
                <input
                  type="text"
                  value={formState.apkFileName}
                  onChange={(e) => setFormState({ ...formState, apkFileName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1">
                  Release Version Label
                </label>
                <input
                  type="text"
                  value={formState.apkVersion}
                  onChange={(e) => setFormState({ ...formState, apkVersion: e.target.value })}
                  placeholder="e.g. v2.4.0 (Production Build)"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#171717] mb-1">
                Direct APK Download URL / Storage Endpoint
              </label>
              <input
                type="url"
                value={formState.apkDownloadUrl}
                onChange={(e) => setFormState({ ...formState, apkDownloadUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Option 2: Google Drive Download Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#171717]">
                  Option 2: Google Drive Mirror Link
                </h3>
                <p className="text-xs text-[#666666]">
                  Secondary reliable cloud mirror for high-speed APK retrieval
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-[#171717] cursor-pointer">
              <input
                type="checkbox"
                checked={formState.googleDriveEnabled}
                onChange={(e) => setFormState({ ...formState, googleDriveEnabled: e.target.checked })}
                className="rounded text-[#F4511E] focus:ring-[#F4511E]"
              />
              <span>Enable Google Drive Button</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Google Drive Shareable Link (Public View)
            </label>
            <input
              type="url"
              required={formState.googleDriveEnabled}
              value={formState.googleDriveUrl}
              onChange={(e) => setFormState({ ...formState, googleDriveUrl: e.target.value })}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
          >
            <Save className="w-4 h-4" />
            <span>Save App Download Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
