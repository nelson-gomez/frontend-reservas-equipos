import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Dashboard from './paginas/Dashboard'
import Equipos from './paginas/Equipos'
import MisReservas from './paginas/MisReservas'
import Navegacion from './componentes/Navegacion'
import PieDePagina from './componentes/PieDePagina'

function App() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false)
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')
    if (token && usuarioGuardado) {
      setUsuarioAutenticado(true)
      setUsuario(JSON.parse(usuarioGuardado))
    }
  }, [])

  const manejarLogin = (token, datosUsuario) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(datosUsuario))
    setUsuarioAutenticado(true)
    setUsuario(datosUsuario)
  }

  const manejarLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuarioAutenticado(false)
    setUsuario(null)
  }

  return (
    <div className="app-container">
      {usuarioAutenticado && <Navegacion usuario={usuario} onLogout={manejarLogout} />}
      <main className="contenido-principal">
        <Routes>
          <Route path="/login" element={<Login onLogin={manejarLogin} />} />
          <Route path="/registro" element={<Registro onLogin={manejarLogin} />} />
          <Route 
            path="/dashboard" 
            element={usuarioAutenticado ? <Dashboard usuario={usuario} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/equipos" 
            element={usuarioAutenticado ? <Equipos usuario={usuario} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/mis-reservas" 
            element={usuarioAutenticado ? <MisReservas usuario={usuario} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={usuarioAutenticado ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <PieDePagina />
    </div>
  )
}

export default App
