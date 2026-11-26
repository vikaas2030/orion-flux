import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DigitalStorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [buyerForm, setBuyerForm] = useState({ name: '', phone: '', email: '' });
  const [utrInput, setUtrInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [settlementResult, setSettlementResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/store/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setProducts(data.products);
          setSelectedProduct(data.products[0]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateOrder = (prod) => {
    setSelectedProduct(prod);
    setOrderData(null);
    setSettlementResult(null);
    setErrorMsg('');

    fetch('/api/store/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: prod.id,
        buyerName: buyerForm.name,
        buyerPhone: buyerForm.phone,
        buyerEmail: buyerForm.email
      })
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setOrderData(d.order);
      })
      .catch(e => setErrorMsg(e.message));
  };

  const handleVerifyUtr = (e) => {
    e.preventDefault();
    if (!utrInput.trim()) return;

    setIsVerifying(true);
    setErrorMsg('');

    fetch('/api/store/verify-utr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: orderData?.orderId,
        productId: selectedProduct?.id,
        utrNumber: utrInput.trim(),
        buyerName: buyerForm.name || 'Valued Customer',
        buyerPhone: buyerForm.phone || '',
        buyerEmail: buyerForm.email || ''
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setSettlementResult(data);
        } else {
          setErrorMsg(data.message || 'Verification failed. Check UTR.');
        }
      })
      .catch(err => setErrorMsg(err.message))
      .finally(() => setIsVerifying(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-pulse flex items-center gap-3">
          <span className="text-3xl">📦</span>
          <span>Loading Autonomous Digital Store...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4">
            <span>⚡</span> 100% Autonomous Instant UPI Delivery • Zero Waiting
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ORION FLUX Digital Assets & AI Automation Store
          </h1>
          <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
            High-converting lead databases, ready-to-deploy WhatsApp AI bot source code, and 4K viral video assets. 
            Scan UPI QR, enter bank UTR, and download immediately.
          </p>
        </div>

        {/* 3 Digital Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {products.map(prod => (
            <div
              key={prod.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 relative ${
                selectedProduct?.id === prod.id
                  ? 'bg-gradient-to-b from-indigo-950/70 to-slate-900 border-indigo-500 shadow-2xl shadow-indigo-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {prod.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {prod.badge}
                </span>
              )}

              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-indigo-400 mb-1">{prod.category}</div>
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">{prod.title}</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{prod.description}</p>

                <ul className="space-y-1.5 text-xs text-slate-300 mb-6">
                  {prod.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-baseline justify-between border-t border-slate-800/80 pt-4 mb-4">
                  <span className="text-xs text-slate-400">One-Time License</span>
                  <div className="text-2xl font-black text-emerald-400">
                    {prod.currencySymbol}{prod.price} <span className="text-xs font-normal text-slate-400">{prod.currency}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCreateOrder(prod)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                    selectedProduct?.id === prod.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <span>📲</span> Buy Now & Download (₹{prod.price})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Checkout & Settlement Modal Area */}
        {orderData && (
          <div className="rounded-2xl bg-slate-900 border border-emerald-500/40 p-6 sm:p-8 shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <span>⚡</span> Instant Autonomous Checkout: {orderData.product.title}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Authorized UPI Payment Rail: <strong className="text-slate-200">9690973030@ibl (Vikas Singh)</strong> • Section 22 CGST Exempt
            </p>

            {settlementResult ? (
              /* Success / Download Unlocked View */
              <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-500 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 text-3xl flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h3 className="text-xl font-extrabold text-white">Payment Verified & Settled!</h3>
                <p className="text-xs text-emerald-200 max-w-md mx-auto">
                  {settlementResult.message}
                </p>

                <div className="p-4 rounded-lg bg-slate-950 border border-emerald-500/40 text-xs font-mono text-left max-w-md mx-auto space-y-1">
                  <div className="text-slate-400">Order ID: <span className="text-white">{settlementResult.orderId}</span></div>
                  <div className="text-slate-400">Bank UTR: <span className="text-emerald-400">{settlementResult.utrNumber}</span></div>
                  <div className="text-slate-400">Amount Settled: <span className="text-white font-bold">{settlementResult.amountPaid}</span></div>
                  <div className="text-slate-400">Official Invoice: <span className="text-indigo-400">{settlementResult.invoiceNumber}</span></div>
                </div>

                <a
                  href={settlementResult.downloadUrl}
                  download={settlementResult.fileName}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/40 transition transform hover:scale-105"
                >
                  <span>⬇️</span> Download {settlementResult.fileName} Now
                </a>
              </div>
            ) : (
              /* Payment QR & UTR Input Area */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* QR Code Column */}
                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-xs font-bold text-slate-300 mb-2">Scan & Pay ₹{orderData.amount} via Any UPI App</div>
                  <div className="p-3 bg-white rounded-xl shadow-xl">
                    <img src={orderData.qrUrl} alt="UPI Payment QR" className="w-52 h-52 object-contain" />
                  </div>
                  <div className="mt-3 text-[11px] text-slate-400 font-mono">
                    UPI ID: <span className="text-emerald-400 font-bold">{orderData.upiId}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    GPay • PhonePe • Paytm • BHIM • CRED
                  </div>
                </div>

                {/* Form & UTR Verification Column */}
                <form onSubmit={handleVerifyUtr} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Your Name / Business Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={buyerForm.name}
                      onChange={e => setBuyerForm({ ...buyerForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">WhatsApp Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9811XXXXXX"
                      value={buyerForm.phone}
                      onChange={e => setBuyerForm({ ...buyerForm, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="text-xs font-bold text-amber-300 block mb-1">
                      Enter 12-Digit Bank UTR / UPI Ref Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 432109876543 (from PhonePe/GPay SMS)"
                      value={utrInput}
                      onChange={e => setUtrInput(e.target.value)}
                      className="w-full bg-slate-950 border-2 border-emerald-500/60 focus:border-emerald-400 rounded-lg px-3 py-2.5 text-xs text-emerald-300 font-mono tracking-wider font-bold"
                      required
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      After scanning the QR code and paying ₹{orderData.amount}, copy the 12-digit UTR from your UPI payment receipt.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition"
                  >
                    {isVerifying ? 'Verifying with Bank Rail...' : `Confirm UTR & Unlock Download (₹${orderData.amount})`}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Guarantee Footer */}
        <div className="mt-12 text-center text-slate-500 text-xs space-y-1">
          <div>Authorized Signatory: <strong>Vikas Singh (Founder & Managing Principal)</strong> • UPI: <code className="text-slate-400">9690973030@ibl</code></div>
          <div>All digital purchases covered under 100% 14-Day Money-Back Guarantee & Section 22 CGST Act Statutory Net-Zero Exemption.</div>
        </div>
      </div>
    </div>
  );
}
