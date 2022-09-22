/* Global variables */
let idCar=1;
let productos=[];//Arreglo de productos disponibles para comprar
let carrito=[];//Carrito de compras
let pedidos=[];//Arreglo para pedido del carrito de compras
let totalPago;
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
class CarritoDeCompras{
    constructor(idCar,nombre,subTotal, cantidad, categoria)
    {
        this.idCar=idCar;//Made unique id (Similar to static value)
        this.nombre=nombre;
        this.subTotal=subTotal;
        this.cantidad=cantidad;
        this.categoria=categoria;
    }
}
/* pedido */
class Pedido{
    constructor(mesa,nombreCliente,detallesPedido,nombreProducto,precio,cantidad,subTotal)
    {
        this.mesa=mesa;
        this.nombreCliente=nombreCliente;
        this.detallesPedido=detallesPedido;
        this.nombreProducto=nombreProducto;
        this.precio=precio;
        this.cantidad=cantidad;
        this.subTotal=subTotal;
    }
}
/* All functions */
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
    formularioCarrito.onsubmit=(evento)=>generarPedido(evento);
}
/* Generar un pedido */
function generarPedido(evento)
{
    evento.preventDefault();
           /* mesa,nombreCliente,detallesPedido,nombreProducto,precio,cantidad,subTotal,total */
    let mesa=inputMesa.value;
    let nombreCliente=inputNombreCliente.value;
    let detallesPedido=inputDetallesPedido.value;
    for(let producto of productos)
    {
        subTotal=0;
        cantidad=0;
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
            actualizarPedidoStorage();
        }
    }
    carrito=[];
    imprimirCarrito();
    imprimirTotal();
    console.log(pedidos);
}
/* Imprimir los productos con codigo HTML DOM */
function imprimirProductos(){
    contenedorProductos.innerHTML="";//Crear el espacio para imprimir el HTML en el contenedor
    productos.forEach((producto)=>{
        let cantidadInicial=0;
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
                    cantidadInicial+=1;
                    agregarCarritoDeCompras(producto.id,cantidadInicial);
                }  
            }//Si el evento de apretar el boton eliminar pasa activa la arrow del metodo elimianr el producto.id
            else
            {
                alert("No hay stock");
            }
        };
        
            
        /* Agregar y quitar producto */
        let botonMas=document.getElementById(`botonMas-${producto.id}`);
        let botonMenos=document.getElementById(`botonMenos-${producto.id}`);
        let textoCantidad=document.getElementById(`textoCantidad-${producto.id}`);
        /* event agregar*/
        botonMas.onclick=()=>{
            cantidadInicial+=1;
            if(cantidadInicial<=producto.cantidad&&cantidadInicial>0)
            {
                agregarMas(cantidadInicial,textoCantidad);
            }
            else
            {
                alert("No hay stock");
            }
        };
        /* event disminuir */
        botonMenos.onclick=()=>{

            if(cantidadInicial>0)
            {
                cantidadInicial-=1;
                agregarMenos(cantidadInicial,textoCantidad);

            }
            else
            {
                alert("Debe haber al menos un artículo");
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
/* Funcion crear carrito de compras ---------------------------------------------------------------AQUIMEQUEDE*/
function agregarCarritoDeCompras(idProducto,cantidadInicial)
{
    let indexAgregar=productos.findIndex((producto)=>Number(producto.id)===Number(idProducto));//Manda cada objeto de producto y lo compara con su valor dado por el parametro de entrada id si son iguales obtiene el indice del arrayProdcutos que corresponde a la posición para agregar
    if(productos[indexAgregar].cantidad>=0)
    {
        let car= new CarritoDeCompras(idCar,productos[indexAgregar].nombre,cantidadInicial*productos[indexAgregar].precio,cantidadInicial,productos[indexAgregar].categoria);
        idCar+=1;//Crear id unicos
        if(carrito.length!=0)//Permite borrar el DOM del carrito para no repetir la informacion grafica
        {
            reset();
        }
        carrito.push(car);
        actualizarCarritoStorage();
        productos[indexAgregar].cantidad-=cantidadInicial;//Quitar del stock
        actualizarProductosStorage();
        console.log(carrito);
        imprimirProductos();
        imprimirCarrito();
        imprimirTotal();
    }
    else
    {
        alert("Sin stock");
    }
}
/* Imprime el carrito de compras */
function imprimirCarrito(){
    contenedorCarrito.innerHTML="";
    carrito.forEach((car)=>{
    let column=document.createElement("div");
        column.className="card ml-3";
        column.id=`columna-${car.id}`;
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
        <button class="btn btn-danger text-right" id="botonEliminar-${car.id}" ><i class="fa-solid fa-xmark"></i></button>
        </div>
        </div>
    </div>
    `;
    contenedorCarrito.append(column);
    let botonEliminarDeCarrito=document.getElementById(`botonEliminar-${car.id}`);
        botonEliminarDeCarrito.onclick=()=>eliminarDeCarrito(car.id);//Si el evento de apretar el boton agregar pasa activa la arrow del metodo agregar al carrito.id
});//Termina foreach
}
/* Eliminar producto de carrito de compras */
function eliminarDeCarrito(carId)
{
    obtenerCarritoStorage();
    let columnaABorrar=document.getElementById(`columna-${carId}`);
    let indexABorrar=carrito.findIndex((car)=> Number(car.id)===Number(carId));
        /* actualiza el stock de productos */
    actualizarStock();
    imprimirProductos();
    carrito.splice(indexABorrar,1);
    imprimirTotal();
    columnaABorrar.remove();
    actualizarCarritoStorage();

}
/* Encuentra el indice para actualizar stock */
function actualizarStock()
{
    let cantidad=0;
    let idPro;
    let val=false;
    for(let producto of productos)
    {
        for(let car of carrito)
        {
            if(car.nombre===producto.nombre)
            {
                cantidad+=car.cantidad;//devolver productos al stock
                console.log(cantidad);
                val=true;
            }
        }
        if(val)
        {
            idPro=producto.id;
            producto.cantidad+=cantidad;
            actualizarProductosStorage();
        }
    }
}
/* Resetear el carrito cada que se da click */
function reset(){
    for(let car of carrito)
    {
        let columnaCarritoABorrar=document.getElementById(`columna-${car.id}`);
        columnaCarritoABorrar.remove();
    }
}
/* STORAGE Y JSON */
/* actualizar el storage local con el JSON */
function actualizarProductosStorage()
{
    console.log(productos.length)
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
/* Obtener el storage al comienzo de la carga de la pag */
function obtenerProductosStorage() {
    let productosJSON = localStorage.getItem("productos");
    console.log(productos.length)
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
        productos.sort((a,b)=>{
            if(a.nombre>b.nombre)
            {
                return 1;
            }
            else if(a.nombre<b.nombre)
            {
                return -1;
            }
            else
            {
                return 0;
            }
        });
    }
    else if(filtro==="Ordenar por Categoria")
    {
        productos.sort((a,b)=>{
            if(a.categoria>b.categoria)
            {
                return 1;
            }
            else if(a.categoria<b.categoria)
            {
                return -1;
            }
            else
            {
                return 0;
            }
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
    console.log(totalprecio);
    totalPago.innerHTML=``;
    totalPago.innerHTML+=`Total: $${totalprecio}`;
}
/* calcular total*/
function calcularTotal(){
    let totalPrecio=0;
    carrito.forEach((car)=>{totalPrecio+=car.subTotal});
    return totalPrecio;
}

/* Función principal o main */
function main()
{
    inicializarElementos();
    InicializarEventos();
    obtenerProductosStorage();
    obtenerCarritoStorage();
    console.log(carrito);
}
main();