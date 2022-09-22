/* Variables globales */
let productos=[];
let id=1;
/* variables de nodos  */
let formulario;
let inputNombre;
let inputCantidad;
let inputPrecio;
let inputCategoria;
let contenedorProductos;
let estadisticas;

/* Filtro */
let formularioFiltro;
let contenedorFiltro;
let filtrar;


/* Clase constructora para produtos */
class Producto{
    constructor(id, nombre, cantidad, precio, categoria)
    {
        this.id=id;
        this.nombre=nombre.toUpperCase();
        this.cantidad=cantidad;
        this.precio=precio;
        this.categoria=categoria;
    }
}
/* inicializar los nodos dentro del HTML */
function inicializarElementos()
{
    formulario=document.getElementById("formulario");
    inputNombre=document.getElementById("inputNombre");
    inputCantidad=document.getElementById("inputCantidad");
    inputPrecio=document.getElementById("inputPrecio");
    inputCategoria=document.getElementById("inputCategoria");
    contenedorProductos=document.getElementById("contenedorProductos");
    estadisticas=document.getElementById("estadisticas");
    /* Filtro */
    formularioFiltro=document.getElementById("formularioFiltro");
    contenedorFiltro=document.getElementById("contenedorFiltro");
    filtrar=document.getElementById("filtrar");
}

/* Inizializar los eventos en este caso el evento es un click en el boton registrar producto */
function InicializarEventos()
{
    formulario.onsubmit=(evento)=> validarFormulario(evento);
    formularioFiltro.onsubmit=(evento)=>filtrarInformacion(evento);
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
    formulario.reset();//Reinicia el nodo formulario evitando que se dupliquen el HTML agregado de los articulos en el innerHTML
    imprimirProductos();
}
/* obtener los valores de los nodos dados en el HTML */
function validarFormulario(evento){
    evento.preventDefault();//Elimina el reinicio por default que da el boton
    let nombre=inputNombre.value;
    let precio=parseFloat(inputPrecio.value);
    let cantidad=parseFloat(inputCantidad.value);
    let categoria=inputCategoria.value;
    if(cantidad>=0)
    {
        if(precio>0)
        {
        let producto= new Producto(id,nombre,cantidad,precio,categoria);
        id+=1;//Crear id unicos
        formulario.reset();//Reinicia el nodo formulario evitando que se dupliquen el HTML agregado de los articulos en el innerHTML
        productos.push(producto);
        actualizarProductosStorage();
        imprimirEstadisticas();
        imprimirProductos();//Muestra los productos en el HTML
    }
        else
        {
            alert("Debe ingresar un precio mayor a cero");
        }
    }
    else
    {
        alert("No se permite ingresar una cantidad de productos negativa");
    }
    }
/* funcion para eliminar productos */
function eliminarProducto(idProducto)
{
    let columnaABorrar=document.getElementById(`columna-${idProducto}`);
    let indexABorrarDelArray=productos.findIndex((producto)=>Number(producto.id)===Number(idProducto));//Manda cada objeto de producto y lo compara con su valor dado por el parametro de entrada id si son iguales obtiene el indice del arrayProdcutos que corresponde a la posición del array que se desea borrar
    productos.splice(indexABorrarDelArray,1);//Quita del array de productos el producto con id dado por el parametro
    columnaABorrar.remove();//Remueve el HTML del producto mostrado
    actualizarProductosStorage();//actualiza el storage segun lo eliminado
    /* PARA LAS ESTADISTICAS */
    let columnaEstadisticaBorrar=document.getElementById("Estadisticas-Inventario");
    columnaEstadisticaBorrar.remove();
    imprimirEstadisticas(); 

}
/* Imprimir los productos con codigo HTML DOM */
function imprimirProductos(){
    contenedorProductos.innerHTML="";//Crear el espacio para imprimir el HTML en el contenedor
    productos.forEach((producto)=>{
        let column=document.createElement("div");
        column.className="col-md-4 mt-2";
        column.id=`columna-${producto.id}`;
        column.innerHTML=`
    <div class="card">
    <img class="card-img-top ml-4" style="width:300px" src="./Imagenes/${producto.categoria}.svg" alt="Card café">
        <div class="card-body">
            <h4 class="card-title">
            ID:<strong> ${producto.id}: ${producto.nombre}</strong>
            </h4>
            <h4 class="card-title">
            <strong>${producto.categoria.replace(`/\s/g`,`%20`)}</strong>
            </h4>
            <p class="card-text">
            <strong>Cantidad:</strong> ${producto.cantidad} PZ
            </p>
            <p class="card-text">
            <strong>Precio unitario:</strong>$ ${producto.precio}
            </p>
        </div>
            <div class="card-footer">
            <button class="btn btn-danger" id="botonEliminar-${producto.id}" >Eliminar</button>
            </div>
    </div>
        `;
        contenedorProductos.append(column);//agregar el objeto column
        let botonEliminarProducto=document.getElementById(`botonEliminar-${producto.id}`);
        botonEliminarProducto.onclick=()=>eliminarProducto(producto.id);//Si el evento de apretar el boton eliminar pasa activa la arrow del metodo elimianr el producto.id
    });//Termina foreach
}
/* Imprimir estadisticas de inventario */
function imprimirEstadisticas()
{
    if(productos.length!=0)
    {
    estadisticas.innerHTML="";
    let column=document.createElement("div");
    column.className="card badge-primary rounded";
    column.id="Estadisticas-Inventario";
    column.innerHTML=`
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
        imprimirEstadisticas();
    }
    else
    {
        ocultarFiltro();
    }
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
/* funcionalidades de la pagina */
/* Calcular costo del inventario */
function calcularCosto(productos)
{
    let costoTotalInventario=0;
    
    for(let producto of productos)
    {
        costoTotalInventario+=producto.cantidad*producto.precio;
    }
    return costoTotalInventario;
}
function calcularTotal(productos) {
    let totalDeProductos=0;
    for(let producto of productos)
    {
        totalDeProductos+=producto.cantidad;
    }
    return totalDeProductos;
}
function calcularMin(productos)
{
    let minVal;
    let minArr=productos;
    minArr.sort((a,b)=>a.cantidad-b.cantidad);//Obtiene el producto con menor cantidad de piezas
    minVal=(minArr[0]).nombre;
    return minVal;
}
/* Fuction main */
function main()
{
    inicializarElementos();
    InicializarEventos();
    obtenerProductosStorage();
}
main();

