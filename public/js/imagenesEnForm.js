const inputImagen = document.getElementById("imagen_post");
const imagenPreview = document.getElementById("imagen_preview");

inputImagen.addEventListener("change", function () {
    console.log("imagen")
  const file = inputImagen.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      imagenPreview.style.display = "block";
      imagenPreview.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }else{
    imagenPreview.style.display = "none";
  }
});