import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ShieldCheck, Download, CreditCard, Layers, BarChart2, CheckCircle2, Ticket, Users, TrendingUp, Trash2, Send, Database, AlertCircle, Plus } from 'lucide-react';
import { PRODUCTS, DEALERS } from '../data';

interface PortalsProps {
  currentLang: 'English' | 'Hindi' | 'Punjabi';
  isOpen: boolean;
  onClose: () => void;
}

interface Order {
  id: string;
  item: string;
  quantity: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  amount: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'Resolved';
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  state: string;
  crop: string;
}

export default function Portals({ currentLang, isOpen, onClose }: PortalsProps) {
  const [role, setRole] = useState<'dealer' | 'distributor' | 'admin'>('dealer');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Login credentials states
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');

  // 1. Dealer State
  const [dealerOrders, setDealerOrders] = useState<Order[]>([
    { id: 'ORD-5012', item: 'Sartaj-101 Bt Cotton (450g)', quantity: '100 Packs', status: 'Delivered', amount: '₹85,000' },
    { id: 'ORD-5099', item: 'Kanak-55 Wheat (40kg)', quantity: '50 Bags', status: 'Shipped', amount: '₹1,20,000' },
    { id: 'ORD-5145', item: 'BM-45 Hybrid Mustard (2kg)', quantity: '30 Packs', status: 'Pending', amount: '₹42,000' }
  ]);
  const [newOrderProduct, setNewOrderProduct] = useState(PRODUCTS[0].name);
  const [newOrderQty, setNewOrderQty] = useState('20');
  const [dealerTickets, setDealerTickets] = useState<SupportTicket[]>([
    { id: 'TCK-201', subject: 'Seed certification request for block B', category: 'Certificates', status: 'Resolved' },
    { id: 'TCK-225', subject: 'Incentive cashback settlement delay', category: 'Accounts', status: 'Open' }
  ]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Product Enquiry');

  // 2. Distributor State
  const [territory, setTerritory] = useState('North India Region');
  const [distributorDealers, setDistributorDealers] = useState(DEALERS);
  const [searchDealer, setSearchDealer] = useState('');

  // 3. Admin State
  const [adminLeads, setAdminLeads] = useState<Lead[]>([
    { id: 'LD-11', name: 'Gurnam Singh', phone: '+91 94160 55443', state: 'Punjab', crop: 'Cotton' },
    { id: 'LD-12', name: 'Harish Patel', phone: '+91 98250 11223', state: 'Gujarat', crop: 'Cotton' },
    { id: 'LD-13', name: 'Satyajit Shukla', phone: '+91 99350 44556', state: 'Uttar Pradesh', crop: 'Wheat' }
  ]);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadState, setLeadState] = useState('Punjab');
  const [leadCrop, setLeadCrop] = useState('Wheat');

  const [downloadNote, setDownloadNote] = useState<string | null>(null);

  const t = {
    English: {
      title: 'Sra Shriji Partner Portals',
      subtitle: 'Premium gateway for authorized dealers, national distributors, and central administrators.',
      labelRole: 'Select Access Level',
      labelCode: 'Enter Secure Access Code',
      phCode: 'SRASHRIJI123 (Try this mock code)',
      btnLogin: 'Authenticate Partnership',
      dashboard: 'Partner Control Panel',
      btnLogout: 'Sign Out',
      orders: 'Active Seed Orders',
      addOrder: 'Submit New Seed Order',
      tickets: 'Support Helpdesk Tickets',
      addTicket: 'File Support Helpdesk Ticket',
      leadManagement: 'Leads & Inquiries Board',
      marketingMaterials: 'Premium Advertising Kits',
      schemes: 'Active Partner Reward Schemes'
    },
    Hindi: {
      title: 'बाला जी पार्टनर पोर्टल',
      subtitle: 'अधिकृत डीलरों, राष्ट्रीय वितरकों और केंद्रीय प्रशासकों के लिए सुरक्षित नियंत्रण केंद्र।',
      labelRole: 'पार्टनर एक्सेस लेवल चुनें',
      labelCode: 'सुरक्षित पार्टनर कोड दर्ज करें',
      phCode: 'SRASHRIJI123 (परीक्षण हेतु यह कोड भरें)',
      btnLogin: 'सुरक्षित लॉगिन करें',
      dashboard: 'पार्टनर कंट्रोल पैनल',
      btnLogout: 'लॉगआउट',
      orders: 'सक्रिय बीज ऑर्डर',
      addOrder: 'नया बीज ऑर्डर बुक करें',
      tickets: 'सहायता टिकट इतिहास',
      addTicket: 'नया सहायता टिकट फाइल करें',
      leadManagement: 'किसान पूछताछ एवं लीड्स प्रबंधन',
      marketingMaterials: 'प्रचार एवं विज्ञापन किट',
      schemes: 'पार्टनर प्रोत्साहन योजनाएं'
    },
    Punjabi: {
      title: 'ਬਾਲਾ ਜੀ ਪਾਰਟਨਰ ਪੋਰਟਲ',
      subtitle: 'ਅਧਿਕਾਰਤ ਡੀਲਰਾਂ, ਰਾਸ਼ਟਰੀ ਵਿਤਰਕਾਂ ਅਤੇ ਕੇਂਦਰੀ ਪ੍ਰਸ਼ਾਸਕਾਂ ਲਈ ਸੁਰੱਖਿਅਤ ਕੰਟਰੋਲ ਕੇਂਦਰ।',
      labelRole: 'ਪਹੁੰਚ ਪੱਧਰ ਚੁਣੋ',
      labelCode: 'ਸੁਰੱਖਿਅਤ ਪਾਰਟਨਰ ਕੋਡ ਦਰਜ ਕਰੋ',
      phCode: 'SRASHRIJI123 (ਟੈਸਟ ਲਈ ਇਹ ਕੋਡ ਭਰੋ)',
      btnLogin: 'ਸੁਰੱਖਿਅਤ ਲੌਗਇਨ',
      dashboard: 'ਪਾਰਟਨਰ ਕੰਟਰੋਲ ਪੈਨਲ',
      btnLogout: 'ਲੌਗਆਉਟ',
      orders: 'ਚੱਲ ਰਹੇ ਬੀਜ ਆਰਡਰ',
      addOrder: 'ਨਵਾਂ ਬੀਜ ਆਰਡਰ ਬੁੱਕ ਕਰੋ',
      tickets: 'ਸਹਾਇਤਾ ਟਿਕਟ ਹਿਸਟਰੀ',
      addTicket: 'ਨਵੀਂ ਸਹਾਇਤਾ ਟਿਕਟ ਫਾਈਲ ਕਰੋ',
      leadManagement: 'ਕਿਸਾਨ ਪੁੱਛਗਿੱਛ ਅਤੇ ਲੀਡਜ਼ ਪ੍ਰਬੰਧਨ',
      marketingMaterials: 'ਪ੍ਰਚਾਰ ਅਤੇ ਇਸ਼ਤਿਹਾਰਬਾਜ਼ੀ ਕਿੱਟ',
      schemes: 'ਪਾਰਟਨਰ ਉਤਸ਼ਾਹਜਨਕ ਸਕੀਮਾਂ'
    }
  }[currentLang];

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authCode.trim().toUpperCase() === 'SRASHRIJI123') {
      setIsLoggedIn(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Security Access Code. Try using mock code: SRASHRIJI123');
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setAuthCode('');
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrd: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      item: newOrderProduct,
      quantity: `${newOrderQty} Packs`,
      status: 'Pending',
      amount: `₹${(parseInt(newOrderQty) * 850).toLocaleString('en-IN')}`
    };
    setDealerOrders([newOrd, ...dealerOrders]);
    setNewOrderQty('20');
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;
    const newTck: SupportTicket = {
      id: `TCK-${Math.floor(200 + Math.random() * 800)}`,
      subject: ticketSubject,
      category: ticketCategory,
      status: 'Open'
    };
    setDealerTickets([newTck, ...dealerTickets]);
    setTicketSubject('');
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;
    const newLd: Lead = {
      id: `LD-${Math.floor(14 + Math.random() * 50)}`,
      name: leadName,
      phone: leadPhone,
      state: leadState,
      crop: leadCrop
    };
    setAdminLeads([newLd, ...adminLeads]);
    setLeadName('');
    setLeadPhone('');
  };

  const handleDownloadKit = (kitName: string) => {
    setDownloadNote(kitName);
    setTimeout(() => {
      setDownloadNote(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md">
      
      {/* Main modal container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] overflow-hidden shadow-2xl flex flex-col relative border border-gray-100"
      >
        {/* Modal Close action */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="bg-brand-dark p-6 text-left border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2 font-display">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              {t.title}
            </h3>
            <p className="text-xs text-gray-300 mt-1 max-w-xl font-medium">
              {t.subtitle}
            </p>
          </div>
          {isLoggedIn && (
            <button
              onClick={handleSignOut}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold px-4 py-2 rounded-xl border border-red-500/20 transition-all"
            >
              {t.btnLogout}
            </button>
          )}
        </div>

        {/* NOT LOGGED IN ACCESS PORTAL FORM */}
        {!isLoggedIn ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-center bg-gray-50/50">
            <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6 text-left">
              
              <div className="text-center space-y-1">
                <h4 className="text-lg font-bold text-gray-900 font-display">Security Verification Required</h4>
                <p className="text-xs text-gray-400">Please authenticate using your authorized partner credentials</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Select access level */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 mb-1.5">{t.labelRole}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['dealer', 'distributor', 'admin'] as const).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2 text-[10px] font-extrabold rounded-lg uppercase border transition-all ${
                          role === r
                            ? 'bg-brand-green border-brand-green text-white shadow'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secure Access Code */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 mb-1">{t.labelCode}</label>
                  <input
                    type="password"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder={t.phCode}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 outline-none focus:border-brand-green"
                  />
                </div>

                {authError && (
                  <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-brand-green hover:bg-brand-green/95 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_8px_16px_rgba(13,92,52,0.15)] flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {t.btnLogin}
                </button>
              </form>

            </div>
          </div>
        ) : (
          /* LOGGED IN DASHBOARD CORE PANEL */
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row text-left">
            
            {/* Sidebar navigation controls for role */}
            <div className="w-full md:w-60 bg-gray-50 border-r border-gray-100 p-4 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">
                  {t.dashboard}
                </span>

                <div className="space-y-1 flex flex-col">
                  <span className="text-xs bg-brand-green/10 text-brand-green font-bold px-3 py-2 rounded-lg block uppercase tracking-wide">
                    🎯 Authorized: {role.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono mt-1 px-1">ID: SRASHRIJI-PT-451</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-3 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Assistance Hotline</p>
                <p className="text-xs font-extrabold text-brand-green mt-1">+91 9866329911</p>
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              
              {/* DEALER WORKSPACE BOARD */}
              {role === 'dealer' && (
                <div className="space-y-8">
                  {/* Stats line */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Dealer Incentive Level</p>
                      <p className="text-lg font-bold text-brand-green mt-0.5">🎖 Gold Partner</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Quarterly Target Met</p>
                      <p className="text-lg font-bold text-brand-green mt-0.5">88% (Level-3)</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Available Credit</p>
                      <p className="text-lg font-bold text-brand-green mt-0.5">₹4,50,000</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Payout Rewards</p>
                      <p className="text-lg font-bold text-brand-gold mt-0.5">₹24,500 Cash</p>
                    </div>
                  </div>

                  {/* Orders and Add Order */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Orders listing */}
                    <div className="lg:col-span-8 space-y-4">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        {t.orders} ({dealerOrders.length})
                      </h4>
                      <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                        <table className="w-full text-xs text-left text-gray-700">
                          <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <tr>
                              <th className="p-3">Order ID</th>
                              <th className="p-3">Variety Description</th>
                              <th className="p-3">Quantity</th>
                              <th className="p-3">Total Value</th>
                              <th className="p-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium">
                            {dealerOrders.map(o => (
                              <tr key={o.id}>
                                <td className="p-3 font-mono font-bold text-brand-green">{o.id}</td>
                                <td className="p-3 font-semibold text-gray-900">{o.item}</td>
                                <td className="p-3">{o.quantity}</td>
                                <td className="p-3 font-bold">{o.amount}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                                    o.status === 'Delivered'
                                      ? 'bg-emerald-50 text-brand-green border border-emerald-100'
                                      : o.status === 'Shipped'
                                      ? 'bg-blue-50 text-blue-500 border border-blue-100'
                                      : 'bg-amber-50 text-brand-gold border border-amber-100'
                                  }`}>
                                    {o.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Add order form */}
                    <div className="lg:col-span-4 bg-gray-50 border border-gray-100 p-5 rounded-2xl text-left space-y-4">
                      <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                        {t.addOrder}
                      </h4>
                      <form onSubmit={handleAddOrder} className="space-y-3">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-gray-500 mb-1">Select Variety</label>
                          <select
                            value={newOrderProduct}
                            onChange={(e) => setNewOrderProduct(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-700 outline-none"
                          >
                            {PRODUCTS.map(p => (
                              <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-gray-500 mb-1">Volume Quantity (Packs/Bags)</label>
                          <input
                            type="number"
                            value={newOrderQty}
                            onChange={(e) => setNewOrderQty(e.target.value)}
                            min="10"
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-700 outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-brand-green hover:bg-brand-green/95 text-white py-2 rounded-lg text-xs font-bold uppercase transition-all shadow"
                        >
                          Place New Order
                        </button>
                      </form>
                    </div>

                  </div>

                  {/* Helpdesk section */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-gray-100">
                    {/* Tickets listing */}
                    <div className="lg:col-span-8 space-y-4">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        {t.tickets} ({dealerTickets.length})
                      </h4>
                      <div className="space-y-2">
                        {dealerTickets.map(tck => (
                          <div key={tck.id} className="p-3.5 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-sm">
                            <div className="text-left">
                              <span className="text-[9px] font-mono font-bold text-brand-green">{tck.id} • {tck.category}</span>
                              <p className="text-xs font-bold text-gray-800 mt-0.5">{tck.subject}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              tck.status === 'Resolved' ? 'bg-emerald-50 text-brand-green' : 'bg-red-50 text-red-500'
                            }`}>
                              {tck.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Create Helpdesk ticket form */}
                    <div className="lg:col-span-4 bg-gray-50 border border-gray-100 p-5 rounded-2xl text-left space-y-4">
                      <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                        {t.addTicket}
                      </h4>
                      <form onSubmit={handleAddTicket} className="space-y-3">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-gray-500 mb-1">Issue Topic Category</label>
                          <select
                            value={ticketCategory}
                            onChange={(e) => setTicketCategory(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-700 outline-none"
                          >
                            <option value="Product Enquiry">Product Quality query</option>
                            <option value="Accounts">Invoice & Payout query</option>
                            <option value="Logistics">Dispatch Delivery delay</option>
                            <option value="Other">Other general queries</option>
                          </select>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-gray-500 mb-1">Detailed Subject Description</label>
                          <textarea
                            value={ticketSubject}
                            onChange={(e) => setTicketSubject(e.target.value)}
                            placeholder="Describe your issue..."
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-2 h-16 text-xs font-semibold text-gray-700 outline-none resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-brand-green hover:bg-brand-green/95 text-white py-2 rounded-lg text-xs font-bold uppercase transition-all shadow"
                        >
                          Submit Helpdesk Ticket
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Downloads & Marketing Materials */}
                  <div className="pt-4 border-t border-gray-100 space-y-4 text-left">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      {t.marketingMaterials}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white border border-gray-100 p-4 rounded-2xl text-center flex flex-col justify-between h-36">
                        <p className="text-xs font-bold text-gray-800">Sartaj-101 HD Poster</p>
                        <p className="text-[9px] text-gray-400">PDF flyer kit with product specs</p>
                        <button
                          onClick={() => handleDownloadKit('Sartaj-101 HD Poster')}
                          className="bg-brand-green text-white text-[10px] font-bold py-1.5 rounded-lg w-full flex items-center justify-center gap-1 mt-2"
                        >
                          <Download className="h-3 w-3" /> Download Kit
                        </button>
                      </div>
                      <div className="bg-white border border-gray-100 p-4 rounded-2xl text-center flex flex-col justify-between h-36">
                        <p className="text-xs font-bold text-gray-800">Authorized Dealer Logo</p>
                        <p className="text-[9px] text-gray-400">PNG high resolution corporate logo</p>
                        <button
                          onClick={() => handleDownloadKit('Authorized Dealer Logo')}
                          className="bg-brand-green text-white text-[10px] font-bold py-1.5 rounded-lg w-full flex items-center justify-center gap-1 mt-2"
                        >
                          <Download className="h-3 w-3" /> Download Kit
                        </button>
                      </div>
                      <div className="bg-white border border-gray-100 p-4 rounded-2xl text-center flex flex-col justify-between h-36">
                        <p className="text-xs font-bold text-gray-800">Cultivation POP Manual</p>
                        <p className="text-[9px] text-gray-400">Printable booklets for customers</p>
                        <button
                          onClick={() => handleDownloadKit('Cultivation POP Manual')}
                          className="bg-brand-green text-white text-[10px] font-bold py-1.5 rounded-lg w-full flex items-center justify-center gap-1 mt-2"
                        >
                          <Download className="h-3 w-3" /> Download Kit
                        </button>
                      </div>
                      <div className="bg-white border border-gray-100 p-4 rounded-2xl text-center flex flex-col justify-between h-36">
                        <p className="text-xs font-bold text-gray-800">Mandi Schemes Chart</p>
                        <p className="text-[9px] text-gray-400">Latest partner rebates checklist</p>
                        <button
                          onClick={() => handleDownloadKit('Mandi Schemes Chart')}
                          className="bg-brand-green text-white text-[10px] font-bold py-1.5 rounded-lg w-full flex items-center justify-center gap-1 mt-2"
                        >
                          <Download className="h-3 w-3" /> Download Kit
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* DISTRIBUTOR WORKSPACE BOARD */}
              {role === 'distributor' && (
                <div className="space-y-8">
                  {/* Performance Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Active Territory</p>
                      <p className="text-lg font-bold text-brand-green mt-0.5">{territory}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Gross Sales Yield</p>
                      <p className="text-lg font-bold text-brand-green mt-0.5">₹1.85 Crores</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Dealers Managed</p>
                      <p className="text-lg font-bold text-brand-green mt-0.5">{distributorDealers.length} Active Partners</p>
                    </div>
                  </div>

                  {/* Dealer list directory for distributor */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        Authorized Dealer Registry Directory
                      </h4>
                      <input
                        type="text"
                        value={searchDealer}
                        onChange={(e) => setSearchDealer(e.target.value)}
                        placeholder="Search dealer by name or state..."
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 outline-none w-64 focus:border-brand-green"
                      />
                    </div>

                    <div className="overflow-x-auto border border-gray-100 rounded-2xl bg-white">
                      <table className="w-full text-xs text-left text-gray-700">
                        <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          <tr>
                            <th className="p-3">Dealer Shop</th>
                            <th className="p-3">Manager Contact</th>
                            <th className="p-3">Phone Line</th>
                            <th className="p-3">Mandi Location Address</th>
                            <th className="p-3">State Division</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {distributorDealers
                            .filter(d => 
                              d.name.toLowerCase().includes(searchDealer.toLowerCase()) || 
                              d.state.toLowerCase().includes(searchDealer.toLowerCase())
                            )
                            .map(d => (
                              <tr key={d.id}>
                                <td className="p-3 font-bold text-brand-green">{d.name}</td>
                                <td className="p-3">{d.contact}</td>
                                <td className="p-3 font-mono">{d.phone}</td>
                                <td className="p-3 text-gray-500">{d.address}</td>
                                <td className="p-3 font-bold text-gray-900">{d.state}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ADMIN WORKSPACE BOARD */}
              {role === 'admin' && (
                <div className="space-y-8">
                  {/* Lead Management Board */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Leads checklist table */}
                    <div className="lg:col-span-8 space-y-4">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <Users className="h-5 w-5 text-brand-green" />
                        {t.leadManagement} ({adminLeads.length})
                      </h4>
                      <div className="overflow-x-auto border border-gray-100 rounded-2xl bg-white">
                        <table className="w-full text-xs text-left text-gray-700">
                          <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <tr>
                              <th className="p-3">Lead ID</th>
                              <th className="p-3">Farmer Name</th>
                              <th className="p-3">Phone Contact</th>
                              <th className="p-3">Region State</th>
                              <th className="p-3">Variety Interest</th>
                              <th className="p-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium">
                            {adminLeads.map(ld => (
                              <tr key={ld.id}>
                                <td className="p-3 font-mono font-bold text-brand-green">{ld.id}</td>
                                <td className="p-3 font-bold text-gray-900">{ld.name}</td>
                                <td className="p-3 font-mono">{ld.phone}</td>
                                <td className="p-3">{ld.state}</td>
                                <td className="p-3 text-brand-gold font-bold">{ld.crop} Hybrid</td>
                                <td className="p-3">
                                  <button
                                    onClick={() => setAdminLeads(adminLeads.filter(l => l.id !== ld.id))}
                                    className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg border border-red-50"
                                    title="Close lead"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Add Lead form */}
                    <div className="lg:col-span-4 bg-gray-50 border border-gray-100 p-5 rounded-2xl text-left space-y-4">
                      <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                        Record New Farmer Lead
                      </h4>
                      <form onSubmit={handleAddLead} className="space-y-3">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-gray-500 mb-1">Farmer Full Name</label>
                          <input
                            type="text"
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                            placeholder="Gurnam Singh..."
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-700 outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-gray-500 mb-1">Mobile Phone Contact</label>
                          <input
                            type="text"
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            placeholder="+91 94160..."
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-700 outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-gray-500 mb-1">State Division</label>
                          <select
                            value={leadState}
                            onChange={(e) => setLeadState(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-700 outline-none"
                          >
                            <option value="Punjab">Punjab</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-brand-green hover:bg-brand-green/95 text-white py-2 rounded-lg text-xs font-bold uppercase transition-all shadow"
                        >
                          Save New Inquiry Lead
                        </button>
                      </form>
                    </div>

                  </div>

                  {/* AI logs analytics inside admin panel */}
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <Database className="h-5 w-5 text-brand-green" />
                      AI Agriculture Suite Logs & Telemetry
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">AI Crop Chats Handled</p>
                        <p className="text-lg font-extrabold text-brand-green mt-0.5">14,520 queries</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">AI Sickness Detections</p>
                        <p className="text-lg font-extrabold text-brand-green mt-0.5">3,241 leaf photos</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Smart Recommendations</p>
                        <p className="text-lg font-extrabold text-brand-green mt-0.5">8,950 reports</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Marketing Copy Generated</p>
                        <p className="text-lg font-extrabold text-brand-gold mt-0.5">1,241 statuses</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* Modal feedback notice overlay for kit downloads */}
        <AnimatePresence>
          {downloadNote && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-brand-dark text-white px-5 py-3 rounded-full shadow-2xl border border-white/10 z-50 flex items-center gap-2 text-xs font-bold"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400 animate-bounce" />
              Download initiated successfully for: {downloadNote}!
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
