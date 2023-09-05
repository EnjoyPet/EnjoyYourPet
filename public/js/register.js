let cerrar = document.querySelectorAll('.close')[0];
let abrir = document.querySelectorAll('.register')[0];
let modal = document.querySelectorAll('.modal')[0];
let modalc = document.querySelectorAll('.modal-container')[0];

let nombre = document.querySelector('#nombre');
let correo = document.querySelector('#correo');
let contrasenia = document.querySelector('#contrasenia');
let numero = document.querySelector('#numero');

let btnregistrar = document.querySelector('#submit-btn');



abrir.addEventListener('click', function(e){
  e.preventDefault();
  modalc.style.opacity = "1";
  modalc.style.visibility = "visible";
  modal.classList.toggle('modal-close');

});

cerrar.addEventListener('click', function(){
  modal.classList.toggle('modal-close');

  setTimeout(function(){
    modalc.style.opacity = "0";
    modalc.style.visibility = "hidden";
  },850)
});

window.addEventListener('click', function(e){
  console.log(e.target)
  if(e.target == modalc){
    modal.classList.toggle('modal-close');
  
  setTimeout(function(){
    modalc.style.opacity = "0";
    modalc.style.visibility = "hidden";
  },850)
  }
  }) 

  btnregistrar.addEventListener('click',()=>{
    let text = "/registrar/"+nombre.value+"/"+correo.value+"/"+contrasenia.value+"/"+numero.value
    document.write(text)
    window.location.href = text
  })
  