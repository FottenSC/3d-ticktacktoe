export const playWinSound = () => {
    // Create audio context
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return

    const ctx = new AudioContext()
    const now = ctx.currentTime

    // Master volume
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.3
    masterGain.connect(ctx.destination)

    // Helper to play a note
    const playNote = (freq: number, time: number, duration: number, type: OscillatorType = 'sine') => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = type
        osc.frequency.value = freq

        // Envelope
        gain.gain.setValueAtTime(0, time)
        gain.gain.linearRampToValueAtTime(1, time + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration)

        osc.connect(gain)
        gain.connect(masterGain)

        osc.start(time)
        osc.stop(time + duration + 0.1)
    }

    // Melody (C Major Fanfare)
    // C4, E4, G4, C5 (Arpeggio)
    playNote(261.63, now, 0.2, 'triangle')
    playNote(329.63, now + 0.1, 0.2, 'triangle')
    playNote(392.00, now + 0.2, 0.2, 'triangle')
    playNote(523.25, now + 0.3, 0.6, 'triangle') // High C

    // Bass (Strong root notes)
    playNote(130.81, now, 0.4, 'square') // C3
    playNote(130.81, now + 0.3, 0.6, 'square') // C3

    // Harmony (Thirds)
    playNote(329.63, now + 0.3, 0.6, 'sine') // E4

    // "Sparkle" effect (High frequency sweep)
    const sparkleOsc = ctx.createOscillator()
    const sparkleGain = ctx.createGain()
    sparkleOsc.type = 'sine'
    sparkleOsc.frequency.setValueAtTime(880, now + 0.4)
    sparkleOsc.frequency.exponentialRampToValueAtTime(1760, now + 0.8)

    sparkleGain.gain.setValueAtTime(0, now + 0.4)
    sparkleGain.gain.linearRampToValueAtTime(0.2, now + 0.5)
    sparkleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8)

    sparkleOsc.connect(sparkleGain)
    sparkleGain.connect(masterGain)
    sparkleOsc.start(now + 0.4)
    sparkleOsc.stop(now + 0.8)
}
