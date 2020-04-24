var createError = require('http-errors');
var express = require('express');


var mysql = require('mysql');     //引入mysql模块

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser = require('body-parser');//解析,用req.body获取post参数
var app = express();



  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
  });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})) 

const db = require("../testjk/db")

//查询
app.get('/look',function (req,res) {
  db.selectAll('select * from document',(e,r)=>{
    if(e){
      res.status(200).json({"status":false,"msg":e,"data":[]});
    }
    res.status(200).json({"status":true,"msg":"","data":r});
})
});
//删除
app.delete('/del',function (req,res) {

  var adminuser = req.body.params   
  console.log(adminuser)
    db.deleteData("document",{"name":"12138"},(e,r)=>{
      if(e){
        res.status(200).json({"status":false,"msg":e,"data":[]});
      }
      res.status(200).json({"status":true,"msg":"","data":r});
  })
});
//添加
app.post('/add',function (req,res) {

  var adminuser = req.body

   console.log(adminuser) // 往数据库种添加的数据
    db.insertData("document",adminuser,(e,r)=>{
      console.log(e)
      if(e){
        console.log("false")
         res.send({
          state:false,
          data:{}
        })
      }else{
        console.log("true")
        res.send({
          state:true,
          data:adminuser
        })
      }
      
  })
});


// connection.end();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
