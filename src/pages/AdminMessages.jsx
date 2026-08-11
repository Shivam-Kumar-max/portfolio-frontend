import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])

  const load = () => {
    api.get('/contacts').then((res) => setMessages(res.data))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    await api.delete(`/contacts/${id}`)
    load()
  }

  return (
    <div>
      <h3 className="mb-4">Contact Messages</h3>
      <div className="row g-3">
        {messages.map((m) => (
          <div className="col-12" key={m.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h6 className="mb-1">{m.firstName} {m.lastName} <span className="text-muted small">&lt;{m.email}&gt;</span></h6>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id)}>Delete</button>
                </div>
                {m.subject && <p className="mb-1 fw-semibold small">{m.subject}</p>}
                <p className="mb-0 small text-secondary">{m.message}</p>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-muted">No messages yet.</p>}
      </div>
    </div>
  )
}
