/* Variables globles */
let pedidosPagados=[];
/* nodos para generar tabla de ventas */
let columnasVentas;
function inicializarElementos()
{
    columnasVentas=document.getElementById("columnaVentas");
}
function InicializarEventos()
{
    if(pedidosPagados!==[])
    {
        imprimirPedidosPagados();
    }
}
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
    })
}
/* obtener pedidos pagados del storage */
function obtenerPedidosPagadosStorage()
{
    let pedidosPagadosJSON=localStorage.getItem("pedidosPagados");
    if(pedidosPagadosJSON)
    {
        pedidosPagados=JSON.parse(pedidosPagadosJSON);
    }
}
/* Función principal o main */
function main()
{
    inicializarElementos();
    obtenerPedidosPagadosStorage();
    InicializarEventos();

}
main();