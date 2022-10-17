/* ===========================================================VARIABLES========================================================= */
/* Variables globales */
let productos = []; //Arreglo de productos
let id = 1; //Id de cada producto
let contrasena = 1234; //Contraseña para editar productos
let val; //Validador
let accesos = []; //Usuarios que iniciaron sesion
/* variables de nodos  */
let formulario;
let inputNombre;
let inputCantidad;
let inputPrecio;
let inputCategoria;
let contenedorProductos;
let estadisticas;
/* Variables para identificacion */
let formularioIdentificacion;
let contenedorIdentificacion;
let contenedorUsuario;
let textoUsuario;
let inputPassword;
/* Filtro */
let formularioFiltro;
let contenedorFiltro;
let filtrar;
/* ======================================================CLASES CONSTRUCTORAS============================================================ */
/* Clase constructora para produtos */
class Producto {
    constructor(...valores) //---------------------------------------------------------------------------------------------------------------------->Se optimizo el codigo
    {
        this.id = id;
        this.nombre = valores[1].toUpperCase();
        this.cantidad = valores[2];
        this.precio = valores[3];
        this.categoria = valores[4];
    }
}
/* ====================================================FUNCIONES========================================================================== */
/* inicializar los nodos dentro del HTML */
function inicializarElementos() {
    formulario = document.getElementById("formulario");
    inputNombre = document.getElementById("inputNombre");
    inputCantidad = document.getElementById("inputCantidad");
    inputPrecio = document.getElementById("inputPrecio");
    inputCategoria = document.getElementById("inputCategoria");
    contenedorProductos = document.getElementById("contenedorProductos");
    estadisticas = document.getElementById("estadisticas");
    /* Filtro */
    formularioFiltro = document.getElementById("formularioFiltro");
    contenedorFiltro = document.getElementById("contenedorFiltro");
    filtrar = document.getElementById("filtrar");
    /*Eventos de password  */
    formularioIdentificacion = document.getElementById("formularioIdentificacion");
    inputPassword = document.getElementById("inputPassword");
    contenedorIdentificacion = document.getElementById("contenedorIdentificacion");
    contenedorUsuario = document.getElementById("contenedorUsuario");
    textoUsuario = document.getElementById("textoUsuario");
}
/* Inizializar los eventos en este caso el evento es un click en el boton registrar producto */
function InicializarEventos() {
    formulario.onsubmit = (evento) => {
        if (val) {
            validarFormulario(evento);
        } else {
            evento.preventDefault();
            alertaWarning("Ingresa la contraseña de autorización");
        }
    }
    formularioFiltro.onsubmit = (evento) => filtrarInformacion(evento);
    /* Eventos Pasword */
    formularioIdentificacion.onsubmit = (evento) => identificarContrasena(evento);
}
/* Identifica si la contraseña es correcta */
function identificarContrasena(evento) {
    evento.preventDefault();
    let valido = (contrasena == inputPassword.value) ? true : false; //---------------------------------------------------------------------------->Se optimizo codigo
    val = valido;
    if (valido) {
        alertaExito("Usuario ingresado")
        formularioIdentificacion.reset();
        contenedorIdentificacion.hidden = true;
        contenedorUsuario.hidden = false;
    } else {
        alertaError("Contraseña incorrecta");
    }
}
/* obtener los valores de los nodos dados en el HTML y agrega un producto nuevo */
function validarFormulario(evento) {
    evento.preventDefault(); //Elimina el reinicio por default que da el boton
    let nombre = inputNombre.value;
    let precio = parseFloat(inputPrecio.value);
    let cantidad = parseFloat(inputCantidad.value);
    let categoria = inputCategoria.value;
    if (cantidad >= 0) {
        if (precio > 0) {
            let producto = new Producto(id, nombre, cantidad, precio, categoria);
            registrarProductoServer(producto); //Registro el el server con metodo POST
        } else {
            alertaError("Precio incorrecto");
        }
    } else {
        alertaError("Cantidad incorrecta");
    }
}
/* funcion para eliminar productos */
function eliminarProducto(idProducto) {
    eliminarProductoServer(idProducto);
}
/* =================================================================MODIFICACION DEL DOM============================================================================== */
/* Imprimir los productos con codigo HTML DOM */
function imprimirProductos() {
    contenedorProductos.innerHTML = ""; //Crear el espacio para imprimir el HTML en el contenedor
    productos.forEach((producto) => {
        let column = document.createElement("div");
        column.className = "col-md-4 mt-2";
        column.id = `columna-${producto.id}`;
        column.innerHTML = `
    <div class="card">
    <img class="card-img-top ml-4" style="width:300px" src="../Imagenes/${producto.categoria}.svg" alt="Card café">
        <div class="card-body">
            <h4 class="card-title">
            ID<strong> ${producto.id}: ${producto.nombre}</strong>
            </h4>
            <h4 class="card-title">
            <strong>${producto.categoria}</strong>
            </h4>
            <p class="card-text">
            <strong>Cantidad:</strong> ${producto.cantidad} PZ
            </p>
            <p class="card-text">
            <strong>Precio unitario:</strong>$ ${producto.precio}
            </p>
        </div>
            <div class="card-footer">
            <button type="button" class="btn btn-danger" id="botonEliminar-${producto.id}" >Eliminar</button>
            <button type="button" class="btn btn-warning ml-5" id="botonEditar-${producto.id}" >Editar</button>
            </div>
    </div>
        `;
        contenedorProductos.append(column); //agregar el objeto column
        let botonEliminarProducto = document.getElementById(`botonEliminar-${producto.id}`);
        botonEliminarProducto.onclick = () => {
            if (val) {
                alertaPregunta(producto.nombre, producto.id);
            } else {
                alertaWarning("Ingresa la contraseña de autorización"); //Si el evento de apretar el boton eliminar pasa activa la arrow del metodo elimianr el producto.id
            }
        }
        let botonEditarProducto = document.getElementById(`botonEditar-${producto.id}`);
        botonEditarProducto.onclick = () => {
            if (val) {
                editarProducto(producto.id, producto.nombre, producto.cantidad, producto.precio, producto.categoria);
            } else {
                alertaWarning("Ingresa la contraseña de autorización"); //Si el evento de apretar el boton eliminar pasa activa la arrow del metodo elimianr el producto.id
            }
        }
    }); //Termina foreach
}
/* Imprimir estadisticas de inventario */
function imprimirEstadisticas() {
    if (productos.length != 0) {
        estadisticas.innerHTML = "";
        let column = document.createElement("div");
        column.className = "card badge-primary rounded";
        column.id = "Estadisticas-Inventario";
        column.innerHTML = `
    <div class="card-body">
        <div class="card-title text-center"><h4>Valor total de inventario</h4></div>
        <div class="card-title text-center"><h4>$ ${calcularCosto(productos)}</h4></div>
        <div class="card-title text-center"><h4>Cantidad de productos</h4></div>
        <div class="card-title text-center"><h4>${calcularTotal(productos)} pz</h4></div>
        <div class="card-title text-center"><h4>Producto a resurir</h4></div>
        <div class="card-title text-center"><h4>${calcularMin(productos)}</h4></div>
    </div>
    `;
        estadisticas.append(column);
    }
}
/*=========================================================================== STORAGE Y JSON========================================================================== */
/* actualizar el storage local con el JSON para los productos */
function actualizarProductosStorage() {
    if (productos.length == null) {
        localStorage.clear();
    } else {
        let productosJSON;
        productosJSON = JSON.stringify(productos);
        localStorage.setItem("productos", productosJSON);
    }
}
/* Obtener si un usuario ha iniciado sesion */
function obtenerAccesos() {
    let statusJSON = localStorage.getItem("accesos");
    accesos = statusJSON && JSON.parse(statusJSON);
}
/* ==============================================================FUNCIONES ESPECIFICAS DE LA PAGINA=================================================== */
/* Obtener el tipo de filtro */
function filtrarInformacion(evento) {
    evento.preventDefault();
    let filtro = filtrar.value;
    if (filtro === "Ordenar por ID") {
        productos.sort((a, b) => b.id - a.id);
    } else if (filtro === "Ordenar por Nombre") {
        productos.sort((a, b) => {
            let val = (a.nombre > b.nombre) ? 1 : ((a.nombre < b.nombre) ? -1 : 0); //--------------------------------------------------------------------------------------------------------->Se optimizo codigo                                                                                                
            return val;
        });
    } else if (filtro === "Ordenar por Categoria") {
        productos.sort((a, b) => {
            let val = (a.categoria > b.categoria) ? 1 : ((a.categoria < b.categoria) ? -1 : 0); //---------------------------------------------------------------------------------------------->Se optimizo codigo
            return val;
        });
    } else if (filtro === "Ordenar por Mayor Precio") {
        productos.sort((a, b) => b.precio - a.precio);
    } else if (filtro === "Ordenar por Menor Precio") {
        productos.sort((a, b) => a.precio - b.precio);
    } else if (filtro === "Ordenar por Cantidad Disponible") {
        productos.sort((a, b) => b.cantidad - a.cantidad);
    }
    formulario.reset(); //Reinicia el nodo formulario evitando que se dupliquen el HTML agregado de los articulos en el innerHTML
    imprimirProductos();
}
/* mostrar filtro */
function mostrarFiltro() {
    contenedorFiltro.hidden = false;
}
/* Ocultar filtro */
function ocultarFiltro() {
    contenedorFiltro.hidden = true;
}
/* Calcular costo del inventario */
function calcularCosto(productos) {
    let costoTotalInventario = 0;
    for (let producto of productos) {
        costoTotalInventario += producto.cantidad * producto.precio;
    }
    return costoTotalInventario;
}
/* Calcular total de productos agregados */
function calcularTotal(productos) {
    let totalDeProductos = 0;
    for (let producto of productos) {
        totalDeProductos += producto.cantidad;
    }
    return totalDeProductos;
}
/* Calcular el producto con menor stock */
function calcularMin(productos) {
    let minVal;
    let minArr = productos;
    minArr.sort((a, b) => a.cantidad - b.cantidad); //Obtiene el producto con menor cantidad de piezas
    minVal = (minArr[0]).nombre;
    return minVal;
}
/* ========================================================================== ALERTAS ====================================================================================================== */
function alertaError(mensaje) {
    Swal.fire({
        icon: 'error',
        text: mensaje,
    });
}

function alertaWarning(mensaje) {
    Swal.fire({
        icon: 'warning',
        text: mensaje,
    });
}

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

function alertaPregunta(nombre, evento) {
    Swal.fire({
        icon: 'warning',
        text: `¿Estas seguro que deseas eliminar ${nombre}?`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Borrar',
        denyButtonText: `No borrar`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            eliminarProducto(evento);
            alertaExito(`${nombre} ha sido eliminado`)
        } else if (result.isDenied) {
            alertaError("Operación cancelada");
        }
    })
}
/* Alerta no se ha hecho inicio de sesion */
function alertaInicioSesion() {
    Swal.fire({
        text: "Debe iniciar sesión",
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Iniciar sesión'
    }).then((result) => {
        if (result.isConfirmed) {
            location.replace("./HTML/Password.html");
        }
    })
}
/* Alerta de modificación de cantidades */
async function editarProducto(...entrada) {
    let idIn = entrada[0];
    let nombre = entrada[1];
    let cantidad = entrada[2];
    let precio = entrada[3];
    let categoria = entrada[4];
    const {
        value: formValues
    } = await Swal.fire({
        confirmButtonText: 'Guardar',
        html: `
    <div class="container-fluid">
        <div class="row">
            <h4 class="card-title ml-5">
            ID<strong>${idIn}: ${nombre}</strong>
            </h4>
            <div class="card-body">
                <img class="ml-3" style="width:250px" src="../Imagenes/${categoria}.svg" alt="Card café">
                    <div class="row ">
                        <div class="form-group col-md-12">
                            <label for="inputNombreSwal">Nombre: ${nombre}</label>
                            <input type="text" class="form-control" id="inputNombreSwal"
                                placeholder="Nombre del producto">
                        </div>
                        <div class="form-group col-md-12">
                            <label for="inputCantidadSwal">Cantidad: ${cantidad}</label>
                            <input type="number" class="form-control" id="inputCantidadSwal"
                                placeholder="Cantidad disponible">
                        </div>
                        <div class="form-group col-md-12">
                            <label for="inputPrecioSwal">Precio: $${precio}</label>
                            <input type="text" class="form-control" id="inputPrecioSwal"
                                placeholder="Costo unitario del producto en formato $XX.YY">
                        </div>
                        <select id="inputCategoriaSwal" class="form-control">
                            <option selected>Seleccionar</option>
                            <option>Otros</option>
                            <option>Bebidas-Calientes</option>
                            <option>Bebidas-Frias</option>
                            <option>Panaderia</option>
                            <option>Cafeteria</option>
                        </select>
                    </div>
            </div>
        </div>
    </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            let nombreSwal = document.getElementById('inputNombreSwal').value.toUpperCase() || nombre;
            let cantidadSwal = document.getElementById('inputCantidadSwal').value || cantidad;
            let precioSwal = document.getElementById('inputPrecioSwal').value || precio;
            let categoriaSwal = (document.getElementById('inputCategoriaSwal').value == "Seleccionar") ? categoria : document.getElementById('inputCategoriaSwal').value;
            editarProductoServer(idIn, nombreSwal, cantidadSwal, precioSwal, categoriaSwal);
        }
    })
    if (formValues) {
        alertaExito(`${nombre} actualizado exitosamente`);
    }
}
/* ==========================================================================BASE DE DATOS FETCH====================================================================== */
/* Obtiene los productos cargados desde la mockAPI con una petición GET */
function obtenerProductosServer() { //Devuelve una promesa
    fetch("https://63444bfedcae733e8fdc4d44.mockapi.io/productos")
        .then((response) => { //Obtiene una promesa con la información del servidor
            //response proviene de un metodo asincrono por lo que es asinc y requiere .then para exception handling
            //.json extrae el body de la respuesta y la devuelve una promesa que tendra el body en formato .json 
            response.json()
                .then((data) => {
                    productos = [...data];
                    actualizarProductosStorage();
                    imprimirProductos();
                    id = parseInt(productos[productos.length - 1].id) + 1;
                }); //Escuchar la respuesta al resolver la promesa (objeto response body en formato json)
            if (productos.length == 0) {
                id = 1;
                ocultarFiltro(); //Si no hay productos oculta el filtro
            }
            /* Mostrar elementos en caso de que esten ocultos (sin productos agregados) */
            mostrarFiltro();
            imprimirProductos();
            imprimirEstadisticas();
        })
        .catch((error) => console.log(error));

}
async function registrarProductoServer(producto) {
    try {
        const response = await fetch(
            `https://63444bfedcae733e8fdc4d44.mockapi.io/productos/`, {
                method: "POST",
                body: JSON.stringify(producto),
            }
        );
        //REgistro en el servidor
        id++ //Crear id unicos                                                                                                                                                     <-------SE optimizo
        formulario.reset(); //Reinicia el nodo formulario evitando que se dupliquen el HTML agregado de los articulos en el innerHTML
        productos.push(producto);
        actualizarProductosStorage();
        imprimirEstadisticas();
        imprimirProductos(); //Muestra los productos en el HTML
        alertaExito(`${producto.nombre} fue agregado exitosamente`);
    } catch (error) {
        console.log(error);
    }
}
async function eliminarProductoServer(idProducto) {
    try {
        const response = await fetch(
            `https://63444bfedcae733e8fdc4d44.mockapi.io/productos/${idProducto}`, {
                method: "DELETE",
            }
        );
        console.log(response);
        let columnaABorrar = document.getElementById(`columna-${idProducto}`);
        let indexABorrarDelArray = productos.findIndex((producto) => Number(producto.id) === Number(idProducto)); //Manda cada objeto de producto y lo compara con su valor dado por el parametro de entrada id si son iguales obtiene el indice del arrayProdcutos que corresponde a la posición del array que se desea borrar
        productos.splice(indexABorrarDelArray, 1); //Quita del array de productos el producto con id dado por el parametro
        columnaABorrar.remove(); //Remueve el HTML del producto mostrado
        actualizarProductosStorage(); //actualiza el storage segun lo eliminado
        /* PARA LAS ESTADISTICAS */
        let columnaEstadisticaBorrar = document.getElementById("Estadisticas-Inventario");
        columnaEstadisticaBorrar.remove();
        imprimirEstadisticas();
    } catch (error) {
        console.log();
        (error);
    }
}
async function editarProductoServer(idIn, nombreSwal, cantidadSwal, precioSwal, categoriaSwal) {
    try {
        productos.forEach((producto) => {
            if (producto.id == idIn) {
                producto.nombre = nombreSwal;
                producto.cantidad = parseFloat(cantidadSwal);
                producto.precio = parseFloat(precioSwal);
                producto.categoria = categoriaSwal;
                const response = fetch(
                    `https://63444bfedcae733e8fdc4d44.mockapi.io/productos/${idIn}`, {
                        method: "PUT",
                        body: JSON.stringify(producto),
                    });
                console.log(response)
                actualizarProductosStorage();
                imprimirProductos();
                imprimirEstadisticas();
            }
        });
    } catch (error) {
        console.log(error);
    }
}
/* ==========================================================================INICIO DE EJECUCION DEL PROGRAMA=============================================================================== */
function main() {
    obtenerAccesos() //Obtiene los accesos y si no los hay no muestra la info HTML
    if (accesos != null) {
        inicializarElementos();
        InicializarEventos();
        obtenerProductosServer();
    } else {
        alertaInicioSesion();
    }
}
main();