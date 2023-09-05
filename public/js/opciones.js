let btncuenta = document.querySelector(".btncuenta");
let btnseguridad = document.querySelector(".btnseguridad");
let btnavanzado = document.querySelector(".btnavanzado");
let btnayuda = document.querySelector(".btnayuda");

let btnvolver = document.querySelector(".back-btn");

let cuentaform = document.querySelector(".cuenta-form");
let seguridadform = document.querySelector(".seguridad-form");
let avanzadoform = document.querySelector(".avanzado-form");
let ayudaform = document.querySelector(".ayuda-form");

btncuenta.addEventListener('click',()=>{
    cuentaform.style.visibility = "visible";
    seguridadform.style.visibility = "hidden";
    avanzadoform.style.visibility = "hidden";
    ayudaform.style.visibility = "hidden";
})
btnseguridad.addEventListener('click',()=>{
    cuentaform.style.visibility = "hidden";
    seguridadform.style.visibility = "visible";
    avanzadoform.style.visibility = "hidden";
    ayudaform.style.visibility = "hidden";

})
btnavanzado.addEventListener('click',()=>{
    cuentaform.style.visibility = "hidden";
    seguridadform.style.visibility = "hidden";
    avanzadoform.style.visibility = "visible";
    ayudaform.style.visibility = "hidden";
})
btnayuda.addEventListener('click',()=>{
    cuentaform.style.visibility = "hidden";
    seguridadform.style.visibility = "hidden";
    avanzadoform.style.visibility = "hidden";
    ayudaform.style.visibility = "visible";

})

btnvolver.addEventListener('click',()=>{
    document.write("...")
    document.location.href = '/';
})
