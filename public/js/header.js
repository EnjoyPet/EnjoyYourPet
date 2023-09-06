let mod = document.querySelectorAll('.header_b')[0];
let Enseñame_button = document.getElementById("Enseñame-Button");
let ToyMalito_Button = document.getElementById("ToyMalito-Button");
let Petfriendly_Button = document.getElementById("Petfriendly-Button");

// const log = document.querySelector('.ingresa');
// const sign = document.querySelector('.register');
// const cuent = document.querySelector('.cuenta');

var lastScrollTop = window.pageYOffset;

// let loggeado = false;

// if(loggeado){
//    log.style.visibility = "hidden";
//    sign.style.visibility = "hidden";
//    cuent.style.visibility = "visible";
// }else{
   
//    log.style.visibility = "visible";
//    sign.style.visibility = "visible";
//    cuent.style.visibility = "hidden";
// }

Enseñame_button.addEventListener('click',()=>{
   document.write('...')
   window.location.href = 'Ensename/'
})
ToyMalito_Button.addEventListener('click',()=>{
   document.write('...')
   window.location.href = '/Toy-Malito'
})

Petfriendly_Button.addEventListener('click',()=>{
   document.write('...')
   window.location.href = '/Petfriendly'
})

window.addEventListener('scroll',()=>{
   
   var st = window.pageYOffset;
   var op = 0
   if (st < lastScrollTop){
      setTimeout(()=>{
         mod.style.opacity = "1";
         mod.style.visibility = "visible";
      },100)
   } else {
      setTimeout(()=>{
         mod.style.opacity = "0";
         mod.style.visibility = "hidden";
      },100)
   }
   lastScrollTop = st;
});