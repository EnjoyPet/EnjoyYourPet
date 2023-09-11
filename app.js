const express = require("express");
const app = express();
const path = require("path");
const multer = require('multer');
const sharp = require('sharp');
const validator = require('validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const conection = require("./mysql.js");
const ejs = require('ejs');
const fs = require('fs');

const port = process.env.PORT;
const verificationCodes = new Map();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const dotenv = require("dotenv");
dotenv.config({ path: './env/.env' });

app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs")

const bcryptjs = require("bcryptjs");

const session = require("express-session");
const { error } = require("console");

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.listen(port, () => {
  console.log("Levantando el Servidor 8080");
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAILER_MAIL,
    pass: process.env.MAILER_PASS
  }
});

const template = fs.readFileSync('views/mailDeCompra.ejs', 'utf-8');
const template2 = fs.readFileSync('views/mailDeComprado.ejs', 'utf-8');

// rutas
app.get("/", (req, res) => {
  conection.conector.query('SELECT id_producto,id_usuario,id_categoria,nombre,imagen_producto,stock,precio FROM producto WHERE stock > 0 ORDER BY id_categoria LIMIT 8',(error,result) =>{
    if(error)throw error
    else{
      if (req.session.loggedin) {
        res.render("index", {
          usuario: req.session.nombre,
          rol: req.session.rol,
          productos: result,
          login: true
        })
      } else {
        res.render("index", {
          usuario: "error DE Loggin",
          rol: 0,
          productos: result,
          login: false
        })
      }
    }
  })
});

app.get('/register', (req, res) => {
  res.render("register")
})

app.post('*/registrar-Usuario', async (req, res) => {
  const nombre = req.body.nombre;
  const correo = req.body.correo;
  const numero = req.body.numero;
  const contrasenia = req.body.contrasenia;
  if (!validator.isEmail(correo)) {
    res.render("index", {
      login: false,
      alert: true,
      alertTitle: "ERROR",
      alertMessage: "Este correo es inválido",
      alertIcon: "error",
      showConfirmButton: true,
      timer: false,
      ruta: '',
      rol: 0
    })
  }
  let contrhaash = await bcryptjs.hash(contrasenia, 8)
  let respuesta = conection.comprobarcorreo(correo, (result) => {
    if (result == null) {
      // Generar un código de verificación único
      const verificationCode = crypto.randomBytes(2).toString('hex'); // 4 dígitos, por ejemplo

      // Almacenar el código de verificación junto con el correo electrónico
      verificationCodes.set(correo, {
        Codigo: verificationCode,
        Nombre: nombre,
        Contrasenia: contrhaash,
        Numero: numero,
      });

      // Enviar un correo electrónico con el código de verificación
      const mailOptions = {
        from: process.env.MAILER_MAIL,
        to: correo,
        subject: 'Código de verificación',
        text: `Tu código de verificación es: ${verificationCode}.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Correo de verificación enviado: ' + info.response);
        }
      });
    }
    else {
      res.render("index", {
        login: false,
        alert: true,
        alertTitle: "ERROR",
        alertMessage: "Este correo ya está registrado",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: '',
        rol: 0
      })
    }
    return result
  })
})

app.post('/verificar-mail', async (req, res) => {
  const correo = req.body.correo;
  const codigo = req.body.codigo;

  // Verificar si el correo y el código coinciden
  const DatosdeUsuario = verificationCodes.get(correo);

  if (!DatosdeUsuario || DatosdeUsuario.Codigo !== codigo) {
    res.render("index", {
      login: false,
      alert: true,
      alertTitle: "ERROR",
      alertMessage: "Este código es incorrecto",
      alertIcon: "error",
      showConfirmButton: true,
      timer: false,
      ruta: '',
      rol: 0
    })
  }

  conection.registrar(DatosdeUsuario.Nombre, correo, DatosdeUsuario.Contrasenia, DatosdeUsuario.Numero);

  // Eliminar el código de verificación, ya que se ha utilizado
  verificationCodes.delete(correo);

  res.render("index", {
    login: false,
    alert: true,
    alertTitle: "EXITO",
    alertMessage: "Usuario creado correctamente",
    alertIcon: "success",
    showConfirmButton: false,
    timer: 800,
    ruta: '',
    rol: 0
  })
});

app.post('*/inciar-sesion', async (req, res) => {
  const ing_correo = req.body.correo;
  const ing_contrasenia = req.body.contrasenia;
  let contrhaash = await bcryptjs.hash(ing_contrasenia, 8)
  conection.conector.query('SELECT * FROM usuario WHERE correo = ?', [ing_correo], async (error, result) => {
    if (error) throw error
    else {
      if (result.length == 0 || !(await bcryptjs.compare(ing_contrasenia, result[0].contrasenia))) {
        req.session.loggedin = false
        req.session.nombre = null;
        req.session.id_usuario = null;
        req.session.Contrasena = null;
        req.session.rol = null;
        req.session.correo = null;
        req.session.celular = null;
        res.redirect("/")
      } else {
        req.session.loggedin = true
        req.session.nombre = result[0].nombre;
        req.session.id_usuario = result[0].id_usuario;
        req.session.Contrasena = result[0].contrasenia;
        req.session.rol = result[0].rol;
        req.session.correo = result[0].correo;
        req.session.celular = result[0].celular;
        console.log("Rol: ", result[0].rol, " - ", req.session.rol)
        res.redirect("/")
      }
    }
  })
})

app.get("*/Serr/", (req, res) => {
  req.session.destroy(() => {
    res.render("index", {
      login: false,
      alert: true,
      alertTitle: "EXITO",
      alertMessage: "Sesión cerrada correctamente",
      alertIcon: "success",
      showConfirmButton: false,
      timer: 800,
      ruta: '',
      rol: 0
    })
  })
})

app.get("/Opciones/", (req, res) => {
  res.render("opciones", {
    login: true,
    rol: req.session.rol,
    usuario: req.session.nombre
  })
})

app.post("/Opciones/ActualizarCuenta", (req, res) => {
  const nomb = req.body.nombre;
  const tipid = req.body.tipid;
  const id = req.body.id;
  const tel = req.body.tel;
  const gen = req.body.gen;

  conection.actualizarUsuario(nomb, tipid, id, tel, gen, req.session.id_usuario);
  res.render("opciones", {
    login: true,
    usuario: req.session.nombre,
    alert: true,
    alertTitle: "EXITO",
    alertMessage: "Datos actualizados correctamente",
    alertIcon: "success",
    showConfirmButton: false,
    timer: 800,
    ruta: ''
  })
})

app.post("/Opciones/actualizarSeguridad", async (req, res) => {

  const corr = req.body.correo;
  const contractual = req.body.contractual;
  const contranueva = req.body.contr;
  const contranueva2 = req.body.contr2;

  let contr = await bcryptjs.hash(contranueva, 8)
  if (contranueva != contranueva2) {
    res.render("opciones", {
      login: true,
      usuario: req.session.nombre,
      alert: true,
      alertTitle: "ERROR",
      alertMessage: "Las contraseñas no coinciden",
      alertIcon: "error",
      showConfirmButton: true,
      timer: false,
      ruta: ''
    })
  } else {
    if (!(await bcryptjs.compare(contractual, req.session.Contrasena))) {
      res.render("opciones", {
        login: true,
        usuario: req.session.nombre,
        alert: true,
        alertTitle: "ERROR",
        alertMessage: "Contraseña actual incorrecta",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: ''
      })
    } else {
      conection.actualizarSeguridad(corr, contr, req.session.id_usuario);
      res.render("opciones", {
        login: true,
        usuario: req.session.nombre,
        alert: true,
        alertTitle: "EXITO",
        alertMessage: "Datos actualizados correctamente",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 800,
        ruta: ''
      })
    }
  }
})

app.post("/Opciones/eliminarCuenta", async (req, res) => {
  const co1 = req.body.contra1;
  const co2 = req.body.contra2;
  if (co1 == co2) {
    if (!(await bcryptjs.compare(co1, req.session.Contrasena))) {
      res.render("opciones", {
        login: true,
        usuario: req.session.nombre,
        alert: true,
        alertTitle: "ERROR",
        alertMessage: "Contraseña incorrecta",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: ''
      })
    } else {
      conection.eliminarCuenta(req.session.id_usuario);
      req.session.destroy(() => {
        res.render("index", {
          login: false,
          alert: true,
          alertTitle: "EXITO",
          alertMessage: "Cuenta eliminada correctamente",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 800,
          ruta: '',
          rol: 0
        })
      })
    }
  } else {
    res.render("opciones", {
      login: true,
      rol: req.session.rol,
      usuario: req.session.nombre,
      alert: true,
      alertTitle: "ERROR",
      alertMessage: "Las contraseñas no coinciden",
      alertIcon: "error",
      showConfirmButton: true,
      timer: false,
      ruta: ''
    })
  }
})

app.get("*/Ensename/", (req, res) => {
  conection.conector.query('SELECT * FROM post ORDER BY id_post DESC', async (error, result) => {
    if (error) throw error;
    else {
      res.render("Ensename", {
        login: (req.session.loggedin),
        id_usuario: req.session.id_usuario,
        usuario: req.session.nombre,
        rol: req.session.rol,
        posts: result
      })
    }
  })
})

app.get("*/Toy-Malito/", (req, res) => {
  res.render("estoyMalito", {
    login: (req.session.loggedin),
    id_usuario: req.session.id_usuario,
    rol: req.session.rol,
    usuario: req.session.nombre,
    H1: "¡ Pronto te conectaremos a la veterinaria !",
    H3: "En días venideros la redirección a la veterinaria virtual estará completa"
  })
})

app.get("*/Petfriendly/", (req, res) => {
  res.render("petfriendly", {
    login: (req.session.loggedin),
    id_usuario: req.session.id_usuario,
    rol: req.session.rol,
    usuario: req.session.nombre
  })
})

app.get("/ventas/", (req, res) => {
  conection.conector.query('SELECT id_producto,id_usuario,id_categoria,nombre,imagen_producto,stock,precio FROM producto ORDER BY id_categoria', async (error, result) => {
    if (error) throw error;
    else {
      res.render("ventas", {
        login: (req.session.loggedin),
        id_usuario: req.session.id_usuario,
        usuario: req.session.nombre,
        rol: req.session.rol,
        productos: result
      })
    }
  })
})

app.get("*/juguetes/", (req, res) => {
  conection.conector.query('SELECT id_producto,id_usuario,id_categoria,nombre,imagen_producto,stock,precio FROM producto WHERE id_categoria = 8', async (error, result) => {
    if (error) throw error;
    else {
      res.render("ventas", {
        login: (req.session.loggedin),
        id_usuario: req.session.id_usuario,
        usuario: req.session.nombre,
        rol: req.session.rol,
        productos: result
      })
    }
  })
})

app.get("*/comida/", (req, res) => {
  conection.conector.query('SELECT id_producto,id_usuario,id_categoria,nombre,imagen_producto,stock,precio FROM producto WHERE id_categoria = 7', async (error, result) => {
    if (error) throw error;
    else {
      res.render("ventas", {
        login: (req.session.loggedin),
        id_usuario: req.session.id_usuario,
        usuario: req.session.nombre,
        rol: req.session.rol,
        productos: result
      })
    }
  })
})

app.get("*/accesorios/", (req, res) => {
  conection.conector.query('SELECT id_producto,id_usuario,id_categoria,nombre,imagen_producto,stock,precio FROM producto WHERE id_categoria = 9', async (error, result) => {
    if (error) throw error;
    else {
      res.render("ventas", {
        login: (req.session.loggedin),
        id_usuario: req.session.id_usuario,
        usuario: req.session.nombre,
        rol: req.session.rol,
        productos: result
      })
    }
  })
})

app.get("/vender/", (req, res) => {
  if (req.session.rol === 1) {
    res.render("vender", {
      login: (req.session.loggedin),
      id_usuario: req.session.id_usuario,
      usuario: req.session.nombre,
      rol: req.session.rol,
    })
  }else{
    res.redirect('/');
  }
})

app.get('/producto/:id', (req, res) => {
  const idProducto = req.params.id;
  const query = 'SELECT producto.*, categoria.nombre AS categoria FROM producto JOIN categoria ON producto.id_categoria = categoria.id_categoria WHERE producto.id_producto = ?';
  conection.conector.query(query, [idProducto], (error, result) => {
    if (error) {
      throw error;
    } else if (result.length > 0) {
      const producto = result[0]; // Accede al primer resultado del arreglo
      res.render('producto',{
        login: (req.session.loggedin),
        id_usuario: req.session.id_usuario,
        usuario: req.session.nombre,
        rol: req.session.rol,
        producto:producto
      })
    } else {
      res.send('Producto no encontrado'); // En caso de que no se encuentre ningún producto con el ID dado
    }
  });
});

app.post('/Ensename/HacerUnPost', upload.single('imagen_post'), (req, res) => {
  const titulo = req.body.titulo;
  const contenido = req.body.contenido_post;
  const post_creado = req.session.id_usuario;
  const Categoria = req.body.Categoria_post;

  // Verifica si se ha cargado una imagen
  if (req.file) {
    // Redimensiona la imagen a un ancho máximo de 300 píxeles sin recortar y manteniendo la relación de aspecto
    sharp(req.file.buffer)
      .resize({ width: 300, fit: sharp.fit.contain })
      .toBuffer()
      .then((imagenRedimensionada) => {
        // Ahora, la variable "imagenRedimensionada" contiene la imagen redimensionada
        // Guarda la imagen redimensionada en la base de datos
        const query =
          'INSERT INTO post (titulo_post, contenido_post, imagen_post, post_creado_por, categoria_post) VALUES (?,?,?,?,?)';

        conection.conector.query(query, [titulo, contenido, imagenRedimensionada, post_creado, Categoria], (error, result, fields) => {
          if (error) {
            console.error('Error al guardar la imagen:', error);
            res.redirect("/Ensename/");
          } else {
            console.log('Imagen redimensionada y guardada en la base de datos.');
            res.redirect("/Ensename/");
          }
        });
      })
      .catch((error) => {
        console.error('Error al redimensionar la imagen:', error);
        res.redirect("/Ensename/");
      });
  } else {
    // Si no se cargó una imagen, inserta el resto de la información en la base de datos sin imagen
    const queryWithoutImage =
      'INSERT INTO post (titulo_post, contenido_post, post_creado_por, categoria_post) VALUES (?,?,?,?)';

    conection.conector.query(queryWithoutImage, [titulo, contenido, post_creado, Categoria], (error, result, fields) => {
      if (error) {
        console.error('Error al insertar la información sin imagen:', error);
        res.redirect("/Ensename/");
      } else {
        console.log('Información insertada en la base de datos sin imagen.');
        res.redirect("/Ensename/");
      }
    });
  }
});

// Ruta para aumentar los "Me Gusta" en la base de datos
app.put('/punt/meGusta/:id', (req, res) => {
  const postId = req.params.id;

  const sqlQuery = `UPDATE post SET meGusta_post = meGusta_post + 1 WHERE id_post = ?`;
  conection.conector.query(sqlQuery, [postId], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'No se pudo actualizar la base de datos.' });
    } else {
      res.status(200).json({ message: 'Me Gusta actualizado en la base de datos.' });
    }
  });
});

// Ruta para aumentar los "No Me Gusta" en la base de datos
app.put('/punt/noMeGusta/:id', (req, res) => {
  const postId = req.params.id;

  const sqlQuery = `UPDATE post SET noMeGusta_post = noMeGusta_post + 1 WHERE id_post = ?`;
  conection.conector.query(sqlQuery, [postId], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'No se pudo actualizar la base de datos.' });
    } else {
      res.status(200).json({ message: 'No Me Gusta actualizado en la base de datos.' });
    }
  });
});

app.post('/PublicarUnaVenta', upload.single('imagen_post'), (req, res) => {
  const id_usuario = req.session.id_usuario;
  const nombre_producto = req.body.nombre;
  const categoria_producto = req.body.Categoria;
  const descripcion_producto = req.body.descripcion;
  const stock_producto = req.body.stock;
  const precio_producto = req.body.precio;

  // Verifica si se ha cargado una imagen
  if (req.file) {
    // Redimensiona la imagen a un ancho máximo de 300 píxeles sin recortar y manteniendo la relación de aspecto
    sharp(req.file.buffer)
      .resize({ height: 200, fit: sharp.fit.contain })
      .toBuffer()
      .then((imagenRedimensionada) => {
        // Ahora, la variable "imagenRedimensionada" contiene la imagen redimensionada
        // Guarda la imagen redimensionada en la base de datos
        const query =
          'INSERT INTO producto (id_usuario, nombre, id_categoria, imagen_producto , stock, precio,	descripcion) VALUES (?,?,?,?,?,?,?)';

        conection.conector.query(query, [id_usuario, nombre_producto, categoria_producto, imagenRedimensionada, stock_producto, precio_producto,descripcion_producto], (error, result, fields) => {
          if (error) {
            console.error('Error al guardar la imagen:', error);
            res.render("vender", {
              login: true,
              rol: req.session.rol,
              usuario: req.session.nombre,
              alert: true,
              alertTitle: "ERROR",
              alertMessage: "Error al guardar la imagen",
              alertIcon: "error",
              showConfirmButton: true,
              timer: false,
            })
          } else {
            console.log('Imagen redimensionada y guardada en la base de datos.');
            res.render("vender", {
              login: true,
              rol: req.session.rol,
              usuario: req.session.nombre,
              alert: true,
              alertTitle: "GENIAL",
              alertMessage: "Imagen redimencionada y guardada",
              alertIcon: "success",
              showConfirmButton: true,
              timer: false,
            })
          }
        });
      })
      .catch((error) => {
        console.error('Error al redimensionar la imagen:', error);
        res.render("vender", {
          login: true,
          rol: req.session.rol,
          usuario: req.session.nombre,
          alert: true,
          alertTitle: "ERROR",
          alertMessage: "Error al redimencionar la imagen",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
        })
      });
  } else {
    res.render("vender", {
      login: true,
      rol: req.session.rol,
      usuario: req.session.nombre,
      alert: true,
      alertTitle: "ERROR",
      alertMessage: "No se cargo una imagen",
      alertIcon: "error",
      showConfirmButton: true,
      timer: false,
    })
  }
});

app.put('*/producto-al-carro/:id/:cantidad',(req,res)=>{
  const productoId = req.params.id;
  const cantidad = req.params.cantidad;
  const compradoPor = req.session.id_usuario;

  const query = `INSERT INTO carrito (cantidad,comprado_por, producto) VALUES (?,?,?)`;
  conection.conector.query(query,[cantidad, compradoPor, productoId], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'No se pudo actualizar la base de datos.' });
    } else {
      res.status(200).json({ message: 'No Me Gusta actualizado en la base de datos.' });
    }
  });
})

app.get('/producto/:id/comprar/:nombre/:cantidad/:precio/:idUsuario', async (req, res) => {
  try {
    const idvendedor = req.params.idUsuario;
    const producto = req.params.nombre;
    const cantidad = req.params.cantidad;
    const precio = req.params.precio;
    const total = cantidad * precio;

    // Consulta SQL para obtener el nombre y el correo del vendedor
    const query = "SELECT usuario.nombre, usuario.correo, usuario.celular FROM usuario WHERE usuario.id_usuario = ?";

    // Realiza la consulta SQL de forma asíncrona utilizando async/await
    const result = await new Promise((resolve, reject) => {
      conection.conector.query(query, [idvendedor], (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    if (result.length > 0) {
      const usuario = result[0].nombre;
      const correoVendedor = result[0].correo;
      const numeroVendedor = result[0].celular;

      // Configura nodemailer y template aquí (asegúrate de que estén definidos)

      const html = ejs.render(template, { 
        usuario: usuario,
        producto: producto,
        cantidad: cantidad,
        precio: precio,
        total: total,
        numero: req.session.celular
      });

      const html2 = ejs.render(template2, { 
        usuario: req.session.nombre,
        producto: producto,
        cantidad: cantidad,
        precio: precio,
        total: total,
        numero: numeroVendedor
      });
      
      const mailVentaOptions = {
        from: process.env.MAILER_MAIL,
        to: correoVendedor,
        subject: 'Tienes Una Venta',
        html: html
      };

      const mailCompraOptions = {
        from: process.env.MAILER_MAIL,
        to: req.session.correo,
        subject: 'Hiciste Una Compra',
        html: html2
      };

      // Envía el correo electrónico de forma asíncrona utilizando async/await
      const info = await transporter.sendMail(mailVentaOptions);

      const info2 = await transporter.sendMail(mailCompraOptions);


      console.log('Correo electrónico enviado con éxito:', info.response);
      res.status(200).redirect("/");
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Error interno del servidor');
  }
});
