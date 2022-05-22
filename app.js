
const express = require('express');
var mysql = require('mysql');
const PORT = process.env.PORT || 3050;
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const { verify } = require('jsonwebtoken');

app.get('/',(req,res) =>{
    res.send('Welcome to my API!')
})
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
app.get('/userName/:user',verifyToken,(req,res)=>{
    const {user} = req.params
    const sql = `SELECT * FROM usuarios WHERE user = "${user}"`;
    connection.query(sql,(error,resul) =>{
        if(error) throw error;
        if (resul.length > 0 ){
            res.json(resul);
        }else{
            res.send('nel')
        }
    });
    
//autorisacion token
function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
    }else{
        res.sendStatus(403);
    }

   
}

})
app.post('/newUser',(req,res)=>{
    const sql = 'INSERT INTO usuarios SET ?';

    const usuario_obj = {
        user : req.body.user,
        password : req.body.password
    };

    connection.query(sql,usuario_obj,error =>{
        if(error) throw error;
     
        console.log('usuario Created!');
        jwt.sign({usuario_obj},'secretKey',(err,token)=>{
            res.json({
                token
            })
        })
    });
    
});



app.listen(3050, function () {
console.log('La Aplicación está funcionando en el puerto 3050');
});