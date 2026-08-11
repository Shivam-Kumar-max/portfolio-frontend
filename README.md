# Portfolio Frontend (React + Vite + Bootstrap)

A public portfolio site (hero, about, skills, projects, contact form) backed
by the Spring Boot API, plus a JWT-protected admin dashboard to manage
skills, projects, and incoming contact messages.

## Stack
- React 18 + Vite
- React Router
- Axios (with a JWT-attaching interceptor)
- Bootstrap 5 + Bootstrap Icons

## 1. Install
```bash
npm install
```

## 2. Configure
```bash
cp .env.example .env
```
Edit `.env` if your backend isn't running on `http://localhost:8080`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## 3. Run
```bash
npm run dev
```
Opens at `http://localhost:5173`. Make sure the backend is running first —
the public page fetches skills/projects on load, and the contact form and
admin dashboard talk to the API directly.

## 4. Log in as admin
Go to `/login` and use the seeded admin credentials from the backend
(`admin` / `Admin@123` by default — see the backend README to change these).
After logging in you're redirected to `/admin`, where you can add/edit/
delete skills and projects, and view or delete contact messages. Everything
you add there immediately shows up on the public homepage.

## 5. Build for production
```bash
npm run build
```
Outputs static files to `dist/` — deploy behind any static host (Netlify,
Vercel, nginx, etc.), pointing `VITE_API_BASE_URL` at your deployed backend.

## Project structure
```
src/
  api/axios.js         # axios instance + JWT interceptor
  context/AuthContext   # login/logout/register + current user state
  components/           # Navbar, Footer, ProtectedRoute
  pages/
    Home.jsx             # public site
    Login.jsx             # admin login
    AdminDashboard.jsx    # sidebar layout, nested routes
    AdminSkills.jsx        # skills CRUD
    AdminProjects.jsx      # projects CRUD
    AdminMessages.jsx      # view/delete contact messages
```
