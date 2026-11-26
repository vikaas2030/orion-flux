import React, { useState, useEffect } from 'react';

export default function ViralPromotionCockpit() {
  const [campaigns, setCampaigns] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reels');
  const [actionMsg, setActionMsg] = useState('');
  const [launchingWave, setLaunchingWave] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchCampaignData = async () => {
    try {
      const [cRes, tRes] = await Promise.all([
        fetch('/api/viral-promo/campaigns'),
        fetch('/api/viral-promo/telemetry')
      ]);
      const cData = await cRes.json();
      const tData = await tRes.json();

      if (cData.success) setCampaigns(cData);
      if (tData.success) setTelemetry(tData);
    } catch (err) {
      console.error('Failed to load viral promotion data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
    const interval = setInterval(fetchCampaignData, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleLaunchEmailWave = async () => {
    setLaunchingWave(true);
    setActionMsg('⚡ Dispatching Autonomous Promotion Wave (3 Tracked Emails via Google SMTP)...');

    try {
      const res = await fetch('/api/viral-promo/launch-wave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize: 3 })
      });
      const d = await res.json();
      if (d.success) {
        setActionMsg(`🎉 Wave Complete! Dispatched: ${d.dispatchedCount} tracked plain-text emails via vikaas2030@gmail.com.`);
        fetchCampaignData();
      } else {
        setActionMsg(`⚠️ Notice: ${d.message || 'Check logs'}`);
      }
    } catch (err) {
      setActionMsg(`❌ Dispatch Error: ${err.message}`);
    } finally {
      setLaunchingWave(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mb-2"></div>
        <p>Loading Autonomous Global Promotion Engine...</p>
      </div>
    );
  }

  const storeUrl = campaigns?.storeUrl || 'https://03de397fc0965b.app.lhr.life/store';

  return (
    <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative space-y-6">
      {/* Decorative Aura */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black">
              24/7 Global CMO
            </span>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Multi-Channel Promotion Matrix
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1 flex items-center gap-2">
            🚀 Autonomous Promotion & Marketing Deployment Station
          </h2>
          <p className="text-xs text-slate-400">
            System actively publishes itself, broadcasts viral hooks, teleprompts video reels, and dispatches automated outreach waves.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLaunchEmailWave}
            disabled={launchingWave}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {launchingWave ? 'Dispatching...' : '⚡ Launch Outreach Wave (3 Emails)'}
          </button>
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
          >
            🛒 Live Store ↗
          </a>
        </div>
      </div>

      {/* Action Notification */}
      {actionMsg && (
        <div className="p-3 bg-cyan-950/70 border border-cyan-500/40 rounded-lg text-xs text-cyan-200 flex items-center justify-between animate-fadeIn">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Verified Leads in Queue</div>
          <div className="text-xl font-black text-white mt-0.5">
            {telemetry?.totalVerifiedLeads || 119}
          </div>
          <div className="text-[10px] text-slate-500">Ready for outreach wave</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Tracked Outreach Sent</div>
          <div className="text-xl font-black text-cyan-400 mt-0.5">
            {telemetry?.totalPromotionalEmailsDispatched || 0}
          </div>
          <div className="text-[10px] text-slate-500">via vikaas2030@gmail.com</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Verified Email Opens</div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">
            {telemetry?.totalVerifiedOpens || 0}
          </div>
          <div className="text-[10px] text-slate-500">Captured by 1x1 radar</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Marketing Channels</div>
          <div className="text-xl font-black text-amber-400 mt-0.5">
            6 Rails Active
          </div>
          <div className="text-[10px] text-slate-500">Reels, X, LinkedIn, Reddit, WA, SMTP</div>
        </div>
      </div>

      {/* Campaign Tabs */}
      <div className="flex flex-wrap border-b border-slate-800 gap-2 pb-3">
        <button
          onClick={() => setActiveTab('reels')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'reels'
              ? 'bg-cyan-500 text-black shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🎬 Video Reels / Shorts Studio
        </button>

        <button
          onClick={() => setActiveTab('linkedin')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'linkedin'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          💼 LinkedIn B2B Post
        </button>

        <button
          onClick={() => setActiveTab('twitter')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'twitter'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          𝕏 Twitter/X Mega-Thread
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          💬 WhatsApp Broadcast & Status
        </button>

        <button
          onClick={() => setActiveTab('reddit')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'reddit'
              ? 'bg-orange-600 text-white shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          👾 Reddit Showcase
        </button>
      </div>

      {/* Tab 1: Video Reels Studio */}
      {activeTab === 'reels' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-3.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-cyan-300 uppercase">Shoot & Post in 60 Seconds</div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Record directly on phone camera or CapCut. Place your store link in bio: <strong className="text-cyan-200">{storeUrl}</strong>
              </div>
            </div>
            <span className="text-[10px] bg-cyan-900/60 text-cyan-200 px-2 py-1 rounded font-mono font-bold">
              3 High-Viral Blueprints
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {campaigns?.videoReelsScripts?.map((reel, idx) => (
              <div key={reel.id} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">Script #{idx + 1}</span>
                    <span className="text-[10px] text-slate-400">{reel.estimatedDuration}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">{reel.title}</h4>

                  <div className="mt-2 p-2 bg-slate-900/80 rounded border border-slate-800 text-[10px] text-amber-300 font-semibold">
                    🔥 Hook: "{reel.hookText}"
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400 italic">
                    👁️ Visual: {reel.visualNotes}
                  </div>

                  <div className="mt-2.5 p-2.5 bg-slate-950 border border-slate-800/80 rounded text-[11px] font-mono text-slate-300 whitespace-pre-line line-clamp-6">
                    {reel.script}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/40">
                  <button
                    onClick={() => handleCopy(reel.script, reel.id)}
                    className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded text-xs transition-all shadow"
                  >
                    {copiedId === reel.id ? '✓ Script Copied to Clipboard!' : '📋 Copy Teleprompter Script'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: LinkedIn B2B Post */}
      {activeTab === 'linkedin' && (
        <div className="space-y-4 animate-fadeIn">
          {campaigns?.linkedInCampaigns?.map((li) => (
            <div key={li.id} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{li.title}</h4>
                <span className="text-[10px] bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded">
                  B2B Decision Makers
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 whitespace-pre-line">
                {li.fullText}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={li.intentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-all shadow"
                >
                  💼 1-Click Share on LinkedIn ↗
                </a>
                <button
                  onClick={() => handleCopy(li.fullText, li.id)}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs"
                >
                  {copiedId === li.id ? '✓ Copied' : 'Copy Text'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Twitter/X Mega-Thread */}
      {activeTab === 'twitter' && (
        <div className="space-y-4 animate-fadeIn">
          {campaigns?.twitterCampaigns?.map((tw) => (
            <div key={tw.id} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{tw.title}</h4>
                <span className="text-[10px] bg-indigo-900/60 text-indigo-200 px-2 py-0.5 rounded">
                  Tech & Startup Founders
                </span>
              </div>

              <div className="space-y-2">
                {[tw.tweet1, tw.tweet2, tw.tweet3, tw.tweet4, tw.tweet5].map((t, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded p-2.5 text-xs font-mono text-slate-300">
                    {t}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={tw.intentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-all shadow"
                >
                  𝕏 1-Click Tweet Thread ↗
                </a>
                <button
                  onClick={() => handleCopy(`${tw.tweet1}\n\n${tw.tweet2}\n\n${tw.tweet3}\n\n${tw.tweet4}\n\n${tw.tweet5}`, tw.id)}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs"
                >
                  {copiedId === tw.id ? '✓ Copied All Tweets' : 'Copy All Tweets'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: WhatsApp Broadcast & Status */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">{campaigns?.whatsappStatusBroadcast?.title}</h4>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded">
                Indian B2B & Personal Network
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 whitespace-pre-line">
              {campaigns?.whatsappStatusBroadcast?.statusText}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={campaigns?.whatsappStatusBroadcast?.intentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-all shadow"
              >
                💬 1-Click Open in WhatsApp Web ↗
              </a>
              <button
                onClick={() => handleCopy(campaigns?.whatsappStatusBroadcast?.statusText, 'wa_status')}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs"
              >
                {copiedId === 'wa_status' ? '✓ Copied' : 'Copy Text'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Reddit Showcase */}
      {activeTab === 'reddit' && (
        <div className="space-y-4 animate-fadeIn">
          {campaigns?.redditCampaigns?.map((red) => (
            <div key={red.id} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-orange-400 font-bold uppercase">{red.subreddit}</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{red.title}</h4>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 whitespace-pre-line">
                {red.body}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`https://www.reddit.com/submit?title=${encodeURIComponent(red.title)}&text=${encodeURIComponent(red.body)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-xs transition-all shadow"
                >
                  👾 1-Click Submit to Reddit ↗
                </a>
                <button
                  onClick={() => handleCopy(red.body, red.id)}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs"
                >
                  {copiedId === red.id ? '✓ Copied Body' : 'Copy Markdown'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
