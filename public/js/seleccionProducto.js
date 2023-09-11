document.addEventListener("DOMContentLoaded", () => {
    const ofertas = document.querySelectorAll(".ofertas_div");
  
    window.addEventListener("click", (event) => {
      const clickedElement = event.target; // Elemento en el que se hizo clic
  
      // Verifica si el elemento clicado o alguno de sus padres es un elemento de la clase "ofertas_div"
      const isOfertasDiv = Array.from(ofertas).some(div => div.contains(clickedElement));
  
      if (isOfertasDiv) {
        // Encuentra el elemento "ofertas_div" padre más cercano
        const closestOfertasDiv = clickedElement.closest('.ofertas_div');
        const idProducto = closestOfertasDiv.getAttribute("id");
        console.log("El clic ocurrió en un elemento de la clase 'ofertas_div', con id: ", idProducto);
        // Realiza acciones adicionales si es necesario
        window.location.href = `/producto/${idProducto}`;
      }
    });
  });
  