import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Converter from './pages/Converter'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
          Currency Converter
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/converter" element={
              <ProtectedRoute>
                <Converter />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white text-center p-2 text-sm">
          &copy; {new Date().getFullYear()} Currency Converter
        </footer>
      </div>
    </Router>
  )
}

export default App
