import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Dashboard.css'

function Dashboard({ usuario }) {
  const [estadisticas, setEstadisticas] = useState({
    totalEquipos: 0,
    misReservas: 0,
    reservasActivas: 0
  })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const respuestaEquipos = await axios.get('http://localhost:5000/api/equipos', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const respuestaReservas = await axios.get('http://localhost:5000/api/reservas/mis-reservas', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const reservasActivas = respuestaReservas.data.filter(r => r.estado === 'activa').length

      setEstadisticas({
        totalEquipos: respuestaEquipos.data.length,
        misReservas: respuestaReservas.data.length,
        reservasActivas
      })
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="dashboard-contenedor">
      <div className="dashboard-encabezado">
        <h1>👋 Bienvenido, {usuario?.nombre}</h1>
        <p>Aquí puedes gestionar tus reservas de equipos</p>
      </div>

      {cargando ? (
        <p className="cargando">Cargando...</p>
      ) : (
        <div className="estadisticas-grid">
          <div className="tarjeta-estadistica">
            <div className="estadistica-icono">📦</div>
            <div className="estadistica-contenido">
              <h3>Equipos Disponibles</h3>
              <p className="numero">{estadisticas.totalEquipos}</p>
            </div>
          </div>

          <div className="tarjeta-estadistica">
            <div className="estadistica-icono">📋</div>
            <div className="estadistica-contenido">
              <h3>Total de Reservas</h3>
              <p className="numero">{estadisticas.misReservas}</p>
            </div>
          </div>

          <div className="tarjeta-estadistica">
            <div className="estadistica-icono">✅</div>
            <div className="estadistica-contenido">
              <h3>Reservas Activas</h3>
              <p className="numero">{estadisticas.reservasActivas}</p>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-acciones">
        <h2>Acciones Rápidas</h2>
        <div className="acciones-grid">
          <a href="/equipos" className="accion-tarjeta">
            <span className="accion-icono">🔍</span>
            <h3>Ver Equipos</h3>
            <p>Consulta equipos disponibles y reserva</p>
          </a>
          <a href="/mis-reservas" className="accion-tarjeta">
            <span className="accion-icono">📅</span>
            <h3>Mis Reservas</h3>
            <p>Gestiona tus reservas activas</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
