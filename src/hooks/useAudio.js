import { useEffect, useRef, useState } from 'react';

export function useAudio(src, targetVolume = 0.3) {
  const audioRef     = useRef(null);
  const fadeTimerRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio   = new Audio(src);
    audio.loop    = true;
    audio.volume  = 0;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Autoplay: set to full target volume immediately so it's audible.
    // A 2-second fade from 0 is silent — user thinks it's broken and clicks
    // to "fix" it, which actually turns it off (ON→OFF→ON bug).
    audio.play()
      .then(() => {
        audio.volume = targetVolume;
        setPlaying(true);
      })
      .catch(() => {
        // Browser blocked autoplay — button stays in OFF state as fallback.
      });

    return () => {
      clearInterval(fadeTimerRef.current);
      audio.pause();
      audio.src        = '';
      audioRef.current = null;
    };
  }, [src, targetVolume]);

  // Smooth ramp between two volume levels
  const rampTo = (toVol, durationMs) => {
    clearInterval(fadeTimerRef.current);
    const audio = audioRef.current;
    if (!audio) return;

    const STEPS     = 25;
    const startVol  = audio.volume;
    const stepTime  = durationMs / STEPS;
    const delta     = (toVol - startVol) / STEPS;
    let step = 0;

    fadeTimerRef.current = setInterval(() => {
      step++;
      const a = audioRef.current;
      if (!a) { clearInterval(fadeTimerRef.current); return; }
      a.volume = Math.min(1, Math.max(0, startVol + delta * step));
      if (step >= STEPS) {
        clearInterval(fadeTimerRef.current);
        if (audioRef.current) {
          audioRef.current.volume = toVol;
          if (toVol === 0) audioRef.current.pause();
        }
      }
    }, stepTime);
  };

  // Manual toggle — always a user gesture, so play() is always allowed
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      setPlaying(false);
      rampTo(0, 800);           // Fade out over 0.8s then pause
    } else {
      audio.volume = 0;
      audio.play()
        .then(() => {
          setPlaying(true);
          rampTo(targetVolume, 1200); // Fade in over 1.2s
        })
        .catch((err) => console.warn('[Audio] play() blocked:', err.message));
    }
  };

  return { playing, toggle };
}
