import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavigationBar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: '#1e1e2f' }}>
      <div className="container">
        <Link className="navbar-brand" to="/">Portfolio</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item"><a className="nav-link" href="/#home">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="/#about">About</a></li>
            <li className="nav-item"><a className="nav-link" href="/#skills">Skills</a></li>
            <li className="nav-item"><a className="nav-link" href="/#skills">Certificates</a></li>
            <li className="nav-item"><a className="nav-link" href="/#projects">Projects</a></li>
            <li className="nav-item"><a className="nav-link" href="/#contact">Contact</a></li>

            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">Dashboard</NavLink>
              </li>
            )}

            {user ? (
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-light ms-lg-2" onClick={handleLogout}>
                  Logout ({user.username})
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink className="btn btn-sm btn-brand ms-lg-2" to="/login">Admin Login</NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
