// Speech synthesis helper for international students to practice listening & pronunciation

export class SpeechAssistant {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  static speak(
    text: string,
    options: {
      rate?: number; // e.g. 0.85 for slow & clear, 1.0 for normal
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
    } = {}
  ): void {
    if (!this.isSupported() || !this.synth) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 0.85; // slightly slower by default for ESL learners
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    const voices = this.synth.getVoices();
    // Prefer high quality English voices if present
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => options.onStart?.();
    utterance.onend = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };
    utterance.onerror = () => {
      this.currentUtterance = null;
      options.onError?.();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  static stop(): void {
    if (!this.synth) return;
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  static isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }
}
