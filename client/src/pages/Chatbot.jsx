import React, { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Greetings. I am the ORION FLUX Executive Client Concierge. I am programmed to handle prospect inquiries, provide technical architecture breakdowns, enforce Master Service Agreements, and coordinate 50% advance settlements. How may I assist your enterprise today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    '🤝 How do we finalize our deal agreement?',
    '💳 What is your 50% advance payment policy?',
    '⚡ Explain your 2-Hour Rapid Revision SLA',
    '🌐 Where do I track project milestones?'
  ];

  const processResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('finalize') || q.includes('deal') || q.includes('agreement') || q.includes('contract') || q.includes('msa')) {
      return 'To finalize your deal, our executive engine generates an official Master Services Agreement (MSA) and Statement of Work (SOW). We require a 50% mobilization advance via direct UPI or bank transfer. Once confirmed, our 14 autonomous agents deploy immediately and your private VIP Portal (/portal) is activated.';
    }
    if (q.includes('advance') || q.includes('payment') || q.includes('upi') || q.includes('bank') || q.includes('invoice')) {
      return 'Our standard payment structure follows enterprise best practices: 50% mobilization deposit prior to sprint commencement, and 50% final balance upon 100% Quality Assurance clearance. All payments settle directly to our verified bank UPI rail with 0% intermediary platform cuts.';
    }
    if (q.includes('sla') || q.includes('revision') || q.includes('guarantee') || q.includes('quality') || q.includes('warranty')) {
      return 'Every engagement is backed by our Ironclad 4-Tier SLA: 100% Bug-Free Quality Assurance clearance, guaranteed 2-Hour Rapid Revision turnaround, and complete IP and source code ownership transfer upon project sign-off.';
    }
    if (q.includes('portal') || q.includes('track') || q.includes('milestone') || q.includes('deliverable')) {
      return 'You can track real-time milestone progress, inspect deliverables, review audit reports, and download production assets 24/7 inside your dedicated VIP Client Portal at /portal.';
    }
    if (q.includes('price') || q.includes('rate') || q.includes('cost') || q.includes('budget')) {
      return 'Our enterprise automation packages range from ₹75,000 for autonomous CRM & Lead Follow-up rails, ₹1,25,000 for custom multi-agent workflow systems, up to ₹3,50,000 for full-stack AI platforms with video production engines.';
    }
    return `Thank you for your inquiry regarding "${query}". Our team of 14 specialized autonomous agents has logged this request. To review formal project terms or initiate deployment, please explore our Sales Pipeline Closer or connect via direct WhatsApp.`;
  };

  const handleSendText = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const replyText = processResponse(textToSend);
      setMessages(prev => [...prev, { sender: 'bot', text: replyText }]);
      setIsTyping(false);
    }, 700);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const current = input;
    setInput('');
    handleSendText(current);
  };

  return (
    <div className="chatbot-page animate-in">
      <div className="mb-20">
        <h2 className="text-xl font-bold flex items-center gap-8">
          <span>🤖</span> 24/7 Executive AI Client Assistant & Query Closer
        </h2>
        <p className="text-sm text-tertiary">Handles prospect questions with peak enterprise diplomacy, explains SLAs, and closes sales</p>
      </div>

      <div className="glass-card flex flex-col" style={{ height: '560px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="font-bold flex items-center gap-8" style={{ fontSize: '15px' }}>
            <span>⚡</span> ORION FLUX Conversational Executive Engine
          </h3>
          <span className="badge badge-won" style={{ fontSize: '10px' }}>🟢 SOLENE CONCIERGE ONLINE</span>
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{ padding: '10px 20px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', whiteSpace: 'nowrap', padding: '4px 10px' }}
              onClick={() => handleSendText(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                background: m.sender === 'user' ? 'var(--gradient-accent)' : 'var(--bg-glass)',
                border: m.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                color: 'white',
                fontSize: '13.5px',
                lineHeight: '1.5'
              }}
            >
              {m.text}
            </div>
          ))}
          {isTyping && (
            <div style={{ alignSelf: 'flex-start', color: 'var(--accent-purple)', fontSize: '12px', fontStyle: 'italic' }}>
              🤖 Solene Concierge is formulating an executive response...
            </div>
          )}
        </div>

        <form onSubmit={handleSend} style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)' }} className="flex gap-12">
          <input
            type="text"
            className="form-input flex-1"
            placeholder="Type a client inquiry (e.g., How do we finalize the deal? What is your payment structure?)..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Send Msg</button>
        </form>
      </div>
    </div>
  );
}
