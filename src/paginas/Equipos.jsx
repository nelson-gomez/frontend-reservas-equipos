import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Equipos.css'

function Equipos({ usuario }) {
  const [equipos, setEquipos] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState('')
  const [equiposDisponibles, setEquiposDisponibles] = useState([])
  const [cargando, setCargando] = useState(false)
  const [mostrarDisponibles, setMostrarDisponibles] = useState(false)

  useEffect(() => {
    cargarEquipos()
  }, [])

  const cargarEquipos = async () => {
    try {
      setCargando(true)
      const token = localStorage.getItem('token')
      const respuesta = await axios.get('http://localhost:5000/api/equipos', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEquipos(respuesta.data)
    } catch (error) {
      toast.error('Error al cargar equipos')
    } finally {
      setCargando(false)
    }
  }

  const buscarDisponibles = async () => {
    if (!fechaSeleccionada) {
      toast.warning('Por favor selecciona una fecha')
      return
    }

    try {
      setCargando(true)
      const token = localStorage.getItem('token')
      const respuesta = await axios.get(`http://localhost:5000/api/equipos/disponibles?fecha=${fechaSeleccionada}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEquiposDisponibles(respuesta.data)
      setMostrarDisponibles(true)
      toast.success(`Se encontraron ${respuesta.data.length} equipos disponibles`)
    } catch (error) {
      toast.error('Error al buscar equipos disponibles')
    } finally {
      setCargando(false)
    }
  }

  const crearReserva = async (equipoId) => {
    if (!fechaSeleccionada) {
      toast.warning('Por favor selecciona una fecha')
      return
    }

    try {
      setCargando(true)
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5000/api/reservas', {
        equipoId,
        fechaReserva: fechaSeleccionada
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('¡Reserva creada exitosamente!')
      buscarDisponibles()
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al crear reserva'
      toast.error(mensaje)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="equipos-contenedor">
      <div className="equipos-encabezado">
        <h1>📦 Equipos Disponibles</h1>
        <p>Consulta y reserva los equipos que necesitas</p>
      </div>

      <div className="filtro-seccion">
        <h2>Buscar Equipos por Fecha</h2>
        <div className="filtro-grupo">
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            className="input-fecha"
          />
          <button 
            onClick={buscarDisponibles} 
            className="btn-buscar"
            disabled={cargando}
          >
            {cargando ? 'Buscando...' : 'Buscar Disponibles'}
          </button>
        </div>
      </div>

      {mostrarDisponibles ? (
        <div className="equipos-seccion">
          <h2>Equipos Disponibles para {fechaSeleccionada}</h2>
          {equiposDisponibles.length === 0 ? (
            <p className="sin-equipos">No hay equipos disponibles para esta fecha</p>
          ) : (
            <div className="equipos-grid">
              {equiposDisponibles.map(equipo => (
                <div key={equipo.id} className="tarjeta-equipo">
                  <div className="equipo-icono">🖥️</div>
                  <h3>{equipo.nombre}</h3>
                  <p className="equipo-descripcion">{equipo.descripcion}</p>
                  <button 
                    onClick={() => crearReserva(equipo.id)}
                    className="btn-reservar"
                    disabled={cargando}
                  >
                    {cargando ? 'Reservando...' : 'Reservar'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="equipos-seccion">
          <h2>Todos los Equipos</h2>
          {cargando ? (
            <p className="cargando">Cargando equipos...</p>
          ) : (
            <div className="equipos-grid">
              {equipos.map(equipo => (
                <div key={equipo.id} className="tarjeta-equipo">
                  <div className="equipo-icono">🖥️</div>
                  <h3>{equipo.nombre}</h3>
                  <p className="equipo-descripcion">{equipo.descripcion}</p>
                  <p className="equipo-estado">
                    Estado: <span className={equipo.estado}>{equipo.estado}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Equipos
