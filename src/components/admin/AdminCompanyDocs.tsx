import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanyDocument, BrandAmbassador, CompanyLocation, LocationDocument } from '../../types';
import { CorporateDocumentModal } from '../documents/CorporateDocumentModal';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Building2,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Calendar,
  Save,
  MapPin,
  Mail,
  Phone,
  Clock,
  Globe2,
  Upload,
  Eye,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const AdminCompanyDocs: React.FC = () => {
  const {
    companyLocations,
    addCompanyLocation,
    updateCompanyLocation,
    deleteCompanyLocation,
    addLocationDocument,
    deleteLocationDocument,
    companyDocuments,
    brandAmbassadors,
    addCompanyDocument,
    updateCompanyDocument,
    deleteCompanyDocument,
    addBrandAmbassador,
    updateBrandAmbassador,
    deleteBrandAmbassador,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'locations' | 'documents' | 'ambassadors'>('locations');
  const [selectedDocPreview, setSelectedDocPreview] = useState<{ doc: LocationDocument; location: CompanyLocation } | null>(null);

  // Location Form Modal States
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [editingLocId, setEditingLocId] = useState<string | null>(null);
  const [locForm, setLocForm] = useState<Partial<CompanyLocation>>({
    countryCode: 'US',
    countryName: 'United States',
    flag: '🇺🇸',
    city: 'New York',
    address: '',
    postalCode: '',
    phone: '',
    email: '',
    registrationNumber: '',
    companyName: '',
    description: '',
    mapsUrl: '',
    businessHours: 'Mon - Fri: 09:00 AM - 06:00 PM',
    additionalDetails: '',
  });

  // Document Upload Modal for a Location
  const [docUploadModalOpen, setDocUploadModalOpen] = useState(false);
  const [targetLocationId, setTargetLocationId] = useState<string | null>(null);
  const [newDocForm, setNewDocForm] = useState<Partial<LocationDocument>>({
    title: '',
    description: '',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    fileType: 'certificate',
    fileSizeMb: 2.5,
  });

  // Legacy Document Modal states
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docForm, setDocForm] = useState<Partial<CompanyDocument>>({
    title: '',
    issuer: '',
    country: 'Pakistan',
    countryFlag: '🇵🇰',
    registrationNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    status: 'certified',
    documentType: 'secp',
    fileUrl: '',
    description: '',
  });

  // Ambassador Modal states
  const [ambModalOpen, setAmbModalOpen] = useState(false);
  const [editingAmbId, setEditingAmbId] = useState<string | null>(null);
  const [ambForm, setAmbForm] = useState<Partial<BrandAmbassador>>({
    name: '',
    role: '',
    country: 'Pakistan',
    countryFlag: '🇵🇰',
    imageUrl: '',
    bio: '',
    verifiedBadge: true,
    partnerSince: '2024',
    socialHandle: '',
  });

  // Location Handlers
  const handleOpenAddLocation = () => {
    setEditingLocId(null);
    setLocForm({
      countryCode: 'US',
      countryName: 'United States',
      flag: '🇺🇸',
      city: '',
      address: '',
      postalCode: '',
      phone: '',
      email: '',
      registrationNumber: '',
      companyName: '',
      description: '',
      mapsUrl: '',
      businessHours: 'Mon - Fri: 09:00 AM - 06:00 PM',
      additionalDetails: '',
    });
    setLocationModalOpen(true);
  };

  const handleOpenEditLocation = (loc: CompanyLocation) => {
    setEditingLocId(loc.id);
    setLocForm(loc);
    setLocationModalOpen(true);
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locForm.countryName || !locForm.city || !locForm.address) {
      showToast('Please fill in country, city, and address.', 'error');
      return;
    }

    if (editingLocId) {
      updateCompanyLocation(editingLocId, locForm);
    } else {
      const newLoc: CompanyLocation = {
        id: `LOC-${(locForm.countryCode || 'XX').toUpperCase()}-${Date.now().toString().slice(-4)}`,
        countryCode: locForm.countryCode || 'US',
        countryName: locForm.countryName || 'United States',
        flag: locForm.flag || '🌐',
        city: locForm.city || '',
        address: locForm.address || '',
        postalCode: locForm.postalCode || '',
        phone: locForm.phone || '',
        email: locForm.email || '',
        registrationNumber: locForm.registrationNumber || '',
        companyName: locForm.companyName || `${locForm.countryName} Commercial Operations`,
        description: locForm.description || '',
        mapsUrl: locForm.mapsUrl || '',
        businessHours: locForm.businessHours || 'Mon - Fri: 09:00 AM - 06:00 PM',
        additionalDetails: locForm.additionalDetails || '',
        documents: [],
      };
      addCompanyLocation(newLoc);
    }
    setLocationModalOpen(false);
  };

  const handleOpenAddDocToLocation = (locationId: string) => {
    setTargetLocationId(locationId);
    setNewDocForm({
      title: '',
      description: '',
      fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      fileType: 'certificate',
      fileSizeMb: 2.5,
    });
    setDocUploadModalOpen(true);
  };

  const handleSaveDocToLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLocationId || !newDocForm.title) {
      showToast('Please provide a document title.', 'error');
      return;
    }

    const doc: LocationDocument = {
      id: `DOC-${Date.now()}`,
      locationId: targetLocationId,
      title: newDocForm.title,
      description: newDocForm.description || 'Verified corporate compliance document.',
      fileUrl: newDocForm.fileUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      fileType: newDocForm.fileType || 'certificate',
      uploadedAt: new Date().toISOString().split('T')[0],
      fileSizeMb: newDocForm.fileSizeMb || 2.4,
      isVisible: true,
    };

    addLocationDocument(targetLocationId, doc);
    setDocUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] tracking-tight">
            Company Locations & Corporate Documents
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Manage the 8 registered global jurisdictions, physical office details, uploaded legal certificates, and brand ambassadors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'locations' && (
            <button
              onClick={handleOpenAddLocation}
              className="px-4 py-2 bg-[#F4511E] hover:bg-[#E64A19] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Location</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-2">
        <button
          onClick={() => setActiveTab('locations')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'locations'
              ? 'bg-[#F4511E] text-white'
              : 'bg-white text-[#666666] hover:text-[#171717] border border-[#E5E7EB]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Global Offices ({companyLocations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('ambassadors')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'ambassadors'
              ? 'bg-[#F4511E] text-white'
              : 'bg-white text-[#666666] hover:text-[#171717] border border-[#E5E7EB]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Brand Ambassadors ({brandAmbassadors.length})</span>
        </button>
      </div>

      {/* 1. LOCATIONS MANAGEMENT */}
      {activeTab === 'locations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {companyLocations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                      {loc.flag}
                    </span>
                    <div>
                      <h3 className="text-base font-extrabold text-[#171717]">{loc.countryName}</h3>
                      <p className="text-xs text-[#666666] font-medium">{loc.city} • {loc.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditLocation(loc)}
                      className="p-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#F4511E] text-[#666666] hover:text-[#F4511E] transition-colors"
                      title="Edit Location"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCompanyLocation(loc.id)}
                      className="p-1.5 rounded-lg border border-[#E5E7EB] hover:border-red-500 text-[#666666] hover:text-red-500 transition-colors"
                      title="Delete Location"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#555555] leading-relaxed line-clamp-2">{loc.description}</p>

                <div className="space-y-2 text-xs text-[#666666] bg-[#F9FAFB] p-3.5 rounded-xl border border-[#E5E7EB]/60">
                  <p><strong className="text-[#171717]">Legal Entity:</strong> {loc.companyName}</p>
                  <p><strong className="text-[#171717]">Registration #:</strong> {loc.registrationNumber}</p>
                  <p><strong className="text-[#171717]">Address:</strong> {loc.address}</p>
                  <p><strong className="text-[#171717]">Helpline:</strong> {loc.phone} | {loc.email}</p>
                  <p><strong className="text-[#171717]">Hours:</strong> {loc.businessHours}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#888888]">
                <span>Jurisdiction: {loc.countryCode}</span>
                {loc.mapsUrl && (
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F4511E] font-semibold flex items-center gap-1"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. BRAND AMBASSADORS TAB */}
      {activeTab === 'ambassadors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {brandAmbassadors.map((amb) => (
            <div key={amb.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <img src={amb.imageUrl} alt={amb.name} className="w-14 h-14 rounded-full object-cover border border-[#FFD7C2]" />
                <div>
                  <h3 className="text-sm font-bold text-[#171717]">{amb.name}</h3>
                  <p className="text-xs text-[#F4511E] font-medium">{amb.role}</p>
                  <p className="text-xs text-[#666666]">{amb.countryFlag} {amb.country}</p>
                </div>
              </div>
              <p className="text-xs text-[#666666] line-clamp-3">{amb.bio}</p>
              <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#888888]">
                <span>Since {amb.partnerSince}</span>
                <span className="text-[#F4511E] font-semibold">{amb.socialHandle}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LOCATION FORM MODAL */}
      {locationModalOpen && (
        <Modal
          isOpen={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          title={editingLocId ? 'Edit Company Location' : 'Add New Company Location'}
          subtitle="Configure registered corporate entity, office address, and jurisdiction details."
          maxWidth="lg"
        >
          <form onSubmit={handleSaveLocation} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Country Name</label>
                <input
                  type="text"
                  required
                  value={locForm.countryName || ''}
                  onChange={(e) => setLocForm({ ...locForm, countryName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Country Code (2-letter)</label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={locForm.countryCode || ''}
                  onChange={(e) => setLocForm({ ...locForm, countryCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Country Flag Emoji</label>
                <input
                  type="text"
                  value={locForm.flag || ''}
                  onChange={(e) => setLocForm({ ...locForm, flag: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">City</label>
                <input
                  type="text"
                  required
                  value={locForm.city || ''}
                  onChange={(e) => setLocForm({ ...locForm, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Postal Code</label>
                <input
                  type="text"
                  value={locForm.postalCode || ''}
                  onChange={(e) => setLocForm({ ...locForm, postalCode: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Corporate Legal Entity Name</label>
                <input
                  type="text"
                  required
                  value={locForm.companyName || ''}
                  onChange={(e) => setLocForm({ ...locForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Registration # / License</label>
                <input
                  type="text"
                  required
                  value={locForm.registrationNumber || ''}
                  onChange={(e) => setLocForm({ ...locForm, registrationNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Physical Office Address</label>
              <input
                type="text"
                required
                value={locForm.address || ''}
                onChange={(e) => setLocForm({ ...locForm, address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Contact Email</label>
                <input
                  type="email"
                  value={locForm.email || ''}
                  onChange={(e) => setLocForm({ ...locForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={locForm.phone || ''}
                  onChange={(e) => setLocForm({ ...locForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Company & Jurisdiction Description</label>
              <textarea
                rows={3}
                value={locForm.description || ''}
                onChange={(e) => setLocForm({ ...locForm, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Google Maps Link</label>
                <input
                  type="url"
                  value={locForm.mapsUrl || ''}
                  onChange={(e) => setLocForm({ ...locForm, mapsUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Operating Business Hours</label>
                <input
                  type="text"
                  value={locForm.businessHours || ''}
                  onChange={(e) => setLocForm({ ...locForm, businessHours: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setLocationModalOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E5E7EB] text-[#666666] hover:bg-[#F9FAFB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#F4511E] hover:bg-[#E64A19] text-white shadow-xs"
              >
                Save Location
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* DOCUMENT UPLOAD MODAL */}
      {docUploadModalOpen && (
        <Modal
          isOpen={docUploadModalOpen}
          onClose={() => setDocUploadModalOpen(false)}
          title="Upload Location Document / Photo"
          subtitle="Add a corporate certificate, government license, or high-res office photo."
          maxWidth="md"
        >
          <form onSubmit={handleSaveDocToLocation} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Document Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Certificate of Corporate Incorporation"
                value={newDocForm.title || ''}
                onChange={(e) => setNewDocForm({ ...newDocForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">File Type</label>
                <select
                  value={newDocForm.fileType || 'certificate'}
                  onChange={(e) => setNewDocForm({ ...newDocForm, fileType: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                >
                  <option value="certificate">Certificate</option>
                  <option value="license">Trade License</option>
                  <option value="pdf">PDF Document</option>
                  <option value="image">Office / Building Photo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">File Size (MB)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newDocForm.fileSizeMb || 2.4}
                  onChange={(e) => setNewDocForm({ ...newDocForm, fileSizeMb: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Document File URL / Image URL</label>
              <input
                type="url"
                required
                value={newDocForm.fileUrl || ''}
                onChange={(e) => setNewDocForm({ ...newDocForm, fileUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Short Description / Legal Note</label>
              <textarea
                rows={2}
                value={newDocForm.description || ''}
                onChange={(e) => setNewDocForm({ ...newDocForm, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setDocUploadModalOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E5E7EB] text-[#666666] hover:bg-[#F9FAFB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#F4511E] hover:bg-[#E64A19] text-white shadow-xs"
              >
                Save Document
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Corporate Document Preview Modal for Admin */}
      <CorporateDocumentModal
        isOpen={Boolean(selectedDocPreview)}
        onClose={() => setSelectedDocPreview(null)}
        documentData={
          selectedDocPreview
            ? {
                id: selectedDocPreview.doc.id,
                title: selectedDocPreview.doc.title,
                issuer:
                  selectedDocPreview.doc.title.includes('Delaware')
                    ? 'State of Delaware Division of Corporations'
                    : selectedDocPreview.doc.title.includes('eBay')
                    ? 'eBay Inc. Global Commerce Syndicate (San Jose, CA)'
                    : selectedDocPreview.doc.title.includes('FinCEN')
                    ? 'Financial Crimes Enforcement Network (US Dept of the Treasury)'
                    : selectedDocPreview.doc.title.includes('Companies House')
                    ? 'Companies House, Cardiff & London (United Kingdom)'
                    : selectedDocPreview.doc.title.includes('DED') || selectedDocPreview.doc.title.includes('Dubai')
                    ? 'Dubai Department of Economy & Tourism (DET / DED)'
                    : selectedDocPreview.doc.title.includes('SECP')
                    ? 'Securities & Exchange Commission of Pakistan (SECP)'
                    : selectedDocPreview.doc.title.includes('DBD')
                    ? 'Department of Business Development (Ministry of Commerce Thailand)'
                    : selectedDocPreview.doc.title.includes('Affairs') || selectedDocPreview.doc.title.includes('MCA')
                    ? 'Ministry of Corporate Affairs (Government of India)'
                    : selectedDocPreview.doc.title.includes('CNPJ') || selectedDocPreview.doc.title.includes('Receita')
                    ? 'Receita Federal do Brasil (Ministério da Fazenda)'
                    : 'Official Statutory Authority Registry',
                country: selectedDocPreview.location.countryName,
                countryFlag: selectedDocPreview.location.flag,
                registrationNumber: selectedDocPreview.location.registrationNumber,
                issueDate: selectedDocPreview.doc.uploadedAt,
                companyName: selectedDocPreview.location.companyName,
                description: selectedDocPreview.doc.description,
                fileUrl: selectedDocPreview.doc.fileUrl,
                fileType: selectedDocPreview.doc.fileType,
              }
            : null
        }
      />
    </div>
  );
};
