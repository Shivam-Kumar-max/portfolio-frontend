import React, { useEffect, useState } from 'react'
import api from '../api/axios'

const Icon = ({ name, className = '' }) => <i className={`bi bi-${name} ${className}`} aria-hidden="true" />

export default function Home() {
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [certificates, setCertificates] = useState([])
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    Promise.all([api.get('/skills'), api.get('/projects'), api.get('/certificates')])
      .then(([skillsRes, projectsRes, certificatesRes]) => {
        setSkills(skillsRes.data)
        setProjects(projectsRes.data)
        setCertificates(certificatesRes.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', text: '' })
    setSending(true)
    try {
      await api.post('/contacts', form)
      setStatus({ type: 'success', text: 'Thanks for reaching out. Your message has been sent.' })
      setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' })
    } catch {
      setStatus({ type: 'danger', text: 'Your message could not be sent. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  const grouped = skills.reduce((acc, skill) => {
    const category = skill.category || 'General'
    acc[category] = acc[category] || []
    acc[category].push(skill)
    return acc
  }, {})

  return (
    <main>
      <section id="home" className="hero-section">
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="eyebrow"><span className="availability-dot" /> FULL-STACK DEVELOPER</div>
            <h1>Building thoughtful<br /><span>digital experiences.</span></h1>
            <p className="hero-lead">I design and build reliable web applications, from the first idea to the final detail.</p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-brand btn-lg">Explore my work <Icon name="arrow-up-right" /></a>
              <a href="#contact" className="text-link">Let’s talk <Icon name="arrow-down-right" /></a>
            </div>
            <div className="hero-meta"><span>BASED IN INDIA</span><span className="meta-line" /><span>AVAILABLE FOR OPPORTUNITIES</span></div>
          </div>
          <div className="hero-art" aria-label="Abstract digital artwork">
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <div className="art-core"><span className="art-bracket">&lt;</span><span className="art-slash">/</span><span className="art-bracket">&gt;</span></div>
            <div className="art-label label-top"><span className="label-dot" /> BUILD / CREATE</div>
            <div className="art-label label-bottom">CRAFTED WITH PURPOSE <Icon name="asterisk" /></div>
            <span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✳</span>
          </div>
        </div>
        <div className="hero-bottom container"><span>SCROLL TO DISCOVER</span><a href="#about" aria-label="Scroll to about"><Icon name="arrow-down" /></a><span className="hero-bottom-rule" /></div>
      </section>

      <section id="about" className="section section-about">
        <div className="container">
          <div className="section-kicker">01 / A LITTLE ABOUT ME</div>
          <div className="about-grid">
            <h2 className="display-heading">Good ideas deserve<br /><span>great execution.</span></h2>
            <div className="about-copy"><p>I’m a software developer focused on building clean, maintainable full-stack applications. I enjoy turning complex problems into simple, intuitive experiences.</p><p>From responsive interfaces to dependable APIs, I care about the details that make products useful, fast, and easy to work with.</p><a href="#contact" className="text-link">More about working together <Icon name="arrow-up-right" /></a></div>
          </div>
          <div className="stats-row"><div><strong>01</strong><span>FRONTEND &amp; BACKEND</span></div><div><strong>02</strong><span>THOUGHTFUL DESIGN</span></div><div><strong>03</strong><span>BUILT TO LAST</span></div></div>
        </div>
      </section>

      <section id="skills" className="section section-soft">
        <div className="container">
          <div className="section-kicker">02 / WHAT I WORK WITH</div>
          <div className="section-heading-row"><h2 className="display-heading">Tools of<br /><span>the trade.</span></h2><p className="section-intro">A growing set of technologies and skills I use to bring ideas to life.</p></div>
          {loading && <p className="empty-note">Loading skills…</p>}
          {!loading && skills.length === 0 && <p className="empty-note">Skills will appear here soon.</p>}
          <div className="skills-grid">{Object.entries(grouped).map(([category, items]) => <article className="skill-group" key={category}><div className="skill-group-top"><h3>{category}</h3><span>{String(items.length).padStart(2, '0')} SKILLS</span></div><div className="skill-tags">{items.map(skill => <span className="skill-tag" key={skill.id}>{skill.skillName}</span>)}</div></article>)}</div>
        </div>
      </section>

      <section id="projects" className="section section-projects">
        <div className="container">
          <div className="section-kicker">03 / SELECTED WORK</div>
          <div className="section-heading-row"><h2 className="display-heading">Made with<br /><span>intention.</span></h2><p className="section-intro">A selection of projects that bring design and engineering together.</p></div>
          {loading && <p className="empty-note">Loading projects…</p>}
          {!loading && projects.length === 0 && <p className="empty-note">Projects will appear here soon.</p>}
          <div className="projects-grid">{projects.map((project, index) => <article className="project-card" key={project.id}><div className="project-image-wrap">{project.imageUrl ? <img src={project.imageUrl} alt={project.title} className="project-image" /> : <div className={`project-placeholder placeholder-${index % 3}`}><span>{String(index + 1).padStart(2, '0')}</span><Icon name="window" /></div>}<span className="project-index">PROJECT / {String(index + 1).padStart(2, '0')}</span></div><div className="project-info"><div><h3>{project.title}</h3><p>{project.description}</p></div><div className="project-footer">{project.techStack && <span className="project-tech">{project.techStack}</span>}<div className="project-links">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.title} source code`}><Icon name="github" /></a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.title} live site`}><Icon name="arrow-up-right" /></a>}</div></div></div></article>)}</div>
        </div>
      </section>

      <section id="certificates" className="section section-soft">
        <div className="container">
          <div className="section-kicker">04 / LEARNING &amp; GROWTH</div>
          <div className="section-heading-row"><h2 className="display-heading">Always<br /><span>learning.</span></h2><p className="section-intro">Certifications and milestones from the journey so far.</p></div>
          {!loading && certificates.length === 0 && <p className="empty-note">Certificates will appear here soon.</p>}
          <div className="cert-grid">{certificates.map((cert, index) => <article className="cert-card" key={cert.id}>{cert.image ? <img src={cert.image} alt="Certificate" /> : <div className="cert-mark"><Icon name="award" /></div>}<div className="cert-info"><span className="cert-number">CERTIFICATE / {String(index + 1).padStart(2, '0')}</span><p>{cert.description}</p></div><Icon name="arrow-up-right" className="cert-arrow" /></article>)}</div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="section-kicker">05 / START A CONVERSATION</div>
          <div className="contact-grid"><div className="contact-copy"><h2 className="display-heading">Have a good<br /><span>one in mind?</span></h2><p>Have a project, an opportunity, or just want to say hello? I’d love to hear from you.</p><a className="contact-email" href="#contact">Let’s connect <Icon name="arrow-up-right" /></a></div><div className="contact-form-wrap">{status.text && <div className={`alert alert-${status.type}`} role="status">{status.text}</div>}<form onSubmit={handleSubmit} className="contact-form"><div className="form-row"><label>FIRST NAME<input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Your first name" required /></label><label>LAST NAME<input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Your last name" /></label></div><div className="form-row"><label>EMAIL ADDRESS<input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required /></label><label>SUBJECT<input name="subject" value={form.subject} onChange={handleChange} placeholder="What’s this about?" /></label></div><label>MESSAGE<textarea name="message" rows="4" value={form.message} onChange={handleChange} placeholder="Tell me a little about it…" required /></label><button className="btn btn-brand btn-lg" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'} <Icon name="arrow-up-right" /></button></form></div></div>
        </div>
      </section>
    </main>
  )
}

