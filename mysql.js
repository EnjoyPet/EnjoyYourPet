const session = require("express-session");
const mysql = require("mysql")

let resultado

const conector = mysql.createConnection({
    host: 'sql10.freesqldatabase.com',
    user: 'sql10644438',
    password: '1gfl2LZZjm',
    database: 'sql10644438'
});


const conectar = () => {
    conector.connect(err => {
        if(err) throw err
        console.log('conexion Exitosa')
    })
}

const comprobarcorreo = (correo,callback)=>{

    const sql=`SELECT usuario.correo, usuario.contrasenia FROM usuario WHERE usuario.correo = "${correo}"`
    
    conector.query(sql,(err,result,field)=>{
        if(err){ 
            throw err
        }
        return callback(result[0])
    })
}

const registrar = (nombre,correo,contrasenia,celular) =>{
        sql=`INSERT INTO usuario (id_usuario, nombre, correo, contrasenia, celular,rol) VALUES (${null},"${nombre}","${correo}","${contrasenia}","${celular}",2)`
        conector.query(sql, (err, result, field)=>{
        if(err) throw err
        console.log(result)
    })
}

const ingresar = (correo,contrasenia,callback) => {

    const sql = `SELECT usuario.correo, usuario.contrasenia FROM usuario WHERE usuario.correo = "${correo}"`
    
    conector.query(sql,(err,result,field)=>{
        if(err){
            throw err
        }
        return callback(result[0]);
    })
}

const actualizarUsuario = (nombre, tipoid, id, tel, genero,id_usu)=>{
    const sql = `UPDATE usuario SET nombre = "${nombre}", tipo_identificacion = ${tipoid}, identificacion = "${id}", celular = "${tel}", genero = "${genero}", rol = 2 WHERE id_usuario = ${id_usu}`

    conector.query(sql,(err,result,field)=>{
        if (err){
            throw err;
        }
    })
}

const actualizarSeguridad = (correo, contrasenia,id_usu)=>{
    const sql = `UPDATE usuario SET correo = "${correo}", contrasenia = "${contrasenia}" WHERE id_usuario = ${id_usu}`

    conector.query(sql,(err,result,field)=>{
        if (err){
            throw err;
        }
    })
}
const eliminarCuenta = (id_usu)=>{
    const sql = `DELETE FROM usuario WHERE id_usuario = ${id_usu}`

    conector.query(sql,(err,result,field)=>{
        if (err){
            throw err;
        }
    })
}
module.exports = {registrar,ingresar,comprobarcorreo,actualizarUsuario,actualizarSeguridad,eliminarCuenta,conector}