import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavigationBar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/"><span className="brand-symbol">A.</span> Portfolio</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item"><a className="nav-link" href="/#about">About</a></li>
            <li className="nav-item"><a className="nav-link" href="/#skills">Skills</a></li>
            <li className="nav-item"><a className="nav-link" href="/#projects">Projects</a></li>
            <li className="nav-item"><a className="nav-link" href="/#certificates">Certificates</a></li>
            {isAdmin && <li className="nav-item"><NavLink className="nav-link nav-admin" to="/admin">Dashboard</NavLink></li>}
            {user ? <li className="nav-item"><button className="btn btn-sm btn-outline-dark ms-lg-2" onClick={handleLogout}>Logout ({user.username})</button></li> : <li className="nav-item"><NavLink className="nav-link nav-admin" to="/login">Admin</NavLink></li>}
            <li className="nav-item"><a className="btn btn-sm btn-brand nav-cta" href="/#contact">Let’s talk <i className="bi bi-arrow-up-right" /></a></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
