import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [estudiantes, setEstudiantes] = useState([]);
  const [atenciones, setAtenciones] = useState([]);
  const [queryBusqueda, setQueryBusqueda] = useState('');
  const [formEstudiante, setFormEstudiante] = useState({ doc: '', nombre: '', grado: '', alergias: '' });
  const [formAtencion, setFormAtencion] = useState({ estudiante: '', motivo: '', estado: 'Alta' });

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
      alert('Estudiante guardado exitosamente.');
      setFormEstudiante({ doc: '', nombre: '', grado: '', alergias: '' });
      cargarEstudiantes();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'No se pudo registrar el estudiante.'));
    }
  };

  const handleAddAttention = async (e) => {
    e.preventDefault();
    if (!formAtencion.estudiante) {
      alert('Por favor selecciona un estudiante del menú desplegable.');
      return;
    }

    const estInfo = estudiantes.find(est => est.nombre === formAtencion.estudiante);
    const nuevaAtencion = {
      estudiante: formAtencion.estudiante,
      grado: estInfo ? estInfo.grado : 'Registrado',
      motivo: formAtencion.motivo,
      estado: formAtencion.estado
    };

    try {
      await axios.post(`${API_URL}/atenciones`, nuevaAtencion);
      alert('Atención médica registrada correctamente.');
      setFormAtencion({ estudiante: '', motivo: '', estado: 'Alta' });
      cargarAtenciones();
    } catch (err) {
      alert('Error al registrar la atención médica.');
    }
  };
  const handleBuscar = () => {
    if (!queryBusqueda.trim()) return;
    const res = estudiantes.find(e => 
      e.nombre.toLowerCase().includes(queryBusqueda.toLowerCase().trim()) || e.doc.includes(queryBusqueda.trim())
    );

    if (res) {
      alert(`EXPEDIENTE SAMGY:\n\nNombre: ${res.nombre}\nGrado: ${res.grado}\nDocumento: ${res.doc}\nAlergias: ${res.alergias}`);
    } else {
      alert(`No se encontraron registros para: "${queryBusqueda}".`);
    }
  };

  return (
    <div className="app-container">
      {/* ENCABEZADO */}
      <header>
        <h1>SAMGY</h1>
        <p>Sistema de Gestión de Enfermería Escolar</p>
      </header>

      <nav>
        <div className="nav-header">
          <button className="hamburger-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
            Menu
          </button>
        </div>
        <ul className={menuAbierto ? 'menu-visible' : 'menu-oculto'}>
          <li>
            <button 
              className={`nav-link ${seccionActiva === 'inicio' ? 'activo' : ''}`} 
              onClick={() => { setSeccionActiva('inicio'); setMenuAbierto(false); }}
            >
              Inicio
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${seccionActiva === 'atencion' ? 'activo' : ''}`} 
              onClick={() => { setSeccionActiva('atencion'); setMenuAbierto(false); }}
            >
              Registrar Atención
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${seccionActiva === 'registro' ? 'activo' : ''}`} 
              onClick={() => { setSeccionActiva('registro'); setMenuAbierto(false); }}
            >
              Nuevo Estudiante
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${seccionActiva === 'historial' ? 'activo' : ''}`} 
              onClick={() => { setSeccionActiva('historial'); setMenuAbierto(false); }}
            >
              Historial
            </button>
          </li>
        </ul>
      </nav>
      <main>
        {(seccionActiva === 'inicio' || seccionActiva === 'historial') && (
          <>
            <section className="card">
              <h2>Consulta Rápida de Estudiantes</h2>
              <p>Ingresa el documento o nombre del estudiante para consultar la base de datos.</p>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Ej: Laura Martínez o N Doc"
                  value={queryBusqueda}
                  onChange={(e) => setQueryBusqueda(e.target.value)}
                />
                <button type="button" className="btn-primary" onClick={handleBuscar}>Buscar</button>
              </div>
            </section>

            <section className="card">
              <h2>Estado del Sistema</h2>
              <ul className="status-list">
                <li>Estudiantes registrados: <strong>{estudiantes.length}</strong></li>
                <li>Atenciones realizadas: <strong>{atenciones.length}</strong></li>
              </ul>
            </section>

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
                    {atenciones.map((item) => (
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
                            onClick={() => alert(`FICHA MÉDICA DE ENFERMERÍA\n\nEstudiante: ${item.estudiante}\nGrado: ${item.grado}\nMotivo: ${item.motivo}\nNotas: ${item.notas || 'Sin observaciones.'}`)}
                          >
                            Ficha
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
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
                  <label>Alergias / Condiciones</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Penicilina, Ninguna"
                    value={formEstudiante.alergias}
                    onChange={(e) => setFormEstudiante({...formEstudiante, alergias: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary btn-guardar">Guardar en Base de Datos</button>
            </form>
          </section>
        )}

        {seccionActiva === 'atencion' && (
          <section className="card">
            <h2>Registrar Atención Médica</h2>
            <form onSubmit={handleAddAttention}>
              <div className="form-campo-full">
                <label>Seleccionar Estudiante (Menú Desplegable Dinámico)*</label>
                <select 
                  className="select-desplegable"
                  required
                  value={formAtencion.estudiante}
                  onChange={(e) => setFormAtencion({...formAtencion, estudiante: e.target.value})}
                >
                  <option value="">-- Seleccione un estudiante de la lista --</option>
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
                  placeholder="Ej: Dolor de cabeza, Caída en patio"
                  value={formAtencion.motivo}
                  onChange={(e) => setFormAtencion({...formAtencion, motivo: e.target.value})}
                />
              </div>

              <div className="form-campo-full">
                <label>Estado del Paciente*</label>
                <select 
                  value={formAtencion.estado}
                  onChange={(e) => setFormAtencion({...formAtencion, estado: e.target.value})}
                >
                  <option value="Alta">Dado de Alta</option>
                  <option value="Observación">En Observación</option>
                </select>
              </div>

              <button type="submit" className="btn-primary btn-guardar">Registrar Atención</button>
            </form>
          </section>
        )}
      </main>

      <footer>
        Proyecto SAMGY — Yaricel Bayter, Mathias Hernández, Gabriela Martínez, Andrea Pallares, Sajoha Vasquez[cite: 10]
      </footer>
    </div>
  );
}

export default App;
