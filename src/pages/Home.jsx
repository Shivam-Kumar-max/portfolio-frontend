import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Home() {
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [certificates,setCertificates] = useState([])
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/skills'), api.get('/projects'), api.get('/certificates')])
      .then(([skillsRes, projectsRes,certificatesRes]) => {
        setSkills(skillsRes.data)
        setProjects(projectsRes.data)
        setCertificates(certificatesRes.data)
      })
      .catch(() => {
        // Public site should still render even if the API is unreachable
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', text: '' })
    try {
      await api.post('/contacts', form)
      setStatus({ type: 'success', text: 'Thanks! Your message has been sent.' })
      setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus({ type: 'danger', text: 'Something went wrong. Please try again.' })
    }
  }

  const grouped = skills.reduce((acc, s) => {
    const key = s.category || 'General'
    acc[key] = acc[key] || []
    acc[key].push(s)
    return acc
  }, {})

  return (
    <>
      {/* HERO */}
      <section id="home" className="hero text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Hi, I'm a Full-Stack Developer</h1>
          <p className="lead col-lg-8 mx-auto">
            I build reliable web applications end-to-end — from REST APIs with Spring Boot
            to responsive interfaces with React.
          </p>
          <a href="#projects" className="btn btn-light btn-lg mt-2">View My Work</a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-5">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <p className="col-lg-8 text-secondary">
            I'm a software developer focused on building clean, maintainable full-stack
            applications. This portfolio itself is powered by a Spring Boot REST API with
            JWT-secured admin endpoints, and a React front end — everything below (skills,
            projects, and this contact form) is backed by real, working CRUD APIs.
          </p>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-5 bg-white">
        <div className="container">
          <h2 className="section-title">Skills</h2>
          {loading && <p className="text-secondary">Loading skills…</p>}
          {!loading && skills.length === 0 && (
            <p className="text-secondary">No skills added yet — add some from the admin dashboard.</p>
          )}
          <div className="row g-4">
            {Object.entries(grouped).map(([category, items]) => (
              <div className="col-md-6" key={category}>
                <h5 className="mb-3">{category}</h5>
                {items.map((s) => (
                  <div className="mb-3" key={s.id}>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>{s.skillName}</span>
                      <span>{s.percentage}%</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-bar-fill"
                        style={{ width: `${Math.min(parseInt(s.percentage) || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      
{/* CERTIFICATES */}
<section id="certificates" className="py-5 bg-white">
  <div className="container">
    <h2 className="section-title">Certificates</h2>

    {!loading && certificates.length === 0 && (
      <p className="text-secondary">
        No certificates added yet.
      </p>
    )}

    <div className="row g-4">
      {certificates.map((c) => (
        <div className="col-md-4" key={c.id}>
          <div className="card h-100 shadow-sm card-hover">

            {c.image && (
              <img
                src={c.image}
                className="card-img-top"
                alt="Certificate"
                style={{
                  height: 220,
                  objectFit: 'cover'
                }}
              />
            )}

            <div className="card-body">
              <p className="card-text text-secondary">
                {c.description}
              </p>
            </div>

          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* PROJECTS */}
      <section id="projects" className="py-5">
        <div className="container">
          <h2 className="section-title">Projects</h2>
          {!loading && projects.length === 0 && (
            <p className="text-secondary">No projects added yet — add some from the admin dashboard.</p>
          )}
          <div className="row g-4">
            {projects.map((p) => (
              <div className="col-md-4" key={p.id}>
                <div className="card h-100 shadow-sm card-hover">
                  {p.imageUrl && (
                    <img src={p.imageUrl} className="card-img-top" alt={p.title} style={{ height: 180, objectFit: 'cover' }} />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.title}</h5>
                    <p className="card-text text-secondary small flex-grow-1">{p.description}</p>
                    {p.techStack && <p className="small text-muted mb-2"><i className="bi bi-tools me-1"></i>{p.techStack}</p>}
                    <div className="d-flex gap-2">
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark">
                          <i className="bi bi-github me-1"></i>Code
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-brand">
                          <i className="bi bi-box-arrow-up-right me-1"></i>Live
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-5 bg-white">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="row">
            <div className="col-lg-7">
              {status.text && <div className={`alert alert-${status.type}`}>{status.text}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      className="form-control"
                      rows="4"
                      value={form.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-brand px-4">Send Message</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
