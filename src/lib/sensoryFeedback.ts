/**
 * Sensory Feedback Service
 * Encapsulates haptic, sound effect, flashlight torch, and emergency SOS hardware signals.
 * Decoupled from domain speech synthesis.
 */

class SensoryFeedbackService {
  private sosOscillator: OscillatorNode | null = null;
  private sosGain: GainNode | null = null;
  private audioCtx: AudioContext | null = null;

  playClick(enabled = true): void {
    if (!enabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.error('Audio click error:', e);
    }
  }

  playSOS(): void {
    if (this.sosOscillator) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      this.audioCtx = ctx;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(329.63, ctx.currentTime); // E4 - Warm emergency tone

      gainNode.gain.setValueAtTime(0, ctx.currentTime);

      const now = ctx.currentTime;
      for (let i = 0; i < 100; i++) {
        gainNode.gain.linearRampToValueAtTime(0.2, now + i * 1.5 + 0.5);
        gainNode.gain.linearRampToValueAtTime(0, now + i * 1.5 + 1.2);
      }

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      this.sosOscillator = oscillator;
      this.sosGain = gainNode;
    } catch (e) {
      console.error('SOS siren error:', e);
    }
  }

  stopSOS(): void {
    if (this.sosOscillator) {
      try {
        this.sosOscillator.stop();
      } catch {
        // ignore
      }
      this.sosOscillator = null;
    }
    if (this.sosGain) {
      try {
        this.sosGain.disconnect();
      } catch {
        // ignore
      }
      this.sosGain = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }

  async toggleFlashlight(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as { torch?: boolean };
      if (capabilities.torch) {
        await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
          advanced: [{ torch: true }]
        });
        setTimeout(() => track.stop(), 5000);
      }
    } catch {
      console.warn('Flashlight not supported');
    }
  }

  vibrate(pattern: number | number[] = 40): void {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }
}

export const sensoryFeedback = new SensoryFeedbackService();
