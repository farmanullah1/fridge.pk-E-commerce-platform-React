import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Plus, Minus, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

// Models/Types
import { ActiveView, User, Product, CartItem, Order } from './types';
import { mockProducts } from './mockData';
import { api } from './lib/api';

// Component Renders
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Notification from './components/Notification';

// Import Views
import HomeView from './components/HomeView';
import ProductsListingView from './components/ProductsListingView';
import ProductDetailView from './components/ProductDetailView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import SellerDashboardView from './components/SellerDashboardView';
import OrderTrackingView from './components/OrderTrackingView';
import DashboardView from './components/DashboardView';
import LoginView from './components/LoginView';
import SignUpView from './components/SignUpView';
import ForgotPasswordView from './components/ForgotPasswordView';
import WishlistView from './components/WishlistView';
import CompareView from './components/CompareView';
import AiAssistantView from './components/AiAssistantView';
import BillCalculatorView from './components/BillCalculatorView';
import ArVisualizerView from './components/ArVisualizerView';
import FaqView from './components/FaqView';
import ReturnsPolicyView from './components/ReturnsPolicyView';
import DeveloperProfileView from './components/DeveloperProfileView';
import ApplianceMatcherQuizView from './components/ApplianceMatcherQuizView';
import LandingView from './components/LandingView';
import FloatingChatbot from './components/FloatingChatbot';
import LoadingOverlay from './components/LoadingOverlay';

export default function App() {
  const [productsList, setProductsList] = useState<Product[]>(mockProducts);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  // Active Routing Screen State
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    const visited = localStorage.getItem('fringe_visited_before');
    return visited === 'true' ? 'home' : 'landing';
  });
  
  // Selected single item for Detail Presentation Page
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Default Shipping Location State
  const [locationCity, setLocationCity] = useState('Karachi');

  // Dark mode active theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('fringe_dark_theme') === 'true';
  });

  // Toggle utility
  const handleToggleTheme = (isD: boolean) => {
    setIsDark(isD);
    localStorage.setItem('fringe_dark_theme', String(isD));
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Wishlist and compare states
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  // Update Wishlist and store in cache
  const updateWishlistState = (nextWishlist: Product[]) => {
    setWishlist(nextWishlist);
    localStorage.setItem('fringe_wishlist', JSON.stringify(nextWishlist));
  };

  const handleAddToWishlist = (product: Product) => {
    if (wishlist.some(it => it.id === product.id)) {
      triggerToast(`"${product.name}" is already in your wishlist!`, 'info');
      return;
    }
    const nextWishlist = [...wishlist, product];
    updateWishlistState(nextWishlist);
    if (user?.token) {
      api.addToWishlist(product.id).catch(() => {});
    }
    triggerToast(`Added "${product.name}" to your wishlist.`, 'success');
  };

  const handleRemoveFromWishlist = (product: Product) => {
    const nextWishlist = wishlist.filter(it => it.id !== product.id);
    updateWishlistState(nextWishlist);
    if (user?.token) {
      api.removeFromWishlist(product.id).catch(() => {});
    }
  };

  const handleAddToCompare = (product: Product) => {
    if (compareProducts.some(it => it.id === product.id)) {
      triggerToast(`"${product.name}" is already in comparison!`, 'info');
      return;
    }
    if (compareProducts.length >= 4) {
      triggerToast("You can compare a maximum of 4 products side-by-side.", 'error');
      return;
    }
    setCompareProducts([...compareProducts, product]);
    triggerToast(`Added "${product.name}" to comparison. Switch to Compare view to see details!`, 'success');
  };

  const handleRemoveFromCompare = (product: Product) => {
    setCompareProducts(compareProducts.filter(it => it.id !== product.id));
  };

  // Custom alert notifications toast states
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Active User session values
  const [user, setUser] = useState<User | null>(null);
  
  // Shopping cart bag state vector and drawer state
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Primary Quick search query
  const [searchQuery, setSearchQuery] = useState('');

  const refreshCatalog = async () => {
    setIsLoadingCatalog(true);
    try {
      await api.health();
      setApiOnline(true);
      const products = await api.getProducts();
      if (products.length > 0) setProductsList(products);
    } catch {
      setApiOnline(false);
    } finally {
      setIsLoadingCatalog(false);
    }
  };

  useEffect(() => {
    refreshCatalog();
  }, []);

  // Hydrate user and cart logs on mount
  useEffect(() => {
    // 1. Fetch user data
    const savedUserData = localStorage.getItem('fringe_user_data');
    if (savedUserData) {
      try {
        setUser(JSON.parse(savedUserData));
      } catch (e) {
        localStorage.removeItem('fringe_user_data');
      }
    }

    // 2. Fetch cart records
    const savedCart = localStorage.getItem('fringe_cart_bag');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem('fringe_cart_bag');
      }
    }

    // 3. Sync wishlist from API when logged in
    const token = localStorage.getItem('fringe_auth_token');
    if (token) {
      api.getWishlist()
        .then((items) => {
          if (items.length > 0) {
            setWishlist(items);
            localStorage.setItem('fringe_wishlist', JSON.stringify(items));
          }
        })
        .catch(() => {});
    }

    // 4. Fetch location
    const savedLoc = localStorage.getItem('fringe_shipping_city');
    if (savedLoc) setLocationCity(savedLoc);

    // 5. Fetch wishlist items
    const savedWishlist = localStorage.getItem('fringe_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        localStorage.removeItem('fringe_wishlist');
      }
    }
  }, []);

  // Update Cart and store in cache
  const updateCartState = (nextCart: CartItem[]) => {
    setCart(nextCart);
    localStorage.setItem('fringe_cart_bag', JSON.stringify(nextCart));
  };

  const triggerToast = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
  };

  const handleLocationChange = (city: string) => {
    setLocationCity(city);
    localStorage.setItem('fringe_shipping_city', city);
    triggerToast(`Location updated to ${city}! Recalculating shipping routes.`, 'info');
  };

  // Add Item to Bag controller
  const handleAddToCart = (product: Product, size: CartItem['size']) => {
    const matchedIndex = cart.findIndex(it => it.product.id === product.id && it.size === size);
    
    let nextCart: CartItem[] = [];
    if (matchedIndex > -1) {
      nextCart = [...cart];
      nextCart[matchedIndex].quantity += 1;
    } else {
      nextCart = [...cart, { product, quantity: 1, size: size || 'M' }];
    }

    updateCartState(nextCart);
    triggerToast(`Added 1x "${product.name}" (Size: ${size || 'M'}) into your shopping bag.`, 'success');
  };

  // Change Qty helper inside cart
  const handleUpdateQty = (index: number, delta: number) => {
    const nextCart = [...cart];
    nextCart[index].quantity += delta;

    if (nextCart[index].quantity <= 0) {
      const deletedName = nextCart[index].product.name;
      nextCart.splice(index, 1);
      triggerToast(`Removed "${deletedName}" from shopping bag.`, 'info');
    }
    updateCartState(nextCart);
  };

  const handleRemoveCartItem = (index: number) => {
    const nextCart = [...cart];
    const deletedName = nextCart[index].product.name;
    nextCart.splice(index, 1);
    updateCartState(nextCart);
    triggerToast(`Removed "${deletedName}" from shopping bag.`, 'info');
  };

  const handleClearFullCart = () => {
    updateCartState([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('fringe_auth_token');
    localStorage.removeItem('fringe_user_data');
    setUser(null);
    setActiveView('home');
    triggerToast('Khuda Hafiz! Logged out successfully.', 'info');
  };

  // Dynamic products actions for sellers
  const handleAddNewProductValue = async (newProd: Product) => {
    try {
      const { product } = await api.createProduct(newProd);
      setProductsList([product, ...productsList]);
      triggerToast('Product listed on fridge.pk catalog!', 'success');
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Failed to add product', 'error');
    }
  };

  const navigateToView = (view: ActiveView) => {
    if (view === 'seller') {
      if (!user) {
        triggerToast('Please sign in to access the seller dashboard.', 'info');
        setActiveView('login');
        return;
      }
      if (user.role !== 'seller') {
        triggerToast('Seller access requires a seller account. Use demo@fridge.pk to test.', 'info');
        return;
      }
    }
    if (view === 'dashboard' && !user) {
      triggerToast('Please sign in to view your account.', 'info');
      setActiveView('login');
      return;
    }
    setActiveView(view);
  };

  const handleRemoveProductValue = async (prodId: string) => {
    try {
      await api.deleteProduct(prodId);
      setProductsList(productsList.filter((p) => p.id !== prodId));
      triggerToast('Product removed from catalog.', 'info');
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Failed to remove product', 'error');
    }
  };

  // Navigate to Category category filters instantly from hero clicks
  const handleCategorySelection = (catSlug: string) => {
    if (catSlug === 'all') {
      setSearchQuery('');
    } else {
      setSearchQuery(catSlug); // triggers matched list searches
    }
    setActiveView('products');
  };

  // Triggered when clicking Buy Now button from detail view
  const handleBuyNowFromDetailAndGo = (prod: Product, size: CartItem['size'], qty: number) => {
    // 1. Inject into bag
    const matchedIndex = cart.findIndex(it => it.product.id === prod.id && it.size === size);
    let nextCart = [...cart];
    if (matchedIndex > -1) {
      nextCart[matchedIndex].quantity += qty;
    } else {
      nextCart.push({ product: prod, quantity: qty, size: size || 'M' });
    }
    updateCartState(nextCart);

    // 2. Direct route to stepper checkout view
    setActiveView('checkout');
  };

  // Subtotals inside main drawer summary
  const subtotalSumList = cart.reduce((acc, it) => acc + (it.product.price * it.quantity), 0);
  const standardShippingRates = subtotalSumList >= 5000 || subtotalSumList === 0 ? 0 : 250;
  const grandTotalDispatches = subtotalSumList + standardShippingRates;
  const summaryItemCountTotal = cart.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-brand-coral/20 transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Toast Alert Layers */}
      <AnimatePresence>
        {notification && (
          <Notification
            key={`${notification.message}-${Date.now()}`}
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Layer */}
      {activeView !== 'landing' && (
        <Navbar
          user={user}
          activeView={activeView}
          setView={navigateToView}
          cart={cart}
          cartCount={summaryItemCountTotal}
          openCart={() => setCartOpen(true)}
          onLogout={handleLogout}
          onSearchChange={(val) => {
            setSearchQuery(val);
            if (activeView !== 'products') {
              setActiveView('products'); // switches to listings immediately
            }
          }}
          searchVal={searchQuery}
          wishlistCount={wishlist.length}
          compareCount={compareProducts.length}
          products={productsList}
          onProductSelect={(prod) => {
            setSelectedProduct(prod);
            setActiveView('product-detail');
          }}
          isDark={isDark}
          setIsDark={handleToggleTheme}
        />
      )}

      {apiOnline === false && activeView !== 'landing' && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-center text-[10px] font-bold py-1.5 px-4 uppercase tracking-wider">
          API offline — showing cached catalog. Start the backend on port 5000.
        </div>
      )}

      {/* Primary Dynamic App Context Router */}
      <main className="flex-grow">
        {isLoadingCatalog && activeView === 'home' ? (
          <LoadingOverlay message="Loading fridge.pk catalog..." />
        ) : (
        <AnimatePresence mode="wait">
          
          {/* LANDING PAGE ENTRY ROW */}
          {activeView === 'landing' && (
            <motion.div
              key="view-landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LandingView
                featuredProducts={productsList.slice(0, 4)}
                setView={navigateToView}
                onProductClick={(p) => {
                  setSelectedProduct(p);
                  setActiveView('product-detail');
                }}
                isDark={isDark}
                setIsDark={handleToggleTheme}
              />
            </motion.div>
          )}
          
          {/* HOME VIEW (DARAZ-STYLE MARKETPLACE) */}
          {activeView === 'home' && (
            <motion.div
              key="view-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <HomeView
                products={productsList}
                onAddToCart={(prod, sz) => handleAddToCart(prod, sz)}
                onProductClick={(prod) => {
                  setSelectedProduct(prod);
                  setActiveView('product-detail');
                }}
                setView={navigateToView}
                setCategoryAndGo={handleCategorySelection}
                searchVal={searchQuery}
                onSearchChange={setSearchQuery}
                locationCity={locationCity}
                onChangeLocation={handleLocationChange}
              />
            </motion.div>
          )}

          {/* PRODUCTS LIST ADVANCED SCREEN FILTERS & SEARCH */}
          {activeView === 'products' && (
            <motion.div
              key="view-products-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ProductsListingView
                products={productsList}
                categoryFilter={searchQuery} // uses search parameters as category filters
                searchQuery={searchQuery}
                onAddToCart={(prod, sz) => handleAddToCart(prod, sz)}
                onProductClick={(prod) => {
                  setSelectedProduct(prod);
                  setActiveView('product-detail');
                }}
                setView={navigateToView}
              />
            </motion.div>
          )}

          {/* PRODUCT SPECIFICATION PROFILE GRAPH TABS & REVIEWS SUBMISSIONS */}
          {activeView === 'product-detail' && selectedProduct && (
            <motion.div
              key="view-product-details-sheet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ProductDetailView
                product={selectedProduct}
                user={user}
                onAddToCart={(prod, sz) => handleAddToCart(prod, sz)}
                onBuyNow={(prod, sz, qty) => handleBuyNowFromDetailAndGo(prod, sz, qty)}
                onBack={() => setActiveView('products')}
                onNotify={triggerToast}
                onAddToWishlist={handleAddToWishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                isInWishlist={wishlist.some(w => w.id === selectedProduct.id)}
                onAddToCompare={handleAddToCompare}
                isInCompare={compareProducts.some(c => c.id === selectedProduct.id)}
              />
            </motion.div>
          )}

          {/* FULL TABLE QUANTITIES MODIFIER SHOPPING BAG */}
          {activeView === 'cart' && (
            <motion.div
              key="view-shopping-bags"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <CartView
                cart={cart}
                onUpdateQty={handleUpdateQty}
                onRemoveItem={handleRemoveCartItem}
                onProceedToCheckout={() => setActiveView('checkout')}
                setView={navigateToView}
                onNotify={triggerToast}
              />
            </motion.div>
          )}

          {/* STEPPING MULTI-STEP CHECKOUT PROGRESSIVES */}
          {activeView === 'checkout' && (
            <motion.div
              key="view-checkout-stepper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <CheckoutView
                cart={cart}
                user={user}
                onClearCart={handleClearFullCart}
                onNotify={triggerToast}
                setView={navigateToView}
              />
            </motion.div>
          )}

          {/* SELLER ANALYTICS AND GARMENT UPLOAD WORKBENCH */}
          {activeView === 'seller' && (
            <motion.div
              key="view-seller-studio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <SellerDashboardView
                onAddNewProduct={handleAddNewProductValue}
                onRemoveProduct={handleRemoveProductValue}
                onCatalogRefresh={refreshCatalog}
                onNotify={triggerToast}
                setView={navigateToView}
              />
            </motion.div>
          )}

          {/* ROADMAPS VERTICAL TIMELINE GPS Courier */}
          {activeView === 'track-order' && (
            <motion.div
              key="view-roadmap-timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <OrderTrackingView
                onNotify={triggerToast}
                setView={navigateToView}
              />
            </motion.div>
          )}

          {/* MY USER ACCOUNT SETTINGS DETAILS */}
          {activeView === 'dashboard' && user && (
            <motion.div
              key="view-dashboard-account"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <DashboardView
                user={user}
                onLogout={handleLogout}
                onNotify={triggerToast}
                setView={navigateToView}
              />
            </motion.div>
          )}

          {/* CUSTOM ACCESS SEGMENTS SIGN IN */}
          {activeView === 'login' && (
            <motion.div
              key="view-sign-in"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <LoginView
                onLoginSuccess={(userData) => {
                  setUser(userData);
                  // pre-populate state name and details
                  localStorage.setItem('fringe_user_data', JSON.stringify(userData));
                  localStorage.setItem('fringe_user_name', userData.name);
                  if (userData.phone) {
                    localStorage.setItem('fringe_user_phone', userData.phone);
                  }
                  setActiveView('home');
                  triggerToast(`Welcome back, ${userData.name}!`, 'success');
                }}
                setView={navigateToView}
                onNotify={triggerToast}
              />
            </motion.div>
          )}

          {/* RECEPTION SIGN UPS */}
          {activeView === 'signup' && (
            <motion.div
              key="view-sign-up"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <SignUpView
                onSignUpSuccess={(userData) => {
                  setUser(userData);
                  localStorage.setItem('fringe_user_data', JSON.stringify(userData));
                  localStorage.setItem('fringe_user_name', userData.name);
                  if (userData.phone) {
                    localStorage.setItem('fringe_user_phone', userData.phone);
                  }
                  setActiveView('home');
                  triggerToast('Account created successfully! Welcome to fridge.pk!', 'success');
                }}
                setView={navigateToView}
                onNotify={triggerToast}
              />
            </motion.div>
          )}

          {/* FORGOT PASSWORDS RESET CONTROLLER */}
          {activeView === 'forgot-password' && (
            <motion.div
              key="view-forgot-passes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ForgotPasswordView
                setView={navigateToView}
                onNotify={triggerToast}
              />
            </motion.div>
          )}

          {/* WISHLIST VIEW */}
          {activeView === 'wishlist' && (
            <motion.div
              key="view-wishlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <WishlistView
                wishlist={wishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onAddToCart={handleAddToCart}
                setView={navigateToView}
                onNotify={triggerToast}
              />
            </motion.div>
          )}

          {/* COMPARE VIEW */}
          {activeView === 'compare' && (
            <motion.div
              key="view-compare"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <CompareView
                compareProducts={compareProducts}
                onRemoveFromCompare={handleRemoveFromCompare}
                onAddToCart={handleAddToCart}
                setView={navigateToView}
              />
            </motion.div>
          )}

          {/* AI SMART APPLIANCE HUB CONSULTATION ASSISTANT */}
          {activeView === 'ai-assistant' && (
            <motion.div
              key="view-ai-consulting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <AiAssistantView
                onNotify={triggerToast}
                setView={navigateToView}
                locationCity={locationCity}
              />
            </motion.div>
          )}

          {/* ELECTRICITY BILL AND SOLAR CALCULATOR METRICS */}
          {activeView === 'bill-calculator' && (
            <motion.div
              key="view-bill-calc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <BillCalculatorView
                products={productsList}
                onNotify={triggerToast}
                setView={navigateToView}
              />
            </motion.div>
          )}

          {/* 3D AR DEVICE CABINET PLACEMENT VISUALIZER */}
          {activeView === 'ar-visualizer' && (
            <motion.div
              key="view-ar-planner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ArVisualizerView
                products={productsList}
                onNotify={triggerToast}
                setView={navigateToView}
              />
            </motion.div>
          )}

          {/* INTERACTIVE APPLIANCE KNOWLEDGE FAQ ENGINE */}
          {activeView === 'faq' && (
            <motion.div
              key="view-faq-accordion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FaqView
                onNotify={triggerToast}
                setView={navigateToView}
              />
            </motion.div>
          )}

          {/* VERIFIED RETURN AND DAMAGE COMPLAINT REGISTER POLICY */}
          {activeView === 'returns-policy' && (
            <motion.div
              key="view-returns-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ReturnsPolicyView
                onNotify={triggerToast}
                setView={navigateToView}
              />
            </motion.div>
          )}

          {/* DEVELOPER PROFILE AND PORTFOLIO VIEW */}
          {activeView === 'developer-profile' && (
            <motion.div
              key="view-developer-profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <DeveloperProfileView
                setView={navigateToView}
                onNotify={triggerToast}
              />
            </motion.div>
          )}

          {/* SMART ENERGY & SOLAR COMPATIBILITY QUIZ ADVISOR */}
          {activeView === 'appliance-matcher' && (
            <motion.div
              key="view-appliance-matcher"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ApplianceMatcherQuizView
                products={productsList}
                onProductClick={(p) => {
                  setSelectedProduct(p);
                  setActiveView('product-detail');
                }}
                onAddToCart={(p, size) => {
                  handleAddToCart(p, size);
                }}
                setView={navigateToView}
                onNotify={triggerToast}
              />
            </motion.div>
          )}

        </AnimatePresence>
        )}
      </main>

      {/* Shared Footer structure */}
      {activeView !== 'landing' && <Footer onNotify={triggerToast} />}

      {/* Global Instant AI Support Live Chat Widget */}
      {activeView !== 'landing' && <FloatingChatbot onNotify={triggerToast} locationCity={locationCity} />}

      {/* QUICK SLIDE-OVER CHECKOUT SHOPPING BAG DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="absolute inset-0 bg-black"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 md:pl-16">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="w-screen max-w-md bg-white border-l border-slate-100 flex flex-col justify-between shadow-2xl h-full"
              >
                {/* Header card drawer */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-coral" />
                    <h2 className="text-base font-bold text-brand-navy-900" id="slide-over-title">
                      Your Shopping Bag ({summaryItemCountTotal})
                    </h2>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-brand-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Close bag"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main lists inside the Drawer */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-24 space-y-3">
                      <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto" />
                      <h3 className="text-sm font-bold text-brand-navy-900">Your bag is empty</h3>
                      <p className="text-xs text-slate-500 leading-normal max-w-[240px] mx-auto font-medium">
                        Fill it with our premium smart refrigerators or heavy-duty inverter split ACs!
                      </p>
                      <button
                        onClick={() => { setCartOpen(false); setActiveView('home'); }}
                        className="px-6 py-2.5 bg-brand-navy-900 hover:bg-brand-coral text-white font-bold text-xs rounded-xl uppercase tracking-wider"
                      >
                        Keep Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item, idx) => {
                        const translateCapacity = (val: string, cat: string) => {
                          if (val === 'Unstitched') return 'Eco-Inverter';
                          if (val === 'Default') return 'Standard';
                          if (cat === 'air-conditioner') {
                            if (val === 'S') return '1.0 Ton';
                            if (val === 'M') return '1.5 Ton';
                            if (val === 'L') return '2.0 Ton';
                            if (val === 'XL') return '2.5 Ton';
                          } else {
                            if (val === 'S') return '12 cu.ft';
                            if (val === 'M') return '15 cu.ft';
                            if (val === 'L') return '18 cu.ft';
                            if (val === 'XL') return '22 cu.ft';
                          }
                          return val;
                        };
                        return (
                          <div 
                            key={`${item.product.id}-${item.size}-${idx}`}
                            className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100"
                          >
                            <div className="w-16 h-20 rounded-xl bg-white overflow-hidden shrink-0 border">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600';
                                }}
                              />
                            </div>

                            <div className="flex-grow flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start gap-1 pb-1">
                                  <h4 className="text-xs font-bold text-brand-navy-950 line-clamp-1">
                                    {item.product.name}
                                  </h4>
                                  <button
                                    onClick={() => handleRemoveCartItem(idx)}
                                    className="text-slate-400 hover:text-rose-500 hover:bg-slate-200/50 p-1 rounded-md cursor-pointer"
                                    aria-label="Remove item"
                                  >
                                    <X className="w-3" />
                                  </button>
                                </div>
                                <span className="text-[10px] bg-white border border-slate-200 text-slate-650 px-1.5 py-0.5 rounded font-black uppercase select-none">
                                  Capacity: {translateCapacity(item.size, item.product.category)}
                                </span>
                              </div>

                            <div className="flex justify-between items-end mt-2">
                              {/* Quantity triggers bar */}
                              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg h-7 px-1">
                                <button
                                  onClick={() => handleUpdateQty(idx, -1)}
                                  className="p-0.5 text-slate-500 hover:text-brand-coral cursor-pointer"
                                  aria-label="Decrease"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold text-brand-navy-900">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQty(idx, 1)}
                                  className="p-0.5 text-slate-500 hover:text-brand-coral cursor-pointer"
                                  aria-label="Increase"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="text-xs font-bold text-brand-navy-900 font-serif">
                                Rs. {(item.product.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  )}
                </div>

                {/* Subtotal, Shipping Rates, and Purchase Actions inside Drawer Footer */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-600 font-medium">
                        <span>Items Subtotal</span>
                        <span>Rs. {subtotalSumList.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 font-medium font-serif">
                        <span>Dispatches Shipping Rate</span>
                        <span>{standardShippingRates === 0 ? 'FREE' : `Rs. ${standardShippingRates}`}</span>
                      </div>
                      
                      {standardShippingRates > 0 && (
                        <p className="text-[9px] text-brand-coral font-bold uppercase tracking-wider block">
                          Add Rs. {(5000 - subtotalSumList).toLocaleString()} more to secure FREE Nationwide Shipping!
                        </p>
                      )}

                      <hr className="border-slate-200 my-1.5" />
                      
                      <div className="flex justify-between text-sm font-bold text-brand-navy-900">
                        <span>Checkout Total</span>
                        <span className="font-serif text-base text-brand-coral">Rs. {grandTotalDispatches.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          setActiveView('cart');
                        }}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-brand-navy-900 py-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Review Bag
                      </button>
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          setActiveView('checkout');
                        }}
                        className="w-full bg-brand-coral hover:bg-brand-coral-hover text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Checkout Box
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider select-none">
                      <ShieldCheck className="w-4 h-4 text-brand-coral" />
                      <span>Encrypted SSL Secure checkout protocol</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
