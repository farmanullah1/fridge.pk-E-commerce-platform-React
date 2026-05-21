import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, MapPin, Package, Heart, LogOut, Save, ClipboardList, 
  CheckCircle2, Truck, Clock, Plus, Trash2, Key, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { ActiveView, User, Order, Address } from '../types';
import { api } from '../lib/api';

interface DashboardViewProps {
  user: User;
  onLogout: () => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  setView: (view: ActiveView) => void;
}

export default function DashboardView({ user, onLogout, onNotify, setView }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  
  // Profile Form States
  const [fullName, setFullName] = useState(user.name);
  const [emailAddress, setEmailAddress] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Address Book list of items
  const [addressBook, setAddressBook] = useState<Address[]>([]);
  
  // Add address form states
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Karachi');
  const [newArea, setNewArea] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Local active orders tracker
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('fringe_auth_token');
      if (token) {
        try {
          const [serverOrders, serverAddresses] = await Promise.all([
            api.getOrders(),
            api.getAddresses(),
          ]);
          setOrders(serverOrders);
          localStorage.setItem('fringe_order_history', JSON.stringify(serverOrders));
          if (serverAddresses.length > 0) {
            setAddressBook(serverAddresses);
            localStorage.setItem('fringe_address_book', JSON.stringify(serverAddresses));
            return;
          }
        } catch {
          // Fall back to local cache below
        }
      }

      const cachedOrders = localStorage.getItem('fringe_order_history');
      if (cachedOrders) {
        try {
          setOrders(JSON.parse(cachedOrders));
        } catch {
          setOrders([]);
        }
      }

      const savedAddressBook = localStorage.getItem('fringe_address_book');
      if (savedAddressBook) {
        try {
          setAddressBook(JSON.parse(savedAddressBook));
        } catch {
          setAddressBook([]);
        }
      } else {
        const initialAddresses: Address[] = [
          {
            id: 'addr-1',
            fullName: user.name,
            phone: user.phone || '03001234567',
            city: localStorage.getItem('fringe_shipping_city') || 'Lahore',
            area: localStorage.getItem('fringe_shipping_area') || 'DHA Phase 3',
            addressLines: localStorage.getItem('fringe_shipping_address') || 'House 42-B, Sector Z, Phase 3, DHA',
            isDefault: true,
          },
        ];
        setAddressBook(initialAddresses);
        localStorage.setItem('fringe_address_book', JSON.stringify(initialAddresses));
      }
    };
    loadData();
  }, [user]);

  // Handle Saving Profile Info
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !emailAddress.trim()) {
      onNotify('Name and Email fields are strictly required.', 'error');
      return;
    }

    try {
      await api.updateProfile({ name: fullName, email: emailAddress, phone: phoneNumber });
      localStorage.setItem('fringe_user_name', fullName);
      localStorage.setItem('fringe_user_phone', phoneNumber);
      localStorage.setItem('fringe_user_email', emailAddress);
      const saved = localStorage.getItem('fringe_user_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        localStorage.setItem('fringe_user_data', JSON.stringify({ ...parsed, name: fullName, email: emailAddress, phone: phoneNumber }));
      }
      onNotify('Profile updated successfully!', 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Profile update failed', 'error');
    }
  };

  // Change Password form validation
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      onNotify('All password fields must be filled.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      onNotify('New password must contain at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      onNotify('Newly configured passwords do not match!', 'error');
      return;
    }

    try {
      await api.changePassword(oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      onNotify('Password changed successfully!', 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Password change failed', 'error');
    }
  };

  // Address book controls (Add, Delete, Set Default)
  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newArea.trim()) {
      onNotify('Address fields cannot remain empty.', 'error');
      return;
    }

    try {
      const createdAddress = await api.addAddress({
        fullName: user.name,
        phone: user.phone || phoneNumber || '03001234567',
        city: newCity,
        area: newArea,
        addressLines: newStreet,
        isDefault: addressBook.length === 0,
      });
      const nextBook = [...addressBook, createdAddress];
      setAddressBook(nextBook);
      localStorage.setItem('fringe_address_book', JSON.stringify(nextBook));
      setNewStreet('');
      setNewArea('');
      setIsAddingAddress(false);
      onNotify('New address added!', 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Failed to add address', 'error');
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await api.setDefaultAddress(id);
      const nextBook = addressBook.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }));
      setAddressBook(nextBook);
      localStorage.setItem('fringe_address_book', JSON.stringify(nextBook));
      const defaultAddr = nextBook.find((a) => a.isDefault);
      if (defaultAddr) {
        localStorage.setItem('fringe_shipping_address', defaultAddr.addressLines);
        localStorage.setItem('fringe_shipping_city', defaultAddr.city);
        localStorage.setItem('fringe_shipping_area', defaultAddr.area);
      }
      onNotify('Default delivery address updated.', 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Update failed', 'error');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const toDelete = addressBook.find((a) => a.id === id);
    if (toDelete?.isDefault) {
      onNotify('Cannot delete default address. Set another default first!', 'error');
      return;
    }

    try {
      await api.deleteAddress(id);
      const nextBook = addressBook.filter((addr) => addr.id !== id);
      setAddressBook(nextBook);
      localStorage.setItem('fringe_address_book', JSON.stringify(nextBook));
      onNotify('Address removed.', 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  // Order Cancellation simulation (Only permitted if status is not 'Shipped' or 'Delivered')
  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to cancel order ${orderId}?`)) return;
    try {
      const { order } = await api.cancelOrder(orderId);
      const nextOrders = orders.map((ord) => (ord.id === orderId ? order : ord));
      setOrders(nextOrders);
      localStorage.setItem('fringe_order_history', JSON.stringify(nextOrders));
      onNotify(`Order ${orderId} cancelled.`, 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Cancel failed', 'error');
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Order placed':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Shipped':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-250';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-brand-navy-900" id="user-my-account-panel">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column Navigation List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs text-center">
            
            {/* Tier Level */}
            <span className="bg-brand-coral/10 text-brand-coral text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-4">
              👑 Silver VIP Tier
            </span>
            
            {/* Large Avatar */}
            <div className="w-16 h-16 bg-brand-navy-900 text-white font-serif font-bold text-3xl rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-brand-coral shadow-sm">
              {fullName.charAt(0).toUpperCase()}
            </div>
            
            {/* User credentials */}
            <h3 className="font-bold text-brand-navy-900 text-base leading-tight">{fullName}</h3>
            <p className="text-slate-400 text-xs mt-1 font-semibold">{emailAddress}</p>
            {phoneNumber && <p className="text-slate-400 text-xs mt-0.5 font-semibold">{phoneNumber}</p>}

            {/* Tab Switches */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full py-2.5 rounded-xl text-left px-4 text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'orders' 
                    ? 'bg-brand-navy-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ClipboardList className="w-4.5 h-4.5 text-brand-coral" />
                <span>My Orders History</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full py-2.5 rounded-xl text-left px-4 text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'profile' 
                    ? 'bg-brand-navy-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserIcon className="w-4.5 h-4.5" />
                <span>Profile & Password</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full py-2.5 rounded-xl text-left px-4 text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'addresses' 
                    ? 'bg-brand-navy-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-4.5 h-4.5" />
                <span>Address Book ({addressBook.length})</span>
              </button>

              <button
                onClick={onLogout}
                className="w-full py-2.5 rounded-xl text-left px-4 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2.5 mt-4 cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5 text-rose-500" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>

          {/* Loyalty Level Progress Meter */}
          <div className="bg-brand-navy-900 text-white rounded-3xl p-6 shadow-xs relative overflow-hidden">
            <span className="text-[9px] text-brand-coral font-bold uppercase tracking-widest block mb-1">
              Loyalty rewards pool
            </span>
            <h4 className="font-display font-medium text-white text-base">Spend pool to Gold VIP</h4>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-semibold">
              Spend <span className="text-white font-bold">Rs. 8,250</span> more to secure 15% flat coupon codes on checkout carts.
            </p>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-300">
                <span>Progress</span>
                <span>65% Completion</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-brand-coral w-[65%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Dashboard Panels layout */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: MY ORDERS */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders-history"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-base font-bold text-brand-navy-900 uppercase tracking-widest">My Order History</h2>
                  <p className="text-xs text-slate-500 mt-1">Review live dispatch status, delivery speeds, and previous appliance catalog choices</p>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-xs">
                    <Package className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                    <h3 className="text-sm font-bold text-brand-navy-900">No Orders Placed</h3>
                    <p className="text-xs text-slate-500 mt-1.5 mb-6 max-w-sm mx-auto leading-normal">
                      We found zero registered orders for this profile. Browse our premium cooling catalog now!
                    </p>
                    <button
                      onClick={() => setView('home')}
                      className="px-6 py-3 bg-brand-coral hover:bg-brand-coral-hover text-white rounded-xl text-xs font-bold tracking-widest uppercase transition-colors shrink-0"
                    >
                      Shop catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {orders.map((ord) => {
                      // Permit cancellation only if status is placed or processing
                      const isCancellable = ord.status === 'Order placed' || ord.status === 'Processing';
                      return (
                        <div 
                          key={ord.id}
                          className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xs space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                            <div>
                              <span className="text-[10px] font-bold text-brand-coral tracking-widest uppercase">Invoice Details</span>
                              <h4 className="text-xs sm:text-sm font-bold text-brand-navy-900 mt-0.5">
                                Order ID: {ord.id} <span className="text-slate-300 mx-1">|</span> <span className="font-normal font-sans text-slate-500">{ord.date}</span>
                              </h4>
                            </div>
                            <div className="flex gap-2 items-center">
                              <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusBadge(ord.status)}`}>
                                {ord.status}
                              </span>
                              
                              {/* Cancel order controls if eligible */}
                              {isCancellable && (
                                <button
                                  onClick={() => handleCancelOrder(ord.id)}
                                  className="text-[10px] font-bold border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Cancel entire shipment order"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Cancel Order</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* List of items contained inside order */}
                          <div className="space-y-3.5">
                            {ord.items.map((it, i) => (
                              <div key={i} className="flex gap-4 justify-between items-center text-xs">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-12 bg-slate-50 rounded overflow-hidden border">
                                    <img src={it.product.image} alt={it.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-brand-navy-900 leading-tight">{it.product.name}</h5>
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                                      Capacity {(() => {
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
                                        return translateCapacity(it.size, it.product.category);
                                      })()} • Qty {it.quantity}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-extrabold text-slate-800 font-serif">
                                  Rs. {(it.product.price * it.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Method: {ord.paymentMethod?.toUpperCase() || 'COD'}</span>
                            <div className="font-bold text-brand-navy-900 tracking-tight">
                              Total Cost: <span className="font-serif text-brand-coral font-black text-sm">Rs. {ord.total.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Order tracking timeline progress visually represent */}
                          {ord.status === 'Shipped' && (
                            <div className="pt-3 border-t border-slate-100 space-y-2">
                              <span className="text-[9px] text-brand-coral font-bold uppercase tracking-widest block">Leopards Dispatch Roadmap</span>
                              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-500">
                                <div className="space-y-1 text-emerald-600">
                                  <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-600" />
                                  <p>Order Handover</p>
                                </div>
                                <div className="space-y-1 text-blue-600">
                                  <Truck className="w-4 h-4 mx-auto text-blue-600" />
                                  <p>In Transit flight</p>
                                </div>
                                <div className="space-y-1 text-slate-300">
                                  <Clock className="w-4 h-4 mx-auto text-slate-350" />
                                  <p>Delivered Doorstep</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW 2: PROFILE PROFILE & PASSWORD CHANGES */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile-security"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                
                {/* Left side: Profile edit form */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-xs font-bold text-brand-navy-900 uppercase tracking-widest flex items-center gap-1.5">
                      <UserIcon className="w-4 h-4 text-brand-coral" />
                      <span>Edit Personal Details</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">Configure profile user variables and correspondence</p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-brand-navy-850">Full Registered Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-brand-navy-850">Primary Correspondence Email</label>
                      <input
                        type="email"
                        required
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-brand-navy-850">Mobile Contact Number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-navy-900 hover:bg-brand-coral text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Save Profile Updates
                    </button>
                  </form>
                </div>

                {/* Right side: Security password reset */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-xs font-bold text-brand-navy-900 uppercase tracking-widest flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-brand-coral" />
                      <span>Change Security Password</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">Configure fresh password authentication passes</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-brand-navy-850">Current Password</label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-brand-navy-850">New Secure Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-brand-navy-850">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-navy-900 hover:bg-brand-coral text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

              </motion.div>
            )}

            {/* VIEW 3: ADDRESS BOOK MANAGEMENT */}
            {activeTab === 'addresses' && (
              <motion.div
                key="address-book"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-bold text-brand-navy-900 uppercase tracking-widest">My Shipping Addresses</h2>
                    <p className="text-xs text-slate-500 mt-1">Configure default and backup dispatch points across major cities</p>
                  </div>
                  {!isAddingAddress && (
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="px-4 py-2 bg-brand-navy-900 hover:bg-brand-coral text-white rounded-xl text-xs font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Address</span>
                    </button>
                  )}
                </div>

                {isAddingAddress && (
                  <form onSubmit={handleAddNewAddress} className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4 max-w-xl">
                    <h4 className="text-xs font-bold text-brand-navy-900 uppercase tracking-wider">New destination address and landmark Details</h4>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Street / House Coordinates</label>
                      <input
                        type="text"
                        required
                        placeholder="House no, plot code, block, street, landmark details"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 block">City selection</label>
                        <select
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-brand-navy-900 focus:outline-none"
                        >
                          {['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Multan', 'Peshawar', 'Rawalpindi'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 block">Sector / Area</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Clifton Sector 5"
                          value={newArea}
                          onChange={(e) => setNewArea(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-brand-navy-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2 bg-slate-150 text-slate-600 rounded-xl text-xs font-bold uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-brand-coral hover:bg-brand-coral-hover text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                      >
                        Insert Entry
                      </button>
                    </div>
                  </form>
                )}

                {/* Grid List representation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addressBook.map((addr) => (
                    <div 
                      key={addr.id}
                      className={`border p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all ${
                        addr.isDefault 
                          ? 'border-brand-navy-900 bg-brand-navy-900/5 ring-1 ring-brand-navy-900' 
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <div className="space-y-1 py-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-brand-coral" />
                          <h4 className="text-xs font-extrabold text-brand-navy-900 uppercase">Home Address Coordinates</h4>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 pt-1 leading-normal">"{addr.addressLines}"</p>
                        <p className="text-[11px] text-slate-500 font-semibold">{addr.area}, {addr.city}</p>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2 select-none">
                        {addr.isDefault ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1 uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Default Address</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-slate-500 hover:text-brand-navy-900 font-bold uppercase cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}

                        {!addr.isDefault && (
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Remove address line"
                          >
                            <Trash2 className="w-4 h-4" />
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
