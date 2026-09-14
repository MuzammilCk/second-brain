// Tactile Synthetic Audio Engine for Industrial Hardware Experience
// Inspired by 21st.dev mechanical switch audio architectures (zero external audio files required)

let audioCtx = null;
let isMuted = false;

// Initialize mute state from localStorage if available
try {
  const saved = localStorage.getItem('codex_tactile_audio_muted');
  if (saved !== null) {
    isMuted = JSON.parse(saved);
  }
} catch (e) {
  // Ignore storage access errors
}

function getAudioContext() {
  if (isMuted) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const tactileAudio = {
  isMuted: () => isMuted,
  
  toggleMute: () => {
    isMuted = !isMuted;
    try {
      localStorage.setItem('codex_tactile_audio_muted', JSON.stringify(isMuted));
    } catch (e) {
      // Ignore
    }
    return isMuted;
  },

  setMuted: (muted) => {
    isMuted = !!muted;
    try {
      localStorage.setItem('codex_tactile_audio_muted', JSON.stringify(isMuted));
    } catch (e) {
      // Ignore
    }
  },

  // Rotary Knob Detent Click (Sharp metallic click with high-frequency damp)
  playKnobTick: (frequency = 1200) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Bandpass to give it a knurled metal detent timbre
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(frequency, now);
      filter.Q.setValueAtTime(4.0, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency * 1.5, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {
      // Ignore audio synthesis errors
    }
  },

  // Heavy Industrial Relay / Breaker Switch Clunk
  playSwitchClunk: (isOpen = true) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // High frequency click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(isOpen ? 850 : 600, now);
      clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.04);
      clickGain.gain.setValueAtTime(0.22, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);

      // Low frequency sub-thud
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(isOpen ? 160 : 120, now);
      thudOsc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
      thudGain.gain.setValueAtTime(0.35, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.04);
      thudOsc.start(now);
      thudOsc.stop(now + 0.08);
    } catch (e) {
      // Ignore
    }
  },

  // Tactile Spring Keycap Depression (Mechanical keyboard/synth button)
  playKeycapPress: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.025);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch (e) {
      // Ignore
    }
  },

  // CRT / Teletype Handshake Chirp
  playTransmissionBeep: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.setValueAtTime(2100, now + 0.04);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      // Ignore
    }
  },
};
