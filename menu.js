import React from 'react';

function Menu({ sidebarAbierto, setSidebarAbierto, seccionActiva, cambiarSeccion }) {
  return (
    <>
      {sidebarAbierto && (
        <div className="sidebar-overlay" onClick={() => setSidebarAbierto(false)}></div>
      )}

      <div className={`sidebar-panel ${sidebarAbierto ? 'abierto' : ''}`}>
        <div className="sidebar-header">
          <h2>Menú Navegación</h2>
          <button className="btn-cerrar-sidebar" onClick={() => setSidebarAbierto(false)}>
            &#10005;
          </button>
        </div>
        <ul className="sidebar-menu">
          <li>
            <button 
              className={`sidebar-link ${seccionActiva === 'inicio' ? 'activo' : ''}`}
              onClick={() => cambiarSeccion('inicio')}
            >
              Inicio / Galería
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-link ${seccionActiva === 'atencion' ? 'activo' : ''}`}
              onClick={() => cambiarSeccion('atencion')}
            >
              Registrar Atención
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-link ${seccionActiva === 'registro' ? 'activo' : ''}`}
              onClick={() => cambiarSeccion('registro')}
            >
              Nuevo Estudiante
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-link ${seccionActiva === 'historial' ? 'activo' : ''}`}
              onClick={() => cambiarSeccion('historial')}
            >
              Historial Completo
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Menu;
