import React, { useState } from 'react';

export default function BankSettlementCommandStation({ onSettlementSuccess }) {
  const [inputText, setInputText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [selectedDealId, setSelectedDealId] = useState('');
  const [isSettling, setIsSettling] = useState(false);
  const [settlementResult, setSettlementResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWebhookGuide, setShowWebhookGuide] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const webhookUrl = `${window.location.origin}/api/settlement/sms-webhook`;

  const handleInputChange = (text) => {
    setInputText(text);
    setErrorMsg('');
    setSettlementResult(null);

    if (!text.trim()) {
      setParsedData(null);
      setSelectedDealId('');
      return;
    }

    setParsing(true);
    fetch('/api/settlement/parse-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
      .then(res => res.json())
      .then(data => {
        setParsing(false);
        if (data.success) {
          setParsedData(data);
          if (data.topMatch) {
            setSelectedDealId(data.topMatch.dealId);
          } else if (data.suggestedDeals?.length > 0) {
            setSelectedDealId(data.suggestedDeals[0].dealId);
          }
        }
      })
      .catch(() => {
        setParsing(false);
      });
  };

  const handleExecuteSettlement = () => {
    if (!parsedData || !parsedData.parsed) {
      setErrorMsg('Please paste a valid bank SMS or 12-digit UTR first.');
      return;
    }

    const { amount, utrNumber, bankName } = parsedData.parsed;
    if (!amount || !utrNumber) {
      setErrorMsg('Both valid Amount and 12-digit UTR are required.');
      return;
    }

    if (!selectedDealId) {
      setErrorMsg('Please select the matching pipeline deal to settle.');
      return;
    }

    setIsSettling(true);
    setErrorMsg('');

    fetch('/api/settlement/reconcile-and-close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealId: selectedDealId,
        amount,
        utrNumber,
        bankName: bankName || 'UPI Instant Bank Rail (9690973030@ibl)',
        notes: `Reconciled via Executive Bank Settlement Station by Vikas Singh`
      })
    })
      .then(res => res.json())
      .then(res => {
        setIsSettling(false);
        if (res.success) {
          setSettlementResult(res);
          setInputText('');
          setParsedData(null);
          if (onSettlementSuccess) onSettlementSuccess(res);
        } else {
          setErrorMsg(res.message || 'Settlement failed. Please verify deal ID.');
        }
      })
      .catch(err => {
        setIsSettling(false);
        setErrorMsg(err.message || 'Network error during bank reconciliation.');
      });
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #070d1e 0%, #030712 100%)',
      border: '2px solid rgba(16, 185, 129, 0.4)',
      borderRadius: '18px',
      padding: '20px 24px',
      marginBottom: '26px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.12)',
      position: 'relative'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#000',
            fontWeight: '900'
          }}>
            🏦
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                fontSize: '10.5px',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                SETTLEMENT STATION • REAL BANK CASH
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                UPI Rail: <strong style={{ color: '#fff' }}>9690973030@ibl</strong> (Vikas Singh)
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: '3px 0 0 0' }}>
              Instant Bank SMS & UTR Cash Settlement Station
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setShowWebhookGuide(!showWebhookGuide)}
            style={{
              background: showWebhookGuide ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>📲 Auto-Sync Webhook</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {isExpanded ? '▲ Collapse' : '▼ Quick Paste / Templates'}
          </button>
        </div>
      </div>

      {/* Android SMS Auto-Sync Webhook Guide */}
      {showWebhookGuide && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '16px',
          color: '#e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>⚡</span>
              <strong style={{ color: '#38bdf8', fontSize: '13px' }}>
                Zero-Click Automated Bank Settlement via Android Forwarder
              </strong>
            </div>
            <button
              onClick={() => setShowWebhookGuide(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 12px 0', lineHeight: '1.5' }}>
            Aapke phone par aane wale har bank SMS se deal automatically close ho sakti hai. Kisi bhi free Android SMS Forwarder app ko is webhook URL par configure kijiye:
          </p>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
            <input
              type="text"
              readOnly
              value={webhookUrl}
              style={{
                flex: 1,
                padding: '9px 12px',
                background: '#030712',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                color: '#38bdf8',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                setCopiedWebhook(true);
                setTimeout(() => setCopiedWebhook(false), 2000);
              }}
              style={{
                background: copiedWebhook ? '#10b981' : '#38bdf8',
                color: '#000',
                border: 'none',
                padding: '9px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {copiedWebhook ? '✓ Copied!' : '📋 Copy Webhook'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '11.5px', color: '#94a3b8' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
              <strong style={{ color: '#fff' }}>1. App Install Karein:</strong><br/>
              Google Play Store se "SMS Forwarder" ya "Webhook SMS" install karein.
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
              <strong style={{ color: '#fff' }}>2. Filter Rule Banayein:</strong><br/>
              Keywords: "credited", "UPI", "SBI", "HDFC", "ICICI".
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
              <strong style={{ color: '#fff' }}>3. Auto-Reconcile:</strong><br/>
              Client ke ₹2,500 ya ₹12,500 bhejte hi receipt auto-issue ho jayegi!
            </div>
          </div>
        </div>
      )}

      {/* Main Input & Action Row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '320px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste Bank Credit SMS or 12-digit UTR (e.g. 'A/C credited by Rs 12,500 on 07Nov via UPI 430198124567')..."
            style={{
              width: '100%',
              padding: '13px 16px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: parsedData?.parsed?.isComplete ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '13.5px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleExecuteSettlement}
          disabled={isSettling || !parsedData?.parsed?.isComplete}
          style={{
            background: parsedData?.parsed?.isComplete
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'rgba(255, 255, 255, 0.08)',
            color: parsedData?.parsed?.isComplete ? '#000' : '#64748b',
            border: 'none',
            padding: '13px 22px',
            borderRadius: '10px',
            fontWeight: '900',
            fontSize: '13px',
            cursor: parsedData?.parsed?.isComplete ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            boxShadow: parsedData?.parsed?.isComplete ? '0 4px 20px rgba(16, 185, 129, 0.35)' : 'none',
            whiteSpace: 'nowrap'
          }}
        >
          {isSettling ? '⏳ Reconciling...' : '✅ Settle Cash to Bank'}
        </button>
      </div>

      {/* Sample Quick-Test Templates (Collapsible) */}
      {isExpanded && (
        <div style={{
          marginTop: '12px',
          background: 'rgba(0,0,0,0.3)',
          padding: '10px 14px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Quick Test Templates:</span>
          <button
            type="button"
            onClick={() => handleInputChange('Dear Customer, your A/C ending with 9030 is credited with INR 12,500.00 on 07-NOV-26 by UPI/9690973030@ibl/Ref 430198124567 from Dr Anuja Singh Clinic')}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#38bdf8', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Dr. Anuja Clinic (₹12,500)
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('HDFC Bank: INR 22,500.00 deposited to A/c ... via UPI Ref No 529104829103 from Apex Luxury Realty Group')}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#38bdf8', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Apex Realty (₹22,500)
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('Received Rs 10,000 in your account from SmileCraft Dental Aesthetics via UPI 639102847192')}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#38bdf8', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
          >
            SmileCraft (₹10,000)
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('SBI User: A/C credited by Rs 2,500.00 on 07Nov26 by UPI/849102938471/Ref Rapid Pilot Token')}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#38bdf8', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Pilot Token (₹2,500)
          </button>
        </div>
      )}

      {/* Parsing Status / Error Alert */}
      {parsing && (
        <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '10px' }}>
          🔍 Telemetry AI analyzing bank SMS & extracting 12-digit UTR...
        </div>
      )}
      {errorMsg && (
        <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '10px' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Live Extracted Telemetry Card */}
      {parsedData && parsedData.parsed && (
        <div style={{
          marginTop: '16px',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1.5px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>⚡</span>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                  Extracted Bank Transaction
                </div>
                <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#34d399' }}>
                  {parsedData.parsed.amountFormatted || 'Amount Pending'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
              UTR: <strong style={{ color: '#fff', letterSpacing: '0.5px' }}>{parsedData.parsed.utrNumber || 'Not Found'}</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Rail: <strong style={{ color: '#fff' }}>{parsedData.parsed.bankName}</strong>
            </div>
          </div>

          {/* Target Deal Matcher Selector */}
          <div style={{ marginTop: '10px' }}>
            <label style={{ fontSize: '11.5px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              Select Pipeline Deal to Reconcile & Mark Won:
            </label>
            <select
              value={selectedDealId}
              onChange={(e) => setSelectedDealId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#030712',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="">-- Choose Matching Deal --</option>
              {parsedData.suggestedDeals?.map(d => (
                <option key={d.dealId} value={d.dealId}>
                  {d.company} — {d.title} (Value: ₹{d.value?.toLocaleString()} | Advance: ₹{d.expectedAdvance?.toLocaleString()}) [{d.matchReason}]
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Success Receipt Banner */}
      {settlementResult && settlementResult.receipt && (
        <div style={{
          marginTop: '16px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.3) 100%)',
          border: '2px solid #10b981',
          borderRadius: '12px',
          padding: '18px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🎉</span>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                  BANK SETTLEMENT RECONCILED & WON!
                </h4>
                <div style={{ fontSize: '11.5px', color: '#34d399' }}>
                  Receipt #{settlementResult.receipt.receiptNo} • Signed by Vikas Singh (Managing Principal)
                </div>
              </div>
            </div>

            <div style={{
              background: '#10b981',
              color: '#000',
              fontWeight: '900',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '13px'
            }}>
              +{settlementResult.receipt.amountFormatted} CASH IN BANK
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#e2e8f0', margin: '8px 0' }}>
            Client: <strong>{settlementResult.receipt.clientCompany}</strong> | UTR: <code>{settlementResult.receipt.utrNumber}</code> | Policy: Sec 22 CGST Exempt
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <a
              href={settlementResult.receipt.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#22c55e',
                color: '#000',
                padding: '8px 14px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              💬 Send Official Receipt via WhatsApp
            </a>

            <a
              href={settlementResult.receipt.portalUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                textDecoration: 'none'
              }}
            >
              🔗 View Live Client Portal
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
