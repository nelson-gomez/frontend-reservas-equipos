import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './MisReservas.css'

function MisReservas({ usuario }) {
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [cancelando, setCancelando] = useState(null)

  useEffect(() => {
    cargarReservas()
  }, [])

  const cargarReservas = async () => {
    try {
      setCargando(true)
      const token = localStorage.getItem('token')
      const respuesta = await axios.get('http://localhost:5000/api/reservas/mis-reservas', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReservas(respuesta.data)
    } catch (error) {
      toast.error('Error al cargar reservas')
    } finally {
      setCargando(false)
    }
  }

  const cancelarReserva = async (reservaId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return
    }

    try {
      setCancelando(reservaId)
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5000/api/reservas/${reservaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Reserva cancelada exitosamente')
      cargarReservas()
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al cancelar reserva'
      toast.error(mensaje)
    } finally {
      setCancelando(null)
    }
  }

  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha)
    const año = fechaObj.getUTCFullYear()
    const mes = fechaObj.getUTCMonth()
    const día = fechaObj.getUTCDate()
    
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    
    return `${día} de ${meses[mes]} de ${año}`
  }

  const reservasActivas = reservas.filter(r => r.estado === 'activa')
  const reservasCanceladas = reservas.filter(r => r.estado === 'cancelada')

  return (
    <div className="mis-reservas-contenedor">
      <div className="mis-reservas-encabezado">
        <h1>📅 Mis Reservas</h1>
        <p>Gestiona tus reservas de equipos</p>
      </div>

      {cargando ? (
        <p className="cargando">Cargando reservas...</p>
      ) : reservas.length === 0 ? (
        <div className="sin-reservas">
          <p>No tienes reservas aún</p>
          <a href="/equipos" className="btn-ir-equipos">Ir a Equipos</a>
        </div>
      ) : (
        <>
          {reservasActivas.length > 0 && (
            <div className="reservas-seccion">
              <h2>✅ Reservas Activas ({reservasActivas.length})</h2>
              <div className="reservas-lista">
                {reservasActivas.map(reserva => (
                  <div key={reserva.id} className="tarjeta-reserva activa">
                    <div className="reserva-contenido">
                      <div className="reserva-equipo">
                        <h3>🖥️ {reserva.Equipo?.nombre}</h3>
                        <p className="reserva-descripcion">{reserva.Equipo?.descripcion}</p>
                      </div>
                      <div className="reserva-detalles">
                        <p><strong>Fecha:</strong> {formatearFecha(reserva.fechaReserva)}</p>
                        <p><strong>Estado:</strong> <span className="estado-activa">Activa</span></p>
                        <p><strong>Creada:</strong> {formatearFecha(reserva.fechaCreacion)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => cancelarReserva(reserva.id)}
                      className="btn-cancelar"
                      disabled={cancelando === reserva.id}
                    >
                      {cancelando === reserva.id ? 'Cancelando...' : 'Cancelar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reservasCanceladas.length > 0 && (
            <div className="reservas-seccion">
              <h2>❌ Reservas Canceladas ({reservasCanceladas.length})</h2>
              <div className="reservas-lista">
                {reservasCanceladas.map(reserva => (
                  <div key={reserva.id} className="tarjeta-reserva cancelada">
                    <div className="reserva-contenido">
                      <div className="reserva-equipo">
                        <h3>🖥️ {reserva.Equipo?.nombre}</h3>
                        <p className="reserva-descripcion">{reserva.Equipo?.descripcion}</p>
                      </div>
                      <div className="reserva-detalles">
                        <p><strong>Fecha:</strong> {formatearFecha(reserva.fechaReserva)}</p>
                        <p><strong>Estado:</strong> <span className="estado-cancelada">Cancelada</span></p>
                        <p><strong>Creada:</strong> {formatearFecha(reserva.fechaCreacion)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MisReservas
