const postForm = document.getElementById('postForm');
  
    postForm.addEventListener('submit', function(event) {
      const titulo_post = postForm.querySelector('[name="titulo_post"]');
      const contenido_post = postForm.querySelector('[name="contenido_post"]');
      const categoria_post = postForm.querySelector('[name="categoria_post"]');
  
      if (!titulo_post.value || !contenido_post.value || !categoria_post.value) {
        alert('Valla ¡Algo salio mal! \n ¿Te falto llenar algun campo?');
        event.preventDefault(); // Evitar que el formulario se envíe
      }
    });
    

    