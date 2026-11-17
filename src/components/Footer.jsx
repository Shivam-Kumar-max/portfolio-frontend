import React from 'react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span className="footer-brand">Portfolio<span style={{ color: 'var(--brand)' }}>.</span></span>
        <p>© {new Date().getFullYear()} Built with care. All rights reserved.</p>
        <a href="#home" className="text-decoration-none">Back to top ↑</a>
      </div>
    </footer>
  )
}
