async function alCarrito(productoId, cantidad) {
  if (cantidad <= 0){
    alert("Por Favor Añade Un Valor A La Cantidad")
  }
    try {
      const response = await fetch(`producto-al-carro/${productoId}/${cantidad}`, { method: 'PUT' });
  
      if (response.ok) {
        console.log("Producto agregado al carrito correctamente.");
        alert("Producto agregado al carrito correctamente.")
      } else {
        console.error("Error al agregar el producto al carrito.");
        console.log("Error al agregar el producto al carrito.");

        // Puedes manejar el error de otra manera, como mostrar un mensaje al usuario.
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      // Puedes manejar el error de otra manera, como mostrar un mensaje al usuario.
    }
  }

  function comprar(idProducto, nombreProducto, cantidad, precio, idVendedor, stock) {
    if((cantidad <= 0) || (cantidad > stock)){
      alert("Por Favor Dale Una Vista A La Cantidad Tenemos Un Error Ahi");
      return
    }
    // Decodificar el nombre del producto
    const nombreDecodificado = decodeURIComponent(nombreProducto);
  
    // Crear la URL con el nombre decodificado
    const url = `/producto/${idProducto}/comprar/${nombreDecodificado}/${cantidad}/${precio}/${idVendedor}`;
  
    // Redireccionar a la URL
    window.location.href = url;
  }