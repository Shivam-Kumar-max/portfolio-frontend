import React, { useEffect, useState } from 'react'
import api from '../api/axios'

const emptyForm = { id: null, title: '', description: '', techStack: '', githubUrl: '', liveUrl: '', imageUrl: '' }
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

const optimizeScreenshot = async (file) => {
  const image = await createImageBitmap(file)
  const maxDimension = 1600
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.width * scale)
  canvas.height = Math.round(image.height * scale)
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
  image.close()

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Image could not be processed.')), 'image/jpeg', 0.82)
  })

  if (blob.size > 2 * 1024 * 1024) {
    throw new Error('Screenshot is still too large after compression. Choose a smaller image.')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Image could not be read.'))
    reader.readAsDataURL(blob)
  })
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [processingImage, setProcessingImage] = useState(false)

  const load = () => {
    api.get('/projects').then((res) => setProjects(res.data))
  }

  useEffect(() => { load() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleScreenshotChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file for the project screenshot.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Choose an image smaller than 10 MB.')
      e.target.value = ''
      return
    }

    setProcessingImage(true)
    setError('')
    try {
      const imageUrl = await optimizeScreenshot(file)
      setForm((current) => ({ ...current, imageUrl }))
    } catch (imageError) {
      setError(imageError.message || 'Could not process this screenshot.')
      e.target.value = ''
    } finally {
      setProcessingImage(false)
    }
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await api.put(`/projects/${form.id}`, form)
      } else {
        await api.post('/projects', form)
      }
      resetForm()
      load()
    } catch (err) {
      setError('Could not save project. Check the fields and try again.')
    }
  }

  const handleEdit = (project) => {
    setForm(project)
    setEditing(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    await api.delete(`/projects/${id}`)
    load()
  }

  return (
    <div>
      <h3 className="mb-4">Projects</h3>
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">{editing ? 'Edit Project' : 'Add Project'}</h6>
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="form-label small">Title</label>
                  <input name="title" className="form-control form-control-sm" value={form.title} onChange={handleChange} required />
                </div>
                <div className="mb-2">
                  <label className="form-label small">Description</label>
                  <textarea name="description" rows="3" className="form-control form-control-sm" value={form.description} onChange={handleChange} />
                </div>
                <div className="mb-2">
                  <label className="form-label small">Tech Stack</label>
                  <input name="techStack" className="form-control form-control-sm" value={form.techStack} onChange={handleChange} placeholder="React, Spring Boot, MySQL" />
                </div>
                <div className="mb-2">
                  <label className="form-label small">GitHub URL</label>
                  <input name="githubUrl" className="form-control form-control-sm" value={form.githubUrl} onChange={handleChange} />
                </div>
                <div className="mb-2">
                  <label className="form-label small">Live URL</label>
                  <input name="liveUrl" className="form-control form-control-sm" value={form.liveUrl} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Project Screenshot</label>
                  <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleScreenshotChange} />
                  <div className="form-text">Choose a screenshot from your device. It will be resized and saved with the project.</div>
                  {form.imageUrl && (
                    <div className="mt-2">
                      <img src={form.imageUrl} alt="Project screenshot preview" style={{ width: '100%', maxHeight: 180, objectFit: 'contain', border: '1px solid #ddd', borderRadius: 6 }} />
                      <button className="btn btn-link btn-sm text-danger px-0" type="button" onClick={() => setForm((current) => ({ ...current, imageUrl: '' }))}>Remove screenshot</button>
                    </div>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-brand btn-sm" type="submit" disabled={processingImage}>{processingImage ? 'Processing screenshot…' : editing ? 'Update' : 'Add'}</button>
                  {editing && <button className="btn btn-outline-secondary btn-sm" type="button" onClick={resetForm}>Cancel</button>}
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="table-responsive bg-white rounded shadow-sm">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Tech Stack</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td className="small text-muted">{p.techStack}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr><td colSpan="3" className="text-center text-muted py-3">No projects yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
