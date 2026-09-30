
document.addEventListener('DOMContentLoaded', () => {
    
    const formRegistro = document.getElementById('form-registro');
    const tablaCuerpo = document.getElementById('tabla-cuerpo');
    const btnBuscar = document.getElementById('btnBuscar');
    const inputBusqueda = document.getElementById('inputBusqueda');

    const cantTotal = document.getElementById('cant-total');
    let contador = 2;

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('estudiante-nombre').value;
            const grado = document.getElementById('estudiante-grado').value;
            const sintomas = document.getElementById('sintomas').value;
            const temp = document.getElementById('temperatura').value || 'N/A';
            const estado = document.getElementById('estado-paciente').value;
            const procedimiento = document.getElementById('procedimiento').value || 'Sin observaciones adicionales.';

            const badgeClase = estado === 'Alta' ? 'badge-alta' : 'badge-observacion';

            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                <td>${nombre}</td>
                <td>${grado}</td>
                <td>${sintomas}</td>
                <td>${temp} °C</td>
                <td><span class="badge ${badgeClase}">${estado}</span></td>
                <td><button class="btn-detalles" onclick="verDetalles('${nombre}', '${grado}', '${sintomas}', '${temp} °C', '${procedimiento}')">Ver Ficha</button></td>
            `;

            tablaCuerpo.appendChild(nuevaFila);

            contador++;
            if (cantTotal) cantTotal.textContent = contador;
            
            formRegistro.reset();
            alert(Atención de ${nombre} registrada correctamente en el sistema.`);
        });
    }

    if (btnBuscar && inputBusqueda) {
        btnBuscar.addEventListener('click', () => {
            const filtro = inputBusqueda.value.toLowerCase().trim();
            const filas = tablaCuerpo.getElementsByTagName('tr');

            for (let fila of filas) {
                const textoFila = fila.textContent.toLowerCase();
                if (textoFila.includes(filtro)) {
                    fila.style.display = '';
                } else {
                    fila.style.display = 'none';
                }
            }
        });
    }
});

function verDetalles(nombre, grado, sintomas, temp, notas) {
    alert(´ FICHA MÉDICA DE ENFERMERÍA\n\nEstudiante: ${nombre}\nGrado: ${grado}\nSintomatología: ${sintomas}\nTemperatura: ${temp}\nObservaciones: ${notas}`);
}
