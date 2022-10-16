/* =======================================EFECTO DE DESPLAZAMIENTO NAVBAR====================== */
let scrollInicial;//Guarda el scroll al inicial la pag de la pagina
let navBar;//Elemento html nav
/* Incializar elemento navbar */
function inicializarElementos(){
navBar=document.getElementById("nav");
}
/* Inicializar evento scroll */
function inicializarEventos(){
    scrollInicial=window.pageYOffset;
        /* Evento scroll para ocultar y mostrar nav */
window.onscroll=()=>{
    let scrollActual=window.pageYOffset;//Monitor se estatus actual del scroll
    /* Si el scroll actual es menor o igual al inicial no ocultes navbar */
    if(scrollInicial>=scrollActual)
    {
        navBar.style.top="0";
    }
    /* Si el scroll esta en cualquier otro lugar cambia el stile css para desaparecer */
    else
    {
        navBar.style.top="-100px";
    }
    scrollInicial=scrollActual;//Guarda el nuevo status del scroll
}
}
/* ==========================================INICIO======================== */
function main(){
    inicializarElementos();
    inicializarEventos();
}
main();