import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Plus, Package, Trash2, ArrowRight, ToggleLeft, Edit, 
  Settings, DollarSign, TrendingUp, AlertCircle, ShoppingBag, Truck, Check, Sparkles 
} from 'lucide-react';
import { Product, ProductCategory, Order } from '../types';
import { api } from '../lib/api';
import LoadingOverlay from './LoadingOverlay';

interface SellerDashboardViewProps {
  onAddNewProduct: (newProduct: Product) => void;
  onRemoveProduct: (productId: string) => void;
  onCatalogRefresh?: () => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  setView: (view: any) => void;
}

export default function SellerDashboardView({
  onAddNewProduct,
  onRemoveProduct,
  onCatalogRefresh,
  onNotify,
  setView
}: SellerDashboardViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sellerOrders, setSellerOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ activeListings: 0, totalOrders: 0, pendingOrders: 0, revenue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  // Store setup
  const [storeName, setStoreName] = useState("Alpha Cooling & Electricals");
  const [isEditingStoreName, setIsEditingStoreName] = useState(false);

  // Form parameters
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('double-door');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newBrand, setNewBrand] = useState('Haier');
  const [newStock, setNewStock] = useState('15');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600');

  // Tab selections
  const [sellerTab, setSellerTab] = useState<'listings' | 'form' | 'orders'>('listings');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [prods, orders, sellerStats] = await Promise.all([
          api.getSellerProducts(),
          api.getSellerOrders(),
          api.getSellerStats(),
        ]);
        setProducts(prods);
        setSellerOrders(orders);
        setStats(sellerStats);
      } catch (err) {
        onNotify(err instanceof Error ? err.message : 'Failed to load seller data', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const activeListingsCount = stats.activeListings || products.length;
  const totalSellerSales = stats.revenue;

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDesc.trim() || !newPrice.trim()) {
      onNotify('Product title, description, and price are required.', 'error');
      return;
    }

    const priceNum = Number(newPrice);
    const origPriceNum = newOriginalPrice ? Number(newOriginalPrice) : undefined;
    const stockNum = Number(newStock) || 12;

    if (isNaN(priceNum) || priceNum <= 0) {
      onNotify('Please enter a valid numeric pricing tag.', 'error');
      return;
    }

    const compiledProduct: Product = {
      id: `p-sel-${Math.floor(10000 + Math.random() * 90000)}`,
      name: newName,
      description: newDesc,
      category: newCategory,
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercentage: origPriceNum && origPriceNum > priceNum 
        ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) 
        : undefined,
      brand: newBrand,
      image: newImage || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
      images: [newImage],
      rating: 5.0,
      reviewsCount: 0,
      inStock: stockNum > 0,
      stock: stockNum,
      ordersCount: 0,
      sellerType: 'official',
      isNew: true
    };

    onAddNewProduct(compiledProduct);
    setProducts([compiledProduct, ...products]);
    onCatalogRefresh?.();

    // Reset forms
    setNewName('');
    setNewDesc('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewStock('15');
    setSellerTab('listings'); // return to catalog view
  };

  const handleShipOrder = async (orderId: string) => {
    try {
      const { order } = await api.updateSellerOrderStatus(orderId, 'Shipped');
      setSellerOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
      onNotify(`Order ${orderId} marked as shipped.`, 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Failed to update order', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-brand-navy-900" id="seller-dashboard-page">
      {isLoading && <LoadingOverlay message="Loading seller dashboard..." />}
      
      {/* Seller Header Brand Plate */}
      <div className="bg-brand-navy-900 text-white rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-coral/10 rounded-full blur-2xl translate-x-6 -translate-y-6" />
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-coral font-bold uppercase tracking-widest text-[10px]">
            <Building className="w-4 h-4 shrink-0" />
            <span>FRIDGE.PK AUTHORIZED DEALER HUB</span>
          </div>
          
          {isEditingStoreName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="bg-white/10 text-white font-display font-bold text-xl sm:text-2xl px-3 py-1 rounded focus:outline-none border border-brand-coral-light/35"
              />
              <button
                onClick={() => setIsEditingStoreName(false)}
                className="bg-brand-coral text-white px-3 py-1 rounded text-xs font-bold font-sans hover:bg-brand-coral-hover cursor-pointer"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="font-display font-black text-xl sm:text-3xl text-white tracking-tight">
                {storeName}
              </h1>
              <button
                onClick={() => setIsEditingStoreName(true)}
                className="text-[10px] text-brand-coral hover:underline font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded cursor-pointer"
              >
                Rename Studio
              </button>
            </div>
          )}
          <p className="text-slate-400 text-xs font-medium">Manage listings, analyze sales performance, and dispatch pending orders nationwide</p>
        </div>

        <button
          onClick={() => setSellerTab(sellerTab === 'form' ? 'listings' : 'form')}
          className="bg-brand-coral hover:bg-brand-coral-hover text-white px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-sm flex items-center justify-center gap-2 select-none cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Cooling Appliance</span>
        </button>
      </div>

      {/* STATS ANALYTICAL METRICS BLOCK */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8">
        {[
          { label: 'Merchant Sales Value', val: `Rs. ${totalSellerSales.toLocaleString()}`, tag: '+14% this week', desc: 'Gross completed revenue' },
          { label: 'Active Store Listings', val: activeListingsCount, tag: 'fridge.pk Store', desc: 'Cooling appliances live' },
          { label: 'Awaiting Fulfillment', val: stats.pendingOrders, tag: 'Leopards dispatches active', desc: 'Inward customer orders' },
          { label: 'Averaging Experience', val: '★4.9 / 5.0', tag: 'Top Tier Vendor Badge', desc: 'Verified buyer feedback' }
        ].map((st, i) => (
          <div key={i} className="bg-white border border-slate-105 rounded-2xl p-5 shadow-3xs flex flex-col justify-between">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{st.label}</h4>
            <div className="my-2.5">
              <span className="text-lg sm:text-xl font-black text-brand-navy-900 tracking-tight font-serif block">{st.val}</span>
              <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded-md font-bold uppercase inline-block font-sans">{st.tag}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none font-semibold">{st.desc}</p>
          </div>
        ))}
      </div>

      {/* COMPONENT SEGMENTS TABS NAVIGATION */}
      <div className="mt-8 bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs" id="seller-inner-segment-panel">
        
        {/* Navigation headers row */}
        <div className="flex border-b border-slate-100 mb-6">
          <button
            onClick={() => setSellerTab('listings')}
            className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider relative cursor-pointer ${
              sellerTab === 'listings' ? 'text-brand-coral' : 'text-slate-400 hover:text-brand-navy-900'
            }`}
          >
            <span>My Active Products ({products.length})</span>
            {sellerTab === 'listings' && (
              <motion.div layoutId="seller-tab-bar" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-coral" />
            )}
          </button>
          <button
            onClick={() => setSellerTab('form')}
            className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider relative cursor-pointer ${
              sellerTab === 'form' ? 'text-brand-coral' : 'text-slate-400 hover:text-brand-navy-900'
            }`}
          >
            <span>Create Store Listing</span>
            {sellerTab === 'form' && (
              <motion.div layoutId="seller-tab-bar" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-coral" />
            )}
          </button>
          <button
            onClick={() => setSellerTab('orders')}
            className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider relative cursor-pointer flex items-center gap-1.5 ${
              sellerTab === 'orders' ? 'text-brand-coral' : 'text-slate-400 hover:text-brand-navy-900'
            }`}
          >
            <span>Incoming Customer Orders ({stats.pendingOrders})</span>
            {sellerTab === 'orders' && (
              <motion.div layoutId="seller-tab-bar" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-coral" />
            )}
          </button>
        </div>

        {/* Dynamic Context Frame */}
        <div className="min-h-[250px]">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: PRODUCT LISTINGS TABLE OR GRID */}
            {sellerTab === 'listings' && (
              <motion.div
                key="seller-listings"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-sm font-bold text-brand-navy-950 uppercase tracking-widest">Store listings directory</h3>
                  <p className="text-xs text-slate-500 mt-1">Review live products, edit details, and modify price listings.</p>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                        <th className="p-4 rounded-tl-2xl">Item specifications</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Brand</th>
                        <th className="p-4">Retail pricing</th>
                        <th className="p-4">Fulfillment Stock</th>
                        <th className="p-4 text-right rounded-tr-2xl">Action Options</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 font-medium">
                          <td className="p-4">
                            <div className="flex gap-3 items-center">
                              <div className="w-9 h-11 bg-slate-100 rounded overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="font-bold text-brand-navy-950 text-xs line-clamp-1">{item.name}</h4>
                                <span className="text-[10px] text-slate-400 font-serif">ID: {item.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 capitalize text-[10px] font-extrabold">{item.category}</td>
                          <td className="p-4 text-slate-500 font-bold">{item.brand || 'Personal Design'}</td>
                          <td className="p-4 text-brand-coral font-bold font-serif text-sm">Rs. {item.price.toLocaleString()}</td>
                          <td className="p-4 uppercase font-bold text-[10px]">
                            {item.stock && item.stock > 0 ? (
                              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{item.stock} in Stock</span>
                            ) : (
                              <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">Out of stock</span>
                            )}
                          </td>
                          <td className="p-4 text-right select-none">
                            <button
                              onClick={() => {
                                onRemoveProduct(item.id);
                                onNotify(`Removed "${item.name}" from your active listings portfolio.`, 'info');
                              }}
                              className="text-slate-400 hover:text-rose-600 hover:bg-slate-100 p-2 rounded-xl transition-all font-semibold inline-flex items-center gap-1 cursor-pointer"
                              title="Delete active item"
                            >
                              <Trash2 className="w-4 h-4 animate-pulse" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 2: ADD PRODUCT FORM */}
            {sellerTab === 'form' && (
              <motion.div
                key="seller-add-form"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="max-w-3xl"
              >
                <div>
                  <h3 className="text-sm font-bold text-brand-navy-950 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-coral" />
                    <span>Upload new design item</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Populate complete detailed descriptions for customer evaluation.</p>
                </div>

                <form onSubmit={handleCreateProductSubmit} className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Product Title Name</label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. PEL Pride Inverter Refrigerator 3300 Pro"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>

                    {/* Brand */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Sub-Brand Label</label>
                      <input
                        type="text"
                        required
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Category Tag</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      >
                        <option value="double-door">Double Door Refrigerator</option>
                        <option value="single-door">Single Door Refrigerator</option>
                        <option value="side-by-side">Premium Side-by-Side Fridge</option>
                        <option value="deep-freezer">Deep Chest Freezer</option>
                        <option value="air-conditioner">Inverter Air Conditioner</option>
                        <option value="water-dispenser">Hot & Cold Water Dispenser</option>
                      </select>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Sale Price (PKR)</label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="e.g. 5800"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>

                    {/* Original Price */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Original Price (PKR - For Discount Tag)</label>
                      <input
                        type="number"
                        value={newOriginalPrice}
                        onChange={(e) => setNewOriginalPrice(e.target.value)}
                        placeholder="e.g. 7500"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image URL */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Product Principal Image URL</label>
                      <input
                        type="url"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>

                    {/* Stock level */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Fulfillment Stock Count</label>
                      <input
                        type="number"
                        required
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        placeholder="e.g. 15"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Public Item Description</label>
                    <textarea
                      rows={3}
                      required
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Write fabric details, sizes available inside box packaging, washing manuals, PTA details etc."
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-brand-navy-900 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-navy-900 hover:bg-brand-coral text-white font-bold text-xs py-3 rounded-xl uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Submit Listing Live (Publish on fridge.pk)
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB 3: INCOMING CUSTOMER ORDERS */}
            {sellerTab === 'orders' && (
              <motion.div
                key="seller-orders"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-sm font-bold text-brand-navy-950 uppercase tracking-widest">Inward orders ledger</h3>
                  <p className="text-xs text-slate-500 mt-1">Review inward customer checks, print air waybills, and fulfill dispatches.</p>
                </div>

                <div className="space-y-4">
                  {sellerOrders.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-8">No customer orders yet for your listings.</p>
                  ) : sellerOrders.map((ord) => (
                    <div 
                      key={ord.id}
                      className="border border-slate-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black bg-brand-coral/10 text-brand-coral px-2.5 py-0.5 rounded border border-brand-coral-light/25">Order {ord.id}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{ord.date}</span>
                          <span className="text-[10px] font-bold uppercase text-slate-500">{ord.status}</span>
                        </div>
                        <h4 className="text-xs font-bold text-brand-navy-900">
                          Buyer: {ord.shippingAddress.fullName} ({ord.shippingAddress.city})
                        </h4>
                        {ord.items.map((it, i) => (
                          <div key={i} className="text-[11px] font-medium text-slate-600">
                            {it.product.name} — {it.size} × {it.quantity}
                          </div>
                        ))}
                        <p className="text-xs text-brand-coral font-bold font-serif">Total: Rs. {ord.total.toLocaleString()}</p>
                      </div>

                      <div className="shrink-0 select-none">
                        {ord.status === 'Shipped' || ord.status === 'Delivered' ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1 uppercase">
                            <Truck className="w-3.5 h-3.5" />
                            <span>{ord.status}</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleShipOrder(ord.id)}
                            className="bg-brand-navy-900 hover:bg-brand-coral text-white text-xs px-4 py-2.5 rounded-xl font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Truck className="w-4 h-4" />
                            <span>Mark Shipped</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
