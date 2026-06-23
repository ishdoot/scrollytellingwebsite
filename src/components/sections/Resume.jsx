import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Resume.css';

gsap.registerPlugin(ScrollTrigger);

export default function Resume() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.resume__animate'),
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="resume section" ref={sectionRef}>
      <div className="container resume__inner">
        <p className="t-subheading resume__animate">CV / Résumé</p>

        <h2 className="t-heading resume__animate">
          Like what<br />
          <em className="accent-italic">you see?</em>
        </h2>

        <p className="t-body resume__sub resume__animate">
          Download my full résumé to see my complete project history, education, and experience.
        </p>

        {/* Replace /scrollytelling/resume.pdf with your actual file in /public/ */}
        <a
          href="/scrollytelling/resume.pdf"
          download="Ambar_Chandra_Resume.pdf"
          className="resume__btn resume__animate"
          aria-label="Download Ambar Chandra's resume"
        >
          <span>Download Résumé</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 2v10M4 8l5 5 5-5M2 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
