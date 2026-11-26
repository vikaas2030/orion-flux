import React, { useState, useEffect } from 'react';
import VideoRenderEngine from '../components/VideoStudio/VideoRenderEngine';
import DeliverablesVault from '../components/Agency/DeliverablesVault';
import SopDirectives from '../components/Agency/SopDirectives';
import MultiModelIntelligence from '../components/Intelligence/MultiModelIntelligence';
import CustomerCallingAgent from '../components/VoiceStudio/CustomerCallingAgent';
import FreelanceMoneyMachine from '../components/Freelance/FreelanceMoneyMachine';
import AutoSendProposalsConsole from '../components/Autonomous/AutoSendProposalsConsole';
import ClientSatisfactionEngine from '../components/Satisfaction/ClientSatisfactionEngine';
import MultiStreamIncomeMatrix from '../components/Revenue/MultiStreamIncomeMatrix';

export default function AgencyOS() {
  const [agents, setAgents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [memory, setMemory] = useState({});
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [channels, setChannels] = useState({});

  const [activeTab, setActiveTab] = useState('agents'); // 'agents' | 'freelance' | 'calling' | 'intelligence' | 'video' | 'vault' | 'sops' | 'chat' | 'knowledge' | 'workflows' | 'integrations'
  const [deliverablesCount, setDeliverablesCount] = useState(7);
  const [vaultRefreshTrigger, setVaultRefreshTrigger] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState('solene_video');
  const [taskPrompt, setTaskPrompt] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  // System Order Broadcast State
  const [broadcastOrderText, setBroadcastOrderText] = useState('');
  const [broadcastTargetDept, setBroadcastTargetDept] = useState('all');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastReceipt, setBroadcastReceipt] = useState(null);

  const handleBroadcastOrder = (orderTextOverride) => {
    const textToDispatch = orderTextOverride || broadcastOrderText;
    if (!textToDispatch || !textToDispatch.trim()) return;

    setIsBroadcasting(true);
    setBroadcastReceipt(null);

    fetch('/api/agency/broadcast-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderCommand: textToDispatch,
        targetDepartment: broadcastTargetDept
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsBroadcasting(false);
        setBroadcastReceipt(data);
        setBroadcastOrderText('');
        fetchRoster();
      })
      .catch(() => setIsBroadcasting(false));
  };

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: '⚡ Hello! I am SOLENE, your Base44-grade Super Agent. Ask me anything, or instruct Solene Video AI to generate complete video production blueprints.' }
  ]);
  const [isChatting, setIsChatting] = useState(false);

  // Video AI Studio State
  const [videoTopic, setVideoTopic] = useState('How AI Automation Is Replacing Traditional 9-5 Agencies');
  const [videoFormat, setVideoFormat] = useState('YouTube Shorts (9:16)');
  const [videoStyle, setVideoStyle] = useState('Cinematic 4K Hyper-realistic');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoBlueprint, setVideoBlueprint] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // New Knowledge Doc State
  const [showKbModal, setShowKbModal] = useState(false);
  const [kbTitle, setKbTitle] = useState('');
  const [kbCategory, setKbCategory] = useState('pricing');
  const [kbContent, setKbContent] = useState('');

  const fetchRoster = () => {
    fetch('/api/agency/roster')
      .then(res => res.json())
      .then(data => {
        if (data.agents) setAgents(data.agents);
        if (data.logs) setLogs(data.logs);
        if (data.memory) setMemory(data.memory);
        if (data.knowledgeBase) setKnowledgeBase(data.knowledgeBase);
        if (data.integrations) setIntegrations(data.integrations);
        if (data.workflows) setWorkflows(data.workflows);
        if (data.channels) setChannels(data.channels);
      })
      .catch(() => {});

    fetch('/api/agency/deliverables')
      .then(res => res.json())
      .then(data => {
        if (data.deliverables) setDeliverablesCount(data.deliverables.length);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchRoster();
    const interval = setInterval(fetchRoster, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!taskPrompt) return;

    setIsDispatching(true);
    fetch('/api/agency/assign-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: selectedAgent, taskPrompt })
    })
      .then(res => res.json())
      .then(() => {
        setIsDispatching(false);
        setTaskPrompt('');
        fetchRoster();
      })
      .catch(() => setIsDispatching(false));
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatting(true);

    fetch('/api/agency/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg })
    })
      .then(res => res.json())
      .then(data => {
        setIsChatting(false);
        if (data.response) {
          setChatMessages(prev => [...prev, { role: 'assistant', text: data.response, agent: data.agentName }]);
        }
        fetchRoster();
      })
      .catch(() => setIsChatting(false));
  };

  const handleGenerateVideo = (e) => {
    e.preventDefault();
    if (!videoTopic) return;

    setIsGeneratingVideo(true);
    fetch('/api/agency/video-blueprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: videoTopic, format: videoFormat, style: videoStyle })
    })
      .then(res => res.json())
      .then(data => {
        setIsGeneratingVideo(false);
        if (data.blueprint) setVideoBlueprint(data.blueprint);
        fetchRoster();
      })
      .catch(() => setIsGeneratingVideo(false));
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleAddKb = (e) => {
    e.preventDefault();
    if (!kbTitle || !kbContent) return;

    fetch('/api/agency/knowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: kbTitle, category: kbCategory, content: kbContent })
    })
      .then(res => res.json())
      .then(() => {
        setShowKbModal(false);
        setKbTitle('');
        setKbContent('');
        fetchRoster();
      });
  };

  const superAgent = agents.find(a => a.id === 'solene_super') || {
    name: 'SOLENE ⚡ SUPER AGENT',
    role: 'Chief Agency Orchestrator',
    status: 'active'
  };
  const subagents = agents.filter(a => a.id !== 'solene_super');

  return (
    <div className="agency-os-page animate-in">
      {/* Solene Header Banner */}
      <div className="glass-card mb-24" style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
        borderLeft: '6px solid var(--accent-purple)'
      }}>
        <div className="flex items-center justify-between flex-wrap gap-16">
          <div className="flex items-center gap-16">
            <div style={{
              fontSize: '36px',
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)'
            }}>
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-8 flex-wrap">
                <h2 className="text-xl font-bold">{superAgent.name}</h2>
                <span className="badge badge-won">BASE44 SUPERAGENT ENGINE</span>
                <span className="badge badge-new">SOLENE VIDEO AGENT ONLINE 🎬</span>
              </div>
              <p className="text-sm text-tertiary mt-4">
                Chief Orchestrator supervising {subagents.length} specialized department subagents with persistent memory & Google Flow CineFlow AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-10 flex-wrap">
            <div style={{ background: 'var(--bg-glass)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
              🧠 Memory: <strong>{memory.totalInteractions || 0} interactions</strong>
            </div>
            <div style={{ background: 'var(--bg-glass)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
              🎬 Video Agent: <strong style={{ color: 'var(--accent-green)' }}>Active</strong>
            </div>
            <div style={{ background: 'var(--bg-glass)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
              ⚡ Workflows: <strong>{workflows.length} armed</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-8 mb-20 flex-wrap">
        <button
          className={`btn ${activeTab === 'agents' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('agents')}
        >
          🤖 Specialized Agents ({subagents.length})
        </button>
        <button
          className={`btn ${activeTab === 'autosend' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('autosend')}
          style={{ background: activeTab === 'autosend' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined, color: activeTab === 'autosend' ? '#000' : undefined, fontWeight: 'bold' }}
        >
          ⚡ Auto-Send Proposals Mode (14 Agents)
        </button>
        <button
          className={`btn ${activeTab === 'freelance' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('freelance')}
          style={{ background: activeTab === 'freelance' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : undefined, color: activeTab === 'freelance' ? '#000' : undefined, fontWeight: 'bold' }}
        >
          💸 Freelance Money Machine (Self-Evolving AI)
        </button>
        <button
          className={`btn ${activeTab === 'calling' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('calling')}
          style={{ background: activeTab === 'calling' ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' : undefined, color: activeTab === 'calling' ? '#000' : undefined, fontWeight: 'bold' }}
        >
          🎙️ VOX Calling Agent (Client Phone)
        </button>
        <button
          className={`btn ${activeTab === 'satisfaction' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('satisfaction')}
          style={{ background: activeTab === 'satisfaction' ? 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' : undefined, color: activeTab === 'satisfaction' ? '#fff' : undefined, fontWeight: 'bold' }}
        >
          🌟 Client Satisfaction (99.8% CSAT)
        </button>
        <button
          className={`btn ${activeTab === 'multistream' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('multistream')}
          style={{ background: activeTab === 'multistream' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : undefined, color: activeTab === 'multistream' ? '#000' : undefined, fontWeight: 'bold' }}
        >
          💰 Multi-Stream Income (5 Streams)
        </button>
        <button
          className={`btn ${activeTab === 'intelligence' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('intelligence')}
          style={{ background: activeTab === 'intelligence' ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' : undefined }}
        >
          🧠 Multi-Model Intelligence (Anthropic + Hermes)
        </button>
        <button
          className={`btn ${activeTab === 'video' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('video')}
          style={{ background: activeTab === 'video' ? 'var(--gradient-secondary)' : undefined }}
        >
          🎬 Solene Video Studio (Real Render)
        </button>
        <button
          className={`btn ${activeTab === 'vault' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('vault')}
          style={{ background: activeTab === 'vault' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined }}
        >
          📁 Agent Work Vault ({deliverablesCount})
        </button>
        <button
          className={`btn ${activeTab === 'sops' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('sops')}
          style={{ background: activeTab === 'sops' ? '#f59e0b' : undefined, color: activeTab === 'sops' ? '#000' : undefined }}
        >
          ⚖️ Professional SOPs
        </button>
        <button
          className={`btn ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Solene AI Chat
        </button>
        <button
          className={`btn ${activeTab === 'knowledge' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('knowledge')}
        >
          📚 Knowledge Base ({knowledgeBase.length})
        </button>
        <button
          className={`btn ${activeTab === 'workflows' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('workflows')}
        >
          ⏱️ Scheduled Workflows ({workflows.length})
        </button>
        <button
          className={`btn ${activeTab === 'integrations' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('integrations')}
        >
          🔌 Tool Connectors ({integrations.length})
        </button>
      </div>

      {/* TAB: Auto-Send Proposals Mode */}
      {activeTab === 'autosend' && (
        <div className="mb-24">
          <AutoSendProposalsConsole />
        </div>
      )}

      {/* TAB 1: Specialized Agents Roster */}
      {activeTab === 'agents' && (
        <>
          <AutoSendProposalsConsole />
          <div className="mb-24">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {subagents.map((agent) => (
                <div
                  key={agent.id}
                  className="glass-card"
                  style={{
                    padding: '20px',
                    borderTop: agent.id === 'solene_video' ? '3px solid #ec4899' : agent.status === 'working' ? '3px solid var(--accent-orange)' : '3px solid var(--accent-purple)',
                    background: agent.id === 'solene_video' ? 'rgba(236, 72, 153, 0.04)' : agent.status === 'working' ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-card)'
                  }}
                >
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-10">
                      <span style={{ fontSize: '26px' }}>{agent.avatar}</span>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>{agent.name}</h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{agent.department}</span>
                      </div>
                    </div>
                    <span className={`badge badge-${agent.status === 'working' ? 'proposal' : agent.status === 'completed' ? 'won' : 'new'}`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '12px', minHeight: '34px' }}>
                    {agent.role}
                  </p>

                  {/* Capabilities Tags */}
                  <div className="flex flex-wrap gap-4 mb-12">
                    {agent.capabilities && agent.capabilities.slice(0, 3).map((cap, i) => (
                      <span key={i} style={{ fontSize: '10px', background: 'var(--bg-glass)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-tertiary)' }}>
                        {cap}
                      </span>
                    ))}
                  </div>

                  <div style={{
                    background: 'var(--bg-glass)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11.5px',
                    color: 'var(--text-tertiary)',
                    marginBottom: '12px'
                  }}>
                    📌 {agent.currentTask}
                  </div>

                  <div className="flex justify-between items-center text-xs text-tertiary">
                    <span>Tasks: <strong>{agent.tasksCompleted}</strong></span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        if (agent.id === 'solene_video') {
                          setActiveTab('video');
                        } else {
                          setSelectedAgent(agent.id);
                          setActiveTab('chat');
                        }
                      }}
                    >
                      {agent.id === 'solene_video' ? '🎬 Open Studio' : 'Assign Task'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ⚡ SYSTEM COMMAND & EXECUTIVE ORDER CENTER */}
          <div className="glass-card mb-24 animate-in" style={{
            padding: '26px',
            borderLeft: '5px solid #8b5cf6',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)'
          }}>
            <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
              <div className="flex items-center gap-12">
                <div style={{
                  fontSize: '28px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: '1px solid #8b5cf6'
                }}>
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-8">
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f1f5f9' }}>
                      System-Wide Order Command Center (14 Agents)
                    </h3>
                    <span className="badge badge-won" style={{ background: '#8b5cf6', color: '#fff', fontWeight: 'bold' }}>
                      100% STRICT SOP COMPLIANCE
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Issue executive system orders to all 14 specialized agents or specific departments. Agents execute synchronously according to system directives.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Preset Order Pills */}
            <div className="mb-16">
              <label style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                ⚡ Quick System Order Presets (1-Click Broadcast):
              </label>
              <div className="flex gap-8 flex-wrap">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11.5px', border: '1px solid #10b981', color: '#34d399' }}
                  onClick={() => {
                    handleBroadcastOrder('FULL REVENUE SURGE: Scrape 50 B2B leads, generate 1080p CineFlow sample video, audit local SEO, and auto-dispatch proposals with 50% advance UPI invoices.');
                  }}
                >
                  🚀 [Preset 1: Full Client Acquisition Surge]
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11.5px', border: '1px solid #f59e0b', color: '#fbbf24' }}
                  onClick={() => {
                    handleBroadcastOrder('D2C E-COMMERCE OVERHAUL: ShopVanguard optimize store checkout CRO, AdVance launch 4.8x ROAS ads, and OmniBot activate WhatsApp cart recovery.');
                  }}
                >
                  🛍️ [Preset 2: D2C Commerce & Paid Ads Blitz]
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11.5px', border: '1px solid #ec4899', color: '#f472b6' }}
                  onClick={() => {
                    handleBroadcastOrder('LEGAL SHIELD & ADVANCE ENFORCEMENT: Enforce ironclad Master Service Agreements and non-negotiable 50% UPI advance deposits on all prospective clients.');
                  }}
                >
                  ⚖️ [Preset 3: Ironclad Legal Shield & 50% Advance]
                </button>
              </div>
            </div>

            {/* Custom Broadcast Order Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleBroadcastOrder(); }} className="mb-16">
              <div className="form-row mb-12">
                <div className="form-group" style={{ minWidth: '220px' }}>
                  <label className="form-label">Target Department</label>
                  <select
                    className="form-select"
                    value={broadcastTargetDept}
                    onChange={e => setBroadcastTargetDept(e.target.value)}
                  >
                    <option value="all">🌐 ALL 14 SPECIALIZED AGENTS (Global Broadcast)</option>
                    <option value="Sales">🔍 Sales & Prospecting (Atlas, Apex, VOX)</option>
                    <option value="Creative">🎨 Creative & Media (Solene Video, PixelCraft, Nova)</option>
                    <option value="Development">💻 Tech & Automation (Cyber Dev, OmniBot, Orion SEO)</option>
                    <option value="Accounting">💰 Finance & Legal (Ledger, Sentinel Legal, ShopVanguard)</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">System Order Directive *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter system order directive to broadcast across all specialized agents..."
                    value={broadcastOrderText}
                    onChange={e => setBroadcastOrderText(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isBroadcasting || !broadcastOrderText.trim()}
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', color: '#fff', fontWeight: 'bold' }}
              >
                {isBroadcasting ? '⚡ Broadcasting System Order...' : '🚀 Issue Executive System Order to Agents'}
              </button>
            </form>

            {/* Broadcast Receipt & Execution Feedback */}
            {broadcastReceipt && (
              <div className="glass-card p-16 animate-in" style={{ background: '#070712', border: '1px solid #8b5cf6' }}>
                <div className="flex justify-between items-center mb-12 flex-wrap gap-8">
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#a78bfa' }}>
                    ✅ SYSTEM ORDER ACKNOWLEDGED ({broadcastReceipt.totalAgentsExecuting} Agents Executing)
                  </span>
                  <span className="badge badge-won" style={{ background: '#10b981', color: '#000', fontSize: '11px' }}>
                    100% SOP COMPLIANCE CONFIRMED
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                  <strong>Directive:</strong> "{broadcastReceipt.order}"
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                  {broadcastReceipt.executionLog?.map(item => (
                    <div key={item.agentId} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #10b981', fontSize: '11.5px' }}>
                      <div className="flex justify-between items-center mb-4">
                        <strong>{item.avatar} {item.agentName}</strong>
                        <span style={{ color: '#10b981', fontSize: '10px' }}>{item.status}</span>
                      </div>
                      <div style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>{item.acknowledgement}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Task Assignment Form */}
          <div className="glass-card mb-24" style={{ padding: '24px' }}>
            <h3 className="font-bold mb-16 flex items-center gap-8">
              🎯 Dispatch Task to Specialized Subagent
            </h3>
            <form onSubmit={handleAssignTask}>
              <div className="form-row mb-16">
                <div className="form-group" style={{ minWidth: '260px' }}>
                  <label className="form-label">Select Subagent</label>
                  <select
                    className="form-select"
                    value={selectedAgent}
                    onChange={e => setSelectedAgent(e.target.value)}
                  >
                    {subagents.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.avatar} {a.name} — {a.department} ({a.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">Task Description / Prompt *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Scrape 15 IT firms in Delhi OR Draft YouTube Shorts script with camera direction"
                    required
                    value={taskPrompt}
                    onChange={e => setTaskPrompt(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isDispatching}
              >
                {isDispatching ? '⚡ Dispatching Task...' : '🚀 Dispatch Task to Agent'}
              </button>
            </form>
          </div>
        </>
      )}

      {/* TAB: Freelance Money Machine & Self-Evolver */}
      {activeTab === 'freelance' && <FreelanceMoneyMachine />}

      {/* TAB: VOX Customer Calling & Handling Agent */}
      {activeTab === 'calling' && <CustomerCallingAgent />}

      {/* TAB: World-Class Client Satisfaction Engine */}
      {activeTab === 'satisfaction' && <ClientSatisfactionEngine />}

      {/* TAB: Multi-Stream Revenue Diversification Matrix */}
      {activeTab === 'multistream' && <MultiStreamIncomeMatrix />}

      {/* TAB: Multi-Model Intelligence Core (Anthropic + Hermes + DeepSeek) */}
      {activeTab === 'intelligence' && (
        <MultiModelIntelligence
          onDeliverableGenerated={() => {
            setVaultRefreshTrigger(prev => prev + 1);
            fetchRoster();
          }}
        />
      )}

      {/* TAB 2: Solene Video AI Studio (CineFlow Director) */}
      {activeTab === 'video' && (
        <div className="glass-card mb-24" style={{ padding: '24px', borderLeft: '4px solid #ec4899' }}>
          <div className="flex items-center justify-between flex-wrap gap-12 mb-16">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-8">
                🎬 Solene CineFlow AI — Autonomous Video Director
                <span className="badge badge-won">GOOGLE FLOW / VEO READY</span>
              </h3>
              <p className="text-sm text-tertiary mt-4">
                Generates complete 4-Scene cinematic video packages with Google Flow / Veo prompts, camera angles, voiceover, SFX cues & YouTube viral thumbnail concepts.
              </p>
            </div>
            <div className="badge badge-new" style={{ fontSize: '11px', padding: '6px 12px' }}>
              🎥 4K Cinematic Engine Active
            </div>
          </div>

          {/* Video Generator Form */}
          <form onSubmit={handleGenerateVideo} className="mb-24" style={{ background: 'var(--bg-glass)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <div className="form-row mb-16">
              <div className="form-group flex-1">
                <label className="form-label">Video Topic or Concept *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. 5 AI Agents Every Business Must Hire in 2026"
                  value={videoTopic}
                  onChange={e => setVideoTopic(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ minWidth: '220px' }}>
                <label className="form-label">Format / Platform</label>
                <select className="form-select" value={videoFormat} onChange={e => setVideoFormat(e.target.value)}>
                  <option value="YouTube Shorts (9:16)">📱 YouTube Shorts (9:16)</option>
                  <option value="Instagram Reel / TikTok (9:16)">📸 Instagram Reel (9:16)</option>
                  <option value="YouTube Long-form (16:9)">🎬 YouTube Long-form 16:9</option>
                  <option value="Cinematic Commercial (21:9)">🎥 Widescreen Ad (21:9)</option>
                </select>
              </div>
              <div className="form-group" style={{ minWidth: '240px' }}>
                <label className="form-label">Visual Aesthetic</label>
                <select className="form-select" value={videoStyle} onChange={e => setVideoStyle(e.target.value)}>
                  <option value="Cinematic 4K Hyper-realistic">✨ Cinematic 4K Photorealistic</option>
                  <option value="Cyberpunk Futuristic Neon">🌃 Cyberpunk Dark Neon</option>
                  <option value="Apple-Style Minimalist Studio">🍎 Minimalist Clean Tech</option>
                  <option value="Dramatic High-Contrast Thriller">⚡ High-Contrast Dramatic</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isGeneratingVideo}
              style={{ background: 'var(--gradient-secondary)' }}
            >
              {isGeneratingVideo ? '⚡ Solene Video AI Is Generating Blueprint...' : '🚀 Generate Complete Video Blueprint'}
            </button>
          </form>

          {/* Real In-Browser Video Render & Player Engine */}
          <VideoRenderEngine
            blueprint={videoBlueprint || {
              title: videoTopic,
              format: videoFormat,
              viralHook: `Stop scrolling if you want to scale with AI using ${videoTopic}...`,
              scenes: [
                { sceneNumber: 1, timing: '0:00 - 0:08', visualType: 'Hook & Problem', voiceover: `Most agencies work 14 hours a day. AI Super Agents completely change the game for ${videoTopic}.` },
                { sceneNumber: 2, timing: '0:08 - 0:20', visualType: 'System Breakdown', voiceover: 'Our autonomous pipeline scrapes, qualifies, and enriches high-ticket prospects while you sleep.' },
                { sceneNumber: 3, timing: '0:20 - 0:35', visualType: 'Results & Revenue Proof', voiceover: 'Proposals generate in 15 seconds. Deals close faster with verified 100% quality delivery.' },
                { sceneNumber: 4, timing: '0:35 - 0:45', visualType: 'Call to Action', voiceover: 'Deploy your autonomous agency today with ORION FLUX. Download your project now.' }
              ]
            }}
            onSaveToVault={() => {
              setVaultRefreshTrigger(prev => prev + 1);
              fetchRoster();
            }}
          />

          {/* Generated Video Blueprint Presentation */}
          {videoBlueprint && (
            <div className="animate-in" style={{ marginTop: '24px' }}>
              <div className="glass-card mb-20" style={{ padding: '20px', background: 'rgba(236, 72, 153, 0.06)' }}>
                <div className="flex justify-between items-center mb-8 flex-wrap gap-12">
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>{videoBlueprint.title}</h4>
                  <div className="flex gap-8">
                    <span className="badge badge-proposal">{videoBlueprint.format}</span>
                    <span className="badge badge-new">{videoBlueprint.estimatedDuration}</span>
                  </div>
                </div>
                <div style={{ background: '#0a0a14', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    🔥 Viral Opening Hook (First 3 Seconds)
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#facc15' }}>
                    "{videoBlueprint.viralHook}"
                  </div>
                </div>
              </div>

              {/* Scene by Scene Grid */}
              <h4 className="font-bold mb-16">🎬 Scene-by-Scene Visual Storyboard & Google Flow / Veo Prompts</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {videoBlueprint.scenes.map((scene) => (
                  <div key={scene.sceneNumber} className="glass-card" style={{ padding: '18px', borderTop: '3px solid var(--accent-purple)' }}>
                    <div className="flex justify-between items-center mb-10">
                      <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--accent-purple)' }}>
                        Scene {scene.sceneNumber}: {scene.visualType}
                      </span>
                      <span className="badge badge-new" style={{ fontSize: '10px' }}>{scene.timing}</span>
                    </div>

                    {/* Camera Direction */}
                    <div style={{ fontSize: '12px', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                      🎥 <strong>Camera Movement:</strong> {scene.cameraMovement}
                    </div>

                    {/* Veo / Flow Prompt */}
                    <div style={{ background: '#07070b', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '10px' }}>
                      <div className="flex justify-between items-center mb-4">
                        <span style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 'bold' }}>
                          ⚡ GOOGLE FLOW / VEO PROMPT
                        </span>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ width: '24px', height: '24px', fontSize: '11px' }}
                          title="Copy Veo Prompt"
                          onClick={() => copyToClipboard(scene.veoPrompt, `veo-${scene.sceneNumber}`)}
                        >
                          {copiedKey === `veo-${scene.sceneNumber}` ? '✓' : '📋'}
                        </button>
                      </div>
                      <p style={{ fontSize: '11.5px', color: 'var(--text-primary)', fontFamily: 'monospace', lineHeight: '1.4' }}>
                        {scene.veoPrompt}
                      </p>
                    </div>

                    {/* Voiceover Script */}
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      🎙️ <strong>Voiceover Script:</strong> "{scene.voiceover}"
                    </div>

                    {/* Sound Effect Cue */}
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      🔊 <strong>SFX / Audio:</strong> {scene.sfxCue}
                    </div>
                  </div>
                ))}
              </div>

              {/* YouTube Thumbnail & Tags */}
              <div className="glass-card" style={{ padding: '20px', background: 'var(--bg-card)' }}>
                <h4 className="font-bold mb-12">🖼️ Viral YouTube Thumbnail Prompt & SEO Tags</h4>
                <div style={{ background: '#07070b', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '12px' }}>
                  <div className="flex justify-between items-center mb-4">
                    <span style={{ fontSize: '11px', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
                      THUMBNAIL CREATIVE PROMPT (Midjourney / Imagen / DALL-E)
                    </span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => copyToClipboard(videoBlueprint.thumbnailPrompt, 'thumb')}
                    >
                      {copiedKey === 'thumb' ? '✅ Copied!' : '📋 Copy Thumbnail Prompt'}
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {videoBlueprint.thumbnailPrompt}
                  </p>
                </div>

                <div className="flex items-center gap-8 flex-wrap">
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Recommended SEO Tags:</span>
                  {videoBlueprint.seoTags.map((tag, idx) => (
                    <span key={idx} className="badge badge-proposal" style={{ fontSize: '11px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Agent Work Vault & Deliverables Hub */}
      {activeTab === 'vault' && (
        <DeliverablesVault onRefreshTrigger={vaultRefreshTrigger} />
      )}

      {/* TAB: Professional SOP Directives */}
      {activeTab === 'sops' && (
        <SopDirectives />
      )}

      {/* TAB 3: Solene Conversational AI Chat */}
      {activeTab === 'chat' && (
        <div className="glass-card mb-24" style={{ padding: '24px' }}>
          <h3 className="font-bold mb-16 flex items-center gap-8">
            💬 Solene Natural Language Command Center
          </h3>
          <p className="text-sm text-tertiary mb-16">
            Speak directly with Solene. Solene interprets requirements, accesses the Knowledge Base, remembers past interactions, and routes commands to the right specialized agents (including Solene Video AI).
          </p>

          <div style={{
            background: '#07070b',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            minHeight: '280px',
            maxHeight: '360px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '16px'
          }}>
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: msg.role === 'user' ? 'var(--gradient-accent)' : 'var(--bg-secondary)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '13px'
                }}
              >
                {msg.agent && <div style={{ fontSize: '10px', opacity: 0.75, marginBottom: '2px' }}>{msg.agent}</div>}
                {msg.text}
              </div>
            ))}
            {isChatting && (
              <div style={{ alignSelf: 'flex-start', color: 'var(--text-tertiary)', fontSize: '12px' }}>
                ⚡ Solene is analyzing & routing...
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-12">
            <input
              type="text"
              className="form-input flex-1"
              placeholder="e.g. Generate a YouTube Shorts video concept for my AI agency, or find 10 clients"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={isChatting}>
              Send Command
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Knowledge Base */}
      {activeTab === 'knowledge' && (
        <div className="glass-card mb-24" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center mb-16">
            <div>
              <h3 className="font-bold">📚 Context-Aware Knowledge Base</h3>
              <p className="text-sm text-tertiary">Reference materials Solene uses to answer questions, calculate pricing, and draft proposals</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowKbModal(true)}>
              + Add Document
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {knowledgeBase.map((doc) => (
              <div key={doc.id} className="glass-card" style={{ padding: '16px' }}>
                <div className="flex justify-between items-center mb-8">
                  <h4 style={{ fontWeight: 'bold', fontSize: '14px' }}>{doc.title}</h4>
                  <span className="badge badge-new" style={{ fontSize: '10px' }}>{doc.category}</span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {doc.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Scheduled Workflows */}
      {activeTab === 'workflows' && (
        <div className="glass-card mb-24" style={{ padding: '24px' }}>
          <h3 className="font-bold mb-8">⏱️ Solene Autonomous Scheduled Workflows</h3>
          <p className="text-sm text-tertiary mb-16">Recurring automations running on schedules or triggered by agency events</p>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Workflow Name</th>
                  <th>Assigned Agent</th>
                  <th>Schedule / Trigger</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map((wf) => (
                  <tr key={wf.id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{wf.name}</td>
                    <td>{wf.agent}</td>
                    <td><span className="badge badge-proposal">{wf.schedule}</span></td>
                    <td><span className="badge badge-won">{wf.status.toUpperCase()}</span></td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{wf.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: Tool Connectors */}
      {activeTab === 'integrations' && (
        <div className="glass-card mb-24" style={{ padding: '24px' }}>
          <h3 className="font-bold mb-8">🔌 Solene Tool Connectors & Integrations</h3>
          <p className="text-sm text-tertiary mb-16">Connect external services for messaging, email outreach, storage, and payment collection</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {integrations.map((tool) => (
              <div key={tool.id} className="glass-card" style={{ padding: '16px' }}>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-8">
                    <span style={{ fontSize: '22px' }}>{tool.icon}</span>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '13.5px' }}>{tool.name}</h4>
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{tool.category}</span>
                    </div>
                  </div>
                  <span className={`badge ${tool.status === 'ready' ? 'badge-won' : 'badge-lost'}`}>
                    {tool.status === 'ready' ? 'READY' : 'CONFIGURABLE'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Multi-Agent Log Stream */}
      <div className="glass-card mb-24" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
        <h3 className="font-bold mb-16 flex items-center gap-8">
          💻 Solene Real-Time Multi-Agent Live Execution Stream
        </h3>
        <div style={{
          background: '#07070b',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          fontFamily: 'monospace',
          fontSize: '12.5px',
          maxHeight: '320px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {logs.map((log) => (
            <div key={log.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '11px', whiteSpace: 'nowrap' }}>
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span style={{ color: '#a78bfa', fontWeight: 'bold', minWidth: '150px', fontSize: '11px' }}>
                [{log.agentName}]
              </span>
              <span style={{ color: log.status === 'success' ? '#34d399' : 'var(--text-primary)', flex: 1 }}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Knowledge Base Modal */}
      {showKbModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Document to Knowledge Base</h2>
              <button className="btn-icon" onClick={() => setShowKbModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddKb}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Document Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Website Pricing Package 2026"
                    value={kbTitle}
                    onChange={e => setKbTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={kbCategory}
                    onChange={e => setKbCategory(e.target.value)}
                  >
                    <option value="pricing">Pricing & Packages</option>
                    <option value="policy">Terms & Company Policies</option>
                    <option value="services">Service Catalog</option>
                    <option value="scripts">Sales Scripts & Pitches</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Document Content *</label>
                  <textarea
                    className="form-textarea"
                    rows="5"
                    required
                    placeholder="Enter details, price points, scope, or terms..."
                    value={kbContent}
                    onChange={e => setKbContent(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowKbModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save to Knowledge Base</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
