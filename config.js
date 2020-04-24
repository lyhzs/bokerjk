const mysql = require('mysql')

const connectdb=()=>{
  let connection = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'123456',
    database:'lds'
  })
  return connection;
}

module.exports=connectdb;
