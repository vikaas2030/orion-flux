import React, { useState, useEffect } from 'react';

export default function Social() {
  const [activeTab, setActiveTab] = useState('studio');
  const [platform, setPlatform] = useState('google_flow');
  const [topic, setTopic] = useState('AI Business Automation & Client Acquisition');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [scheduledPosts, setScheduledPosts] = useState([]);

  useEffect(() => {
    fetch('/api/social/posts')
      .then(res => res.json())
      .then(data => {
        if (data.posts) setScheduledPosts(data.posts);
      })
      .catch(() => {});
  }, []);

  const handleGenerateAIContent = (e) => {
    e.preventDefault();
    if (!topic) return;

    setIsGenerating(true);
    fetch('/api/social/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, platform })
    })
      .then(res => res.json())
      .then(data => {
        setIsGenerating(false);
        if (data.data) setGeneratedData(data.data);
      })
      .catch(() => setIsGenerating(false));
  };

  const handleSchedulePost = (title, content, tags) => {
    fetch('/api/social/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: platform.toUpperCase(),
        title: title || topic,
        content: typeof content === 'string' ? content : JSON.stringify(content),
        tags: Array.isArray(tags) ? tags.join(', ') : (tags || '')
      })
    })
      .then(res => res.json())
      .then(newPost => {
        setScheduledPosts([newPost, ...scheduledPosts]);
        alert(`🚀 Post "${title || topic}" successfully scheduled & queued for marketing!`);
      });
  };

  return (
    <div className="social-studio-page animate-in">
      <div className="flex justify-between items-center mb-20">
        <div>
          <h2 className="text-xl font-bold">Google Flow AI Video Model & Social Studio</h2>
          <p className="text-sm text-tertiary">Scene-by-scene Veo prompts, camera angles, voiceover cues & YouTube SEO automation</p>
        </div>
        <div className="chart-filter">
          <button className={activeTab === 'studio' ? 'active' : ''} onClick={() => setActiveTab('studio')}>
            ⚡ Google Flow Studio
          </button>
          <button className={activeTab === 'scheduler' ? 'active' : ''} onClick={() => setActiveTab('scheduler')}>
            📅 Multi-Platform Queue ({scheduledPosts.length})
          </button>
          <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
            📈 Growth Analytics
          </button>
        </div>
      </div>

      {activeTab === 'studio' && (
        <div className="charts-grid animate-in">
          {/* Left Panel: Form */}
          <div className="glass-card p-24" style={{ padding: '24px' }}>
            <h3 className="font-bold mb-16 flex items-center gap-8">
              🎥 Select Model Workflow & Topic Target
            </h3>
            <form onSubmit={handleGenerateAIContent}>
              <div className="form-group mb-16">
                <label className="form-label">Workflow Engine</label>
                <div className="grid grid-cols-2 gap-8 flex flex-wrap">
                  {[
                    { id: 'google_flow', label: '⚡ Google Flow (YouTube Veo Scenes)', icon: '🌊' },
                    { id: 'youtube', label: '🔴 YouTube Standard Package', icon: '▶️' },
                    { id: 'instagram', label: '📸 Instagram Reels & Shorts', icon: '📷' },
                    { id: 'linkedin', label: '💼 LinkedIn Post', icon: '💼' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      className={`btn ${platform === item.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '12px', padding: '8px 12px' }}
                      onClick={() => setPlatform(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group mb-20">
                <label className="form-label">Video Topic Keyword *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. How to automate business, Google Flow Veo tutorial"
                  required
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                style={{ justifyContent: 'center', height: '44px' }}
                disabled={isGenerating}
              >
                {isGenerating ? '⚡ Generating Google Flow Model...' : '🚀 Generate Google Flow AI Video Model'}
              </button>
            </form>
          </div>

          {/* Right Panel: Google Flow Model Scene Breakdown Output */}
          <div className="glass-card p-24" style={{ padding: '24px', background: 'var(--bg-secondary)', overflowY: 'auto', maxHeight: '760px' }}>
            {generatedData ? (
              <div className="animate-in">
                {/* GOOGLE FLOW SCENE BY SCENE MODEL OUTPUT */}
                {generatedData.googleFlowModel && (
                  <div>
                    <div className="flex justify-between items-center mb-16 pb-12" style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <div>
                        <h3 style={{ color: '#06b6d4', fontSize: '18px' }}>🌊 Google Flow AI Video Model</h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                          Engine: {generatedData.googleFlowModel.modelName} | Aspect Ratio: {generatedData.googleFlowModel.aspectRatio}
                        </p>
                      </div>
                      <span className="badge badge-won">SEO Score: {generatedData.seo.score}/100</span>
                    </div>

                    <h4 style={{ color: 'var(--text-primary)', marginTop: '8px' }}>1. High-CTR Titles</h4>
                    <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {generatedData.titleOptions.map((t, i) => <li key={i} style={{ marginBottom: '4px' }}><strong>{t}</strong></li>)}
                    </ul>

                    <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '12px' }}>
                      2. Scene-by-Scene Google Veo Storyboard & Shot List ({generatedData.googleFlowModel.flowScenes.length} Scenes)
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {generatedData.googleFlowModel.flowScenes.map((scene) => (
                        <div key={scene.sceneId} style={{
                          background: 'var(--bg-glass)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          padding: '16px',
                          borderLeft: '4px solid var(--accent-purple)'
                        }}>
                          <div className="flex justify-between items-center mb-8">
                            <strong style={{ fontSize: '14px', color: 'var(--accent-purple)' }}>{scene.name}</strong>
                            <span className="badge badge-new" style={{ fontSize: '10px' }}>⏱️ {scene.time}</span>
                          </div>

                          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div><strong>📹 Camera Angle & Motion:</strong> <span style={{ color: 'var(--text-secondary)' }}>{scene.cameraAngle}</span></div>
                            <div>
                              <strong>🎬 Google Veo Visual Prompt:</strong>
                              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', marginTop: '4px', fontFamily: 'monospace', color: '#a78bfa', fontSize: '11px' }}>
                                {scene.veoVideoPrompt}
                              </div>
                            </div>
                            <div><strong>🎙️ Voiceover Script:</strong> <span style={{ color: 'var(--text-primary)' }}>{scene.voiceoverText}</span></div>
                            <div><strong>🔊 Sound FX Cue:</strong> <span style={{ color: 'var(--accent-orange)' }}>{scene.sfxCue}</span></div>
                            <div><strong>🖼️ On-Screen Graphic:</strong> <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{scene.onScreenText}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h4 style={{ color: 'var(--text-primary)', marginTop: '20px' }}>3. YouTube SEO Description & Timestamps</h4>
                    <textarea className="form-textarea" style={{ height: '110px', fontSize: '11px' }} readOnly value={generatedData.seo.description}></textarea>

                    <h4 style={{ color: 'var(--text-primary)', marginTop: '16px' }}>4. AI Thumbnail Generation Prompt</h4>
                    <p style={{ fontSize: '12px', color: '#38bdf8', background: 'var(--bg-glass)', padding: '10px', borderRadius: '6px' }}>
                      {generatedData.seo.thumbnailPrompt}
                    </p>

                    <button
                      className="btn btn-primary mt-20 w-full"
                      style={{ justifyContent: 'center' }}
                      onClick={() => handleSchedulePost(generatedData.titleOptions[0], generatedData.googleFlowModel, generatedData.seo.keywords)}
                    >
                      🚀 Export & Queue Google Flow Production
                    </button>
                  </div>
                )}

                {/* OTHER PLATFORMS OUTPUT */}
                {!generatedData.googleFlowModel && generatedData.titleOptions && (
                  <div>
                    <h3 style={{ color: 'var(--accent-red)' }}>🔴 YouTube Standard Package</h3>
                    <textarea className="form-textarea" style={{ height: '180px' }} readOnly value={JSON.stringify(generatedData.script, null, 2)}></textarea>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🌊</span>
                <h3>Google Flow AI Model Ready</h3>
                <p>Enter your YouTube topic keyword on the left and click "Generate Google Flow AI Video Model" to get scene-by-scene Veo prompts, camera angles, voiceover cues, and SFX timing.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'scheduler' && (
        <div className="data-table-wrapper animate-in">
          <table className="data-table">
            <thead>
              <tr>
                <th>Channel / Platform</th>
                <th>Content Title</th>
                <th>Target Keywords / Hashtags</th>
                <th>Scheduled Date</th>
                <th>Publishing Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduledPosts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                    No posts queued yet. Use the Google Flow AI Studio to create and schedule content.
                  </td>
                </tr>
              ) : scheduledPosts.map(post => (
                <tr key={post.id}>
                  <td style={{ fontWeight: 'bold', color: 'var(--accent-purple)' }}>{post.platform}</td>
                  <td>{post.title}</td>
                  <td>{post.tags || 'General SEO'}</td>
                  <td>{new Date(post.scheduled_at || post.created_at).toLocaleDateString()}</td>
                  <td><span className="badge badge-won">QUEUED / GOOGLE FLOW</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="animate-in">
          <div className="stat-cards mb-24">
            <div className="stat-card">
              <div className="stat-info">
                <h3>Total Impressions</h3>
                <div className="stat-value">1,48,500</div>
                <div className="stat-change positive">↑ 38% this month</div>
              </div>
              <div className="stat-icon red">▶️</div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h3>Google Flow Video CTR</h3>
                <div className="stat-value">14.2%</div>
                <div className="stat-change positive">High engagement</div>
              </div>
              <div className="stat-icon cyan">🌊</div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h3>Inbound Leads Generated</h3>
                <div className="stat-value">28</div>
                <div className="stat-change positive">₹5,20,000 deal value</div>
              </div>
              <div className="stat-icon green">🎯</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
