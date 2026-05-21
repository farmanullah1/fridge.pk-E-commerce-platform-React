import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Star, ShoppingCart, Filter, ArrowUpDown, X, Eye } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductsListingViewProps {
  products: Product[];
  categoryFilter?: string;
  searchQuery?: string;
  onAddToCart: (product: Product, size: CartItem['size']) => void;
  onProductClick: (product: Product) => void;
  setView: (view: any) => void;
}

export default function ProductsListingView({
  products,
  categoryFilter = 'all',
  searchQuery = '',
  onAddToCart,
  onProductClick,
  setView
}: ProductsListingViewProps) {
  // Filters states
  const [maxPrice, setMaxPrice] = useState<number>(350000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedSellerType, setSelectedSellerType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Dynamic lists from active category products
  const categoryProducts = useMemo(() => {
    return products.filter(p => {
      // Category match
      if (categoryFilter && categoryFilter !== 'all') {
        return p.category === categoryFilter;
      }
      return true;
    });
  }, [products, categoryFilter]);

  // Unique list of brands for current filter selection
  const brandsList = useMemo(() => {
    const brandsSet = new Set<string>();
    categoryProducts.forEach(p => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet);
  }, [categoryProducts]);

  // High price range calculation
  const highestPriceLimit = useMemo(() => {
    if (categoryProducts.length === 0) return 350000;
    return Math.max(...categoryProducts.map(p => p.price));
  }, [categoryProducts]);

  // Handle brand selections toggling
  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Perform filtering of listed products
  const processedProducts = useMemo(() => {
    return categoryProducts.filter(p => {
      // Text Search query match if any
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesBrand = p.brand?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesDesc && !matchesBrand) return false;
      }

      // Max Price constraint
      if (p.price > maxPrice) return false;

      // Brand selection check
      if (selectedBrands.length > 0 && p.brand && !selectedBrands.includes(p.brand)) {
        return false;
      }

      // Rating score match
      if (selectedRating !== null && p.rating < selectedRating) {
        return false;
      }

      // Official store check
      if (selectedSellerType) {
        if (p.sellerType !== selectedSellerType) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // relevance / standard
    });
  }, [categoryProducts, searchQuery, maxPrice, selectedBrands, selectedRating, selectedSellerType, sortBy]);

  const clearAllFilters = () => {
    setMaxPrice(highestPriceLimit || 350000);
    setSelectedBrands([]);
    setSelectedRating(null);
    setSelectedSellerType(null);
    setSortBy('relevance');
  };

  const getCategoryTitle = () => {
    switch (categoryFilter) {
      case 'all': return 'All Inverter Cooling Systems';
      case 'single-door': return 'Single-Door Compact Fridges';
      case 'double-door': return 'Double-Door Frost-Free Refrigerators';
      case 'side-by-side': return 'Luxury Side-by-Side Fridges';
      case 'deep-freezer': return 'Chest & Deep Freezers';
      case 'air-conditioner': return 'Smart Inverter Air Conditioners';
      case 'water-dispenser': return 'Filtered Water Dispensers';
      default: return categoryFilter ? categoryFilter.toUpperCase() : 'Catalog';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-brand-navy-900" id="search-products-listing-page">
      {/* Breadcrumb row */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-6 select-none bg-white p-3 rounded-xl border border-slate-100">
        <button onClick={() => setView('home')} className="hover:text-brand-coral transition-colors">Home</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 font-semibold">{getCategoryTitle()}</span>
        {searchQuery && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand-coral">Search Results for "{searchQuery}"</span>
          </>
        )}
      </nav>

      {/* Main filters/grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* LEFT FILTER SIDEBAR (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
              <Filter className="w-4 h-4 text-brand-coral" />
              <span>FILTER OPTIONS</span>
            </div>
            <button 
              onClick={clearAllFilters}
              className="text-[11px] font-bold text-slate-400 hover:text-brand-coral transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Price range slider selection */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Limitation (PKR)</h4>
            <div className="space-y-2">
              <input 
                type="range"
                min={100}
                max={highestPriceLimit > 100 ? highestPriceLimit : 350000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-coral cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Rs. 100</span>
                <span className="text-brand-coral border border-brand-coral-light bg-brand-coral/5 px-2 py-0.5 rounded">
                  Max: Rs. {maxPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Brands Checklist */}
          {brandsList.length > 0 && (
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter by Brand</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {brandsList.map(brand => (
                  <label key={brand} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer select-none font-medium hover:text-brand-navy-900">
                    <input 
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="rounded border-slate-300 text-brand-coral focus:ring-brand-coral h-4 w-4"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Customer Rating Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Experience</h4>
            <div className="space-y-1.5">
              {[5, 4, 3].map(rating => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  className={`w-full text-left flex items-center justify-between text-xs py-1 px-2 rounded-lg transition-all ${
                    selectedRating === rating
                      ? 'bg-brand-coral/10 text-brand-coral font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="pl-1.5 font-medium">& Up</span>
                  </div>
                  <span className="text-[10px] text-slate-400">★{rating}.0+</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seller Type Check filters */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seller Affiliation</h4>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedSellerType(selectedSellerType === 'official' ? null : 'official')}
                className={`w-full border py-2.5 rounded-xl text-xs font-bold font-serif transition-all text-center flex items-center justify-center gap-1.5 ${
                  selectedSellerType === 'official'
                    ? 'bg-brand-navy-900 text-white border-brand-navy-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Fridge Mall Store</span>
              </button>
              <button
                onClick={() => setSelectedSellerType(selectedSellerType === 'individual' ? null : 'individual')}
                className={`w-full border py-2.5 rounded-xl text-xs font-bold font-serif transition-all text-center flex items-center justify-center gap-1.5 ${
                  selectedSellerType === 'individual'
                    ? 'bg-brand-navy-900 text-white border-brand-navy-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Individual Sellers</span>
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT PRODUCT GRID COLUMN */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Sorter and summary header panel */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-3xs">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-brand-navy-900">
                {getCategoryTitle()}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Showing <span className="text-brand-coral font-bold">{processedProducts.length}</span> verified results on fridge.pk
              </p>
            </div>

            {/* Sorting choices dropdown and mobile filters opener */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex-grow flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Filter className="w-4 h-4 text-brand-coral" />
                <span>Filters ({selectedBrands.length + (selectedRating ? 1 : 0) + (selectedSellerType ? 1 : 0)})</span>
              </button>

              <div className="relative shrink-0 flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-semibold w-full sm:w-auto">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-brand-navy-900 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="relevance">By Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating">Top Rated Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active filters badges tags list */}
          {(selectedBrands.length > 0 || selectedRating !== null || selectedSellerType !== null || maxPrice < highestPriceLimit) && (
            <div className="flex flex-wrap gap-2 items-center text-xs font-bold text-slate-600">
              <span className="text-slate-400">Active Criteria:</span>
              {selectedBrands.map(b => (
                <span key={b} className="bg-white border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px]">
                  <span>{b}</span>
                  <button onClick={() => handleBrandToggle(b)} className="text-slate-400 hover:text-brand-coral font-sans text-xs">×</button>
                </span>
              ))}
              {selectedRating && (
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px]">
                  <span>{selectedRating} Stars & Up</span>
                  <button onClick={() => setSelectedRating(null)} className="text-slate-400 hover:text-brand-coral">×</button>
                </span>
              )}
              {selectedSellerType && (
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] capitalize">
                  <span>Seller: {selectedSellerType}</span>
                  <button onClick={() => setSelectedSellerType(null)} className="text-slate-400 hover:text-brand-coral">×</button>
                </span>
              )}
              {maxPrice < highestPriceLimit && (
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px]">
                  <span>Max Price: Rs. {maxPrice.toLocaleString()}</span>
                  <button onClick={() => setMaxPrice(highestPriceLimit)} className="text-slate-400 hover:text-brand-coral">×</button>
                </span>
              )}
              <button 
                onClick={clearAllFilters}
                className="text-xs text-brand-coral hover:underline font-bold px-1"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Primary Product Grid list */}
          {processedProducts.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-xs">
              <Filter className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-brand-navy-900">No Matched Products</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-normal">
                No items match your particular combination of filters. Try raising your price range or clearing search queries.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-6 px-6 py-2.5 bg-brand-coral hover:bg-brand-coral-hover text-white rounded-xl text-xs font-bold tracking-widest uppercase"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {processedProducts.map(product => {
                const discountAmount = product.originalPrice ? product.originalPrice - product.price : 0;
                return (
                  <motion.div
                    key={product.id}
                    layoutId={`product-list-card-${product.id}`}
                    className="group bg-white border border-slate-100 hover:border-brand-coral-light/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full relative"
                  >
                    {/* Discount/Tag overlay badges */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 select-none">
                      {product.discountPercentage && (
                        <span className="bg-brand-coral text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          -{product.discountPercentage}% OFF
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-teal-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Image space */}
                    <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden cursor-pointer" onClick={() => onProductClick(product)}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600';
                        }}
                      />
                      
                      {/* Hover Actions Sheet view trigger */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onProductClick(product);
                          }}
                          className="bg-white text-brand-navy-900 p-2.5 rounded-full hover:bg-brand-coral hover:text-white shadow-md transition-colors"
                          title="Quick View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product, 'M');
                          }}
                          className="bg-brand-coral text-white p-2.5 rounded-full hover:bg-brand-navy-900 shadow-md transition-colors"
                          title="Add instantly to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Product Metadata detail */}
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                      <div onClick={() => onProductClick(product)} className="cursor-pointer space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>{product.brand || 'Official Brand'}</span>
                          <span>{product.category}</span>
                        </div>
                        <h3 className="text-[13px] font-bold text-brand-navy-900 leading-tight group-hover:text-brand-coral transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        {/* Rating row with stars */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <div className="flex items-center text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="pl-0.5 text-xs font-bold text-slate-700">{product.rating}</span>
                          </div>
                          <span className="text-[10px] text-slate-300">|</span>
                          <span className="text-[10px] font-semibold text-slate-400">{product.ordersCount || 42}+ Sold</span>
                        </div>

                        {/* Price tiering */}
                        <div className="flex items-baseline gap-1.5 font-serif pt-1">
                          <span className="text-sm font-bold text-brand-coral">
                            Rs. {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              Rs. {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* MOBILE FILTER OVERLAY DRAWERS */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="bg-white w-full max-w-xs h-full p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="font-bold text-sm tracking-widest text-brand-navy-900 uppercase">FILTERS SCREEN</span>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Price list */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Price (PKR)</h4>
                  <input 
                    type="range"
                    min={100}
                    max={highestPriceLimit || 350000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg accent-brand-coral cursor-pointer"
                  />
                  <p className="text-xs font-bold text-brand-coral">
                    Limit: Rs. {maxPrice.toLocaleString()}
                  </p>
                </div>

                {/* Brand checkboxes */}
                {brandsList.length > 0 && (
                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-serif">Brand choice:</h4>
                    <div className="space-y-2">
                      {brandsList.map(brand => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                          <input 
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="rounded border-slate-300 text-brand-coral"
                          />
                          <span>{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer rating */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ratings:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {[5, 4, 3].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                        className={`text-xs px-3 py-1 flex items-center gap-1 rounded-full border ${
                          selectedRating === rating
                            ? 'bg-brand-coral text-white border-brand-coral font-bold'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <span>{rating}★ & Up</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Store Type check */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seller Type:</h4>
                  <button
                    onClick={() => setSelectedSellerType(selectedSellerType === 'official' ? null : 'official')}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold font-serif transition-all text-center border ${
                      selectedSellerType === 'official' ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    fridge.pk Store
                  </button>
                </div>
              </div>

              <div className="py-2.5 border-t border-slate-100">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full py-3 bg-brand-coral hover:bg-brand-coral-hover text-white rounded-xl text-xs font-bold tracking-widest uppercase transition-all"
                >
                  Apply Filters ({processedProducts.length} Items)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
