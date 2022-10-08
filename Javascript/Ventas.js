/* ===========================================VARIABLES===================================================== */
/* Variables globles */
let pedidosPagados=[];
let accesos=[]//usuarios logeados
/* nodos para generar tabla de ventas */
let columnasVentas;
/* ==============================================EVENTOS Y EL DOM========================================== */
function inicializarElementos()
{
    columnasVentas=document.getElementById("columnaVentas");
}
function InicializarEventos()
{
        pedidosPagados!==[] && imprimirPedidosPagados();//------------------------------------------------------------------------------------->sE OPTIMIZÓ CODIGO
}
/* ==========================================================MANIPULACION DEL DOM================================================ */
/* Imprimir la tabla de pedidos pagados */
function imprimirPedidosPagados()
{
    columnasVentas.innerHTML="";
    pedidosPagados.forEach((pedidoPagado)=>
    {
        let column=document.createElement("tr");
        column.innerHTML=`
        <th scope="row">${pedidoPagado.fecha}</th>
        <td>${pedidoPagado.idMesa}</td>
        <td>${pedidoPagado.productosFormulario}</td>
        <td>${pedidoPagado.tipoDePago}</td>
        <td>$${pedidoPagado.totalPedido}</td>
        `;
        columnasVentas.append(column);
    });
}
/* =============================================================LOCALSTORAGE Y JSON======================================== */
/* Obtener si un usuario ha iniciado sesion */
function obtenerAccesos()
{
    let statusJSON=localStorage.getItem("accesos");
    accesos= statusJSON && JSON.parse(statusJSON);
}
/* obtener pedidos pagados del storage */
function obtenerPedidosPagadosStorage()
{
    let pedidosPagadosJSON=localStorage.getItem("pedidosPagados");
        pedidosPagados=pedidosPagadosJSON && JSON.parse(pedidosPagadosJSON);//--------------------------------------------------------------------------------------------------------------------------->Se optimizó codigo
}
/* ==========================================================================ALERTAS DE USUARIO============================================================== */
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
        obtenerPedidosPagadosStorage();
        InicializarEventos();
    }
    else
    {
        alertaInicioSesion();
    }
}
main();