import './PieDePagina.css'

function PieDePagina() {
  const anioActual = new Date().getFullYear()

  return (
    <footer className="pie-de-pagina">
      <div className="pie-de-pagina-contenedor">
        <span className="pie-de-pagina-texto">© {anioActual} Nelson Gomez</span>
      </div>
    </footer>
  )
}

export default PieDePagina
