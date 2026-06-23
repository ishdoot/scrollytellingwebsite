import { useAudio } from '../../hooks/useAudio';
import './AudioPlayer.css';

// Muted speaker icon — shown when sound is OFF
function MutedIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path
        d="M1.5 6H4L8 2.5v12L4 11H1.5V6z"
        fill="currentColor"
        fillOpacity="0.55"
      />
      <line x1="10.5" y1="6.5" x2="15.5" y2="11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="15.5" y1="6.5" x2="10.5" y2="11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

export default function AudioPlayer() {
  const src = `${import.meta.env.BASE_URL}audio/ambient.mp3`;
  const { playing, toggle } = useAudio(src, 0.3);

  return (
    <button
      className={`audio-player${playing ? ' audio-player--on' : ' audio-player--off'}`}
      onClick={toggle}
      aria-label={playing ? 'Mute ambient music' : 'Play ambient music'}
      title={playing ? 'Mute' : 'Play ambient sound'}
    >
      {playing ? (
        /* ON state: 4 animated EQ bars */
        <>
          <span className="audio-bar" style={{ '--d': '0s' }} />
          <span className="audio-bar" style={{ '--d': '0.22s' }} />
          <span className="audio-bar" style={{ '--d': '0.38s' }} />
          <span className="audio-bar" style={{ '--d': '0.12s' }} />
        </>
      ) : (
        /* OFF state: muted speaker icon */
        <MutedIcon />
      )}
    </button>
  );
}
