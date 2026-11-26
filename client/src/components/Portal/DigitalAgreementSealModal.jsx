import React, { useState } from 'react';

export default function DigitalAgreementSealModal({ deal, isOpen, onClose, onRatified }) {
  const [clientName, setClientName] = useState(deal?.contact || deal?.lead_name || '');
  const [company, setCompany] = useState(deal?.company || deal?.lead_company || '');
  const [designation, setDesignation] = useState('Director / Executive Decision Maker');
  const [phone, setPhone] = useState(deal?.phone || '');
  const [agreed, setAgreed] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [ratificationResult, setRatificationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRatify = async (e) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMsg('Please enter your full legal or business name to sign.');
      return;
    }
    if (!agreed) {
      setErrorMsg('Please accept the Buyer Protection terms and SLA conditions.');
      return;
    }

    setSealing(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/trust/ratify-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: deal?.id || deal?.slug || 'direct',
          clientName: clientName.trim(),
          company: company.trim() || deal?.company || 'Enterprise Partner',
          designation: designation.trim(),
          phone: phone.trim()
        })
      });
      const data = await res.json();
      setSealing(false);

      if (data.success && data.ratification) {
        setRatificationResult(data.ratification);
        if (onRatified) onRatified(data.ratification);
      } else {
        setErrorMsg(data.message || 'Ratification could not be sealed. Please retry.');
      }
    } catch (err) {
      setSealing(false);
      setErrorMsg(err.message || 'Network error while generating digital seal.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-black border-2 border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-500/10 p-6 md:p-8 text-white my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 transition-colors"
        >
          ✕
        </button>

        {!ratificationResult ? (
          <div>
            {/* Header */}
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-amber-500/20">
                📜
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  Master Services Digital Ratification & Buyer Protection Bond
                </h3>
                <p className="text-xs text-amber-400 font-mono">
                  STATUTORY INSTRUMENT • SECTION 22 CGST ACT (CERT-CGST-2026-EXEMPT-09)
                </p>
              </div>
            </div>

            {/* Parties Summary */}
            <div className="my-5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-semibold text-slate-400">Authorized Provider:</span>
                <span className="text-amber-300 font-bold">Vikas Singh (Founder & Managing Principal)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-semibold text-slate-400">Agency Organization:</span>
                <span className="text-white">ORION FLUX Autonomous Global OS</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-semibold text-slate-400">Official Settlement UPI:</span>
                <span className="text-emerald-400 font-mono font-bold">9690973030@ibl (Vikas Singh)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-semibold text-slate-400">Statutory Net-Zero Tax:</span>
                <span className="text-sky-400 font-semibold">100% Tax-Exempt Under Sec 22 CGST Act</span>
              </div>
            </div>

            {/* 4 Guarantees */}
            <div className="space-y-2 my-4">
              <div className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>60-Minute 100% Refund SLA:</strong> If the initial pilot or staging fails live acceptance testing, funds reversed in 60 mins.</span>
              </div>
              <div className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Full Commercial IP Handover:</strong> 100% source code, system models, and assets transferred irrevocably upon final milestone.</span>
              </div>
              <div className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Cryptographic SHA-256 Audit:</strong> Contract sealed with unique SHA-256 mathematical hash timestamped on public ledger.</span>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleRatify} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Apex Enterprises"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Designation / Authority
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Managing Director"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Phone (WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-start space-x-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-0 bg-slate-950"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  I hereby ratify this engagement with <strong>Vikas Singh (Founder & Managing Principal, ORION FLUX)</strong> under the 100% Zero-Risk Buyer Protection terms and authorize deployment kickoff.
                </span>
              </label>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={sealing || !agreed}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center space-x-2 ${
                    sealing || !agreed
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 hover:brightness-110 shadow-amber-500/20 active:scale-[0.99]'
                  }`}
                >
                  <span>{sealing ? '⏳ Generating Cryptographic SHA-256 Seal...' : '✍️ Ratify & Cryptographically Seal Agreement'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Sealed State */
          <div className="text-center py-4 space-y-5">
            <div className="inline-flex p-4 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 shadow-xl shadow-emerald-500/20 animate-pulse">
              <span className="text-4xl">🛡️</span>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-emerald-400">
                Agreement Ratified & Formally Sealed!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your engagement with Vikas Singh is now legally ratified and backed by Buyer Protection Bond.
              </p>
            </div>

            {/* Seal Certificate Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-left font-mono text-xs space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">AGREEMENT REF:</span>
                <span className="text-amber-400 font-bold">{ratificationResult.agreementId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">CLIENT SIGNATORY:</span>
                <span className="text-white font-semibold">{ratificationResult.clientName} ({ratificationResult.company})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">MANAGING PRINCIPAL:</span>
                <span className="text-white font-semibold">{ratificationResult.managingPrincipal}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">SETTLEMENT RAIL:</span>
                <span className="text-emerald-400 font-bold">{ratificationResult.settlementRail}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block text-[10px]">CRYPTOGRAPHIC SHA-256 SEAL:</span>
                <span className="text-sky-400 break-all text-[11px] font-bold">{ratificationResult.sha256Seal}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all"
              >
                ⚡ Proceed to Instant Settlement QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}