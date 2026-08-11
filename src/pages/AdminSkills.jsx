import React, { useEffect, useState } from 'react'
import api from '../api/axios'

const emptyForm = { id: null, skillName: '', percentage: '', category: '' }

export default function AdminSkills() {
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    api.get('/skills').then((res) => setSkills(res.data))
  }

  useEffect(() => { load() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await api.put(`/skills/${form.id}`, form)
      } else {
        await api.post('/skills', form)
      }
      resetForm()
      load()
    } catch (err) {
      setError('Could not save skill. Check the fields and try again.')
    }
  }

  const handleEdit = (skill) => {
    setForm(skill)
    setEditing(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return
    await api.delete(`/skills/${id}`)
    load()
  }

  return (
    <div>
      <h3 className="mb-4">Skills</h3>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">{editing ? 'Edit Skill' : 'Add Skill'}</h6>
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="form-label small">Skill Name</label>
                  <input name="skillName" className="form-control form-control-sm" value={form.skillName} onChange={handleChange} required />
                </div>
                <div className="mb-2">
                  <label className="form-label small">Percentage</label>
                  <input name="percentage" type="number" min="0" max="100" className="form-control form-control-sm" value={form.percentage} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Category</label>
                  <input name="category" className="form-control form-control-sm" value={form.category} onChange={handleChange} placeholder="e.g. Backend" />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-brand btn-sm" type="submit">{editing ? 'Update' : 'Add'}</button>
                  {editing && <button className="btn btn-outline-secondary btn-sm" type="button" onClick={resetForm}>Cancel</button>}
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="table-responsive bg-white rounded shadow-sm">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>%</th>
                  <th>Category</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {skills.map((s) => (
                  <tr key={s.id}>
                    <td>{s.skillName}</td>
                    <td>{s.percentage}</td>
                    <td>{s.category}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(s)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {skills.length === 0 && (
                  <tr><td colSpan="4" className="text-center text-muted py-3">No skills yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
