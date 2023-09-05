const express = require("express");
const app = express();
const path = require("path");
const multer = require('multer');
const sharp = require('sharp');

var conection = require("./mysql.js")

const port = process.env.PORT || 8080;
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const dotenv = require("dotenv");
dotenv.config({path:  './env/.env'});

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
    saveUninitialized:true
}));

app.listen(port, () => {
  console.log("Levantando el Servidor 8080");
});

// rutas
app.get("/", (req, res) => {
  if(req.session.loggedin){
    res.render("index",{
      usuario: req.session.nombre,
      login: true
    })
  }else{
    res.render("index",{
      usuario: "error DE Loggin",
      login: false
      })
    }
  });

app.get('/register', (req, res) => {
  res.render("register")
})
app.post('*/registrar-Usuario',async(req, res)=>{
  const nombre = req.body.nombre
  const correo = req.body.correo
  const numero = req.body.numero
  const contrasenia = req.body.contrasenia
  let contrhaash = await bcryptjs.hash(contrasenia, 8)
  let respuesta = conection.comprobarcorreo(correo,(result)=>{
    if(result==null){
      conection.registrar(nombre,correo,contrhaash,numero)
      req.session.exist=true;
    }else {
      req.session.exist=false;
    }
    if(!req.session.exist){
      res.render("index",{
        login:false,
        alert:true,
        alertTitle: "ERROR",
        alertMessage: "Este correo ya esta registrado",
        alertIcon:  "error",
        showConfirmButton:true,
        timer:false,
        ruta:''})
    }else{
      res.render("index",{
        login:false,
        alert:true,
        alertTitle: "EXITO",
        alertMessage: "Usuario creado correctamente",
        alertIcon:  "success",
        showConfirmButton:false,
        timer:800,
        ruta:''})
    }
    return result
  })
  
})

app.post('*/inciar-sesion',async (req, res)=>{
  const ing_correo = req.body.correo
  const ing_contrasenia = req.body.contrasenia
  let contrhaash = await bcryptjs.hash(ing_contrasenia,8)
  conection.conector.query('SELECT * FROM usuario WHERE correo = ?',[ing_correo],async(error,result)=>{
    if(error)throw error
    else{
      if(result.length == 0 || !(await bcryptjs.compare(ing_contrasenia, result[0].contrasenia))){
        res.render("index",{
          login:false,
          alert:true,
          alertTitle: "ERROR",
          alertMessage: "Correo y/o Contraceña incorrectos",
          alertIcon:  "error",
          showConfirmButton:true,
          timer:false,
          ruta:''})
      }else{
        req.session.loggedin = true
        req.session.nombre = result[0].nombre;
        req.session.id_usuario = result[0].id_usuario;
        req.session.Contrasena = result[0].contrasenia;
        res.render("index",{
          usuario: req.session.nombre,
          login:true,
          alert:true,
          alertTitle: "EXITO",
          alertMessage: "sesion iniciada correctamente",
          alertIcon:  "success",
          showConfirmButton:false,
          timer:800,
          ruta:''})
      }
    }
  })
})

app.get("*/Serr/",(req,res)=>{
  req.session.destroy(()=>{
    res.render("index",{
      login:false,
      alert:true,
      alertTitle: "EXITO",
      alertMessage: "sesion cerrada correctamente",
      alertIcon:  "success",
      showConfirmButton:false,
      timer:800,
      ruta:''})
  })
})

app.get("/Opciones/",(req,res)=>{
  res.render("opciones",{
    login:true,
    usuario: req.session.nombre
  })
})

app.post("/Opciones/ActualizarCuenta",(req,res)=>{
  const nomb = req.body.nombre;
  const tipid = req.body.tipid;
  const id = req.body.id;
  const tel = req.body.tel;
  const gen = req.body.gen;

  conection.actualizarUsuario(nomb,tipid,id,tel,gen,req.session.id_usuario);
  res.render("opciones",{
    login:true,
    usuario: req.session.nombre,
    alert:true,
    alertTitle: "EXITO",
    alertMessage: "datos actualizados correctamente",
    alertIcon:  "success",
    showConfirmButton:false,
    timer:800,
    ruta:''})
})

app.post("/Opciones/actualizarSeguridad",async(req,res)=>{
  
  const corr = req.body.correo;
  const contractual = req.body.contractual;
  const contranueva = req.body.contr;
  const contranueva2 = req.body.contr2;

  let contr = await bcryptjs.hash(contranueva,8)
  if(contranueva != contranueva2){
    res.render("opciones",{
      login:true,
      usuario: req.session.nombre,
      alert:true,
      alertTitle: "ERROR",
      alertMessage: "las contraceñas no coinciden",
      alertIcon:  "error",
      showConfirmButton:true,
      timer:false,
      ruta:''})
  }else{
    if(!(await bcryptjs.compare(contractual, req.session.Contrasena))){
      res.render("opciones",{
        login:true,
        usuario: req.session.nombre,
        alert:true,
        alertTitle: "ERROR",
        alertMessage: "Contraceña actual incorrecta",
        alertIcon:  "error",
        showConfirmButton:true,
        timer:false,
        ruta:''})
    }else{
      conection.actualizarSeguridad(corr,contr,req.session.id_usuario);
      res.render("opciones",{
        login:true,
        usuario: req.session.nombre,
        alert:true,
        alertTitle: "EXITO",
        alertMessage: "datos actualizados correctamente",
        alertIcon:  "success",
        showConfirmButton:false,
        timer:800,
        ruta:''})
    }
  }
})

app.post("/Opciones/eliminarCuenta",async(req,res)=>{
  const co1 = req.body.contra1;
  const co2 = req.body.contra2;
  if(co1 == co2){
    if(!(await bcryptjs.compare(co1, req.session.Contrasena))){
      res.render("opciones",{
        login:true,
        usuario: req.session.nombre,
        alert:true,
        alertTitle: "ERROR",
        alertMessage: "Contraceña incorrecta",
        alertIcon:  "error",
        showConfirmButton:true,
        timer:false,
        ruta:''})
    }else{
      conection.eliminarCuenta(req.session.id_usuario);
      req.session.destroy(()=>{
        res.render("index",{
          login:false,
          alert:true,
          alertTitle: "EXITO",
          alertMessage: "cuenta eliminada correctamente",
          alertIcon:  "success",
          showConfirmButton:false,
          timer:800,
          ruta:''})
      })
    }
  }else{
    res.render("opciones",{
      login:true,
      usuario: req.session.nombre,
      alert:true,
      alertTitle: "ERROR",
      alertMessage: "las contraceñas no coinciden",
      alertIcon:  "error",
      showConfirmButton:true,
      timer:false,
      ruta:''})
  }
})

app.get("*/Ensename/",(req,res)=>{
    conection.conector.query('SELECT * FROM post ORDER BY id_post DESC',async(error,result)=>{
    if (error) throw error;
    else{
      res.render("Ensename",{
        login:(req.session.loggedin),
        id_usuario: req.session.id_usuario,
        usuario: req.session.nombre,
        posts: result
      })
    }
  })
})

app.get("*/Toy-Malito/",(req,res)=>{
  res.render("estoyMalito",{
    login:(req.session.loggedin),
    id_usuario: req.session.id_usuario,
    usuario: req.session.nombre
  })
})

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
