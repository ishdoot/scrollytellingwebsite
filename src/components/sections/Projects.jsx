import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../../data/projects';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef(null);
  const bentoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tiles = bentoRef.current?.querySelectorAll('.bento__tile');
      if (tiles) {
        gsap.fromTo(
          tiles,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bentoRef.current,
              start: 'top 72%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="projects section" ref={sectionRef}>
      <div className="container projects__header">
        <p className="t-subheading">Selected Work</p>
        <h2 className="projects__heading">
          Five projects.<br />
          <em className="accent-italic">Hover to explore.</em>
        </h2>
      </div>

      <div className="bento" ref={bentoRef}>
        {projects.map((project) => (
          <div key={project.id} className="bento__tile">

            {/* ── Always-visible strip (collapsed state) ── */}
            <div className="bento__strip">
              <span className="bento__num t-subheading">{project.id}</span>
              <p className="bento__vtitle">{project.title}</p>
            </div>

            {/* ── Expanded content (revealed on hover) ── */}
            <div className="bento__content" aria-hidden="true">
              <div className="bento__info">
                <p className="t-subheading bento__disc">{project.discipline}</p>
                <h3 className="bento__title">{project.title}</h3>
                <p className="t-subheading bento__year" style={{ marginTop: '-0.25rem' }}>{project.year}</p>
                <p className="t-body bento__desc">{project.description}</p>
                <div className="bento__tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="bento__img-wrap">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="bento__img" />
                ) : (
                  <div className="bento__img-placeholder">
                    <span className="t-subheading">Project Visual</span>
                    <p style={{ fontSize: '0.72rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                      /public/projects/
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}

