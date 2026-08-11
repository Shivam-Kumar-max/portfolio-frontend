import React from 'react'

export default function Footer() {
  return (
    <footer className="py-4 text-center" style={{ backgroundColor: '#1e1e2f', color: '#cfcfe8' }}>
      <div className="container">
        <p className="mb-0 small">
          &copy; {new Date().getFullYear()} Built with React, Vite &amp; Spring Boot.
        </p>
      </div>
    </footer>
  )
}
