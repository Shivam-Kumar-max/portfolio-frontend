import React from 'react'
import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import AdminSkills from './AdminSkills'
import AdminProjects from './AdminProjects'
import AdminMessages from './AdminMessages'
import AdminCertificates from './AdminCertificates'

export default function AdminDashboard() {
  return (
    <div className="d-flex">
      <div className="admin-sidebar text-white p-3" style={{ width: 220 }}>
        <h6 className="text-uppercase text-secondary small mb-3 px-2">Manage</h6>
        <ul className="nav nav-pills flex-column gap-1">
          <li className="nav-item">
            <NavLink to="/admin/skills" className="nav-link">
              <i className="bi bi-bar-chart-line me-2"></i>Skills
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/admin/certificates" className="nav-link">
              <i className="bi bi-kanban me-2"></i>Certificate
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/admin/projects" className="nav-link">
              <i className="bi bi-kanban me-2"></i>Projects
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/messages" className="nav-link">
              <i className="bi bi-envelope me-2"></i>Messages
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="flex-grow-1 p-4">
        <Routes>
          <Route index element={<Navigate to="skills" replace />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="messages" element={<AdminMessages />} />
        </Routes>
      </div>
    </div>
  )
}
