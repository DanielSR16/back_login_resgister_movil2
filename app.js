const express = require('express');
var mysql = require('mysql');
const PORT = process.env.PORT || 3050;
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');


//mysql
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'node',
    password : 'danielsr16',
    database : 'petclinc'
  });
   
connection.connect(error =>{
    if(error) throw error;
    console.log('Database server running!')
});
app.post('/login',(req,res)=>{
    console.log('hola')
    const login_JSON = {
        correo : req.body.correo,
        contrasenia : req.body.contrasenia
    };

    const sql = `SELECT * FROM usuarios WHERE correo = '${login_JSON.correo}' and contrasenia = '${login_JSON.contrasenia}'`;

    connection.query(sql,(error,resul) =>{
        if(error) throw error;

            if (resul.length > 0 ){
                
                const payload = {
                    check:true
                };
                const token = jwt.sign(payload,'clavesecreta123',{
                    expiresIn:'7d'
                });
                let lista = []
                let  resultado_token ={}
                resultado_token.id =  resul[0].id
                resultado_token.nombre =  resul[0].nombre
                resultado_token.correo =  resul[0].correo
                resultado_token.contrasenia =  resul[0].contrasenia
                resultado_token.token =  token    
                console.log(resultado_token)
                lista.push(resultado_token)
                res.json(lista)
             
                res.status(200)
                // res.json(resul);
            }else{
                res.json(['incorrecto'])
            }
    });
    
})

app.post('/newUser',(req,res)=>{

    const usuario_obj = {
        nombre : req.body.nombre,
        correo : req.body.correo,
        contrasenia : req.body.contrasenia

    };
    connection.query('SELECT * FROM usuarios WHERE correo = ?',[usuario_obj.correo],(err,userdata)=>{
        if(userdata.length > 0){

            res.send('Usuario Existente')
        }else{
            
            connection.query('INSERT INTO usuarios SET ?',usuario_obj,error =>{
                if(error) throw error;
             
                    console.log('usuario Created!');
                
                    res.send('true');
            });
        }
    });

});

const verificacion = express.Router()

verificacion.use((req,res,next)=>{
    let token = req.headers['x-access-token'] || req.headers['authorization']
    // console.log(token)
    if(!token){
        res.status(401).send(
            {
                error: 'es necesario un token'
            }
        )
        return
    }
    if(token.startsWith('Bearer  ')){
        token = token.slice(7,token.length);
        console.log(token)
    }
    if(token){
        jwt.verify(token,app.get('key'),(error,decode)=>{
            if(error){
                return res.json({
                    message: 'el token'
                })
            }
        })
    }
          
});

app.get('/info',verificacion,(req,res)=>{
    res.json('Informacion importante entregada')
})

app.listen(3050, function () {
console.log('La Aplicación está funcionando en el puerto 3050');

});