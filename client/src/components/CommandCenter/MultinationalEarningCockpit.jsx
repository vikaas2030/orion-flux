import React, { useState, useEffect } from 'react';

export default function MultinationalEarningCockpit() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hubs');
  const [selectedHub, setSelectedHub] = useState('hub_us');
  const [invoiceForm, setInvoiceForm] = useState({
    clientName: 'Manhattan Dental Group',
    country: 'United States',
    currency: 'USD',
    amount: 1500,
    serviceDescription: '24/7 AI Patient Intake & CineFlow 4K Video Ad Infrastructure'
  });
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/multinational/overview');
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      console.error('Failed to load MNC data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/multinational/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceForm)
      });
      const d = await res.json();
      if (d.success) setGeneratedInvoice(d.invoice);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 text-slate-300 animate-pulse flex items-center gap-3">
        <span className="text-3xl">🌐</span>
        <span>Connecting to Global Multinational Earning Hubs...</span>
      </div>
    );
  }

  const hubs = data?.territories || [];
  const currentHub = hubs.find(h => h.id === selectedHub) || hubs[0];

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden my-6">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
            🌐
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Multinational AI Enterprise Operating System
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                5 Sovereign Hubs
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-border FX Arbitrage • Zero-Rated B2B Export of Software (Section 16 IGST) • USD/GBP/AED Settlement Rails
            </p>
          </div>
        </div>

        {/* Global Pipeline Total */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Global Pipeline</div>
            <div className="text-lg font-extrabold text-emerald-400 flex items-center gap-2">
              {data?.totalGlobalPipelineInrFormatted}
              <span className="text-xs font-medium text-slate-400">({data?.totalGlobalPipelineUsdFormatted})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('hubs')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
            activeTab === 'hubs'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          🌍 5 Sovereign Global Hubs
        </button>
        <button
          onClick={() => setActiveTab('arbitrage')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
            activeTab === 'arbitrage'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          💹 FX Currency Multiplier Arbitrage
        </button>
        <button
          onClick={() => setActiveTab('invoice')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
            activeTab === 'invoice'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          📄 Cross-Border Zero-Tax Invoicing
        </button>
      </div>

      {/* TAB 1: 5 SOVEREIGN HUBS */}
      {activeTab === 'hubs' && (
        <div>
          {/* Hub Selector Pills */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 mb-6">
            {hubs.map(hub => (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedHub === hub.id
                    ? 'bg-indigo-950/80 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-white truncate">{hub.name.split(' ')[0]} {hub.territory}</div>
                <div className="text-[11px] font-mono text-indigo-300 mt-1">{hub.currency} ({hub.currencySymbol})</div>
                <div className="text-xs font-semibold text-emerald-400 mt-2">{hub.pipelineFormattedInr}</div>
              </button>
            ))}
          </div>

          {/* Active Hub Detailed Breakdown Card */}
          {currentHub && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{currentHub.name}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Cities: <span className="text-slate-300">{currentHub.cities?.join(', ')}</span> • Timezone: <span className="text-indigo-300 font-mono">{currentHub.timezone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Avg Ticket Value</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {currentHub.currencySymbol}{currentHub.avgDealSizeUsd?.toLocaleString()} ({currentHub.currency}) ≈ ₹{currentHub.avgDealSizeInr?.toLocaleString()} INR
                  </div>
                </div>
              </div>

              {/* Settlement Rails & Statutory Compliance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="text-slate-400 font-semibold mb-1">💳 Authorized Settlement Rails</div>
                  <ul className="space-y-1 text-slate-300">
                    {currentHub.paymentRails?.map((rail, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-emerald-400">✓</span> {rail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="text-slate-400 font-semibold mb-1">⚖️ Statutory Tax Treatment</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {currentHub.statutoryTax}
                  </p>
                  <div className="mt-2 text-[10px] text-emerald-400 font-mono">
                    LUT Ref: LUT-EXPORT-2026-B2B
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="text-slate-400 font-semibold mb-1">🎯 High-Yield Niches</div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {currentHub.activeNiches?.map((niche, idx) => (
                      <li key={idx} className="truncate">• {niche}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FX CURRENCY MULTIPLIER ARBITRAGE */}
      {activeTab === 'arbitrage' && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
            <strong>💡 The Multinational Currency Advantage:</strong> While local Indian deals yield ₹999 to ₹25,000, 
            a single North American or Dubai deal of $2,000 USD converts into <strong>₹1,73,700 INR</strong> at current FX rates (86.85x multiplier).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">1 US Dollar ($ USD)</div>
              <div className="text-2xl font-bold text-white mt-1">₹86.85 INR</div>
              <div className="text-[11px] text-emerald-400 mt-1">$1,500 Deal = ₹1,30,275</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">1 British Pound (£ GBP)</div>
              <div className="text-2xl font-bold text-white mt-1">₹110.20 INR</div>
              <div className="text-[11px] text-emerald-400 mt-1">£1,200 Deal = ₹1,32,240</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">1 Euro (€ EUR)</div>
              <div className="text-2xl font-bold text-white mt-1">₹94.50 INR</div>
              <div className="text-[11px] text-emerald-400 mt-1">€1,500 Deal = ₹1,41,750</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">1 UAE Dirham (AED)</div>
              <div className="text-2xl font-bold text-white mt-1">₹23.65 INR</div>
              <div className="text-[11px] text-emerald-400 mt-1">5,000 AED = ₹1,18,250</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CROSS-BORDER ZERO-TAX INVOICE GENERATOR */}
      {activeTab === 'invoice' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Invoice Builder Form */}
          <form onSubmit={handleCreateInvoice} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>📄</span> Issue International B2B Export Invoice
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Client Business Name</label>
                <input
                  type="text"
                  value={invoiceForm.clientName}
                  onChange={e => setInvoiceForm({ ...invoiceForm, clientName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Destination Country</label>
                <input
                  type="text"
                  value={invoiceForm.country}
                  onChange={e => setInvoiceForm({ ...invoiceForm, country: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Settlement Currency</label>
                <select
                  value={invoiceForm.currency}
                  onChange={e => setInvoiceForm({ ...invoiceForm, currency: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="USD">USD ($ - United States)</option>
                  <option value="GBP">GBP (£ - United Kingdom)</option>
                  <option value="EUR">EUR (€ - Europe)</option>
                  <option value="INR">INR (₹ - India Domestic)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Contract Amount</label>
                <input
                  type="number"
                  value={invoiceForm.amount}
                  onChange={e => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Deliverable / Scope Description</label>
              <textarea
                value={invoiceForm.serviceDescription}
                onChange={e => setInvoiceForm({ ...invoiceForm, serviceDescription: e.target.value })}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition"
            >
              {isGenerating ? 'Generating Official Invoice...' : 'Generate Compliant MNC B2B Invoice'}
            </button>
          </form>

          {/* Generated Invoice Preview */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
            {generatedInvoice ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-indigo-400 font-bold">{generatedInvoice.invoiceNumber}</span>
                  <span className="text-emerald-400 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                    LUT Export Compliant
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Bill To: <span className="text-white font-bold">{generatedInvoice.billTo.clientName}</span> ({generatedInvoice.billTo.country})
                </div>

                <div className="text-[11px] text-slate-400">
                  Service: <span className="text-slate-200">{generatedInvoice.serviceDescription}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex justify-between text-slate-300">
                    <span>Gross Total:</span>
                    <span className="text-white font-bold">{generatedInvoice.billing.formattedNet}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px] mt-1">
                    <span>Tax (Section 16 IGST Zero-Rated):</span>
                    <span className="text-emerald-400">0.00 (LUT Filed)</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1.5 mt-1.5">
                    <span>INR Value:</span>
                    <span>{generatedInvoice.billing.inrEquivalentFormatted}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400">
                  Payment Instructions: <span className="text-indigo-300">{generatedInvoice.paymentInstructions}</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12">
                <span className="text-3xl mb-2">📄</span>
                Fill the form on the left to generate an instant zero-tax cross-border invoice.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Footer */}
      <div className="mt-6 pt-3 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
        <div>
          Signatory: <strong className="text-slate-300">Vikas Singh (Founder & Managing Principal)</strong>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span>PayPal: payments@orionflux.agency</span>
          <span>•</span>
          <span>UPI: 9690973030@ibl</span>
          <span>•</span>
          <span>LUT: B2B Export 0% Tax</span>
        </div>
      </div>
    </div>
  );
}
