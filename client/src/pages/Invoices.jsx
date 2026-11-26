import React, { useState, useEffect } from 'react';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState({
    upi_id: '9690973030@ibl',
    upi_name: 'ORION FLUX Agency',
    paypal_email: 'payments@orionflux.agency'
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedInv, setSelectedInv] = useState(null);
  const [newInv, setNewInv] = useState({ client: '', service: 'Web & Digital Services', amount: '', status: 'sent', applyGst: false });
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setPaymentSettings({
            upi_id: data.settings.upi_id || '9690973030@ibl',
            upi_name: data.settings.upi_name || 'ORION FLUX Agency',
            paypal_email: data.settings.paypal_email || 'payments@orionflux.agency'
          });
        }
      })
      .catch(() => {});

    // Sync invoices with real deals
    fetch('/api/deals/all')
      .then(res => res.json())
      .then(data => {
        if (data.deals && Array.isArray(data.deals)) {
          const mapped = data.deals.map((deal, idx) => {
            const amt = parseFloat(deal.value) || 10000;
            // 100% All-Inclusive Net Pricing (Zero Hidden GST Surcharges)
            // Under Section 22 of CGST Act, service turnover < ₹20 Lakhs is legally GST-exempt.
            const isGstRequired = deal.applyCorporateGst === true;
            const tax = isGstRequired ? Math.round(amt * 0.18) : 0;
            const total = isGstRequired ? amt + tax : amt;
            return {
              id: deal.id,
              number: deal.invoiceNumber || `INV-2026-${String(deal.id).slice(-4)}`,
              client: deal.lead_company || deal.lead_name || 'Verified Client',
              service: deal.title,
              amount: amt,
              currency: deal.currency || 'INR',
              tax: tax,
              total: total,
              isGstExempt: !isGstRequired,
              status: deal.stage === 'won' ? 'paid' : 'sent',
              date: deal.created_at ? deal.created_at.split('T')[0] : '2026-10-24'
            };
          });
          setInvoices(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddInvoice = (e) => {
    e.preventDefault();
    const amt = parseFloat(newInv.amount) || 0;
    const isGst = newInv.applyGst === true;
    const tax = isGst ? Math.round(amt * 0.18) : 0;
    const total = isGst ? amt + tax : amt;
    const item = {
      id: Date.now(),
      number: `INV-2026-0${invoices.length + 1}`,
      client: newInv.client,
      service: newInv.service,
      amount: amt,
      tax: tax,
      total: total,
      isGstExempt: !isGst,
      status: newInv.status,
      date: new Date().toISOString().split('T')[0]
    };
    setInvoices([item, ...invoices]);
    setShowModal(false);
    setNewInv({ client: '', service: 'Web & Digital Services', amount: '', status: 'sent', applyGst: false });
  };

  const markAsPaid = (id) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status: 'paid' } : i));
    if (selectedInv && selectedInv.id === id) {
      setSelectedInv({ ...selectedInv, status: 'paid' });
    }
  };

  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const totalPending = invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.total, 0);

  const getUpiQrUrl = (amount) => {
    const upiUri = `upi://pay?pa=${encodeURIComponent(paymentSettings.upi_id)}&pn=${encodeURIComponent(paymentSettings.upi_name)}&am=${amount}&cu=INR`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUri)}`;
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(paymentSettings.upi_id);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  return (
    <div className="invoices-page animate-in">
      <div className="flex justify-between items-center mb-20 flex-wrap gap-12">
        <div>
          <h2 className="text-xl font-bold">Invoices & Real Client Payment Gateway</h2>
          <p className="text-sm text-tertiary">Generate GST invoices with integrated UPI QR Codes & PayPal links for real client payments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <span>+</span> Create New Invoice
        </button>
      </div>

      <div className="stat-cards mb-24">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Paid Client Revenue</h3>
            <div className="stat-value">₹{totalCollected.toLocaleString()}</div>
            <span className="stat-change positive">✓ Settled in Bank</span>
          </div>
          <div className="stat-icon green">💰</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Pending Client Invoices</h3>
            <div className="stat-value">₹{totalPending.toLocaleString()}</div>
            <span className="stat-change negative">⏳ Awaiting Payment</span>
          </div>
          <div className="stat-icon orange">⌛</div>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="data-table-wrapper mb-24">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client & Service</th>
              <th>Date</th>
              <th>Subtotal</th>
              <th>Tax / GST</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td style={{ fontWeight: '600', color: 'var(--accent-purple)' }}>{inv.number}</td>
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{inv.client}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{inv.service}</div>
                </td>
                <td>{inv.date}</td>
                <td>₹{inv.amount.toLocaleString()}</td>
                <td>{inv.tax > 0 ? `₹${inv.tax.toLocaleString()} (18%)` : <span style={{ color: 'var(--accent-green)', fontSize: '11px', fontWeight: 'bold' }}>₹0 (All-Inclusive)</span>}</td>
                <td style={{ fontWeight: 'bold', color: 'var(--accent-green)' }}>₹{inv.total.toLocaleString()}</td>
                <td>
                  <span className={`badge badge-${inv.status === 'paid' ? 'won' : 'proposal'}`}>
                    {inv.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="flex gap-8">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedInv(inv)}
                    >
                      💳 Pay / View
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                      📄 PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View & Pay Invoice Modal (UPI & PayPal) */}
      {selectedInv && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h2>Invoice: {selectedInv.number}</h2>
              <button className="btn-icon" onClick={() => setSelectedInv(null)}>✕</button>
            </div>
            <div className="modal-body">
              {/* Header Details */}
              <div className="flex justify-between items-start mb-16 pb-16" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedInv.client}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Service: {selectedInv.service}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Date: {selectedInv.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-green)' }}>
                    ₹{selectedInv.total.toLocaleString()}
                  </div>
                  <span className={`badge badge-${selectedInv.status === 'paid' ? 'won' : 'proposal'}`}>
                    {selectedInv.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ background: 'var(--bg-glass)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
                <div className="flex justify-between text-xs mb-4">
                  <span>Net Service Fee:</span>
                  <span>₹{selectedInv.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs mb-4">
                  <span>Taxes / Surcharges:</span>
                  <span style={{ color: selectedInv.tax > 0 ? 'var(--text-primary)' : 'var(--accent-green)', fontWeight: 'bold' }}>
                    {selectedInv.tax > 0 ? `₹${selectedInv.tax.toLocaleString()} (18% Corporate GST)` : '₹0 (100% All-Inclusive • Sec 22 CGST Exempt)'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                  <span>Total Payable:</span>
                  <span style={{ color: 'var(--accent-green)', fontSize: '16px' }}>₹{selectedInv.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Integrated Payment Gateways */}
              <h4 className="font-bold mb-12">💳 Client Payment Methods</h4>
              <div className="flex gap-16 flex-wrap">
                {/* UPI Box */}
                <div className="glass-card flex-1" style={{ padding: '16px', minWidth: '240px', textAlign: 'center' }}>
                  <div className="font-bold text-xs mb-8" style={{ color: 'var(--accent-purple)' }}>
                    📱 INSTANT UPI PAYMENT (GPay, PhonePe, Paytm)
                  </div>

                  {paymentSettings.upi_id ? (
                    <>
                      <div style={{ background: '#ffffff', padding: '8px', display: 'inline-block', borderRadius: '8px', marginBottom: '10px' }}>
                        <img
                          src={getUpiQrUrl(selectedInv.total)}
                          alt="UPI QR Code"
                          style={{ width: '140px', height: '140px', display: 'block' }}
                        />
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                        {paymentSettings.upi_id}
                      </div>
                      <button className="btn btn-secondary btn-sm" onClick={copyUpiId}>
                        {copiedUpi ? '✅ Copied!' : '📋 Copy UPI ID'}
                      </button>
                    </>
                  ) : (
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', padding: '20px 0' }}>
                      Configure your UPI ID in Settings to display live QR code.
                    </div>
                  )}
                </div>

                {/* PayPal Box */}
                <div className="glass-card flex-1" style={{ padding: '16px', minWidth: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="font-bold text-xs mb-8" style={{ color: '#00d2ff' }}>
                    🌐 INTERNATIONAL PAYPAL GATEWAY
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Clients outside India can pay securely via PayPal account or credit card.
                  </p>
                  {paymentSettings.paypal_email ? (
                    <a
                      href={paymentSettings.paypal_email.startsWith('http') ? paymentSettings.paypal_email : `https://paypal.me/${paymentSettings.paypal_email}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ textAlign: 'center', justifyContent: 'center' }}
                    >
                      🚀 Pay via PayPal
                    </a>
                  ) : (
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      Configure PayPal details in Settings.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedInv.status !== 'paid' && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => markAsPaid(selectedInv.id)}
                >
                  ✓ Mark as Paid
                </button>
              )}
              <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
                📄 Print PDF Invoice
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedInv(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Generate New Client Invoice</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddInvoice}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Client Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Acme Corporation"
                    value={newInv.client}
                    onChange={e => setNewInv({ ...newInv, client: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Service Description</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Website Development & Logo Design"
                    value={newInv.service}
                    onChange={e => setNewInv({ ...newInv, service: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Amount (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    placeholder="e.g. 50000"
                    value={newInv.amount}
                    onChange={e => setNewInv({ ...newInv, amount: e.target.value })}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <input
                        type="checkbox"
                        checked={newInv.applyGst || false}
                        onChange={e => setNewInv({ ...newInv, applyGst: e.target.checked })}
                      />
                      <span>Add 18% Corporate GST (Optional for Corporate ITC claims)</span>
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--accent-green)', display: 'block', marginTop: '4px' }}>
                      {newInv.applyGst ? '18% GST added for corporate input credit' : '✅ 100% All-Inclusive Net Pricing (₹0 GST Surcharge • Sec 22 CGST Exempt)'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
