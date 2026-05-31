/**
 * Play a beep sound using Web Audio API
 * Generates a 1000Hz sine wave for 200ms
 */
export function playBeep(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Connect oscillator to gain to audio output
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Set oscillator frequency and type
    oscillator.frequency.value = 1000; // 1000Hz tone
    oscillator.type = 'sine';

    // Set gain to fade out
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    // Start and stop the oscillator
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.warn('Failed to play beep sound:', error);
    // Silently fail - audio not critical to functionality
  }
}
