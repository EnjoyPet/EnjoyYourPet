let cerrar = document.querySelectorAll('.close')[0];
let abrir = document.querySelectorAll('.register')[0];
let modal = document.querySelectorAll('.modal')[0];
let modalc = document.querySelectorAll('.modal-container')[0];

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
  document.write("...")
  document.location.href = '/';
});

window.addEventListener('click', function(e){
  if(e.target == modalc){
    modal.classList.toggle('modal-close');
  
  setTimeout(function(){
    modalc.style.opacity = "0";
    modalc.style.visibility = "hidden";
  },850)
  document.write("...")
  document.location.href = '/';
  }
  }) 

  function cambiarform() {
    const registrarUsuarioForm = document.getElementById("registrar-Usuario-form");
    const validarUsuarioForm = document.getElementById("validar-Usuario-form");
    const espacio_mail = document.getElementById("__correo");
    registrarUsuarioForm.style.display = "none";
    validarUsuarioForm.style.display = "flex";
    espacio_mail.value = document.getElementById("_correo").value;
  }