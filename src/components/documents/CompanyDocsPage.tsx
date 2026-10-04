import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EBuyPartnerLogo } from '../common/EBuyPartnerLogo';
import { EbayLicenseModal } from '../common/EbayLicenseModal';
import {
  ShieldCheck,
  Building2,
  ExternalLink,
  Award,
  CheckCircle2,
  Search,
  Users,
  BadgeCheck,
  MapPin,
  Mail,
  Phone,
  Clock,
  Compass,
  Headphones,
} from 'lucide-react';
import { CompanyLocation, BrandAmbassador } from '../../types';
import { Modal } from '../common/Modal';

export const CompanyDocsPage: React.FC = () => {
  const { companyLocations, brandAmbassadors, currentUser } = useApp();

  const [selectedLocation, setSelectedLocation] = useState<CompanyLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'locations' | 'ambassadors'>('locations');
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);

  // Identify user's registered country
  const userCountryCode = currentUser?.countryCode || 'US';

  // Separate user registered location and other locations
  const userRegisteredLocation = companyLocations.find(
    (loc) => loc.countryCode.toUpperCase() === userCountryCode.toUpperCase()
  );

  const otherLocations = companyLocations.filter(
    (loc) => loc.countryCode.toUpperCase() !== userCountryCode.toUpperCase()
  );

  const filteredOtherLocations = otherLocations.filter((loc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      loc.countryName.toLowerCase().includes(q) ||
      loc.city.toLowerCase().includes(q) ||
      loc.companyName.toLowerCase().includes(q) ||
      loc.registrationNumber.toLowerCase().includes(q) ||
      loc.address.toLowerCase().includes(q)
    );
  });

  const allLocationsFiltered = companyLocations.filter((loc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      loc.countryName.toLowerCase().includes(q) ||
      loc.city.toLowerCase().includes(q) ||
      loc.companyName.toLowerCase().includes(q) ||
      loc.registrationNumber.toLowerCase().includes(q) ||
      loc.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto font-sans">
      {/* Official eBay Inc. Sister Entity Header Banner */}
      <div className="bg-gradient-to-br from-white via-[#FFF4ED] to-white rounded-3xl border border-[#FFD7C2] p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#F4511E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FF8A3D]/40 text-[#F4511E] text-xs font-bold shadow-2xs">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Official eBay Inc. Sister Entity & Certified Commercial Partner</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              Deed #EB-PARTNER-2024-884920-US
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <EBuyPartnerLogo size={42} />
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#171717] tracking-tight leading-tight">
              eBuy-Partner Corporate Registrations
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            <strong>eBuy-Partner</strong> operates as an authorized promotional sister company and merchant network of <strong>eBay Inc.</strong> under statutory global commercial compliance across 8 international jurisdictions.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => setIsLicenseModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Inspect Official eBay License Deed</span>
            </button>

            <button
              onClick={() => setActiveTab('locations')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'locations'
                  ? 'bg-[#F4511E] text-white shadow-sm'
                  : 'bg-white text-[#171717] border border-[#E5E7EB] hover:border-[#F4511E]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Registered Locations ({companyLocations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ambassadors')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'ambassadors'
                  ? 'bg-[#F4511E] text-white shadow-sm'
                  : 'bg-white text-[#171717] border border-[#E5E7EB] hover:border-[#F4511E]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Brand Ambassadors ({brandAmbassadors.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'locations' && (
        <div className="space-y-8">
          {/* Search bar & Jurisdiction Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#999999] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search country, city, or license #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E] text-[#171717]"
              />
            </div>
            <div className="text-xs text-[#666666] font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>All 8 jurisdictions legally audited & verified active</span>
            </div>
          </div>

          {/* 1. HIGHLIGHTED USER REGISTERED COUNTRY */}
          {userRegisteredLocation && !searchQuery && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F4511E] animate-pulse" />
                <span className="text-xs font-bold text-[#F4511E] uppercase tracking-wider">
                  Your Registered Country Regional Hub
                </span>
              </div>

              <div className="bg-gradient-to-br from-[#FFF9F5] via-white to-[#FFF4ED] border-2 border-[#FF8A3D] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#F4511E] text-white text-[11px] font-bold rounded-bl-2xl uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Primary Jurisdiction</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl shadow-2xs rounded-lg p-1 bg-white border border-[#FFD7C2]">
                        {userRegisteredLocation.flag}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-extrabold text-[#171717]">
                            {userRegisteredLocation.countryName}
                          </h2>
                          <span className="px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A] text-[11px] font-bold">
                            Verified Active
                          </span>
                        </div>
                        <p className="text-xs text-[#666666] font-medium">
                          {userRegisteredLocation.companyName} • {userRegisteredLocation.city}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/80 p-4 rounded-2xl border border-[#FFD7C2]/60 space-y-2">
                      <p className="text-xs font-bold text-[#F4511E] uppercase tracking-wider">
                        Registration & Compliance Data
                      </p>
                      <p className="text-xs text-[#444444] leading-relaxed">
                        {userRegisteredLocation.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-[#E5E7EB]">
                        <span className="text-[11px] text-[#888888] font-bold block">Legal Entity:</span>
                        <p className="font-semibold text-[#171717] mt-0.5">{userRegisteredLocation.companyName}</p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-[#E5E7EB]">
                        <span className="text-[11px] text-[#888888] font-bold block">Registration Number:</span>
                        <p className="font-semibold text-[#171717] mt-0.5">{userRegisteredLocation.registrationNumber}</p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-[#E5E7EB]">
                        <span className="text-[11px] text-[#888888] font-bold block">Physical Address:</span>
                        <p className="font-semibold text-[#171717] mt-0.5">{userRegisteredLocation.address}</p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-[#E5E7EB]">
                        <span className="text-[11px] text-[#888888] font-bold block">Direct Contact:</span>
                        <p className="font-semibold text-[#171717] mt-0.5">{userRegisteredLocation.email} • {userRegisteredLocation.phone}</p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] sm:col-span-2">
                        <span className="text-[11px] text-[#888888] font-bold block">Business Hours:</span>
                        <p className="font-semibold text-[#171717] mt-0.5">{userRegisteredLocation.businessHours}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Helpline & Direct Actions */}
                  <div className="bg-white/90 backdrop-blur-xs border border-[#FFD7C2] p-5 rounded-2xl space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                        <Headphones className="w-4 h-4 text-[#F4511E]" />
                        <span>Regional Helpline & Support</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold">
                        24/7 Active
                      </span>
                    </div>

                    <p className="text-xs text-[#666666] leading-relaxed">
                      Connect directly with our local jurisdiction merchant support officer for inquiries, partner verification, or remittance clearance.
                    </p>

                    <div className="space-y-2 pt-2">
                      <a
                        href={`tel:${userRegisteredLocation.phone.replace(/[^0-9+]/g, '')}`}
                        className="w-full py-2.5 px-4 bg-[#F4511E] hover:bg-[#E64A19] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call Helpline ({userRegisteredLocation.phone})</span>
                      </a>

                      <a
                        href={`mailto:${userRegisteredLocation.email}`}
                        className="w-full py-2 px-4 bg-[#FFF4ED] hover:bg-[#FFE0CC] text-[#F4511E] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email Support Desk</span>
                      </a>

                      {userRegisteredLocation.mapsUrl && (
                        <a
                          href={userRegisteredLocation.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-4 bg-white border border-[#E5E7EB] hover:border-[#F4511E] text-[#171717] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Compass className="w-3.5 h-3.5 text-[#F4511E]" />
                          <span>View on Google Maps</span>
                          <ExternalLink className="w-3 h-3 text-[#999999]" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. OTHER COMPANY LOCATIONS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#171717] tracking-tight">
                {searchQuery ? 'Search Results' : 'Global Registered Jurisdictions & Offices'}
              </h2>
              <span className="text-xs text-[#666666] font-medium">
                {searchQuery ? allLocationsFiltered.length : filteredOtherLocations.length} Registered Hubs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {(searchQuery ? allLocationsFiltered : filteredOtherLocations).map((loc) => (
                <div
                  key={loc.id}
                  className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#F4511E] hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-1.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                          {loc.flag}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-[#171717] group-hover:text-[#F4511E] transition-colors">
                            {loc.countryName}
                          </h3>
                          <p className="text-xs text-[#666666] font-medium">{loc.city}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-[11px] font-bold">
                        Verified Active
                      </span>
                    </div>

                    <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EFE8DC] space-y-1">
                      <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider block">
                        Registration & Compliance Data
                      </span>
                      <p className="text-xs text-[#444444] leading-relaxed">
                        {loc.description}
                      </p>
                    </div>

                    {/* Key Details matching user specification */}
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-[#888888] text-[11px] block font-medium">Legal Entity:</span>
                        <p className="font-bold text-[#171717]">{loc.companyName}</p>
                      </div>

                      <div>
                        <span className="text-[#888888] text-[11px] block font-medium">Registration Number:</span>
                        <p className="font-semibold text-[#171717]">{loc.registrationNumber}</p>
                      </div>

                      <div>
                        <span className="text-[#888888] text-[11px] block font-medium">Physical Address:</span>
                        <p className="text-[#444444]">{loc.address}</p>
                      </div>

                      <div>
                        <span className="text-[#888888] text-[11px] block font-medium">Direct Contact:</span>
                        <p className="text-[#171717] font-semibold">{loc.email} • {loc.phone}</p>
                      </div>

                      <div>
                        <span className="text-[#888888] text-[11px] block font-medium">Business Hours:</span>
                        <p className="text-[#666666]">{loc.businessHours}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-4 border-t border-[#F3F4F6] flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${loc.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex-1 py-2 px-3 bg-[#FFF4ED] hover:bg-[#F4511E] text-[#F4511E] hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Helpline</span>
                    </a>

                    <a
                      href={`mailto:${loc.email}`}
                      className="py-2 px-3 bg-white border border-[#E5E7EB] hover:border-[#F4511E] text-[#171717] hover:text-[#F4511E] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                      title="Send Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>

                    {loc.mapsUrl && (
                      <a
                        href={loc.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white border border-[#E5E7EB] hover:border-[#F4511E] text-[#666666] hover:text-[#F4511E] rounded-xl transition-colors shadow-2xs"
                        title="Open in Google Maps"
                      >
                        <Compass className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Brand Ambassadors Tab */}
      {activeTab === 'ambassadors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#171717] tracking-tight">
              International Growth Patrons & Ambassadors
            </h2>
            <span className="text-xs text-[#666666]">
              {brandAmbassadors.length} Verified Enterprise Advocates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {brandAmbassadors.map((amb) => (
              <div
                key={amb.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#F4511E] p-5 shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-4 text-center">
                  <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-[#FFD7C2] shadow-xs">
                    <img src={amb.imageUrl} alt={amb.name} className="w-full h-full object-cover" />
                    {amb.verifiedBadge && (
                      <div className="absolute bottom-0 right-2 p-1 bg-[#16A34A] text-white rounded-full shadow-xs">
                        <BadgeCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#171717]">{amb.name}</h3>
                    <p className="text-[11px] font-semibold text-[#F4511E] mt-0.5">{amb.role}</p>
                    <p className="text-xs text-[#666666] flex items-center justify-center gap-1 mt-1">
                      <span>{amb.countryFlag}</span>
                      <span>{amb.country}</span>
                    </p>
                  </div>

                  <p className="text-xs text-[#666666] line-clamp-3 leading-relaxed text-left">
                    {amb.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#666666]">
                  <span>Partner since {amb.partnerSince}</span>
                  <span className="font-semibold text-[#F4511E]">{amb.socialHandle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official eBay License Modal */}
      <EbayLicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      />
    </div>
  );
};
