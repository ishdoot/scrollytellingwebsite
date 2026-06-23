import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

const skillGroups = [
  {
    category: 'Visual Design',
    skills: ['Typography', 'Brand Identity', 'Editorial Layout', 'Illustration', 'Poster Design', 'Print'],
  },
  {
    category: 'Sound & Audio',
    skills: ['Sound Design', 'Audio Post-Production', 'Music Composition', 'Field Recording', 'Foley', 'Mixing'],
  },
  {
    category: 'Communication',
    skills: ['Visual Storytelling', 'Art Direction', 'Motion Graphics', 'Photography', 'Concept Development'],
  },
  {
    category: 'Tools',
    skills: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'After Effects', 'Figma', 'Ableton Live', 'Logic Pro'],
  },
];

export default function Skills() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const groups = sectionRef.current?.querySelectorAll('.skills__group');
      groups?.forEach((group) => {
        const tags = group.querySelectorAll('.skills__tag');
        gsap.fromTo(
          tags,
          { opacity: 0, y: 20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      const headings = sectionRef.current?.querySelectorAll('.skills__cat');
      if (headings) {
        gsap.fromTo(
          headings,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className="skills section" ref={sectionRef}>
      <div className="container">
        <p className="t-subheading skills__label">Disciplines & Tools</p>
        <h2 className="t-heading skills__heading">
          What I bring<br />
          <em className="accent-italic">to the table.</em>
        </h2>

        <div className="skills__grid">
          {skillGroups.map((group) => (
            <div key={group.category} className="skills__group">
              <h3 className="t-subheading skills__cat">{group.category}</h3>
              <div className="skills__tags">
                {group.skills.map((skill) => (
                  <span key={skill} className="skills__tag tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
