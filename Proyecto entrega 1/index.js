/* PROYECTO: SISTEMA INTEGRADO DE COMANDAS PARA CAFETERÍA "LA BIBLIOTECA"   
DESCRIPCIÓN: El proyecto consiste en un sistema interno basado en HTML/CSS que tiene como función gestionar los pedidos
diarios de una cafeteria, para ello integrará primero un sistema de usuario contraseña
unicamente los usuarios ingresados por el master podran accesar al sistema interno,
dentro del sistema, los mesero tendrán acceso a todos los productos existentes en el sistema y 
podran levantar el pedido de la gente usando la pagina como sistema de comandas 
también la pagina servirá como un sistema de administración de inventarios, con el los usuarios podran gestionar
de forma automatica las entradas y salidas de almacén, actualizar articulos o incluso calcular la cantidad total de articulos 
tambien se utilizará para levantar pedidos en un formato ecommerce donde podran interactual con filtros para facilitar la busqueda de informacion*/
/*---------------------------------------INSTRUCCIONES DE USO-------------------------------------------------------------------------------
1.Acceda a la opción crear nuevo usuario
2.Ingrese la contraseña 1234 (contraseña maestra)
3.Cree un usuario y contraseña
4.Ingrese al programa con su usuario y contraseña
5.Agregue uno o varios nuevos productos (Seleccione algun nombre, categoría, precio y cantidad)
6.Genere alguna compra(comanda)
7.Seleccione entre las opciones de filtrado disponibles
8.Elija algun producto para agregar al carrito
9.Una vez agregado el pedido completo pague
10.Se visualizará el carrito con los productos a pagar y el monto de cada uno
11.Pague (Se actualiza el stock disponible)
12.Para salir seleccione la opción de salir y posteriormente seleccione esc
13.Si desea cerrar sesión y volver a la pagina de inicio seleccione volver al inicio */
/* Global variables */
const contraseñaAdmin="1234";//Contraseña de autorización para validar acciones y metodos
let arrayUsuarioContraseña=[];//Arreglo de los usuarios y contraseñas agregados
let id=0;//ID de productos
let productos=[];//Arreglo de productos disponibles para comprar
/* Clase usuario */
class Usuario{
    constructor(usuario, contrasena)
    {
        this.usuario=usuario;
        this.contrasena=contrasena;
    }
}
/* Clase productos */
class Producto{
    constructor(nombre,categoria, precio,cantidad)
    {
        this.id=id+1;//Made unique id (Similar to static value)
        id=this.id;
        this.nombre=nombre.toUpperCase();
        this.categoria=categoria.toUpperCase();
        this.precio=precio;
        this.cantidad=cantidad;
    }
    /* Methodos de producto */
    calcularCosto=()=>this.cantidad*this.precio;
}
/* carrito de compras */
class CarritoDeCompras{
    constructor(nombre,subTotal, cantidad)
    {
        this.nombre=nombre;
        this.subTotal=subTotal;
        this.cantidad=cantidad;
    }
}
/* All functions */
/* Función de usuario y contraseña para accesar al programa */
function inicio()
{
    let onoff=0;//Interruptor del switch
    let opcion;
    let usuario;
    let contrasena;
    let permiso;//Permiso para accesar al programa tipo boolean
    do
    {
        opcion=validarCantidad(prompt("CAFETERÍA LA BIBLIOTECA SISTEMA DE ADMINISTRACIÓN\n¿Que desea hacer?\n1.Crear nuevo usuario y contraseña\n2.Ingresar con usuario y contraseña\n3.Volver al menu de inicio"));
            switch(opcion)
            {
                case 1:
                    contraseñaMaestra=validarNombre(prompt("Pide a tu gerente que ingrese la contraseña(ingresa:1234)"));
                    if(contraseñaMaestra===contraseñaAdmin)
                    {
                        alert("Bienvenido");
                        usuarioContrasena();
                    }
                    else
                    {
                        alert("La contraseña es incorrecta");
                    }
                    break;
                case 2:
                    usuario=validarNombre(prompt("Ingresa el usuario"));
                    contrasena=validarNombre(prompt("Ingresa la contraseña"));
                    permiso=acceso(usuario,contrasena);
                    if(permiso)
                    {
                        CarritoCompras();
                    }
                break;
                case 3:
                    alert("Volviendo al menú de inicio");
                    onoff=1;
                    break;
                default:
                    alert("Opcion invalida");
            }
    }while(onoff!=1);
}
/* array de objetos de usuario y contraseña */
function usuarioContrasena()
{
    let usuario;
    let contrasena;
    alert("Crear nuevo usuario y contraseña");
    usuario=validarNombre(prompt("Ingrese el nombre de usuario:"));
    contrasena=validarNombre(prompt("Ingrese la contraseña:"));
        alert(`El usuario ${usuario} ha sido registrado correctamente`);
    let usuarioNuevo=new Usuario(usuario,contrasena);
    arrayUsuarioContraseña.push(usuarioNuevo);
    console.log(arrayUsuarioContraseña);
}
/* Función de acceso al programa general */
function acceso(usuario, contrasena)
{
    for(let persona of arrayUsuarioContraseña)
    {
        if(existeusuario=arrayUsuarioContraseña.some((persona)=> persona.usuario===usuario&&persona.contrasena===contrasena))
        {
            alert(`Bienvenido ${persona.usuario}`);
            return true;
        }
        else
        {
            alert("El usuario o la contraseña son incorrectos");
            return false;
        }
    }
}
/* Función de validacion de cantidades */
function validarCantidad(cantidad)
{
    let result=cantidad;
    do{
    if(result!="")
    {
        result=parseInt(result);
        if(result!=isNaN&&result>0)
        {
            return result;
        }
        else if(result<0)
        {
            result=prompt("Valores negativos no son permitidos\n Ingresa una opción válida");
        }
        else
        {
            result=prompt("No se permite ingresar letras\n Ingresa una opción válida:");
        }
    }
    else
    {
        result=prompt("Debes ingresar algún valor:");
    }
    }while(true);
}
/* Función de validacion de nombres */
function validarNombre(nombre)
{
    let result=nombre;
    do{
    if(result!="")
    {
        return result;
    }
    else
    {
        result=prompt("Debes ingresar algún valor:");
    }
    }while(true);
}
/* Menu fuction */
function menu()
{
    let opcion=validarNombre(prompt("LA BIBLIOTECA CAFETERÍA (Introduce ESC para salir)\n ¿Que deseas hacer?\n1.Agregar artículos al menú\n2.Generar pedido"));
    return opcion;
}
/* Agregar nuevo producto */
function agregarProductos(productos){
    let opt=0;
    let numeroProductos;
    numeroProductos=validarCantidad(prompt("Cuantos productos se van a registrar"));
    for(let index=0; index<numeroProductos; index++)
    {
        let nombre=validarNombre(prompt("Ingrese el nombre"));
        let categoria=validarNombre(prompt("Ingresa la categoría"));   
        let precio=parseFloat(validarCantidad(prompt("Ingresa el precio de venta")));
        let cantidad=validarCantidad(prompt("Ingresa la cantidad"));
    /* Creacion de objetos o productos */
    let productoARegistrar=new Producto(nombre,categoria,precio,cantidad);
    alert(`Se ha agregado satisfactoriamente el producto:\nID: ${id}\nNombre: ${productoARegistrar.nombre}\nCantidad:${productoARegistrar.cantidad} `);
/* agregarlo al arreglo */
productos.push(productoARegistrar);
}
return productos;
}
/* Mensaje para filtros */
function mensajeFiltrar()
{
    return validarCantidad(prompt("Deseas filtrar los productos\n1.No filtrar\n2.Por categoría\n3.Por Precio mayor a menor\n4.Por precio menor a mayor"));
}
/* Función para filtrar */
function filtrar(productos)
{
    let opcion;
    let opt=0;
    do{
    opcion=parseInt(mensajeFiltrar());
    switch(opcion)
    {
        case 1://No filtra
            opt=1;
            break;
        case 2://Filtra en orden alfabetico
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
            opt=1;
            break;
        case 3://Filtra en orden acendente de precio
            productos.sort((a,b)=>b.precio-a.precio);
        opt=1;
        break;
        case 4://Filtra en orden descendente de precio
            productos.sort((a,b)=>a.precio-b.precio);
            opt=1;
            break;
        default:
            alert("Opcion invalida");
    }
    }while(opt!=1);
    return productos;
}
/* Calcular costo del inventario */
function calcularCosto(productos)
{
    costoTotalInventario=0;
    for(let producto of productos)
    {
        costoTotalInventario+=producto.calcularCosto();
    }
    return costoTotalInventario.toString();
}
/* Funcion de menú dinámico */
function crearMensaje(productos){
    let mensaje="Que producto deseas comprar?";
    let count=1;
    for(let producto of productos)
    {
        mensaje+=`\n${count}. ${producto.nombre} (${producto.categoria})- $${producto.precio} (Stock: ${producto.cantidad})`;
        count++;
    }
    mensaje+=`\n${count}.Pagar ahora`;
    return mensaje;
}
/* Mensaje dinamico de carrito de compras */
function crearMensajeCarrito(carrito){
    let mensaje="CARRITO DE COMPRAS";
    let count=1;
    for(let car of carrito)
    {
        mensaje+=`\n${count}. Nombre:${car.nombre}- Cantidad:${car.cantidad}- Total: $${car.subTotal}`;
        count++;
    }
    mensaje+=`\nPagar ahora`;
    return mensaje;
}
/* imprimir mensaje para cantidades agregadas a carrito */
function cantidad(producto){
    opcion=prompt(`¿Cuantas unidades de ${producto.nombre} deseas comprar?`);
    return validarCantidad(opcion);
}
/* Generar un subtotal de pago */
function calcularSubtotal(cantidad,producto){
    alert(`Se agregó al carrito ${cantidad} pzas de ${producto.nombre} por $${cantidad*producto.precio}`);
    return cantidad*producto.precio;
}
/* Total a pagar */
function calcularTotal(arr){
return arr.reduce((acumulador,elemento)=>acumulador+elemento,0);//Suma cada elemento del arreglo 
}
/* Función de carrito de compras */
function CarritoCompras()
{
let total=[];//Total a pagar
let carrito=[];//Carrito de compras 
let opcion=menu();
while(opcion.toLowerCase()!="esc")
{
    carrito=[];//Vacia el carrito despues de cada compra
    if(opcion!=""&&opcion.toLowerCase()!="esc")
    {
        opcion=parseInt(opcion);
        if(opcion!=isNaN)
        {
            switch(opcion)
            {
                case 1://Add new product
                productos=agregarProductos(productos);

                const contenedorProductos = document.getElementById("contenedor-productos");
                alert(`Estatus actual de inventario:\nCantidad de productos diferentes: ${productos.length}\nValor de inventario:$ ${calcularCosto(productos)}`);
                    break;
                case 2://Create add a list of product to buy               
                    do{
                        opcionCompra=parseInt(prompt(crearMensaje(filtrar(productos))));
                        if( opcionCompra==productos.length+1)
                        {
                            alert(crearMensajeCarrito(carrito));
                            alert(`Su total fue de: $ ${calcularTotal(total)}\n Gracias por su compra`);
                            break;
                        }
                        let qty=cantidad(productos[opcionCompra-1]);
                        if(qty<=productos[opcionCompra-1].cantidad)//Valida si el stock es positivo sino no ejecuta el guardado del carrito
                        {
                            productos[opcionCompra-1].cantidad-=qty;//Descontar del stock
                            let product=productos[opcionCompra-1];
                            let subtotal=calcularSubtotal(qty,product);
                            let productoARegistrar=new CarritoDeCompras(product.nombre,subtotal,qty);
                            carrito.push(productoARegistrar);
                            total.push(subtotal);
                        }
                        else{alert(`El producto no tiene stock`);}
                    } while(true);
                break;   
                default:
                    alert("Ingrese una opción válida");
                    opcion=menu();
            }
        }
    else
    {
        alert("Ingresó una letra");
        opcion=menu();
    }
    opcion=menu();
    }
}
}
/* Función principal o main */
function main()
{
inicio();
}
/* Run file */
main();

