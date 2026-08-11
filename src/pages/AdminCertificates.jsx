import React, { useEffect, useState } from 'react'
import api from '../api/axios'

const emptyForm = {
  id: null,
  description: '',
  image: ''
}

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    api.get('/certificates')
      .then((res) => setCertificates(res.data))
      .catch(() => setError('Could not load certificates.'))
  }

  useEffect(() => {
    load()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    // Only images
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5 MB.')
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setForm({
        ...form,
        image: reader.result
      })
      setError('')
    }

    reader.readAsDataURL(file)
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.image) {
      setError('Please select a certificate image.')
      return
    }

    try {
      if (editing) {
        await api.put(`/certificates/${form.id}`, form)
      } else {
        await api.post('/certificates', form)
      }

      resetForm()
      load()
    } catch (err) {
      setError('Could not save certificate. Please try again.')
    }
  }

  const handleEdit = (certificate) => {
    setForm(certificate)
    setEditing(true)
    setError('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return

    try {
      await api.delete(`/certificates/${id}`)
      load()
    } catch (err) {
      setError('Could not delete certificate.')
    }
  }

  return (
    <div>
      <h2 className="mb-4">Certificates</h2>

      {/* ADD / EDIT */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">

          <h5 className="mb-3">
            {editing ? 'Edit Certificate' : 'Add Certificate'}
          </h5>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Certificate Image</label>

              <input
                type="file"
                name="image"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />

              <small className="text-secondary">
                Select certificate image from your device.
              </small>
            </div>

            {/* IMAGE PREVIEW */}
            {form.image && (
              <div className="mb-3">
                <img
                  src={form.image}
                  alt="Certificate Preview"
                  style={{
                    width: 250,
                    maxHeight: 180,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 8
                  }}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Description</label>

              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter certificate description"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-brand me-2"
            >
              {editing ? 'Update' : 'Add'}
            </button>

            {editing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </form>
        </div>
      </div>

      {/* CERTIFICATE LIST */}
      <div className="card shadow-sm">
        <div className="card-body">

          <h5 className="mb-3">Certificates List</h5>

          <div className="row g-4">

            {certificates.map((c) => (
              <div className="col-md-4" key={c.id}>

                <div className="card h-100 shadow-sm">

                  {c.image && (
                    <img
                      src={c.image}
                      alt="Certificate"
                      className="card-img-top"
                      style={{
                        height: 200,
                        objectFit: 'contain',
                        padding: 10
                      }}
                    />
                  )}

                  <div className="card-body">
                    <p className="card-text text-secondary">
                      {c.description}
                    </p>

                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>

              </div>
            ))}

            {certificates.length === 0 && (
              <div className="col-12">
                <p className="text-secondary">
                  No certificates yet.
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}