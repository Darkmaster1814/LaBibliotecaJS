/* =============================================VARIABLES======================================================== */
/* Variables */
let pedidos=[];
let mesas=[];//Mesas
let pedidosMesas=[]//Pedidos de las mesas
let pedidosPagados=[];//Pedidos que han sido pagados
let totalParaMostrar;//Total para impresion
let iva;//subtotal de pago sin iva
let accesos=[];//Usuarios logeados
/* Variables formulario */
let idMesa;//Id de cada mesa que hizo pedido
let nombreClienteFormulario;//Nombre del cliente
let totalFormulario;//Total generado por mesa
let productosFormulario;//Productos pedidos por mesa
let cantidadesFormulario;//Cantidades de productos por mesa
let preciosUnitariosFormulario;//Precios de productos pedidos por mesa
let subTotalesFormulario;//Subtotal por mesa 
/* variables nodos */
let contenedorPedidos;
let numeroMesa;
let nombreCliente;
let contenedorPedido;
let MesaTotalPagar;
let formularioPago;
let inputPago;
let inputTipoPago;
/* ======================================================CLASES CONSTRUCTORAS========================================================= */
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
    constructor(...pedidosFormados)//------------------------------------------------------------------------------------------------------------------------------>Se optimizo codigo
    {
        this.mesa=pedidosFormados[0];
        this.nombreCliente=pedidosFormados[1];
        this.detallesPedido=pedidosFormados[2];
        this.nombreProducto=pedidosFormados[3];
        this.precio=pedidosFormados[4];
        this.cantidad=pedidosFormados[5];
        this.subTotal=pedidosFormados[6];
    }
}
/* Clase de pedidos pagados */
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
/* ==========================================================FUNCIONES=============================================== */
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
/* inicializar eventos */   
function InicializarEventos()
{
    formularioPago.onsubmit=(evento)=>
    {
        evento.preventDefault();
        alertaPregunta(evento);
    }
}
/* validar Formulario de pago */
function validarFormularioPago(evento)
{
    evento.preventDefault();
    let totalPagado=parseFloat(inputPago.value);
    let tipoDePago=inputTipoPago.value;
    if(totalPagado>=totalFormulario)
    {
        let pedido=new PedidoPagado(idMesa,nombreClienteFormulario,productosFormulario,cantidadesFormulario,preciosUnitariosFormulario,subTotalesFormulario,totalFormulario,tipoDePago,`${(new Date()).getDate()}-${(new Date()).getMonth()+1}-${(new Date()).getFullYear()}`);
        pedidosPagados.push(pedido);
        borrarPedido();
        actualizarPedidoPagadosStorage();
        alertaExito("Pagado");
    }
    else
    {
        alertaError("El pago ingresado es menor al total");
    }
}
/* =====================================================MODIFICACION DEL DOM============================================ */
/* Borrar pedido que se ha pagado */
function borrarPedido()
{
    while(pedidos.findIndex((pedido)=>idMesa==pedido.mesa)!=-1)
    {
        let index=pedidos.findIndex((pedido)=>idMesa==pedido.mesa);
        pedidos.splice(index,1);
    }
    borrarPedidoHTML();
    let cardABorrar=document.getElementById(`columna-${idMesa}`);
    cardABorrar.remove();//Borrar HTML del card de pedido completo (desocupa la mesa que pago)
    actualizarPedidoStorage();
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
        botonAgregarMesa.onclick=()=>imprimirPedido(pedidoMesa.numeroMesa);//boton para desplegar modal con detalles del pedido
    });
}
/* Borrar pedidoxmesa */
function borrarPedidoHTML()
{
    numeroMesa.innerHTML="";
    nombreCliente.innerHTML="";//Limpiar el pedido en el html cada que hace clic en abrir
    contenedorPedido.innerHTML="";
    MesaTotalPagar.innerHTML="";
    formularioPago.reset();
}
/* Imprimir el pedido por mesa */
function imprimirPedido(numerodeMesa)
{//Indice del pedido que se hizo click
    /* variables de HTML */
    borrarPedidoHTML();
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
        totalParaMostrar=Math.round((calcularTotalPedido(pedido.arrSubTotales)-(0.16)*calcularTotalPedido(pedido.arrSubTotales))*100)/100;//Calcular subtotal sin iva
        iva=(0.16)*calcularTotalPedido(pedido.arrSubTotales);
        }
        let botonImprimir=document.getElementById("imprimir")
        botonImprimir.onclick=()=>imprimirPDF();
    });
}
/* Imprimir pedido por pedido(producto por producto) por mesa  en el modal*/
function imprimirPedidoxPedido(arrNombreProductos,arrCantidades,arrPreciosUnitario,arrSubTotales,arrDetallesPedido)
{
    let numeroPedido=1;
    let pedidoString="";
    for(let index=0; index<arrNombreProductos.length;index++)
    {
        pedidoString+=`${numeroPedido}) ${arrNombreProductos[index]}:  ${arrCantidades[index]} PZ X $${arrPreciosUnitario[index]}= $${arrSubTotales[index]}<br>Detalles: ${arrDetallesPedido[index]||"Sin detalles"}<br>`;
        numeroPedido++;//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->Se optimizo codigo
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
    for(let mes of cantidadMesas)
    {
        mesas.push(mes);//Genera un arreglo con el nombre de la mesa
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
                    if(detalles2!=pedido.detallesPedido)//Si los detalles no se repiten entonces agrega los detalles al arr
                    {
                        arrDetallePedido.push(pedido.detallesPedido); //Guarda todos los detalles por comanda generada
                    }
                    detalles2=pedido.detallesPedido;//Guarda los detalles que no se repitieron
                }
                arrProductosxMesa.push(pedido.nombreProducto);
                arrPrecioProducto.push(pedido.precio);
                arrCantidadProducto.push(pedido.cantidad);
                arrSubtotal.push(pedido.subTotal);
            }
            detalles=pedido.detallePedido;//Guarda los detalles que fueron encontrados por mesa
            });
            /* Guarda el arreglo de informacion de cada mesa en un arreglo para todas las mesas que generaron pedido */
        arrClientes.push(cliente);
        arrDetallesPedido.push(arrDetallePedido);
        arrProductos.push(arrProductosxMesa);
        arrPrecioProductos.push(arrPrecioProducto);
        arrCantidadProductos.push(arrCantidadProducto);
        arrSubTotales.push(arrSubtotal);
    }//Crea un objeto de tipo mesa(lo estructura y da formato antes de pasarlo por el constructor)
    crearMesas(mesas,arrClientes,arrDetallesPedido,arrProductos,arrPrecioProductos,arrCantidadProductos,arrSubTotales);//Llama la funcion para crear los objectos de pedido por mesa
}
/* Imprimir pedido en PDF para pago */
function imprimirPDF()
{
    let doc=new jsPDF();//Crear objeto tipo jsPDF
    /* Estructura de pdf labels */
    let logotipo=document.getElementById("logotipo").innerText;
    let mesaText=numeroMesa.innerText;
    let client="Cliente: "+nombreCliente.innerText;
    let division="\n______________________________________________________________________\n"
    let productos=contenedorPedido.innerText+division
    +`\nSubtotal: $${totalParaMostrar}`+"\nIVA: 16%\n"+MesaTotalPagar.innerText;
/* info del pdf */
doc.setFontSize(25);//Tamaño de texto
doc.text(logotipo,78,10);
doc.setFontSize(16);
doc.text(mesaText,90,20);
doc.text(client, 10,30);
doc.text(division,5,15);
doc.text(productos, 10,40);
//Genera pdf
doc.save("pedido.pdf");
alertaExito(`PDF generado`);
}
/* ============================================================LOCAL STORAGE Y JSON======================================= */
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
/* Actualizar pedidos pagados Storage */
function actualizarPedidoPagadosStorage()
{
    if(pedidosPagados.length==null)
    {
        localStorage.pedidosPagados.clear();
    }
    else
    {
        let pedidosPagadosJSON;
        pedidosPagadosJSON=JSON.stringify(pedidosPagados);
        localStorage.setItem("pedidosPagados",pedidosPagadosJSON);
    }
}
/* Obtener si un usuario ha iniciado sesion */
function obtenerAccesos()
{
    let statusJSON=localStorage.getItem("accesos");
    accesos= statusJSON && JSON.parse(statusJSON);
}
/* Obtener pedidos del storage */
function obtenerPedidoStorage()
{
    let pedidosJSON=localStorage.getItem("pedidos");
    if(pedidosJSON)
    {
        pedidos=JSON.parse(pedidosJSON);
        unirInformacionXMesa(pedidos);//de acuerdo a los pedidos formados, ordena la informacion junta por mesa
    }
}
/* obtener pedidos pagados del storage */
function obtenerPedidosPagadosStorage()
{//Funciona como un if tradicional o existe y se guarda en el JSON o pedidosPagados es un arreglo vacio
    let pedidosPagadosJSON=localStorage.getItem("pedidosPagados");
        pedidosPagados=JSON.parse(pedidosPagadosJSON)||[];//----------------------------------------------------------------------------->Se optimizo codigo
}
/* ==============================================================FUNCIONES ESPECIFICAS DE LA PAGINA=================================================== */
/* calcular total por pedido de mesa */
function calcularTotalPedido(arrsubtotales){
    let total=0;
    for(subTotal of arrsubtotales)
    {
        total+=subTotal;
    }
    return total;
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
        text: `¿Confirmar el pago?`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            validarFormularioPago(evento);
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
    if(accesos!=null)
    {
        inicializarElementos();
        InicializarEventos();
        obtenerPedidoStorage();
        obtenerPedidosPagadosStorage();
    }
    else
    {
        alertaInicioSesion();
    }
}
main();