import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Hero.css';

export default function Hero() {
  const containerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const taglineRef = useRef(null);
  const metaRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Split each name word into spans for the stagger
      [line1Ref, line2Ref].forEach((ref) => {
        const el = ref.current;
        if (!el) return;
        const text = el.textContent;
        el.innerHTML = text
          .split('')
          .map((ch) =>
            ch === ' '
              ? '<span style="display:inline-block;">&nbsp;</span>'
              : `<span style="display:inline-block;">${ch}</span>`
          )
          .join('');
      });

      tl.fromTo(
        [
          ...Array.from(line1Ref.current?.querySelectorAll('span') ?? []),
          ...Array.from(line2Ref.current?.querySelectorAll('span') ?? []),
        ],
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.03 },
        0
      )
        .fromTo(
          taglineRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.6
        )
        .fromTo(
          metaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.8
        )
        .fromTo(
          indicatorRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.8 },
          1.2
        );

      // Bounce scroll indicator
      gsap.to(indicatorRef.current, {
        y: 8,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero section" ref={containerRef}>
      <div className="container">
        <h1 className="hero__name" aria-label="Ambar Chandra">
          <div className="t-display hero__line" ref={line1Ref} aria-hidden="true">
            Ambar
          </div>
          <div className="t-display hero__line hero__line--indent" ref={line2Ref} aria-hidden="true">
            Chandra
          </div>
        </h1>

        <p className="hero__tagline" ref={taglineRef}>
          <span className="accent">Communication Designer</span>
          {' '}— Visual & Sound
        </p>

        <p className="t-subheading hero__meta" ref={metaRef}>
          B.Des · DTU Delhi · Open to Opportunities
        </p>
      </div>

      <div className="hero__indicator" ref={indicatorRef} aria-hidden="true">
        <span className="t-subheading">Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <path d="M8 2v20M2 16l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
