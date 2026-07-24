const contenedor = document.getElementById("malla");

// CARGAR DATOS: Intentamos recuperar lo guardado en el teléfono/PC, si no hay nada, empezamos vacío
const datosGuardados = localStorage.getItem("ramosAprobados");
const ramosAprobados = datosGuardados ? new Set(JSON.parse(datosGuardados)) : new Set();

// 1. Renderizar la estructura inicial de la malla
for (const semestre in malla) {
    const bloqueSemestre = document.createElement("div");
    bloqueSemestre.classList.add("semestre");

    const titulo = document.createElement("h2");
    titulo.textContent = semestre.toUpperCase().replace("S", "SEM ");
    bloqueSemestre.appendChild(titulo);

    malla[semestre].forEach(ramo => {
        const div = document.createElement("div");
        
        const grupoClase = ramo[4].toLowerCase(); 
        div.classList.add("ramo", grupoClase);
        div.id = ramo[1]; 

        div.dataset.prerequisitos = JSON.stringify(ramo[5]);
        div.dataset.grupo = grupoClase; 

        div.innerHTML = `
            <div class="ramo-codigo" style="font-size: 9px; font-weight: bold; opacity: 0.7;">${ramo[1]}</div>
            <div style="margin: 4px 0; font-weight: 600; line-height: 1.2;">${ramo[0]}</div>
            <div class="ramo-creditos" style="font-size: 10px; opacity: 0.7; text-align: right;">${ramo[2]}</div>
        `;

        div.addEventListener("click", () => {
            if (!div.classList.contains("disponible") && !div.classList.contains("aprobado")) {
                return; 
            }

            if (ramosAprobados.has(div.id)) {
                ramosAprobados.delete(div.id);
                desaprobarCascada(div.id);
            } else {
                ramosAprobados.add(div.id);
            }

            // GUARDAR DATOS: Guardamos la lista actualizada en la memoria del navegador
            localStorage.setItem("ramosAprobados", JSON.stringify([...ramosAprobados]));

            actualizarMalla();
        });

        bloqueSemestre.appendChild(div);
    });

    contenedor.appendChild(bloqueSemestre);
}

// 2. Función que evalúa el estado y activa los colores de la malla original
function actualizarMalla() {
    document.querySelectorAll(".ramo").forEach(div => {
        const codigo = div.id;
        const prerequisitos = JSON.parse(div.dataset.prerequisitos);
        const grupo = div.dataset.grupo;

        div.className = `ramo ${grupo}`;

        if (ramosAprobados.has(codigo)) {
            div.classList.add("aprobado");
            return;
        }

        const todosPrerequisitosCumplidos = prerequisitos.every(pre => ramosAprobados.has(pre));

        if (todosPrerequisitosCumplidos) {
            div.classList.add("disponible");
        } else {
            div.classList.add("bloqueado");
        }
    });
}

function desaprobarCascada(codigoDesaprobado) {
    let huboCambios = false;
    document.querySelectorAll(".ramo").forEach(div => {
        if (ramosAprobados.has(div.id)) {
            const prerequisitos = JSON.parse(div.dataset.prerequisitos);
            if (prerequisitos.includes(codigoDesaprobado)) {
                ramosAprobados.delete(div.id);
                huboCambios = true;
            }
        }
    });
    if (huboCambios) {
        desaprobarCascada(codigoDesaprobado);
    }
}

actualizarMalla();

const coloresRamos = [
    { bg: '#fce4ec', border: '#f8bbd0', text: '#880e4f' }, // Rosado pastel clásico
    { bg: '#f3e5f5', border: '#e1bee7', text: '#4a148c' }, // Lila / Rosado purpúreo
    { bg: '#ffebee', border: '#ffcdd2', text: '#b71c1c' }, // Rosa coral suave
    { bg: '#fce8e6', border: '#f5c6cb', text: '#a71d2a' }, // Rosa empolvado
    { bg: '#fff0f3', border: '#ffccd5', text: '#c9184a' }, // Rosa vibrante suave
    { bg: '#f8edeb', border: '#fcd5ce', text: '#9e2a2b' }, // Rosa terracota / nude
    { bg: '#fae1dd', border: '#f8ad9d', text: '#6f1d1b' }  // Rosa durazno cálido
];

// 1. Tu paleta rosita
const coloresRamos = [
    { bg: '#fce4ec', border: '#f8bbd0', text: '#880e4f' },
    { bg: '#f3e5f5', border: '#e1bee7', text: '#4a148c' },
    { bg: '#ffebee', border: '#ffcdd2', text: '#b71c1c' },
    { bg: '#fce8e6', border: '#f5c6cb', text: '#a71d2a' },
    { bg: '#fff0f3', border: '#ffccd5', text: '#c9184a' },
    { bg: '#f8edeb', border: '#fcd5ce', text: '#9e2a2b' },
    { bg: '#fae1dd', border: '#f8ad9d', text: '#6f1d1b' }
];

// 2. Esta función va justo aquí abajito
function obtenerColorRamo(codigoRamo) {
    let hash = 0;
    for (let i = 0; i < codigoRamo.length; i++) {
        hash = codigoRamo.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % coloresRamos.length;
    return coloresRamos[index];
}

// Cuando estés creando la tarjeta visual del ramo para ponerla en el calendario:
const divRamo = document.createElement('div');
divRamo.className = 'tarjeta-ramo'; // (o la clase que uses)
divRamo.innerText = ramo.nombre;

// 🌸 AQUÍ ES DONDE APLICAS LOS COLORES ROSITAS:
console.log(sec);
console.log(sec.codigo);
const color = obtenerColorRamo(ramo.codigo);
divRamo.style.backgroundColor = color.bg;
divRamo.style.borderColor = color.border;
divRamo.style.color = color.text;
divRamo.style.borderLeft = `4px solid ${color.text}`;

// Y luego lo inyectas en la celda correspondiente de tu tabla:
const celda = document.getElementById(`celda-${bloque}-${dia}`);
if (celda) {
    celda.appendChild(divRamo);
}