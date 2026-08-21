import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CheckCircle2, AlertTriangle, XCircle, Gift, ShieldCheck, 
  Upload, Sparkles, Building2, User, Phone, MapPin, Tag, 
  Download, ArrowRight, RefreshCw, FileSpreadsheet, Mail, Eye, Plus, Search, Filter, Send, Layers
} from 'lucide-react';

interface RewardsPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: 'English' | 'Hindi' | 'Punjabi';
  initialCode?: string;
}

interface ClaimResult {
  referenceId: string;
  rewardAmount: number;
  submittedAt: string;
}

interface Redemption {
  referenceId: string;
  couponCode: string;
  rewardAmount: number;
  retailerName: string;
  shopName: string;
  distributor: string;
  village: string;
  tehsil?: string;
  district: string;
  state: string;
  phone: string;
  email?: string;
  gst?: string;
  shopPhoto?: string;
  submittedAt: string;
}

interface Coupon {
  code: string;
  rewardAmount: number;
  status: 'active' | 'redeemed';
  createdAt: string;
}

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  sentAt: string;
  body: string;
}

export default function RewardsPortalModal({ isOpen, onClose, initialCode }: RewardsPortalModalProps) {
  // Flow step: 1 = Verify Coupon, 2 = Retailer Details, 3 = Success Screen, 'admin' = Admin Dashboard
  const [step, setStep] = useState<1 | 2 | 3 | 'admin'>(1);

  // Step 1 States
  const [couponCode, setCouponCode] = useState(initialCode || '');
  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'valid' | 'invalid' | 'redeemed'>('idle');
  const [verifyMessage, setVerifyMessage] = useState('');

  useEffect(() => {
    if (initialCode) {
      setCouponCode(initialCode.toUpperCase().trim());
    }
  }, [initialCode]);

  // Step 2 States (Retailer Form)
  const [formData, setFormData] = useState({
    retailerName: '',
    shopName: '',
    distributor: '',
    village: '',
    tehsil: '',
    district: '',
    state: 'Madhya Pradesh',
    phone: '',
    email: '',
    gst: ''
  });
  const [shopPhoto, setShopPhoto] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Step 3 States (Claim Success)
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);

  // Admin View States
  const [adminAuthCode, setAdminAuthCode] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminData, setAdminData] = useState<{
    metrics: { totalCoupons: number; activeCoupons: number; redeemedCoupons: number; totalRewardAmount: number };
    redemptions: Redemption[];
    coupons: Coupon[];
    emailLogs: EmailLog[];
  } | null>(null);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStateFilter, setAdminStateFilter] = useState('ALL');
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);
  const [couponModalTab, setCouponModalTab] = useState<'single' | 'bulk'>('single');
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponAmount, setNewCouponAmount] = useState('500');
  const [bulkCodesText, setBulkCodesText] = useState('');
  const [createCouponStatus, setCreateCouponStatus] = useState<string | null>(null);
  const [isBulkImporting, setIsBulkImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'redemptions' | 'coupons' | 'emails'>('redemptions');
  const [viewEmailModal, setViewEmailModal] = useState<EmailLog | null>(null);
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailMessage, setTestEmailMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  // STEP 1: VERIFY COUPON VIA BACKEND API
  // --------------------------------------------------------------------------
  const handleVerifyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setVerifyStatus('invalid');
      setVerifyMessage('Please enter a coupon code.');
      return;
    }

    setVerifying(true);
    setVerifyStatus('idle');
    setVerifyMessage('');

    try {
      const response = await fetch('/api/rewards/verify-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      });

      const rawText = await response.text();
      let data: any = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        setVerifying(false);
        setVerifyStatus('invalid');
        setVerifyMessage('❌ Server error during coupon verification. Please try again in a moment.');
        return;
      }

      setVerifying(false);

      const alreadyRedeemed =
        data.status === 'REDEEMED' ||
        response.status === 410 ||
        String(data.error || data.message || '').toLowerCase().includes('redeemed');

      if ((data.success && data.status === 'VALID') || data.ok === true) {
        setVerifyStatus('valid');
        setVerifyMessage('✅ Coupon Verified Successfully! Please complete your details to reveal your reward.');
        // Transition to Step 2 after brief visual confirmation
        setTimeout(() => {
          setStep(2);
        }, 1200);
      } else if (alreadyRedeemed) {
        setVerifyStatus('redeemed');
        setVerifyMessage('⚠️ This coupon has already been redeemed.');
      } else {
        setVerifyStatus('invalid');
        setVerifyMessage('❌ Invalid Coupon Code');
      }
    } catch (err) {
      console.error('Error verifying coupon:', err);
      setVerifying(false);
      setVerifyStatus('invalid');
      setVerifyMessage('❌ Network error during coupon verification. Please try again.');
    }
  };

  // --------------------------------------------------------------------------
  // SHOP PHOTO UPLOAD HANDLER
  // --------------------------------------------------------------------------
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Photo size should be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --------------------------------------------------------------------------
  // STEP 2: SUBMIT CLAIM VIA BACKEND API
  // --------------------------------------------------------------------------
  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Check required fields
    if (
      !formData.retailerName.trim() ||
      !formData.shopName.trim() ||
      !formData.distributor.trim() ||
      !formData.village.trim() ||
      !formData.district.trim() ||
      !formData.state.trim() ||
      !formData.phone.trim()
    ) {
      setFormError('Please fill out all required fields marked with *');
      return;
    }

    // Phone validation
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          ...formData,
          shopPhoto
        })
      });

      const data = await response.json();
      setSubmitting(false);

      if (data.success) {
        setClaimResult({
          referenceId: data.referenceId,
          rewardAmount: data.rewardAmount,
          submittedAt: data.submittedAt
        });
        setStep(3);
      } else {
        setFormError(data.message || 'Failed to submit claim. Please try again.');
        if (data.status === 'REDEEMED') {
          setStep(1);
          setVerifyStatus('redeemed');
          setVerifyMessage('⚠️ This coupon has already been redeemed.');
        }
      }
    } catch (err) {
      console.error('Claim submission error:', err);
      setSubmitting(false);
      setFormError('Failed to connect to backend service. Please try again.');
    }
  };

  // Reset to initial verify state
  const handleReset = () => {
    setStep(1);
    setCouponCode('');
    setVerifyStatus('idle');
    setVerifyMessage('');
    setFormData({
      retailerName: '',
      shopName: '',
      distributor: '',
      village: '',
      tehsil: '',
      district: '',
      state: 'Madhya Pradesh',
      phone: '',
      email: '',
      gst: ''
    });
    setShopPhoto(null);
    setClaimResult(null);
    setFormError('');
  };

  // --------------------------------------------------------------------------
  // ADMIN DASHBOARD DATA FETCH & EXPORT
  // --------------------------------------------------------------------------
  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/rewards/admin/data');
      const data = await res.json();
      if (data.success) {
        setAdminData(data);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminAuthCode.trim().toUpperCase() === 'SRASHRIJI123' || adminAuthCode.trim().toLowerCase() === 'admin') {
      setIsAdminAuthenticated(true);
      setAdminError('');
      fetchAdminData();
    } else {
      setAdminError('Invalid Security Access Code. Try mock code: SRASHRIJI123');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponAmount) return;

    try {
      const res = await fetch('/api/rewards/admin/create-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode,
          rewardAmount: Number(newCouponAmount)
        })
      });
      const data = await res.json();
      if (data.success) {
        setCreateCouponStatus(`✅ Coupon ${newCouponCode.toUpperCase()} created successfully!`);
        setNewCouponCode('');
        fetchAdminData();
        setTimeout(() => setShowCreateCouponModal(false), 1500);
      } else {
        setCreateCouponStatus(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setCreateCouponStatus('❌ Error creating coupon.');
    }
  };

  const handleBulkImportCoupons = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkCodesText.trim() || !newCouponAmount) return;

    setIsBulkImporting(true);
    setCreateCouponStatus(null);

    try {
      const res = await fetch('/api/rewards/admin/bulk-create-coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: bulkCodesText,
          rewardAmount: Number(newCouponAmount)
        })
      });
      const data = await res.json();
      setIsBulkImporting(false);
      if (data.success) {
        setCreateCouponStatus(`✅ ${data.message}`);
        setBulkCodesText('');
        fetchAdminData();
        setTimeout(() => setShowCreateCouponModal(false), 2000);
      } else {
        setCreateCouponStatus(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setIsBulkImporting(false);
      setCreateCouponStatus('❌ Error during bulk import.');
    }
  };

  const exportToCSV = () => {
    if (!adminData || !adminData.redemptions.length) return;

    const headers = [
      'Reference ID', 'Coupon Code', 'Reward Amount (₹)', 'Retailer Name', 
      'Shop Name', 'Distributor', 'Village', 'Tehsil', 'District', 
      'State', 'Phone', 'Email', 'GST', 'Submitted Date'
    ];

    const rows = adminData.redemptions.map(r => [
      r.referenceId,
      r.couponCode,
      r.rewardAmount,
      `"${r.retailerName}"`,
      `"${r.shopName}"`,
      `"${r.distributor}"`,
      `"${r.village}"`,
      `"${r.tehsil || ''}"`,
      `"${r.district}"`,
      `"${r.state}"`,
      `"${r.phone}"`,
      `"${r.email || ''}"`,
      `"${r.gst || ''}"`,
      `"${new Date(r.submittedAt).toLocaleString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SRA_Reward_Redemptions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendTestEmail = async () => {
    setTestEmailSending(true);
    setTestEmailMessage(null);
    try {
      const res = await fetch('/api/rewards/admin/send-test-email', { method: 'POST' });
      const data = await res.json();
      setTestEmailSending(false);
      if (data.success) {
        setTestEmailMessage(data.message);
        fetchAdminData();
      } else {
        setTestEmailMessage('❌ Failed to dispatch test email.');
      }
    } catch (err) {
      console.error(err);
      setTestEmailSending(false);
      setTestEmailMessage('❌ Network error dispatching test email.');
    }
  };

  // Indian States list
  const INDIAN_STATES = [
    'Madhya Pradesh', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Rajasthan', 
    'Gujarat', 'Maharashtra', 'Chhattisgarh', 'Bihar', 'Jharkhand', 
    'Telangana', 'Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Odisha', 'West Bengal'
  ];

  // Filter redemptions for admin table
  const filteredRedemptions = adminData?.redemptions.filter(r => {
    const matchesSearch = 
      r.referenceId.toLowerCase().includes(adminSearch.toLowerCase()) ||
      r.couponCode.toLowerCase().includes(adminSearch.toLowerCase()) ||
      r.retailerName.toLowerCase().includes(adminSearch.toLowerCase()) ||
      r.shopName.toLowerCase().includes(adminSearch.toLowerCase()) ||
      r.phone.includes(adminSearch) ||
      r.district.toLowerCase().includes(adminSearch.toLowerCase());

    const matchesState = adminStateFilter === 'ALL' || r.state === adminStateFilter;
    return matchesSearch && matchesState;
  }) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto text-left"
        id="sra-rewards-modal-container"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-brand-dark to-emerald-950 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black font-display tracking-tight">
                    🎁 SRA Rewards Portal
                  </h2>
                  <span className="text-[10px] font-bold bg-amber-400 text-gray-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Official
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
                  Redeem authentic SRA Agri Genetics scratch coupons and instant rewards
                </p>
              </div>
            </div>

            {/* Navigation / Close Controls */}
            <div className="flex items-center space-x-2">
              {step !== 'admin' ? (
                <button
                  onClick={() => {
                    setStep('admin');
                    fetchAdminData();
                  }}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 border border-white/15"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Admin Console</span>
                </button>
              ) : (
                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 bg-emerald-700/60 hover:bg-emerald-700 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 border border-white/15"
                >
                  <Gift className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Redeem Portal</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
          {/* ========================================================================= */}
          {/* STEP 1: VERIFY COUPON */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="max-w-md mx-auto space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-50 text-brand-green mb-1 border border-emerald-100 shadow-sm">
                  <Tag className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-display">
                  Enter Your Coupon Code
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Please enter the 10-digit unique scratch code found inside your SRA hybrid seed bag.
                </p>
              </div>

              <form onSubmit={handleVerifyCoupon} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Coupon Scratch Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setVerifyStatus('idle');
                        setVerifyMessage('');
                      }}
                      placeholder="e.g. SRA4589231"
                      maxLength={15}
                      className="w-full px-5 py-4 text-center font-mono text-xl font-black uppercase tracking-widest bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-brand-green focus:bg-white focus:outline-none transition-all shadow-inner text-gray-900"
                      disabled={verifying}
                    />
                    <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5 text-center">
                    Sample Test Codes: <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded font-bold">SRA4589231</code> (₹500), <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded font-bold">SRA1029384</code> (₹1000)
                  </p>
                </div>

                {/* Status Alert Banners */}
                {verifyStatus === 'invalid' && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start space-x-3 text-sm font-semibold"
                  >
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{verifyMessage}</p>
                      <p className="text-xs text-red-600 font-normal mt-0.5">
                        Please re-check the letters and digits on your seed coupon card.
                      </p>
                    </div>
                  </motion.div>
                )}

                {verifyStatus === 'redeemed' && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start space-x-3 text-sm font-semibold"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{verifyMessage}</p>
                      <p className="text-xs text-amber-700 font-normal mt-0.5">
                        If you believe this is an error, please contact your authorized SRA distributor or hotline.
                      </p>
                    </div>
                  </motion.div>
                )}

                {verifyStatus === 'valid' && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start space-x-3 text-sm font-semibold"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{verifyMessage}</p>
                      <p className="text-xs text-emerald-700 font-medium mt-0.5">
                        Redirecting to Retailer Information Form...
                      </p>
                    </div>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={verifying || !couponCode.trim()}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {verifying ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Validating Backend Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Coupon</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: RETAILER DETAILS FORM */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                      Coupon Verified: {couponCode}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Step 2 of 3</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1 font-display">
                    Complete Retailer Profile & Claim Reward
                  </h3>
                  <p className="text-xs text-gray-500">
                    Fill in your verified retail store details to reveal and receive your instant cash reward.
                  </p>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:text-gray-800 font-bold underline"
                >
                  Change Code
                </button>
              </div>

              {formError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center space-x-2">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitClaim} className="space-y-6">
                {/* Section A: Required Store Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Store & Retailer Details (Required *)</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Retailer Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Retailer Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.retailerName}
                          onChange={(e) => setFormData({ ...formData, retailerName: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-medium text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Shop Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Shop Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.shopName}
                          onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                          placeholder="e.g. Rahul Agro Store"
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-medium text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Distributor */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Distributor Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.distributor}
                        onChange={(e) => setFormData({ ...formData, distributor: e.target.value })}
                        placeholder="e.g. ABC Distributors Pvt Ltd"
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-medium text-gray-900"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-medium text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section B: Location Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>Location Information</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Village */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Village / Town <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        placeholder="e.g. Rampur"
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-medium text-gray-900"
                      />
                    </div>

                    {/* Tehsil */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Tehsil <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.tehsil}
                        onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                        placeholder="e.g. Bilaspur"
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-medium text-gray-900"
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        District <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        placeholder="e.g. Raipur"
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-medium text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* State */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-medium text-gray-900"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@gmail.com"
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-medium text-gray-900"
                      />
                    </div>

                    {/* GST Number */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        GST Number <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.gst}
                        onChange={(e) => setFormData({ ...formData, gst: e.target.value.toUpperCase() })}
                        placeholder="e.g. 22ABCDE1234F1Z5"
                        className="w-full px-3 py-2.5 text-sm uppercase bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-medium text-gray-900 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section C: Optional Shop Photo Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Shop Photo <span className="text-gray-400 font-normal">(Optional Verification Photo)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {shopPhoto ? (
                    <div className="relative w-full h-36 rounded-2xl border-2 border-emerald-500 overflow-hidden bg-gray-900 group">
                      <img src={shopPhoto} alt="Shop Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-white text-gray-900 font-bold text-xs rounded-lg shadow"
                        >
                          Change Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => setShopPhoto(null)}
                          className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-lg shadow"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-emerald-50/40"
                    >
                      <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs font-bold text-gray-700">Click or Drag to Upload Shop Storefront Photo</p>
                      <p className="text-[10px] text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>

                {/* Submit Claim Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Verifying & Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      <span>Submit & Reveal Reward</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: SUCCESS SCREEN (RESERVED REWARD REVEALED) */}
          {/* ========================================================================= */}
          {step === 3 && claimResult && (
            <div className="text-center py-6 space-y-6 max-w-lg mx-auto">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-green-400 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/40"
              >
                <CheckCircle2 className="w-12 h-12" />
              </motion.div>

              <div>
                <h3 className="text-2xl font-black text-gray-900 font-display">
                  🎉 Congratulations!
                </h3>
                <p className="text-xs text-emerald-700 font-bold mt-1">
                  Your coupon has been redeemed successfully.
                </p>
              </div>

              {/* Revealed Reward Banner */}
              <div className="p-6 bg-gradient-to-br from-emerald-900 via-emerald-950 to-gray-900 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-emerald-500/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <p className="text-xs uppercase font-extrabold tracking-widest text-emerald-300">
                  You Won
                </p>
                <div className="text-4xl md:text-5xl font-black text-amber-400 font-display my-2 tracking-tight">
                  ₹{claimResult.rewardAmount.toLocaleString('en-IN')}
                </div>
                <div className="inline-block bg-white/10 px-4 py-1.5 rounded-xl border border-white/10 mt-1">
                  <p className="text-[10px] text-gray-300 font-mono">Reference ID</p>
                  <p className="text-sm font-black font-mono text-white tracking-wider">
                    {claimResult.referenceId}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900 font-medium space-y-1 text-left">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Redemption Request Confirmation:</span>
                </p>
                <p className="text-emerald-700">
                  Your reward request has been submitted to SRA Central Accounts. An automated notification email has been dispatched to the admin team. Our field representative will disburse the cashback shortly.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>Redeem Another Coupon</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all text-xs cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 'admin': ADMIN REDEMPTION DASHBOARD & DATABASE */}
          {/* ========================================================================= */}
          {step === 'admin' && (
            <div className="space-y-6">
              {!isAdminAuthenticated ? (
                /* Admin Login Form */
                <div className="max-w-md mx-auto py-8 space-y-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 font-display">
                    SRA Central Admin Authentication
                  </h3>
                  <p className="text-xs text-gray-500">
                    Access redemption logs, coupon database, admin notifications & Excel export.
                  </p>

                  <form onSubmit={handleAdminLogin} className="space-y-3">
                    <input
                      type="password"
                      value={adminAuthCode}
                      onChange={(e) => setAdminAuthCode(e.target.value)}
                      placeholder="Enter Security Admin Code (e.g. SRASHRIJI123)"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-sm font-bold text-gray-900"
                    />

                    {adminError && (
                      <p className="text-xs font-bold text-red-600">{adminError}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                    >
                      Authenticate Admin Console
                    </button>
                  </form>
                </div>
              ) : (
                /* Admin Dashboard Main Interface */
                <div className="space-y-6">
                  {/* Top Bar with Metrics & Tools */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 font-display flex items-center gap-2">
                        <span>Central Redemptions & Coupons Database</span>
                        <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Live DB Sync
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500">
                        Manage all retailer claims, generate coupon codes, export data & inspect admin notifications.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={exportToCSV}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Export Excel (CSV)</span>
                      </button>

                      <button
                        onClick={() => setShowCreateCouponModal(true)}
                        className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Coupon</span>
                      </button>

                      <button
                        onClick={fetchAdminData}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-all cursor-pointer"
                        title="Refresh Database"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  {adminData && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <p className="text-[10px] uppercase font-bold text-emerald-700">Total Reward Paid</p>
                        <p className="text-xl font-black text-emerald-900 font-display mt-0.5">
                          ₹{adminData.metrics.totalRewardAmount.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                        <p className="text-[10px] uppercase font-bold text-blue-700">Redeemed Coupons</p>
                        <p className="text-xl font-black text-blue-900 font-display mt-0.5">
                          {adminData.metrics.redeemedCoupons} Claims
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                        <p className="text-[10px] uppercase font-bold text-purple-700">Active Coupons</p>
                        <p className="text-xl font-black text-purple-900 font-display mt-0.5">
                          {adminData.metrics.activeCoupons} Unused
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                        <p className="text-[10px] uppercase font-bold text-amber-700">Admin Email Logs</p>
                        <p className="text-xl font-black text-amber-900 font-display mt-0.5">
                          {adminData.emailLogs.length} Sent
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab Navigation: Redemptions | Coupons | Email Notifications */}
                  <div className="flex items-center space-x-2 border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('redemptions')}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                        activeTab === 'redemptions'
                          ? 'border-emerald-600 text-emerald-800'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Redemption History ({filteredRedemptions.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('coupons')}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                        activeTab === 'coupons'
                          ? 'border-emerald-600 text-emerald-800'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Coupons Inventory ({adminData?.coupons.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('emails')}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                        activeTab === 'emails'
                          ? 'border-emerald-600 text-emerald-800'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Admin Email Logs ({adminData?.emailLogs.length || 0})
                    </button>
                  </div>

                  {/* TAB 1: REDEMPTIONS HISTORY */}
                  {activeTab === 'redemptions' && (
                    <div className="space-y-4">
                      {/* Search & State Filter Controls */}
                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={adminSearch}
                            onChange={(e) => setAdminSearch(e.target.value)}
                            placeholder="Search by Ref ID, Coupon Code, Retailer, Shop, Phone, District..."
                            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Filter className="w-4 h-4 text-gray-400" />
                          <select
                            value={adminStateFilter}
                            onChange={(e) => setAdminStateFilter(e.target.value)}
                            className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                          >
                            <option value="ALL">All States</option>
                            {INDIAN_STATES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Redemptions Table */}
                      <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-50 text-gray-700 font-extrabold border-b border-gray-200">
                            <tr>
                              <th className="p-3">Reference ID</th>
                              <th className="p-3">Coupon Code</th>
                              <th className="p-3">Retailer & Shop</th>
                              <th className="p-3">Distributor</th>
                              <th className="p-3">Location</th>
                              <th className="p-3">Phone</th>
                              <th className="p-3">Reward</th>
                              <th className="p-3">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredRedemptions.length > 0 ? (
                              filteredRedemptions.map((r) => (
                                <tr key={r.referenceId} className="hover:bg-gray-50/80 transition-colors">
                                  <td className="p-3 font-mono font-bold text-gray-900">{r.referenceId}</td>
                                  <td className="p-3 font-mono font-black text-emerald-800">{r.couponCode}</td>
                                  <td className="p-3">
                                    <p className="font-bold text-gray-900">{r.retailerName}</p>
                                    <p className="text-[10px] text-gray-500">{r.shopName}</p>
                                  </td>
                                  <td className="p-3 text-gray-700 font-medium">{r.distributor}</td>
                                  <td className="p-3">
                                    <p className="font-bold text-gray-800">{r.village}, {r.district}</p>
                                    <p className="text-[10px] text-gray-500">{r.state}</p>
                                  </td>
                                  <td className="p-3 font-mono">{r.phone}</td>
                                  <td className="p-3 font-black text-amber-600 text-sm">₹{r.rewardAmount}</td>
                                  <td className="p-3 text-gray-500 text-[10px]">
                                    {new Date(r.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400 font-medium">
                                  No redemption records found matching search filters.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: COUPONS INVENTORY */}
                  {activeTab === 'coupons' && (
                    <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 text-gray-700 font-extrabold border-b border-gray-200">
                          <tr>
                            <th className="p-3">Coupon Code</th>
                            <th className="p-3">Reward Amount</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Created At</th>
                            <th className="p-3">Redemption Reference</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {adminData?.coupons.map((c) => (
                            <tr key={c.code} className="hover:bg-gray-50/80">
                              <td className="p-3 font-mono font-black text-gray-900">{c.code}</td>
                              <td className="p-3 font-bold text-amber-600">₹{c.rewardAmount}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  c.status === 'active' 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {c.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="p-3 text-gray-500 text-[10px]">
                                {new Date(c.createdAt).toLocaleString()}
                              </td>
                              <td className="p-3 font-mono text-[11px] text-gray-700">
                                {c.redeemedByRef || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* TAB 3: ADMIN EMAIL LOGS */}
                  {activeTab === 'emails' && (
                    <div className="space-y-4">
                      {/* Email Dispatch Control Card */}
                      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-emerald-400" />
                              <h4 className="text-sm font-bold text-white">Target Admin Email: <span className="text-amber-400">srashrijiagrigeneticsseeds@gmail.com</span></h4>
                            </div>
                            <p className="text-xs text-slate-300 mt-1">
                              Every retailer redemption automatically formats and logs an admin email notification to this address.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleSendTestEmail}
                            disabled={testEmailSending}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{testEmailSending ? 'Sending Test Email...' : 'Send Test Email Now'}</span>
                          </button>
                        </div>

                        {testEmailMessage && (
                          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-300 flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>{testEmailMessage}</span>
                          </div>
                        )}
                      </div>

                      {/* Email Logs List */}
                      {adminData?.emailLogs && adminData.emailLogs.length > 0 ? (
                        adminData.emailLogs.map((log) => (
                          <div key={log.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50 space-y-2">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-emerald-700" />
                                <span className="font-bold text-gray-900">{log.subject}</span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                  To: {log.to}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {new Date(log.sentAt).toLocaleString()}
                              </span>
                            </div>

                            <pre className="text-xs font-mono bg-white p-3 rounded-xl border border-gray-200 text-gray-800 whitespace-pre-wrap leading-relaxed">
                              {log.body}
                            </pre>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-400 font-medium">
                          No email notification logs found yet.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create New Coupon Modal Overlay */}
        {showCreateCouponModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900 font-display">Create / Feed SRA Coupons</h4>
                  <p className="text-[11px] text-gray-500">Add single or bulk paste hundreds of codes</p>
                </div>
                <button 
                  onClick={() => {
                    setShowCreateCouponModal(false);
                    setCreateCouponStatus(null);
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setCouponModalTab('single'); setCreateCouponStatus(null); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    couponModalTab === 'single' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Single Coupon
                </button>
                <button
                  type="button"
                  onClick={() => { setCouponModalTab('bulk'); setCreateCouponStatus(null); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                    couponModalTab === 'bulk' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Bulk Import (Paste List)</span>
                </button>
              </div>

              {couponModalTab === 'single' ? (
                <form onSubmit={handleCreateCoupon} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Coupon Code</label>
                    <input
                      type="text"
                      required
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SRA998811"
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl font-mono uppercase font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Reward Amount (₹)</label>
                    <select
                      value={newCouponAmount}
                      onChange={(e) => setNewCouponAmount(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    >
                      <option value="250">₹250</option>
                      <option value="500">₹500</option>
                      <option value="750">₹750</option>
                      <option value="1000">₹1,000</option>
                      <option value="1500">₹1,500</option>
                      <option value="2000">₹2,000</option>
                      <option value="3000">₹3,000</option>
                      <option value="5000">₹5,000</option>
                    </select>
                  </div>

                  {createCouponStatus && (
                    <p className="text-xs font-bold text-emerald-700">{createCouponStatus}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow"
                  >
                    Create & Register Coupon
                  </button>
                </form>
              ) : (
                <form onSubmit={handleBulkImportCoupons} className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-gray-700">Paste Coupon Codes</label>
                      <span className="text-[10px] text-gray-400">Separated by lines, spaces, or commas</span>
                    </div>
                    <textarea
                      required
                      rows={6}
                      value={bulkCodesText}
                      onChange={(e) => setBulkCodesText(e.target.value)}
                      placeholder={`SRA100001\nSRA100002\nSRA100003\n... (Paste up to hundreds of codes)`}
                      className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl font-mono uppercase focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Reward Value for all pasted codes (₹)</label>
                    <select
                      value={newCouponAmount}
                      onChange={(e) => setNewCouponAmount(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    >
                      <option value="250">₹250</option>
                      <option value="500">₹500</option>
                      <option value="750">₹750</option>
                      <option value="1000">₹1,000</option>
                      <option value="1500">₹1,500</option>
                      <option value="2000">₹2,000</option>
                      <option value="3000">₹3,000</option>
                      <option value="5000">₹5,000</option>
                    </select>
                  </div>

                  {createCouponStatus && (
                    <p className="text-xs font-bold text-emerald-700">{createCouponStatus}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isBulkImporting}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Layers className="w-4 h-4" />
                    <span>{isBulkImporting ? 'Importing Codes...' : 'Bulk Import All Codes'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}