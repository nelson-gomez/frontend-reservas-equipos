import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Auth.css'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [cargando, setCargando] = useState(false)
  const navegar = useNavigate()

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setCargando(true)

    try {
      const respuesta = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        contrasena
      })

      const { token, usuario } = respuesta.data
      onLogin(token, usuario)
      toast.success('¡Sesión iniciada correctamente!')
      navegar('/dashboard')
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al iniciar sesión'
      toast.error(mensaje)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-contenedor">
      <div className="auth-caja">
        <h1>🔐 Iniciar Sesión</h1>
        <form onSubmit={manejarEnvio}>
          <div className="form-grupo">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-grupo">
            <label htmlFor="contrasena">Contraseña:</label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              placeholder="Tu contraseña"
            />
          </div>

          <button type="submit" className="btn-primario" disabled={cargando}>
            {cargando ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="auth-enlace">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
