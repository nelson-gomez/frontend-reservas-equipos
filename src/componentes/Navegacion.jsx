import { Link, useNavigate } from 'react-router-dom'
import './Navegacion.css'

function Navegacion({ usuario, onLogout }) {
  const navegar = useNavigate()

  const manejarLogout = () => {
    onLogout()
    navegar('/login')
  }

  return (
    <nav className="navegacion">
      <div className="nav-contenedor">
        <div className="nav-logo">
          <h1>📦 Reservas Equipos</h1>
        </div>
        <div className="nav-enlaces">
          <Link to="/dashboard" className="nav-enlace">Dashboard</Link>
          <Link to="/equipos" className="nav-enlace">Equipos</Link>
          <Link to="/mis-reservas" className="nav-enlace">Mis Reservas</Link>
        </div>
        <div className="nav-usuario">
          <span className="usuario-nombre">👤 {usuario?.nombre}</span>
          <button className="btn-logout" onClick={manejarLogout}>Cerrar Sesión</button>
        </div>
      </div>
    </nav>
  )
}

export default Navegacion
