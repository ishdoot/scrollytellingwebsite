import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const decorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger text lines in
      const lines = textRef.current?.querySelectorAll('.about__animate');
      if (lines) {
        gsap.fromTo(
          lines,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Parallax on decorative element
      gsap.to(decorRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="about section" ref={sectionRef}>
      <div className="container about__grid">
        {/* Left: text */}
        <div className="about__text" ref={textRef}>
          <p className="t-subheading about__animate">About</p>

          <h2 className="t-heading about__animate">
            Designing across{' '}
            <em className="accent-italic">senses</em>.
          </h2>

          <p className="t-body about__animate">
            I'm Ambar — a communication designer who works at the intersection of visual form and sound. I believe good design is felt before it's understood.
          </p>

          <p className="t-body about__animate">
            Graduated with a B.Des from Delhi Technological University (DTU), I've spent the last four years exploring how type, space, image, and audio can work together to tell a coherent story.
          </p>

          <p className="t-body about__animate">
            Whether it's a brand identity system, a motion piece, or an immersive audio experience — I approach every project as a communication problem first, and a craft challenge second.
          </p>

          <div className="about__tags about__animate">
            <span className="tag">Visual Design</span>
            <span className="tag">Sound Design</span>
            <span className="tag">Communication Design</span>
            <span className="tag">DTU Delhi '25</span>
          </div>
        </div>

        {/* Right: decorative */}
        <div className="about__decor" ref={decorRef} aria-hidden="true">
          <div className="about__ring about__ring--1" />
          <div className="about__ring about__ring--2" />
          <div className="about__ring about__ring--3" />
          <div className="about__dot" />
        </div>
      </div>
    </section>
  );
}
