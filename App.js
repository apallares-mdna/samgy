import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './menu';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const [estudiantes, setEstudiantes] = useState([]);
  const [atenciones, setAtenciones] = useState([]);

  const [queryBusqueda, setQueryBusqueda] = useState('');
  const [formEstudiante, setFormEstudiante] = useState({ 
    doc: '', nombre: '', grado: '', alergias: '', acudiente: '', telefonoAcudiente: '' 
  });
  const [formAtencion, setFormAtencion] = useState({ 
    estudiante: '', motivo: '', estado: 'Alta', observaciones: '' 
  });

  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  // Galería de imágenes / Carrusel
  const [slideActual, setSlideActual] = useState(0);
  const slidesGaleria = [
    {
      titulo: "Énfasis en Inglés",
      texto: "Nuestra propuesta fortalece la enseñanza del idioma inglés con material interactivo y plataformas comprobadas.",
      imagen: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80"
    },
    {
      titulo: "Proyecto SAMGY",
      texto: "Sistema automatizado de gestión de enfermería diseñado para el bienestar, registro y cuidado integral de nuestros estudiantes.",
      imagen: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"
    },
    {
      titulo: "Ambiente Escolar Seguro",
      texto: "Espacios modernos y personal médico capacitado para brindar una atención inmediata y oportuna a la comunidad educativa.",
      imagen: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Cambio automático cada 5 segundos
  useEffect(() => {
    const temporizador = setInterval(() => {
      siguienteSlide();
    }, 5000);
    return () => clearInterval(temporizador);
  }, [slideActual]);

  const siguienteSlide = () => {
    setSlideActual((prev) => (prev === slidesGaleria.length - 1 ? 0 : prev + 1));
  };

  const anteriorSlide = () => {
    setSlideActual((prev) => (prev === 0 ? slidesGaleria.length - 1 : prev - 1));
  };

  useEffect(() => {
    cargarEstudiantes();
    cargarAtenciones();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      const res = await axios.get(`${API_URL}/estudiantes`);
      setEstudiantes(res.data);
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
    }
  };

  const cargarAtenciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/atenciones`);
      setAtenciones(res.data);
    } catch (err) {
      console.error('Error al cargar atenciones:', err);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/estudiantes`, formEstudiante);
      alert('Estudiante registrado exitosamente.');
      setFormEstudiante({ doc: '', nombre: '', grado: '', alergias: '', acudiente: '', telefonoAcudiente: '' });
      cargarEstudiantes();
    } catch (err) {
      alert('Error al registrar estudiante.');
    }
  };

  const handleAddAttention = async (e) => {
    e.preventDefault();
    if (!formAtencion.estudiante) {
      alert('Por favor selecciona un estudiante.');
      return;
    }

    const estInfo = estudiantes.find(est => est.nombre === formAtencion.estudiante);
    const nuevaAtencion = {
      estudiante: formAtencion.estudiante,
      grado: estInfo ? estInfo.grado : 'Registrado',
      motivo: formAtencion.motivo,
      estado: formAtencion.estado,
      notas: formAtencion.observaciones || 'Atención en enfermería.'
    };

    try {
      await axios.post(`${API_URL}/atenciones`, nuevaAtencion);
      alert('Atención médica registrada correctamente.');
      setFormAtencion({ estudiante: '', motivo: '', estado: 'Alta', observaciones: '' });
      cargarAtenciones();
    } catch (err) {
      alert('Error al registrar la atención.');
    }
  };

  const abrirFichaEstudiante = (nombreEstudiante) => {
    if (!nombreEstudiante) return;
    const est = estudiantes.find(e => e.nombre.toLowerCase() === nombreEstudiante.toLowerCase());
    const historialEstudiante = atenciones.filter(a => a.estudiante.toLowerCase() === nombreEstudiante.toLowerCase());
    
    setEstudianteSeleccionado({
      info: est || { nombre: nombreEstudiante, grado: 'N/A', doc: 'N/A', alergias: 'Sin registros', acudiente: 'N/A', telefonoAcudiente: 'N/A' },
      historial: historialEstudiante
    });
  };

  const cambiarSeccion = (seccion) => {
    setSeccionActiva(seccion);
    setSidebarAbierto(false);
  };

  return (
    <div className="app-container">
      <div className="top-bar"></div>

      <header>
        <div className="header-left">
          <button 
            className="btn-menu-hamburguesa" 
            onClick={() => setSidebarAbierto(true)}
          >
            &#9776;
          </button>
          <div className="header-title-container">
            <h1>SAMGY</h1>
            <p>Sistema de Gestión de Enfermería Escolar</p>
          </div>
        </div>
      </header>

      {/* Menú separado */}
      <Menu 
        sidebarAbierto={sidebarAbierto} 
        setSidebarAbierto={setSidebarAbierto}
        seccionActiva={seccionActiva}
        cambiarSeccion={cambiarSeccion}
      />

      <main>
        {seccionActiva === 'inicio' && (
          <>
            {/* Galería de fotos */}
            <section 
              className="carrusel-institucion" 
              style={{ backgroundImage: `url(${slidesGaleria[slideActual].imagen})` }}
            >
              <div className="carrusel-overlay">
                <div className="carrusel-contenido">
                  <h2>{slidesGaleria[slideActual].titulo}</h2>
                  <p>{slidesGaleria[slideActual].texto}</p>
                </div>
              </div>
              <button className="carrusel-btn prev" onClick={anteriorSlide}>&#10094;</button>
              <button className="carrusel-btn next" onClick={siguienteSlide}>&#10095;</button>
              <div className="carrusel-puntos">
                {slidesGaleria.map((_, index) => (
                  <span 
                    key={index} 
                    className={`punto ${index === slideActual ? 'activo' : ''}`}
                    onClick={() => setSlideActual(index)}
                  />
                ))}
              </div>
            </section>

            <section className="card">
              <h2>Consulta Rápida de Estudiantes</h2>
              <p>Ingresa el nombre del estudiante para consultar su expediente clínico.</p>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Ej: Laura Martínez"
                  value={queryBusqueda}
                  onChange={(e) => setQueryBusqueda(e.target.value)}
                />
                <button type="button" className="btn-primary" onClick={() => abrirFichaEstudiante(queryBusqueda)}>
                  Buscar
                </button>
              </div>
            </section>

            <section className="card">
              <h2>Estado del Sistema</h2>
              <ul className="status-list">
                <li>Estudiantes registrados: <strong>{estudiantes.length}</strong></li>
                <li>Atenciones realizadas: <strong>{atenciones.length}</strong></li>
              </ul>
            </section>
          </>
        )}

        {seccionActiva === 'historial' && (
          <section className="card">
            <h2>Historial de Atenciones Médicas</h2>
            <div className="tabla-contenedor">
              <table>
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Grado</th>
                    <th>Motivo / Síntoma</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {atenciones.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay registros de atenciones.</td></tr>
                  ) : (
                    atenciones.map((item) => (
                      <tr key={item._id || item.id}>
                        <td>{item.estudiante}</td>
                        <td>{item.grado}</td>
                        <td>{item.motivo}</td>
                        <td>
                          <span className={`badge ${item.estado === 'Alta' ? 'badge-alta' : 'badge-observacion'}`}>
                            {item.estado}
                          </span>
                        </td>
                        <td>
                          <button 
                            type="button" 
                            className="btn-detalles"
                            onClick={() => abrirFichaEstudiante(item.estudiante)}
                          >
                            Ver Ficha
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {seccionActiva === 'registro' && (
          <section className="card">
            <h2>Registrar Nuevo Estudiante</h2>
            <form onSubmit={handleAddStudent}>
              <div className="form-grupo">
                <div className="form-campo">
                  <label>Documento de Identidad*</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej: 1098765432"
                    value={formEstudiante.doc}
                    onChange={(e) => setFormEstudiante({...formEstudiante, doc: e.target.value})}
                  />
                </div>
                <div className="form-campo">
                  <label>Nombre Completo*</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej: Laura Martínez"
                    value={formEstudiante.nombre}
                    onChange={(e) => setFormEstudiante({...formEstudiante, nombre: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-grupo">
                <div className="form-campo">
                  <label>Grado / Curso*</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej: 8 A"
                    value={formEstudiante.grado}
                    onChange={(e) => setFormEstudiante({...formEstudiante, grado: e.target.value})}
                  />
                </div>
                <div className="form-campo">
                  <label>Alergias / Condiciones Médicas</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Penicilina, Ninguna"
                    value={formEstudiante.alergias}
                    onChange={(e) => setFormEstudiante({...formEstudiante, alergias: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-grupo">
                <div className="form-campo">
                  <label>Acudiente / Tutor</label>
                  <input 
                    type="text" 
                    placeholder="Ej: María Rodríguez"
                    value={formEstudiante.acudiente}
                    onChange={(e) => setFormEstudiante({...formEstudiante, acudiente: e.target.value})}
                  />
                </div>
                <div className="form-campo">
                  <label>Teléfono Contacto</label>
                  <input 
                    type="text" 
                    placeholder="Ej: 3001234567"
                    value={formEstudiante.telefonoAcudiente}
                    onChange={(e) => setFormEstudiante({...formEstudiante, telefonoAcudiente: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary btn-guardar">Guardar Estudiante</button>
            </form>
          </section>
        )}

        {seccionActiva === 'atencion' && (
          <section className="card">
            <h2>Registrar Atención Médica</h2>
            <form onSubmit={handleAddAttention}>
              <div className="form-campo-full">
                <label>Seleccionar Estudiante*</label>
                <select 
                  required
                  value={formAtencion.estudiante}
                  onChange={(e) => setFormAtencion({...formAtencion, estudiante: e.target.value})}
                >
                  <option value="">-- Seleccionar de la lista --</option>
                  {estudiantes.map((est) => (
                    <option key={est._id || est.doc} value={est.nombre}>
                      {est.nombre} ({est.grado})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-campo-full">
                <label>Motivo de Consulta*</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej: Dolor de cabeza"
                  value={formAtencion.motivo}
                  onChange={(e) => setFormAtencion({...formAtencion, motivo: e.target.value})}
                />
              </div>

              <div className="form-campo-full">
                <label>Observaciones</label>
                <input 
                  type="text" 
                  placeholder="Ej: Reposo en enfermería 15 min"
                  value={formAtencion.observaciones}
                  onChange={(e) => setFormAtencion({...formAtencion, observaciones: e.target.value})}
                />
              </div>

              <div className="form-campo-full">
                <label>Estado del Paciente*</label>
                <select 
                  value={formAtencion.estado}
                  onChange={(e) => setFormAtencion({...formAtencion, estado: e.target.value})}
                >
                  <option value="Alta">Dado de Alta</option>
                  <option value="Observacion">En Observación</option>
                </select>
              </div>

              <button type="submit" className="btn-primary btn-guardar">Registrar Atención</button>
            </form>
          </section>
        )}

        {estudianteSeleccionado && (
          <div className="modal-overlay">
            <div className="modal-contenido card">
              <h2>Ficha Clínica del Estudiante</h2>
              <p><strong>Nombre:</strong> {estudianteSeleccionado.info.nombre}</p>
              <p><strong>Grado:</strong> {estudianteSeleccionado.info.grado}</p>
              <p><strong>Documento:</strong> {estudianteSeleccionado.info.doc}</p>
              <p><strong>Alergias:</strong> {estudianteSeleccionado.info.alergias}</p>
              <p><strong>Acudiente:</strong> {estudianteSeleccionado.info.acudiente || 'N/A'}</p>
              <p><strong>Teléfono:</strong> {estudianteSeleccionado.info.telefonoAcudiente || 'N/A'}</p>

              <h3 style={{ marginTop: '15px', color: '#0F5836' }}>Historial de Atenciones</h3>
              {estudianteSeleccionado.historial.length === 0 ? (
                <p>Sin registros previos.</p>
              ) : (
                <ul className="status-list">
                  {estudianteSeleccionado.historial.map((h, i) => (
                    <li key={i}>
                      <strong>Motivo:</strong> {h.motivo} | <strong>Estado:</strong> {h.estado}
                    </li>
                  ))}
                </ul>
              )}

              <button 
                type="button" 
                className="btn-primary" 
                style={{ marginTop: '15px' }}
                onClick={() => setEstudianteSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </main>

      <footer>
        Proyecto SAMGY - Yaricel Bayter, Mathias Hernández, Gabriela Martínez, Andrea Pallares, Sajoha Vásquez
      </footer>
    </div>
  );
}

export default App;
