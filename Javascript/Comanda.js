/* =======================================================VARIABLES============================================= */
/* Global variables */
let idCar=1;//id de carrito de compras
let productos=[];//Arreglo de productos disponibles para comprar
let carrito=[];//Carrito de compras
let pedidos=[];//Arreglo para pedido del carrito de compras
let totalPago;//total por pagar
let accesos=[]//Usuarios logeados
/* Filtro */
let formularioFiltro;
let contenedorFiltro;
let filtrar;
/* carrito de compras */
let contenedorCarrito;
let formularioCarrito;
/* pedido */
let inputMesa;
let inputNombreCliente;
let inputDetallesPedido;
let nombreProducto;
let precio;
let cantidad=0;
let subTotal=0;
/* ================================================ CLASES CONSTRUCTORAS========================================= */
/* Clase de carrito de compras */
class CarritoDeCompras{
    constructor(...compra)//------------------------------------------------------------------------------------------------------>Se optimizo codigo
    {
        this.idCar=compra[0];//Made unique id (Similar to static value)
        this.idProducto=compra[1];
        this.nombre=compra[2];
        this.subTotal=compra[3];
        this.cantidad=compra[4];
        this.categoria=compra[5];
    }
}
/*Clase de pedidos formados para comandas */
class Pedido{
    constructor(...pedidoCompleto)//------------------------------------------------------------------------------------------------>Se optimizo codigo
    {
        this.mesa=pedidoCompleto[0];
        this.nombreCliente=pedidoCompleto[1];
        this.detallesPedido=pedidoCompleto[2];
        this.nombreProducto=pedidoCompleto[3];
        this.precio=pedidoCompleto[4];
        this.cantidad=pedidoCompleto[5];
        this.subTotal=pedidoCompleto[6];
    }
}
/* ============================================================FUNCIONES=============================================== */
/* inicializar los nodos dentro del HTML */
function inicializarElementos()
{
    /* Filtro */
    formularioFiltro=document.getElementById("formularioFiltro");
    contenedorFiltro=document.getElementById("contenedorFiltro");
    filtrar=document.getElementById("filtrar");
    /* carrito */
    contenedorCarrito=document.getElementById("contenedorCarrito");
    totalPago=document.getElementById("totalPago");
    /* pedido */
    formularioCarrito=document.getElementById("formularioCarrito");
    inputMesa=document.getElementById("mesa");
    inputNombreCliente=document.getElementById("inputNombre");
    inputDetallesPedido=document.getElementById("detallesTexto");
}

/* Inizializar los eventos en este caso el evento es un click en el boton registrar producto */
function InicializarEventos()
{
    formularioFiltro.onsubmit=(evento)=>filtrarInformacion(evento);
    formularioCarrito.onsubmit=(evento)=>
    {
        evento.preventDefault();
        alertaPregunta(evento);
    }
}
/* Generar un pedido */
function generarPedido(evento)
{
    evento.preventDefault();
    let mesa=inputMesa.value;
    let nombreCliente=inputNombreCliente.value||"Cliente";//----------------------------------------------------------------------------------->Se optimizo codigo
    let detallesPedido=inputDetallesPedido.value||"Ninguno";//---------------------------------------------------------------------------------->Se optimizo codigo
    for(let producto of productos)
    {
        subTotal=0;//reset de subtotal al formar pedido
        cantidad=0;//reset de cantidad al formar pedido
        carrito.forEach((car)=>{
            if(producto.nombre===car.nombre)
            {
                subTotal+=car.subTotal;
                cantidad+=car.cantidad;
            }
        });
        if(subTotal!=0&&cantidad!=0)
        {
            let pedido= new Pedido(mesa,nombreCliente,detallesPedido,producto.nombre,producto.precio,cantidad,subTotal);
            pedidos.push(pedido);
        }
    }/* Actualizar variables(las limpia) */
    actualizarPedidoStorage();
    carrito=[];
    actualizarCarritoStorage();
    imprimirCarrito();
    imprimirTotal();
    formularioCarrito.reset();
    
}
/* Funcion crear carrito de compras ---------------------------------------------------------------AQUIMEQUEDE*/
function agregarCarritoDeCompras(idProducto,cantidadInicial)
{
    let indexAgregar=productos.findIndex((producto)=>Number(producto.id)===Number(idProducto));//Manda cada objeto de producto y lo compara con su valor dado por el parametro de entrada id si son iguales obtiene el indice del arrayProdcutos que corresponde a la posición para agregar
    if(productos[indexAgregar].cantidad>=0)
    {
        let car= new CarritoDeCompras(idCar,idProducto,productos[indexAgregar].nombre,cantidadInicial*productos[indexAgregar].precio,cantidadInicial,productos[indexAgregar].categoria);
        idCar++;//Crear id unicos--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->Se optimizo codigo
        (carrito.length!=0) && reset();//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->Se optimizo codigo 
        //Permite borrar el DOM del carrito para no repetir la informacion grafica
        carrito.push(car);
        actualizarCarritoStorage();
        productos[indexAgregar].cantidad-=cantidadInicial;//Quitar del stock
        actualizarProductosStorage();
        imprimirProductos();
        imprimirCarrito(idProducto);
        imprimirTotal();
        alertaExito(`${productos[indexAgregar].nombre} agregado a comanda`)
    }
    else
    {
        alertaError(`${productos[indexAgregar].nombre} no tiene stock`);
    }
}
/* Eliminar producto de carrito de compras */
function eliminarDeCarrito(carId)
{
    obtenerCarritoStorage();
    let columnaABorrar=document.getElementById(`columna-${carId}`);
    let indexABorrar=carrito.findIndex((car)=> Number(car.idCar)===Number(carId));
        /* actualiza el stock de productos */
    actualizarStock(indexABorrar);
    imprimirProductos();
    alertaExito(`${carrito[indexABorrar].nombre} ha sido eliminado`);
    carrito.splice(indexABorrar,1);
    imprimirTotal();
    columnaABorrar.remove();
    actualizarCarritoStorage();
}
/* ======================================================================MODIFICACION DEL DOM========================================================== */
/* Imprimir los productos con codigo HTML DOM */
function imprimirProductos(){
    contenedorProductos.innerHTML="";//Crear el espacio para imprimir el HTML en el contenedor
    productos.forEach((producto)=>{
        let cantidadInicial=0;//Cantidad inicial agregar al carrito
        let column=document.createElement("div");
        column.className="col-md-4 mt-2";
        column.id=`column-${producto.id}`;
        column.innerHTML=`
    <div class="card">
    <img class="card-img-top ml-4" style="width:300px" src="../Imagenes/${producto.categoria}.svg" alt="Card café">
        <div class="card-body">
            <h4 class="card-title">
            <strong>${producto.nombre}</strong>
            </h4>
            <p class="card-text">
            <strong>Cantidad:</strong> ${producto.cantidad} PZ
            </p>
            <p class="card-text">
            <strong>Precio unitario:</strong>$ ${producto.precio}
            </p>
            <div class="row mt-4">
                <div class="col-6">
                    <h4 class="card-title" id="textoCantidad-${producto.id}">
                    </h4>
                </div>
                <div class="col-6">
                    <button class="btn btn-primary ml-2" id="botonMas-${producto.id}" ><i class="fa-solid fa-plus"></i></button>
                    <button class="btn btn-primary ml-2" id="botonMenos-${producto.id}" ><i class="fa-solid fa-minus"></i></button>
                </div>
        </div>
        </div>
        <div class="card-footer">
        <button class="btn btn-danger" id="botonAgregar-${producto.id}" >Agregar</button>
        </div>
    </div>
        `;
        contenedorProductos.append(column);//agregar el objeto column
        /* Agregar a carrito */
        let botonAgregarCarrito=document.getElementById(`botonAgregar-${producto.id}`);
        botonAgregarCarrito.onclick=()=>{
            if(producto.cantidad>0)
            {
                if(cantidadInicial>0)
                {
                    agregarCarritoDeCompras(producto.id,cantidadInicial);
                }
                else{
                    cantidadInicial++;//------------------------------------------------------------------------------------------------------->Se optimizo codigo
                    agregarCarritoDeCompras(producto.id,cantidadInicial);
                }  
            }//Si el evento de apretar el boton eliminar pasa activa la arrow del metodo elimianr el producto.id
            else
            {
                alertaError(`${producto.nombre} no tiene stock`);
            }
        };
        /* Agregar y quitar producto  acceso a elementos para botones*/
        let botonMas=document.getElementById(`botonMas-${producto.id}`);
        let botonMenos=document.getElementById(`botonMenos-${producto.id}`);
        let textoCantidad=document.getElementById(`textoCantidad-${producto.id}`);
        /* event agregar*/
        botonMas.onclick=()=>{
            cantidadInicial++;//------------------------------------------------------------------------------------------------------->Se optimizo codigo
            if(cantidadInicial<=producto.cantidad&&cantidadInicial>0) 
            {
            agregarMas(cantidadInicial,textoCantidad)
            }
            else
            {
                alertaError(`${producto.nombre} no tiene stock`);
            }

        };
        /* event disminuir */
        botonMenos.onclick=()=>{
            if(cantidadInicial>0)
            {
                cantidadInicial--;//--------------------------------------------------------------------------------------------------------->Se optimizo codigo
                agregarMenos(cantidadInicial,textoCantidad);

            }
            else
            {
                alertaWarning("Ingrese al menos un producto");
            }
        };
    });//Termina foreach
}
/* Funcion agregar mas */
function agregarMas(cantidadInicial,textoCantidad)
{
    textoCantidad.innerHTML=``;
    textoCantidad.innerHTML+=`${cantidadInicial} PZ`;
}
/* Funcion quitar producto */
function agregarMenos(cantidadInicial,textoCantidad)
{
    textoCantidad.innerHTML=``;
    textoCantidad.innerHTML+=`${cantidadInicial} PZ`;
}
/* Imprime el carrito de compras */
function imprimirCarrito(idProducto){
    contenedorCarrito.innerHTML="";
    carrito.forEach((car)=>{
    let column=document.createElement("div");
        column.className="card ml-3";
        column.id=`columna-${car.idCar}`;
    column.innerHTML=`
    <div class="card mb-3">
    <div class="row g-0">
        <div class="col-md-3">
            <img src="../Imagenes/${car.categoria}.svg" class="img-fluid rounded-start"
                alt="cafe de compra" style="width:300px">
        </div>
        <div class="col-md-7">
            <div class="card-body">
                <h6 class="card-title">${car.nombre}</h6>
                <h6 class="card-text">$${car.subTotal}</h6>
                <h6 class="card-title"><small class="text-muted">Cantidad:${car.cantidad} PZ</small></h6>
            </div>
        </div>
        <div class="col-md-1">
        <button class="btn btn-danger text-right" id="botonEliminar-${car.idCar}" ><i class="fa-solid fa-xmark"></i></button>
        </div>
        </div>
    </div>
    `;
    contenedorCarrito.append(column);
    let botonEliminarDeCarrito=document.getElementById(`botonEliminar-${car.idCar}`);
        botonEliminarDeCarrito.onclick=()=>eliminarDeCarrito(car.idCar);//Si el evento de apretar el boton agregar pasa activa la arrow del metodo agregar al carrito.id
});//Termina foreach
}
/* Resetear el carrito cada que se da click */
function reset(){
    for(let car of carrito)
    {
        let columnaCarritoABorrar=document.getElementById(`columna-${car.idCar}`);
        columnaCarritoABorrar.remove();
    }
}
/* ================================================STORAGE Y JSON===================================================== */
/* Encuentra el indice para actualizar stock */
function actualizarStock(indexABorrar)
{
    for(let producto of productos)
    {
        if(producto.id==carrito[indexABorrar].idProducto)
        {
            producto.cantidad+=carrito[indexABorrar].cantidad;
            actualizarProductosStorage();
        }
    }
}
/* actualizar el storage local con el JSON */
function actualizarProductosStorage()
{
        if(productos.length==null)
        {
            localStorage.clear();
        }
        else
        {
            let productosJSON;
            productosJSON= JSON.stringify(productos);
            localStorage.setItem("productos", productosJSON);
        }
}
/* Actualiza carrito de compras en storage */
function actualizarCarritoStorage()
{
    if(carrito.length==null)
    {
        localStorage.carrito.clear();
    }
    else
    {
        let carritoJSON;
        carritoJSON=JSON.stringify(carrito);
        localStorage.setItem("carrito",carritoJSON);
    }
}
/* Actualiza los pedidos formados en el storage */
function actualizarPedidoStorage()
{
    if(pedidos.length==null)
    {
        localStorage.pedidos.clear();
    }
    else
    {
        let pedidosJSON;
        pedidosJSON=JSON.stringify(pedidos);
        localStorage.setItem("pedidos",pedidosJSON);
    }
}
/* Obtener si un usuario ha iniciado sesion */
function obtenerAccesos()
{
    let statusJSON=localStorage.getItem("accesos");
    accesos= statusJSON && JSON.parse(statusJSON);
}
/* Obtener el storage al comienzo de la carga de la pag */
function obtenerProductosStorage() {
    let productosJSON = localStorage.getItem("productos");
    if(productosJSON)
    {
        productos = JSON.parse(productosJSON);
        if(productos.length!=0)
        {
            id=productos[productos.length-1].id+1;
        }
        if(productos.length==0)
        {
            id=1;
        }
        mostrarFiltro();
        imprimirProductos();
    }
    else
    {
        ocultarFiltro();
    }
}
/* Obtiene el carrito de compras guardado si se recarga la pag y no se finalizo el pedido */
function obtenerCarritoStorage(){
    let carritoJSON=localStorage.getItem("carrito");
    if(carritoJSON)
    {
        carrito=JSON.parse(carritoJSON);
        if(carrito.length!=0)
        {
            idCar=carrito[carrito.length-1].idCar+1
        }
        if(carrito.length==0)
        {
            idCar=1;
        }
        imprimirCarrito();
    }
}
/* Obtener pedidos del storage obtiene los pedidos formados */
function obtenerPedidoStorage()
{
    let pedidosJSON=localStorage.getItem("pedidos");
    if(pedidosJSON)
    {
        pedidos=JSON.parse(pedidosJSON);
    }
}
/* ====================================================FUNCIONALIDADES DEL PROGRAMA====================================== */
/* Obtener el tipo de filtro */
function filtrarInformacion(evento)
{
    evento.preventDefault();
    let filtro=filtrar.value;
    if(filtro==="Ordenar por ID")
    {
        productos.sort((a,b)=>b.id-a.id);
    }
    else if(filtro==="Ordenar por Nombre")
    {
        productos.sort((a,b)=>
        { 
            let val=(a.nombre>b.nombre) ?  1 : ((a.nombre<b.nombre) ? -1 : 0);//--------------------------------------------------------------------------------------------------------->Se optimizo codigo                                                                                                
            return val;
        });
    }
    else if(filtro==="Ordenar por Categoria")
    {
        productos.sort((a,b)=>{
            let val=(a.categoria>b.categoria) ? 1 : ((a.categoria<b.categoria) ? -1 : 0);//---------------------------------------------------------------------------------------------->Se optimizo codigo
            return val;
        });
    }
    else if(filtro==="Ordenar por Mayor Precio")
    {
        productos.sort((a,b)=>b.precio-a.precio);
    }
    else if(filtro==="Ordenar por Menor Precio")
    {
        productos.sort((a,b)=>a.precio-b.precio);
    }
    else if(filtro==="Ordenar por Cantidad Disponible")
    {
        productos.sort((a,b)=>b.cantidad-a.cantidad);
    }
    imprimirProductos();
}
/* mostrar filtro */
function mostrarFiltro()
{
    contenedorFiltro.hidden=false;
}
function ocultarFiltro()
{
    contenedorFiltro.hidden=true;
}
/* Imprimir total */
function imprimirTotal(){
    let totalprecio=calcularTotal();
    totalPago.innerHTML=``;
    totalPago.innerHTML+=`Total: $${totalprecio}`;
}
/* calcular total*/
function calcularTotal(){
    let totalPrecio=0;
    carrito.forEach((car)=>{totalPrecio+=car.subTotal});
    return totalPrecio;
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
        timer: 2000,
        timerProgressBar: true,
    })

    Toast.fire({
        icon: 'success',
        text: mensaje
    })
}
function alertaPregunta(evento) {
    Swal.fire({
        icon: 'warning',
        text: `¿Estas seguro que generar el pedido?`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Generar Pedido',
        denyButtonText: `Cancelar`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            generarPedido(evento);
            alertaExito(`Pedido generado`)
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
            location.replace("../HTML/Password.html");
        }
    })
}
/* ==========================================================================INICIO DE EJECUCION DEL PROGRAMA=============================================================================== */
function main()
{
    obtenerAccesos()
    if(accesos.length!=0)
    {
        inicializarElementos();
        InicializarEventos();
        obtenerProductosStorage();
        obtenerCarritoStorage();
        obtenerPedidoStorage();
    }
    else
    {
        alertaInicioSesion();
    }
}
main();