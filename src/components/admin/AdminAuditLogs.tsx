import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAction = log.action.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchTarget = (log.targetId || log.entityId || '').toLowerCase().includes(q);
      const matchEmail = (log.adminEmail || log.actorName || '').toLowerCase().includes(q);
      if (!matchAction && !matchDetails && !matchTarget && !matchEmail) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Administrative Compliance Audit Log ({auditLogs.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident record of all manual financial approvals, status alterations, and inventory updates
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Log ID & Timestamp</th>
                <th className="px-6 py-3.5">Administrator</th>
                <th className="px-6 py-3.5">Action Code</th>
                <th className="px-6 py-3.5">Target</th>
                <th className="px-6 py-3.5">Event Details</th>
                <th className="px-6 py-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-semibold text-slate-900 block">{log.id}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{log.createdAt || log.timestamp}</span>
                  </td>

                  <td className="px-6 py-4 font-mono text-slate-700">
                    {log.adminEmail || log.actorName}
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-700 font-mono text-[11px]">
                    <span className="capitalize text-slate-500">{log.targetType || log.entityType}: </span>
                    <span className="font-semibold text-slate-800">{log.targetId || log.entityId}</span>
                  </td>

                  <td className="px-6 py-4 text-slate-600 max-w-sm leading-relaxed">
                    {log.details}
                  </td>

                  <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
