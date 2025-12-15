import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Auth.css'

function Registro({ onLogin }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [cargando, setCargando] = useState(false)
  const navegar = useNavigate()

  const manejarEnvio = async (e) => {
    e.preventDefault()

    if (contrasena !== confirmarContrasena) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (contrasena.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setCargando(true)

    try {
      const respuesta = await axios.post('http://localhost:5000/api/auth/registro', {
        nombre,
        email,
        contrasena
      })

      const { token, usuario } = respuesta.data
      onLogin(token, usuario)
      toast.success('¡Registro exitoso!')
      navegar('/dashboard')
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al registrarse'
      toast.error(mensaje)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-contenedor">
      <div className="auth-caja">
        <h1>📝 Crear Cuenta</h1>
        <form onSubmit={manejarEnvio}>
          <div className="form-grupo">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Tu nombre completo"
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-grupo">
            <label htmlFor="confirmarContrasena">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmarContrasena"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
              placeholder="Repite tu contraseña"
            />
          </div>

          <button type="submit" className="btn-primario" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-enlace">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  )
}

export default Registro
