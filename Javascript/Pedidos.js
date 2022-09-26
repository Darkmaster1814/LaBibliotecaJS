/* Variables */
let pedidos=[];
let mesas=[];//Mesas
let pedidosMesas=[]//Pedidos de las mesas
let pedidosPagados=[];
/* Variables formulario */
let idMesa;
let nombreClienteFormulario;
let totalFormulario;
let productosFormulario;
let cantidadesFormulario;
let preciosUnitariosFormulario;
let subTotalesFormulario;
/* variables nodos */
let contenedorPedidos;
let numeroMesa;
let nombreCliente;
let contenedorPedido;
let MesaTotalPagar;
let formularioPago;
let inputPago;
let inputTipoPago;
/* Clase mesa */
class Mesa{
    constructor(numeroMesa,nombreCliente,arrDetallesPedido,arrNombreProductos,arrPreciosUnitario,arrCantidades,arrSubTotales)
    {
        this.numeroMesa=numeroMesa;
        this.nombreCliente=nombreCliente;
        this.arrDetallesPedido=arrDetallesPedido;
        this.arrNombreProductos=arrNombreProductos;
        this.arrPreciosUnitario=arrPreciosUnitario;
        this.arrCantidades=arrCantidades;
        this.arrSubTotales=arrSubTotales;
    }
}
/* Clase para pedidos */
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
class PedidoPagado{
    constructor(idMesa,cliente,productosFormulario,cantidadesFormulario,preciosUnitariosFormulario,subTotalesFormulario,totalPedido,tipoDePago,fecha)
    {
        this.idMesa=idMesa;
        this.cliente=cliente;
        this.productosFormulario=productosFormulario;
        this.cantidadesFormulario=cantidadesFormulario;
        this.preciosUnitariosFormulario=preciosUnitariosFormulario;
        this.subTotalesFormulario=subTotalesFormulario;
        this.totalPedido=totalPedido;
        this.tipoDePago=tipoDePago;
        this.fecha=fecha;
    }
}
/* inicializar los nodos dentro del HTML */
function inicializarElementos()
{
    contenedorPedidos=document.getElementById("contenedorPedidos");
    numeroMesa=document.getElementById("numeroMesa");    
    nombreCliente=document.getElementById("nombreCliente");
    contenedorPedido=document.getElementById("contenedorPedido");
    MesaTotalPagar=document.getElementById("MesaTotalPagar");
    formularioPago=document.getElementById("formularioPago");
    inputPago=document.getElementById("inputPago");
    inputTipoPago=document.getElementById("inputTipoPago");
}   
function InicializarEventos()
{
    formularioPago.onsubmit=(evento)=> validarFormularioPago(evento);
}
/* validar Formulario de pago */
function validarFormularioPago(evento)
{
    evento.preventDefault();
    let totalPagado=parseFloat(inputPago.value);
    let tipoDePago=inputTipoPago.value;
    if(totalPagado>=totalFormulario)
    {
        alert(`Su cambio: $${totalPagado-totalFormulario}`);
        let pedido=new PedidoPagado(idMesa,nombreClienteFormulario,productosFormulario,cantidadesFormulario,preciosUnitariosFormulario,subTotalesFormulario,totalFormulario,tipoDePago,new Date());
        pedidosPagados.push(pedido);
        console.log(pedidosPagados);

    }
    else
    {
        alert("El pago no se puede procesar porque es menor al total");
    }

}
/* Imprimir las card de pedidos por mesa */
function imprimirPedidos()
{
    contenedorPedidos.innerHTML="";
    pedidosMesas.forEach((pedidoMesa)=>{
        let column=document.createElement("div");
        column.className="col-md-4 mt-2";
        column.id=`columna-${pedidoMesa.numeroMesa}`;
        column.innerHTML=`
        <div class="card">
            <img type="button" class="card-img-top btn ml-5" id="boton-${pedidoMesa.numeroMesa}" data-bs-toggle="modal" data-bs-target="#detallesPedido" style="width:300px"
                src="../Imagenes/${pedidoMesa.numeroMesa}.svg" alt="Mesa">
            <div class="card-body">
                <h4 class="card-title text-center">
                <strong> ${pedidoMesa.numeroMesa}</strong>
                </h4>
                <h4 class="card-title text-center">
                <strong>${pedidoMesa.nombreCliente}</strong>
                </h4>
            </div>
        </div>
            `;
        contenedorPedidos.append(column);
        let botonAgregarMesa=document.getElementById(`boton-${pedidoMesa.numeroMesa}`);
        botonAgregarMesa.onclick=()=>imprimirPedido(pedidoMesa.numeroMesa);
    });
}
/* Imprimir el pedido por mesa */
function imprimirPedido(numerodeMesa)
{//Indice del pedido que se hizo click
    /* variables de HTML */
    numeroMesa.innerHTML="";
    nombreCliente.innerHTML="";//Limpiar el pedido en el html cada que hace clic en abrir
    contenedorPedido.innerHTML="";
    MesaTotalPagar.innerHTML="";
    formularioPago.reset();
    pedidosMesas.forEach((pedido)=>{
        if(pedido.numeroMesa===numerodeMesa)
        {
            idMesa=pedido.numeroMesa;
            nombreClienteFormulario=pedido.nombreCliente;
            totalFormulario=calcularTotalPedido(pedido.arrSubTotales);//Guardar para formulario de pedidos completos
            productosFormulario=pedido.arrNombreProductos;
            cantidadesFormulario=pedido.arrCantidades;
            preciosUnitariosFormulario=pedido.arrPreciosUnitario;
            subTotalesFormulario=pedido.arrSubTotales;
            numeroMesa.innerHTML=`${pedido.numeroMesa}`;//CREacion HTML
            nombreCliente.innerHTML=`${pedido.nombreCliente}`;
            MesaTotalPagar.innerHTML=`Total: $${calcularTotalPedido(pedido.arrSubTotales)}`;
            contenedorPedido.innerHTML=`${imprimirPedidoxPedido(pedido.arrNombreProductos,pedido.arrCantidades,pedido.arrPreciosUnitario,pedido.arrSubTotales,pedido.arrDetallesPedido)}`;
        }
    });
}
/* Imprimir pedido por pedido por mesa  en el modal*/
function imprimirPedidoxPedido(arrNombreProductos,arrCantidades,arrPreciosUnitario,arrSubTotales,arrDetallesPedido)
{
    let numeroPedido=1;
    let pedidoString="";
    for(let index=0; index<arrNombreProductos.length;index++)
    {
        pedidoString+=`${numeroPedido}) ${arrNombreProductos[index]}:  ${arrCantidades[index]} PZ X $${arrPreciosUnitario[index]}= $${arrSubTotales[index]}<br>Detalles: ${arrDetallesPedido[index]}<br>`;
        numeroPedido++;
    }
    return pedidoString;
}
/* Crear objetos mesa */
function crearMesas(mesas,arrClientes,arrDetallesPedido,arrProductos,arrPrecioProductos,arrCantidadProductos,arrSubTotales)
{
for(let index=0; index<mesas.length; index++)
{
    let pedidoXMesa=new Mesa(mesas[index],arrClientes[index],arrDetallesPedido[index],arrProductos[index],arrPrecioProductos[index],arrCantidadProductos[index],arrSubTotales[index]);//Creacion de cada objecto de cliente por mesa
    pedidosMesas.push(pedidoXMesa);
}
console.log(pedidosMesas);
imprimirPedidos();
}
/* Junta la informacion de una misma mesa */
function unirInformacionXMesa(pedidos)
{
    let cantidadMesas;//Define la cantidad de mesas del cafe
    let detalles;//Detalles sin repeticiones
    let detalles2;
    let arregloMesas=[];//Arreglo de mesas que tienen pedido
    let cliente="";//nombre de cliente
    let arrClientes=[];//nombre de todos los clientes
    let arrDetallePedido=[];//detalles de cada mesa
    let arrDetallesPedido=[];//detalles de todas las mesas
    let arrProductosxMesa=[];//productosxmesa
    let arrProductos=[];//productos pedidos en todas las mesas
    let arrPrecioProducto=[];
    let arrPrecioProductos=[];
    let arrCantidadProducto=[];
    let arrCantidadProductos=[];
    let arrSubtotal=[];
    let arrSubTotales=[];
    pedidos.forEach((pedido) => {
        arregloMesas.push(pedido.mesa);
    });
    cantidadMesas=new Set(arregloMesas);
    for(let index=1; index<=cantidadMesas.size;index++)
    {
        mesas.push(`MESA-${index}`);//Genera un arreglo con el nombre de la mesa
        console.log(mesas);
    }
    for(let index=0; index<mesas.length;index++)
    {
        /* limpiar variables */
        cliente="";
        detalles="";
        arrProductosxMesa=[];
        arrPrecioProducto=[];
        arrCantidadProducto=[];
        arrSubtotal=[];
        arrDetallePedido=[];
        pedidos.forEach((pedido)=>{
            if(mesas[index]===pedido.mesa)
            {
                if(cliente=="")//Se guarda el primer nombre del cliente
                {
                    cliente=pedido.nombreCliente;
                }
                if(detalles!=pedido.detallesPedido)//Agrega los detalles del pedido sin repeticion
                {
                    if(detalles2!=pedido.detallesPedido)
                    {
                        arrDetallePedido.push(pedido.detallesPedido); 
                    }
                    detalles2=pedido.detallesPedido;
                }
                arrProductosxMesa.push(pedido.nombreProducto);
                arrPrecioProducto.push(pedido.precio);
                arrCantidadProducto.push(pedido.cantidad);
                arrSubtotal.push(pedido.subTotal);
            }
            detalles=pedido.detallePedido;
            });
        arrClientes.push(cliente);
        arrDetallesPedido.push(arrDetallePedido);
        arrProductos.push(arrProductosxMesa);
        arrPrecioProductos.push(arrPrecioProducto);
        arrCantidadProductos.push(arrCantidadProducto);
        arrSubTotales.push(arrSubtotal);
    }
    crearMesas(mesas,arrClientes,arrDetallesPedido,arrProductos,arrPrecioProductos,arrCantidadProductos,arrSubTotales);//Llama la funcion para crear los objectos de pedido por mesa
}
/* STORAGE */
/* Actualizar pedidos storage */
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
/* Obtener pedidos del storage */
function obtenerPedidoStorage()
{
    let pedidosJSON=localStorage.getItem("pedidos");
    if(pedidosJSON)
    {
        pedidos=JSON.parse(pedidosJSON);
        unirInformacionXMesa(pedidos);
    }
}
/* funciones operacionales */
/* calcular total por pedido de mesa */
function calcularTotalPedido(arrsubtotales){
    let total=0;
    for(subTotal of arrsubtotales)
    {
        total+=subTotal;
    }
    return total;
}
/* Función principal o main */
function main()
{
    inicializarElementos();
    InicializarEventos();
    obtenerPedidoStorage()
    console.log(pedidos);
/*     
    obtenerProductosStorage();
    obtenerCarritoStorage();
    console.log(pedidos); */
}
main();