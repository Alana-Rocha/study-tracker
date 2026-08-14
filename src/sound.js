let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

// Browsers block audio until it's triggered from a user gesture (e.g. clicking
// "Iniciar"); call this from a click handler so later automatic chimes can play.
export function primeAudio() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();
}

function beep(ctx, frequency, startTime, duration, type = "sine") {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
}

// Plays a single soft beep when the timer is started.
export function playStartChime() {
  const ctx = getAudioContext();
  beep(ctx, 740, ctx.currentTime, 0.12);
}

// Plays a sound when a phase ends. `nextMode` is the phase being entered.
export function playPhaseEndChime(nextMode) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  if (nextMode === "work") {
    // break just ended — alarm-clock-style repeated beeps to snap you back to focus
    const beepDuration = 0.12;
    const gap = 0.18;
    for (let i = 0; i < 4; i++) {
      beep(ctx, 1000, now + i * gap, beepDuration, "square");
    }
  } else {
    // focus just ended — calmer descending chime into break
    beep(ctx, 880, now, 0.15);
    beep(ctx, 660, now + 0.18, 0.25);
  }
}
