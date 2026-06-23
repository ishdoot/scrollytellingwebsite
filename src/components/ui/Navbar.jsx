import { useEffect, useRef, useState } from 'react';
import './Navbar.css';

const sections = [
  { id: 'home',    label: 'Home' },
  { id: 'about',   label: 'About' },
  { id: 'work',    label: 'Work' },
  { id: 'skills',  label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      let current = 'home';
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) current = id;
      }
      setActive(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} aria-label="Site navigation">
      {/* Logo */}
      <button className="navbar__logo" onClick={() => scrollTo('home')} aria-label="Back to top">
        AC
      </button>

      {/* Section nav: dot + label */}
      <ul className="navbar__nav" role="list">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <button
              className={`navbar__item${active === id ? ' navbar__item--active' : ''}`}
              onClick={() => scrollTo(id)}
              aria-label={`Go to ${label}`}
              aria-current={active === id ? 'true' : undefined}
            >
              <span className="navbar__dot" aria-hidden="true" />
              <span className="navbar__label">{label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Resume download */}
      <a
        href="/scrollytelling/resume.pdf"
        download="Ambar_Chandra_Resume.pdf"
        className="navbar__resume"
        aria-label="Download Ambar Chandra's résumé"
      >
        <span>Résumé</span>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
          <path d="M5.5 1v6.5M2 5l3.5 3.5L9 5M1 10h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </nav>
  );
}

