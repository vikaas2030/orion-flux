import React, { useState, useEffect } from 'react';

export default function VideoPitchPlayer({ clientSlug, companyName }) {
  const [videoPkg, setVideoPkg] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!clientSlug) return;
    fetch(`/api/video-pitch/package/${clientSlug}`)
      .then(res => res.json())
      .then(data => {
        if (data.package) setVideoPkg(data.package);
      })
      .catch(() => {});
  }, [clientSlug]);

  // Simulated 4K Video Playback with synchronized scene progression
  useEffect(() => {
    let interval = null;
    if (isPlaying && videoPkg) {
      interval = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            setCurrentSceneIndex(0);
            return 0;
          }
          const next = prev + 2;
          const totalScenes = videoPkg.scenes?.length || 3;
          const sceneIdx = Math.min(Math.floor((next / 100) * totalScenes), totalScenes - 1);
          setCurrentSceneIndex(sceneIdx);
          return next;
        });
      }, 900);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, videoPkg]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    } else {
      setIsPlaying(true);
      // Play scene voiceover using SpeechSynthesis
      if (window.speechSynthesis && videoPkg?.scenes?.[currentSceneIndex]?.voiceover) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(videoPkg.scenes[currentSceneIndex].voiceover);
        utter.rate = 1.05;
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utter);
        setIsSpeaking(true);
      }
    }
  };

  if (!videoPkg) return null;

  const currentScene = videoPkg.scenes?.[currentSceneIndex] || videoPkg.scenes?.[0];

  return (
    <div style={{
      backgroundColor: '#070714',
      borderRadius: '16px',
      border: '1px solid #1e293b',
      borderTop: '3px solid #f59e0b',
      padding: '24px',
      marginBottom: '24px',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🎬
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#fff' }}>
              4K Cinema-Grade Showcase & Live Intake Simulation
            </h3>
            <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '600' }}>
              ⚡ 3840 x 2160 (Ultra-HD Retina) • 60 FPS • Bespoke Video Asset for {companyName || videoPkg.company}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            fontWeight: '700'
          }}>
            ✓ Retention Rate: 99.4%
          </span>
          <span style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: '#1e293b',
            color: '#94a3b8'
          }}>
            {videoPkg.pricingPolicy}
          </span>
        </div>
      </div>

      {/* Main 4K Video Player Viewport */}
      <div style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#020617',
        border: '1px solid #334155',
        aspectRatio: '16 / 9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
      }}>
        {/* Top Overlay Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '11px',
            fontWeight: '700',
            color: '#38bdf8',
            letterSpacing: '0.05em'
          }}>
            ORION 4K STUDIO • SCENE {currentSceneIndex + 1} OF {videoPkg.scenes?.length || 3}: {currentScene?.title?.toUpperCase()}
          </div>
          <div style={{
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: isPlaying ? '#ef4444' : '#334155',
            color: '#fff',
            fontSize: '10px',
            fontWeight: '800'
          }}>
            {isPlaying ? '● LIVE 4K PLAYBACK' : 'PAUSED'}
          </div>
        </div>

        {/* Center Dynamic Scene Content */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ fontSize: '42px', marginBottom: '8px' }}>
            {currentSceneIndex === 0 ? '⚠️' : currentSceneIndex === 1 ? '⚡' : '🏆'}
          </div>
          <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '0 0 8px' }}>
            {currentScene?.title}
          </h4>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: '0 0 12px' }}>
            {currentScene?.visual}
          </p>
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            fontSize: '12px',
            color: '#fbbf24',
            fontStyle: 'italic'
          }}>
            🎙️ Voiceover: "{currentScene?.voiceover}"
          </div>
        </div>

        {/* Bottom Player Controls */}
        <div>
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#1e293b',
            borderRadius: '2px',
            marginBottom: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${playbackProgress}%`,
              height: '100%',
              backgroundColor: '#10b981',
              transition: 'width 0.8s linear'
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={handleTogglePlay}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: isPlaying ? '#334155' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: isPlaying ? '#cbd5e1' : '#020617',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{isPlaying ? '⏸️' : '▶️'}</span> {isPlaying ? 'Pause Video' : 'Play 4K Campaign Demo'}
              </button>

              <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                {currentScene?.timestamp}
              </span>
            </div>

            {/* Scene Selectors */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {videoPkg.scenes?.map((sc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentSceneIndex(idx);
                    setPlaybackProgress(idx === 0 ? 10 : idx === 1 ? 50 : 85);
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: currentSceneIndex === idx ? '#f59e0b' : '#1e293b',
                    color: currentSceneIndex === idx ? '#020617' : '#94a3b8',
                    border: 'none',
                    fontSize: '10px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Scene {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
