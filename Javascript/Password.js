/* ========================VARIABLES GLOBALES=========================================== */

let formularioAcceso;
let usuario;
let contrasena;
let recordar;
let accesos = []; //Usuarios logeados
/* =============================CLASES CONSTRUCTORAS====================================================== */
class Status {
    constructor(usuario) {
        this.usuario = usuario;
    }
}
/* ============================FUNCIONES===================================== */
function inicializarElementos() {
    formularioAcceso = document.getElementById("formularioAcceso");
    usuario = document.getElementById("usuario");
    contrasena = document.getElementById("contrasena");
}

function inicializarEventos() {
    formularioAcceso.onsubmit = (evento) => {
        evento.preventDefault();
        validarFormularioAcceso(evento);
    }
}

function validarFormularioAcceso(evento) {
    evento.preventDefault();
    let user = usuario.value;
    let pass = contrasena.value;
    validarUsuarioContrasena(user, pass);
}

/* validar usuario y contraseña */
function validarUsuarioContrasena(user, pass) {
    let usuarios = {
        usuario: ["admin", "juan", "victor", "valeria"],
        contrasena: ["1234", "juanbolsa123", "victor_1234", "valle"],
    } //Objeto de contraseñas aceptadas
    if (usuarios.usuario.includes(user)) {
        let indexContrasena = usuarios.usuario.findIndex((us) => us == user);
        if (usuarios.contrasena[indexContrasena] === pass) {
            let accesoNuevo = new Status(user);
            accesos.push(accesoNuevo);
            ActualizarInicioSesionStorage();
            alertaExito(`Bienvenido ${user}`);
            location.replace("./HTML/Inventario.html");
        } else {
            alertaError("Contraseña incorrecta");
        }
    } else {
        alertaError("Usuario incorrecto");
    }
}
/* ============================================================SESION STORAGE Y JSON======================================= */
/* Actualizar inicios de sesion en el storage*/
function ActualizarInicioSesionStorage() {
    let statusJSON;
    statusJSON = JSON.stringify(accesos);
    localStorage.setItem("accesos", statusJSON);
}

function obtenerAccesos() {
    let statusJSON = localStorage.getItem("accesos");
    accesos = statusJSON && JSON.parse(statusJSON);
}
/* ========================================================================== ALERTAS ====================================================================================================== */
function alertaExito(mensaje) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    })
    Toast.fire({
        icon: 'success',
        text: mensaje
    })
}

function alertaError(mensaje) {
    Swal.fire({
        icon: 'error',
        text: mensaje,
    });
}

/* ============================================================================MAIN============================================== */

function main() {
    ActualizarInicioSesionStorage(); //Inicialmente en cero
    obtenerAccesos();
    inicializarElementos();
    inicializarEventos();
}
main();