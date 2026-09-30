
let estudiantes = JSON.parse(localStorage.getItem('samgy_estudiantes')) || [
    { doc: '1001', nombre: 'Laura Martínez', grado: '9° B', alergias: 'Ninguna' },
    { doc: '1002', nombre: 'Mateo Gómez', grado: '6° A', alergias: 'Polen' }
];

let atenciones = JSON.parse(localStorage.getItem('samgy_atenciones')) || [
    { estudiante: 'Laura Martínez', grado: '9° B', motivo: 'Cefalea (Dolor de cabeza)', estado: 'Alta', notas: 'Dado de alta tras 20 min de reposo.' },
    { estudiante: 'Mateo Gómez', grado: '6° A', motivo: 'Fiebre leve (37.8 °C)', estado: 'Observación', notas: 'En espera de llamado a acudiente.' }
];

document.addEventListener('DOMContentLoaded', () => {
    actualizarContadores();
    cargarDesplegableEstudiantes();
    renderizarTablaHistorial();
});

function mostrarSeccion(idSeccion) {
    const seccionRegistro = document.getElementById('registro');
    const seccionAtencion = document.getElementById('atencion');

    if (seccionRegistro) seccionRegistro.style.display = 'none';
    if (seccionAtencion) seccionAtencion.style.display = 'none';

    if (idSeccion) {
        const objetivo = document.getElementById(idSeccion);
        if (objetivo) {
            objetivo.style.display = 'block';
            objetivo.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function addStudent(e) {
    e.preventDefault();
    
    const doc = document.getElementById('doc').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const grado = document.getElementById('grado').value.trim();
    const alergias = document.getElementById('alergias').value.trim() || 'Ninguna';

    const existe = estudiantes.some(est => est.doc === doc);
    if (existe) {
        alert(' Ya existe un estudiante registrado con este número de documento.');
        return;
    }

    const nuevoEstudiante = { doc, nombre, grado, alergias };
    estudiantes.push(nuevoEstudiante);
    guardarEnLocalStorage();

    actualizarContadores();
    cargarDesplegableEstudiantes();

    document.getElementById('form-estudiante').reset();
    alert(' Estudiante registrado exitosamente en la base de datos de SAMGY.');
}

function addAttention(e) {
    e.preventDefault();
    
    const estudianteNombre = document.getElementById('select-estudiante').value;
    const motivo = document.getElementById('motivo').value.trim();
    const estado = document.getElementById('estado-atencion').value;

    if (!estudianteNombre) {
        alert('Por favor selecciona un estudiante de la lista.');
        return;
    }

    const estInfo = estudiantes.find(e => e.nombre === estudianteNombre);
    const grado = estInfo ? estInfo.grado : 'Registrado';

    const nuevaAtencion = {
        estudiante: estudianteNombre,
        grado: grado,
        motivo: motivo,
        estado: estado,
        notas: `Atención registrada el ${new Date().toLocaleDateString('es-CO')}`
    };

    atenciones.push(nuevaAtencion);
    guardarEnLocalStorage();

    renderizarTablaHistorial();
    actualizarContadores();

    document.getElementById('form-atencion').reset();
    alert(' Atención de enfermería registrada correctamente.');
}


function buscarEstudiante() {
    const input = document.getElementById('inputBusqueda');
    if (!input) return;

    const query = input.value.toLowerCase().trim();

    if (query === '') {
        alert('Por favor ingresa un nombre o documento para iniciar la búsqueda.');
        return;
    }

    const resultado = estudiantes.find(e => 
        e.nombre.toLowerCase().includes(query) || e.doc.includes(query)
    );

    if (resultado) {
        alert(` COINCIDENCIA ENCONTRADA - SAMGY\n\nNombre: ${resultado.nombre}\nGrado: ${resultado.grado}\nDocumento: ${resultado.doc}\nAlergias/Condiciones: ${resultado.alergias}`);
    } else {
        alert(` No se encontraron registros coincidentes con: "${query}".`);
    }
}

function verDetalles(nombre, grado, motivo, notas) {
    alert(` FICHA DE ATENCIÓN - SAMGY\n\nEstudiante: ${nombre}\nGrado: ${grado}\nMotivo de consulta: ${motivo}\nObservaciones: ${notas}`);
}

function actualizarContadores() {
    const totalEst = document.getElementById('total-estudiantes');
    const totalAtenc = document.getElementById('total-atenciones');

    if (totalEst) totalEst.innerText = estudiantes.length;
    if (totalAtenc) totalAtenc.innerText = atenciones.length;
}

function cargarDesplegableEstudiantes() {
    const select = document.getElementById('select-estudiante');
    if (!select) return;

    select.innerHTML = '<option value="">-- Seleccione un estudiante --</option>';
    estudiantes.forEach(est => {
        select.innerHTML += `<option value="${est.nombre}">${est.nombre} (${est.grado})</option>`;
    });
}

function renderizarTablaHistorial() {
    const tablaCuerpo = document.getElementById('tabla-cuerpo');
    if (!tablaCuerpo) return;

    tablaCuerpo.innerHTML = '';

    atenciones.forEach(atencion => {
        const badgeClase = atencion.estado === 'Alta' ? 'badge-alta' : 'badge-observacion';
        const nuevaFila = document.createElement('tr');
        
        nuevaFila.innerHTML = `
            <td>${atencion.estudiante}</td>
            <td>${atencion.grado}</td>
            <td>${atencion.motivo}</td>
            <td><span class="badge ${badgeClase}">${atencion.estado}</span></td>
            <td><button type="button" class="btn-detalles" onclick="verDetalles('${atencion.estudiante}', '${atencion.grado}', '${atencion.motivo}', '${atencion.notas}')">Ficha</button></td>
        `;
        
        tablaCuerpo.appendChild(nuevaFila);
    });
}

function guardarEnLocalStorage() {
    localStorage.setItem('samgy_estudiantes', JSON.stringify(estudiantes));
    localStorage.setItem('samgy_atenciones', JSON.stringify(atenciones));
}
