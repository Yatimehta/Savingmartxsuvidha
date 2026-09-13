'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  Search,
  Download,
  Upload,
  Check,
  X,
  Sparkles,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Product, ProductCategory } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'fruits' as ProductCategory,
    categoryName: 'Fresh Fruits',
    price: '',
    originalPrice: '',
    unit: 'per kg',
    stockCount: '50',
    origin: 'Victoria, Australia',
    freshnessBadge: 'Farm Direct Harvest',
    dietary: 'Australian Grown, Fresh',
    description: '',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    isOrganic: false
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockChange = async (productId: string, newStock: number) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockCount: newStock })
      });
      if (res.ok) {
        setProducts(
          products.map((p) => (p.id === productId ? { ...p, stockCount: newStock } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product from the catalog?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== productId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
          stockCount: parseInt(formData.stockCount, 10),
          dietary: formData.dietary.split(',').map((s) => s.trim())
        })
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const headers = 'ID,Name,Category,Price,Unit,Stock,Origin\n';
    const rows = products
      .map(
        (p) =>
          `"${p.id}","${p.name}","${p.categoryName}","${p.price}","${p.unit}","${p.stockCount}","${p.origin}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vegimart_products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkCsvText.trim()) return;
    setBulkLoading(true);
    setBulkMessage(null);
    try {
      const res = await fetch('/api/products/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData: bulkCsvText })
      });
      const data = await res.json();
      if (data.success) {
        setBulkMessage(`Success! Uploaded and added ${data.count} products to catalog.`);
        fetchProducts();
        setTimeout(() => {
          setIsBulkModalOpen(false);
          setBulkCsvText('');
          setBulkMessage(null);
        }, 1200);
      } else {
        setBulkMessage(data.error || 'Failed to parse CSV');
      }
    } catch {
      setBulkMessage('Bulk upload request failed.');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setBulkCsvText(text);
      };
      reader.readAsText(file);
    }
  };

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.origin.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-vegimart-green" /> Product Catalog & Inventory
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage Australian IGA farm items and Suvidha cafe snacks. Total: <strong>{products.length}</strong> items.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={exportCSV}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-vegimart-green/40 hover:bg-green-50 text-xs font-semibold text-vegimart-green flex items-center justify-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Bulk CSV
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-vegimart-green hover:bg-green-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Produce
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items, origins..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-vegimart-green"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'fruits', 'vegetables', 'suvidha-cafe', 'dairy-bakery', 'pantry'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                categoryFilter === cat
                  ? 'bg-vegimart-green text-white font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Origin / Freshness</th>
                <th className="py-3 px-4 text-center">Stock Count</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/60">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 rounded-xl object-cover bg-gray-100"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{prod.name}</p>
                      <p className="text-[10px] text-gray-400">{prod.unit}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prod.category === 'suvidha-cafe'
                        ? 'bg-orange-100 text-vegimart-orange'
                        : 'bg-green-50 text-vegimart-green'
                    }`}>
                      {prod.categoryName}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900 text-sm">
                    ${prod.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">{prod.origin}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">{prod.freshnessBadge}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={prod.stockCount}
                      onChange={(e) => handleStockChange(prod.id, parseInt(e.target.value, 10) || 0)}
                      className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-center font-bold text-xs"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Add New Grocery Product</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Victorian Golden Apricots"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      const catName =
                        cat === 'fruits'
                          ? 'Fresh Fruits'
                          : cat === 'vegetables'
                          ? 'Fresh Vegetables'
                          : cat === 'suvidha-cafe'
                          ? 'Suvidha Cafe & Grocery'
                          : cat === 'dairy-bakery'
                          ? 'Dairy & Bakery'
                          : 'Pantry Essentials';
                      setFormData({ ...formData, category: cat, categoryName: catName });
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <option value="fruits">Fresh Fruits</option>
                    <option value="vegetables">Fresh Vegetables</option>
                    <option value="suvidha-cafe">Suvidha Cafe & Grocery</option>
                    <option value="dairy-bakery">Dairy & Bakery</option>
                    <option value="pantry">Pantry Essentials</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Price (AUD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="4.50"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Unit *</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="per kg or each"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Origin / Farm Location</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="e.g. Yarra Valley, Victoria"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-vegimart-green text-white font-bold shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK CSV UPLOAD MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-green-100 text-vegimart-green flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Bulk Product Upload</h2>
                  <p className="text-xs text-gray-500">Upload CSV file or paste formatted CSV records</p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bulkMessage && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                bulkMessage.includes('Success')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {bulkMessage.includes('Success') ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                {bulkMessage}
              </div>
            )}

            <form onSubmit={handleBulkUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  1. Select CSV File from Computer
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-vegimart-green hover:file:bg-green-100 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    2. Or Paste Raw CSV Content Below
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setBulkCsvText(
                        'name,category,price,unit,stock,origin,organic,description\n' +
                        'Victorian Hass Avocados 2pk,fruits,4.90,2 pack,45,Sunraysia VIC,false,Creamy rich Hass avocados ready to slice.\n' +
                        'Fresh Ginger Root,vegetables,2.80,per 200g,30,Queensland Australia,true,Zesty aromatic organic ginger rhizomes.\n' +
                        'Suvidha Punjabi Masala Chai 250g,suvidha-cafe,7.50,250g box,50,Imported Blend,false,Handcrafted blend with crushed green cardamom and cinnamon.'
                      );
                    }}
                    className="text-[11px] text-vegimart-orange hover:underline font-semibold"
                  >
                    Paste Sample CSV
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={bulkCsvText}
                  onChange={(e) => setBulkCsvText(e.target.value)}
                  placeholder="name,category,price,unit,stock,origin,organic,description&#10;Crisp Red Apples,fruits,4.50,per kg,50,Victoria,true,Fresh and sweet"
                  className="w-full p-3 font-mono text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-vegimart-green focus:outline-hidden"
                />
              </div>

              <div className="text-[11px] text-gray-400 bg-gray-50 p-2.5 rounded-xl">
                Supported categories: <code>vegetables</code>, <code>fruits</code>, <code>organic</code>, <code>suvidha-cafe</code>, <code>dairy-bakery</code>, <code>pantry</code>.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bulkLoading || !bulkCsvText.trim()}
                  className="px-5 py-2 rounded-xl bg-vegimart-green hover:bg-green-800 disabled:opacity-50 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {bulkLoading ? 'Uploading...' : 'Import to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
