/* ===========================================VARIABLES===================================================== */
/* Variables globles */
let pedidosPagados=[];
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
/* obtener pedidos pagados del storage */
function obtenerPedidosPagadosStorage()
{
    let pedidosPagadosJSON=localStorage.getItem("pedidosPagados");
        pedidosPagados=pedidosPagadosJSON && JSON.parse(pedidosPagadosJSON);//--------------------------------------------------------------------------------------------------------------------------->Se optimizó codigo
}
/* ==========================================================================INICIO DE EJECUCION DEL PROGRAMA=============================================================================== */
function main()
{
    inicializarElementos();
    obtenerPedidosPagadosStorage();
    InicializarEventos();
}
main();