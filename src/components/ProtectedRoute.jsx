import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap admin-only routes with this. Redirects to /login if not authenticated
// as an admin, preserving the intended destination.
export default function ProtectedRoute({ children }) {
  const { user, isAdmin } = useAuth()

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}
