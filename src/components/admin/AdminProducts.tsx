import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { Plus, Edit2, Trash2, Search, Package, Star, Eye, Layers, DollarSign, Home, Image as ImageIcon } from 'lucide-react';
import { Modal } from '../common/Modal';

export const AdminProducts: React.FC = () => {
  const { products, saveProduct, deleteProduct, formatCurrency } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    'Studio Audio & Electronics',
    'Horology & Wearables',
    'Executive Leather & Luggage',
    'Artisanal Home & Kitchen',
    'Industrial Machinery & Equipment',
    'Luxury Automotive & Transport',
    'Maritime & Luxury Vessels',
    'Prime Real Estate & Estates',
    'Commercial Properties & Towers',
  ];

  const filteredProducts = products.filter((prod) => {
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;
    if (selectedLevelFilter !== 'all' && (prod.minLevel ?? 0) !== parseInt(selectedLevelFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchSku = prod.sku?.toLowerCase().includes(q);
      const matchCat = prod.category.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchCat) return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct({
      name: '',
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      category: 'Studio Audio & Electronics',
      price: 199.00,
      baseValue: 199.00,
      baseCurrency: 'USD',
      minLevel: 1,
      maxLevel: 10,
      commissionRate: 7.0,
      commissionType: 'percentage',
      inventory: 25,
      description: '',
      specifications: { 'Origin': 'Global Commercial Certified', 'Warranty': '3 Years Direct' },
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
      isFeatured: false,
      isAvailable: true,
      status: 'active',
      propertyDetails: {
        propertyType: 'Luxury Estate',
        location: 'California, USA',
        landArea: '1.2 Acres',
        buildingArea: '5,000 sq ft',
        bedrooms: 4,
        bathrooms: 5,
        yearBuilt: 2023,
        propertyStatus: 'Verified Title',
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct({
      ...p,
      baseValue: p.baseValue || p.price,
      propertyDetails: p.propertyDetails || {
        propertyType: 'Commercial Property',
        location: 'Downtown Center',
        landArea: '1 Acre',
        buildingArea: '10,000 sq ft',
        bedrooms: 0,
        bathrooms: 10,
        yearBuilt: 2024,
        propertyStatus: 'Certified',
      },
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;
    saveProduct(editingProduct);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const isRealEstate = editingProduct?.category === 'Prime Real Estate & Estates' || editingProduct?.category === 'Commercial Properties & Towers';

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] tracking-tight">
            Product & Asset Inventory ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Configure Level 0 to Level 10 product tiers, USD base valuations ($1,000+ to $100,000+), real estate attributes, and task margins.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-bold text-white bg-[#F4511E] hover:bg-[#E64A19] rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product / Asset</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB]">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#999999] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, category, or SKU..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E] bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <select
            value={selectedLevelFilter}
            onChange={(e) => setSelectedLevelFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white font-medium cursor-pointer"
          >
            <option value="all">All Plan Levels (0–10)</option>
            <option value="0">Level 0 (Basic Trial)</option>
            <option value="1">Level 1 (Starter)</option>
            <option value="2">Level 2 ($1,000+)</option>
            <option value="3">Level 3 ($1,000+)</option>
            <option value="4">Level 4 ($5,000+)</option>
            <option value="5">Level 5 ($5,000+)</option>
            <option value="6">Level 6 ($50,000+)</option>
            <option value="7">Level 7 ($50,000+)</option>
            <option value="8">Level 8 ($100,000+)</option>
            <option value="9">Level 9 ($100,000+)</option>
            <option value="10">Level 10 ($1,000,000+)</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white font-medium cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#F4511E] p-4 shadow-xs flex flex-col justify-between transition-all group"
          >
            <div className="space-y-3">
              <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100 border border-[#E5E7EB]">
                <img
                  src={p.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 bg-[#171717]/85 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  Level {p.minLevel ?? 0} {p.minLevel === 0 ? '(Trial)' : '+'}
                </div>
                <div className="absolute top-2 right-2 px-2.5 py-1 bg-[#F4511E] text-white text-[11px] font-bold rounded-lg shadow-xs">
                  ${(p.baseValue || p.price).toLocaleString()} USD
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">{p.category}</span>
                <h3 className="text-sm font-bold text-[#171717] line-clamp-1 group-hover:text-[#F4511E] transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-[#666666] line-clamp-2 mt-1 leading-relaxed">{p.description}</p>
              </div>

              {p.propertyDetails && (p.category.includes('Real Estate') || p.category.includes('Commercial')) && (
                <div className="bg-[#FFF9F5] border border-[#FFD7C2] p-2.5 rounded-xl text-[11px] text-[#444444] space-y-1">
                  <p><strong className="text-[#171717]">Type:</strong> {p.propertyDetails.propertyType} • {p.propertyDetails.location}</p>
                  <p><strong className="text-[#171717]">Area:</strong> {p.propertyDetails.buildingArea} ({p.propertyDetails.landArea})</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
              <div className="text-xs text-[#666666]">
                <span>SKU: <strong className="text-[#171717]">{p.sku}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#F4511E] text-[#666666] hover:text-[#F4511E] transition-colors"
                  title="Edit Product"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="p-1.5 rounded-lg border border-[#E5E7EB] hover:border-red-500 text-[#666666] hover:text-red-500 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / ADD MODAL */}
      {isModalOpen && editingProduct && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct.id ? 'Edit Product / Asset' : 'Add New Product / High-Value Asset'}
          subtitle="Configure base valuation, target level eligibility, category, and real estate specifications."
          maxWidth="lg"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Product / Asset Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Category</label>
                <select
                  value={editingProduct.category || categories[0]}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Base Value (USD $)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingProduct.baseValue ?? editingProduct.price ?? 100}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    baseValue: parseFloat(e.target.value),
                    price: parseFloat(e.target.value),
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Minimum Required Level</label>
                <select
                  value={editingProduct.minLevel ?? 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, minLevel: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                >
                  <option value={0}>Level 0 (Basic Trial)</option>
                  <option value={1}>Level 1 (Starter)</option>
                  <option value={2}>Level 2 ($1,000+)</option>
                  <option value={3}>Level 3 ($1,000+)</option>
                  <option value={4}>Level 4 ($5,000+)</option>
                  <option value={5}>Level 5 ($5,000+)</option>
                  <option value={6}>Level 6 ($50,000+)</option>
                  <option value={7}>Level 7 ($50,000+)</option>
                  <option value={8}>Level 8 ($100,000+)</option>
                  <option value={9}>Level 9 ($100,000+)</option>
                  <option value={10}>Level 10 ($1,000,000+)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Inventory / Units</label>
                <input
                  type="number"
                  value={editingProduct.inventory ?? 10}
                  onChange={(e) => setEditingProduct({ ...editingProduct, inventory: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Primary Image URL</label>
              <input
                type="url"
                required
                value={editingProduct.images?.[0] || ''}
                onChange={(e) => setEditingProduct({
                  ...editingProduct,
                  images: [e.target.value, ...(editingProduct.images?.slice(1) || [])],
                })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={editingProduct.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E]"
              />
            </div>

            {/* REAL ESTATE SPECIFIC FIELDS */}
            {isRealEstate && (
              <div className="bg-[#FFF9F5] border border-[#FFD7C2] p-4 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-[#F4511E] uppercase tracking-wider flex items-center gap-1.5">
                  <Home className="w-4 h-4" />
                  <span>Real Estate & Property Specifications</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#171717] mb-1">Property Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Luxury Villa / Farm House"
                      value={editingProduct.propertyDetails?.propertyType || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        propertyDetails: { ...editingProduct.propertyDetails, propertyType: e.target.value },
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E5E7EB] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#171717] mb-1">Location Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Beverly Hills, CA"
                      value={editingProduct.propertyDetails?.location || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        propertyDetails: { ...editingProduct.propertyDetails, location: e.target.value },
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E5E7EB] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#171717] mb-1">Building Area</label>
                    <input
                      type="text"
                      placeholder="e.g. 8,400 sq ft"
                      value={editingProduct.propertyDetails?.buildingArea || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        propertyDetails: { ...editingProduct.propertyDetails, buildingArea: e.target.value },
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E5E7EB] bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#171717] mb-1">Land Area</label>
                    <input
                      type="text"
                      placeholder="e.g. 0.85 Acres"
                      value={editingProduct.propertyDetails?.landArea || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        propertyDetails: { ...editingProduct.propertyDetails, landArea: e.target.value },
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E5E7EB] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#171717] mb-1">Bedrooms / Baths</label>
                    <input
                      type="text"
                      placeholder="e.g. 6 Beds / 8 Baths"
                      value={`${editingProduct.propertyDetails?.bedrooms ?? 0} Beds / ${editingProduct.propertyDetails?.bathrooms ?? 0} Baths`}
                      onChange={(e) => {
                        const parts = e.target.value.match(/\d+/g) || ['0', '0'];
                        setEditingProduct({
                          ...editingProduct,
                          propertyDetails: {
                            ...editingProduct.propertyDetails,
                            bedrooms: parseInt(String(parts[0] || '0'), 10),
                            bathrooms: parseInt(String(parts[1] || '0'), 10),
                          },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E5E7EB] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#171717] mb-1">Title & Deed Status</label>
                    <input
                      type="text"
                      placeholder="e.g. Verified Escrow Deed"
                      value={editingProduct.propertyDetails?.propertyStatus || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        propertyDetails: { ...editingProduct.propertyDetails, propertyStatus: e.target.value },
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E5E7EB] bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E5E7EB] text-[#666666] hover:bg-[#F9FAFB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#F4511E] hover:bg-[#E64A19] text-white shadow-xs"
              >
                Save Product
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
