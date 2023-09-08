let cerrarrr = document.querySelectorAll('.cerrar')[0];
let abrirrr = document.querySelectorAll('.cuenta')[0];
let modalll = document.querySelectorAll('.modalll')[0];
let modallcc = document.querySelectorAll('.modal-containerrr')[0];

let cerrarsecion = document.querySelector(".cerrarsesion");
let opciones = document.querySelector(".opciones");

abrirrr.addEventListener('click', (e)=>{
  e.preventDefault();
  console.log("click")
  modallcc.style.opacity = "1";
  modallcc.style.visibility = "visible";
  modalll.classList.toggle('modal-closee');

});

cerrarrr.addEventListener('click', ()=>{
  modalll.classList.toggle('modal-closee');

  setTimeout(function(){
    modallcc.style.opacity = "0";
    modallcc.style.visibility = "hidden";
  },850)
});

window.addEventListener('click', (e)=>{
  if(e.target == modallcc){
    modalll.classList.toggle('modal-closee');
  
  setTimeout(function(){
    modallcc.style.opacity = "0";
    modallcc.style.visibility = "hidden";
  },850)
  }
  }) 

  cerrarsecion.addEventListener('click',()=>{
    document.write('...')
    window.location.href = 'Serr/'
  })

  opciones.addEventListener('click',()=>{
    document.write('...')
    window.location.href = 'Opciones/'
  })