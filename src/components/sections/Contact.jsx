import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { label: 'Email', href: 'mailto:ambar@example.com', display: 'ambar@example.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ambar-chandra', display: 'linkedin.com/in/ambar-chandra' },
  { label: 'Behance', href: 'https://behance.net/ambarchandra', display: 'behance.net/ambarchandra' },
  { label: 'Instagram', href: 'https://instagram.com/ambarchandra', display: '@ambarchandra' },
];

export default function Contact() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.contact__animate'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="contact section" ref={sectionRef}>
      <div className="container">
        <p className="t-subheading contact__animate">Get in Touch</p>

        <h2 className="t-heading contact__heading contact__animate">
          Let's make<br />
          <em className="accent-italic">something together.</em>
        </h2>

        <ul className="contact__list" role="list">
          {links.map(({ label, href, display }) => (
            <li key={label} className="contact__animate">
              <a
                href={href}
                className="contact__link"
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              >
                <span className="t-subheading contact__link-label">{label}</span>
                <span className="contact__link-display">{display}</span>
                <span className="contact__arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>

        <footer className="contact__footer contact__animate">
          <p className="t-subheading">
            © {new Date().getFullYear()} Ambar Chandra. All rights reserved.
          </p>
        </footer>
      </div>
    </section>
  );
}
