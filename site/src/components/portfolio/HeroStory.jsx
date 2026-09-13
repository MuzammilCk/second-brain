import { useState } from 'react';
import './HeroStory.css';

const LATENCY_STAGES = [
  {
    id: 'vad',
    name: 'Stage 01: Client VAD',
    time: '20ms',
    percent: '5%',
    tech: 'Silero VAD (WASM)',
    desc: 'Local speech boundary detection running in WebAssembly before any network transmission occurs.'
  },
  {
    id: 'stt',
    name: 'Stage 02: Streaming STT',
    time: '110ms',
    percent: '29%',
    tech: 'Whisper Streaming',
    desc: 'Speculative phoneme emission via WebRTC data channel while the speaker is still finishing the clause.'
  },
  {
    id: 'llm',
    name: 'Stage 03: Speculative LLM',
    time: '160ms',
    percent: '42%',
    tech: 'Mistral 7B (vLLM)',
    desc: 'First token generation with speculative tool-call branching for ERP inventory and calendar lookups.'
  },
  {
    id: 'tts',
    name: 'Stage 04: Edge Voice Synth',
    time: '90ms',
    percent: '24%',
    tech: 'Streaming PCM TTS',
    desc: 'Streaming raw PCM audio chunks direct to client Web Audio Context before the sentence completes.'
  }
];

export default function HeroStory({ project, onInspect }) {
  const [activeStage, setActiveStage] = useState(LATENCY_STAGES[0]);
  const [pipelineMode, setPipelineMode] = useState('optimized'); // 'optimized' | 'legacy'

  return (
    <section className="hero-story" aria-label="Flagship engineering story">
      <div className="hero-story__eyebrow">
        <span className="hero-story__tag">01 / FLAGSHIP ARCHITECTURE STORY</span>
        <span className="hero-story__accolade">ODOO HACKATHON GRAND FINALE FINALIST</span>
      </div>

      <div className="hero-story__header">
        <h2 className="hero-story__title">
          {project?.title || 'Odoo Hackathon: Real-Time Multimodal Voice Agent'}
        </h2>
        <p className="hero-story__tension">
          The 400ms Turn-Taking Barrier: Traditional HTTP request-response architectures add over 1,200ms latency, breaking conversational cadence. Building an ERP voice agent requires a sub-400ms pipeline: streaming WebRTC with client-side VAD, speculative token generation, and instant barge-in cancellation.
        </p>
      </div>

      {/* Interactive Latency Budget Visualizer */}
      <div className="latency-widget">
        <div className="latency-widget__head">
          <div className="latency-widget__title-group">
            <span className="latency-widget__label">PIPELINE LATENCY BUDGET BREAKDOWN</span>
            <span className="latency-widget__metric">
              {pipelineMode === 'optimized' ? '380ms TOTAL (SUB-400MS TARGET ACHIEVED)' : '1,240ms TOTAL (UNOPTIMIZED HTTP BASELINE)'}
            </span>
          </div>

          <div className="latency-widget__mode-toggle">
            <button
              type="button"
              className={`mode-btn ${pipelineMode === 'optimized' ? 'mode-btn--active' : ''}`}
              onClick={() => setPipelineMode('optimized')}
            >
              Stream WebRTC (380ms)
            </button>
            <button
              type="button"
              className={`mode-btn ${pipelineMode === 'legacy' ? 'mode-btn--active' : ''}`}
              onClick={() => setPipelineMode('legacy')}
            >
              Standard HTTP (1,240ms)
            </button>
          </div>
        </div>

        {/* Progress Bar Breakdown */}
        <div className="latency-bar">
          {LATENCY_STAGES.map((stage) => {
            const isSelected = activeStage.id === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                className={`latency-bar__segment latency-bar__segment--${stage.id} ${isSelected ? 'is-selected' : ''}`}
                style={{ width: pipelineMode === 'optimized' ? stage.percent : '25%' }}
                onClick={() => setActiveStage(stage)}
                aria-label={`Inspect ${stage.name}`}
              >
                <span className="segment-label">{stage.time}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail */}
        <div className="latency-detail">
          <div className="latency-detail__header">
            <span className="latency-detail__name">{activeStage.name}</span>
            <span className="latency-detail__tech">ENGINE: {activeStage.tech}</span>
            <span className="latency-detail__budget">BUDGET: {activeStage.time}</span>
          </div>
          <p className="latency-detail__desc">{activeStage.desc}</p>
        </div>
      </div>

      {/* Code Invariant & Engineering Context */}
      <div className="hero-story__invariant">
        <div className="invariant-header">
          <span className="invariant-title">SYSTEM INVARIANT: BARGE-IN INTERRUPTION HANDLER</span>
          <span className="invariant-file">webrtc/audio_stream_controller.py</span>
        </div>
        <pre className="invariant-code">
          <code>{`async def handle_user_barge_in(session: VoiceSession, vad_confidence: float):
    # If user speaks while model is streaming audio, cancel the playback queue instantly
    if vad_confidence > 0.82 and session.is_transmitting:
        await session.cancel_active_stream()
        session.flush_pcm_buffer()
        logger.info(f"Barge-in detected in {session.id}: audio cancelled in <18ms")`}</code>
        </pre>
      </div>

      {/* Story Actions */}
      <div className="hero-story__actions">
        <button
          type="button"
          className="btn-story btn-story--primary"
          onClick={() => onInspect && onInspect(project)}
          id="hero-story-inspect-btn"
        >
          Inspect Architecture Case Study →
        </button>
        {project?.repo_reference && (
          <a
            href={project.repo_reference}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-story btn-story--ghost"
            id="hero-story-repo-btn"
          >
            View Repository on GitHub ↗
          </a>
        )}
      </div>
    </section>
  );
}
