
let mod = document.querySelectorAll('.header_b')[0];
var lastScrollTop = window.pageYOffset;


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