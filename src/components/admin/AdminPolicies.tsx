import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PolicyDocument } from '../../types';
import {
  FileText,
  Save,
  CheckCircle2,
  Edit,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export const AdminPolicies: React.FC = () => {
  const { policies, updatePolicy, showToast } = useApp();

  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(policies[0]?.id || 'POL-01');
  const activePolicy = policies.find((p) => p.id === selectedPolicyId) || policies[0];

  const [formTitle, setFormTitle] = useState(activePolicy?.title || '');
  const [formCategory, setFormCategory] = useState(activePolicy?.category || '');
  const [formSummary, setFormSummary] = useState(activePolicy?.summary || '');
  const [formContent, setFormContent] = useState(activePolicy?.content || '');

  React.useEffect(() => {
    if (activePolicy) {
      setFormTitle(activePolicy.title);
      setFormCategory(activePolicy.category);
      setFormSummary(activePolicy.summary);
      setFormContent(activePolicy.content);
    }
  }, [activePolicy]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePolicy) return;
    updatePolicy(activePolicy.id, {
      title: formTitle,
      category: formCategory,
      summary: formSummary,
      content: formContent,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2]">
              Legal CMS & Compliance Governance
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#171717]">
            Legal Documents & Policies Content Management
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Manage and publish official platform terms, escrow refund charters, withdrawal rules, and risk disclosure notices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Policy List Selector */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
            <span className="text-xs font-extrabold text-[#171717] block px-1">
              Platform Policies (8 Documents)
            </span>

            <div className="space-y-1">
              {policies.map((pol) => {
                const isSelected = pol.id === selectedPolicyId;
                return (
                  <button
                    key={pol.id}
                    onClick={() => setSelectedPolicyId(pol.id)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#F4511E] text-white shadow-2xs font-bold'
                        : 'bg-[#FFFDFB] text-[#171717] hover:bg-[#FFF4ED] border border-[#E5E7EB]'
                    }`}
                  >
                    <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-white' : 'text-[#F4511E]'}`} />
                    <div className="overflow-hidden">
                      <div className="font-extrabold truncate">{pol.title}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-[#666666]'}`}>
                        {pol.category} · Updated {pol.lastUpdated}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Policy Editor Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-[#F4511E]" />
                <h3 className="font-black text-sm text-[#171717]">
                  Editing: {formTitle}
                </h3>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#171717] mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-bold text-xs focus:ring-2 focus:ring-[#F4511E]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs focus:ring-2 focus:ring-[#F4511E]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#171717] mb-1">Summary Excerpt</label>
                <input
                  type="text"
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs focus:ring-2 focus:ring-[#F4511E]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#171717] mb-1">Full Legal Text (Markdown Supported)</label>
                <textarea
                  rows={12}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-xs focus:ring-2 focus:ring-[#F4511E]"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
