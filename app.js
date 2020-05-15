var createError = require('http-errors');
var express = require('express');


var mysql = require('mysql');     //引入mysql模块

var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser = require('body-parser');//解析,用req.body获取post参数
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var session = require('express-session'); 
var app = express();

app.use(cookieParser())
//配置中间件

app.use(session({
  resave: true, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'admin', //密钥
  name: 'islogin', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {
      maxAge: 1000*60*60*24
  } //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
}));


app.all('*', function (req, res, next) {
  if( req.headers.origin == "http://180.76.151.100:801" || "http://192.168.31.219:8082" ){
        res.header("Access-Control-Allow-Origin", req.headers.origin);
         res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
         res.header('Access-Control-Allow-Headers', 'Content-Type');
    }
   next();	
 });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})) 
const db = require("../testjk/db")





//查询
app.get('/look',function (req,res) {
  // 查询时去除文章内容
   db.selectAll('select id,title,classify,timer,expl,ismy,islabel from document',(e,r)=>{
  // db.selectAll('select * from document',(e,r)=>{
    if(e){
      res.status(200).json({"status":false,"msg":e,"data":[]});
    }
    res.status(200).json({"status":true,"msg":"","data":r});
})
});

//查询具体文章
app.get('/lookdetails',function (req,res) {
  // 获取get请求参数
  var adminuser = req.query
   // console.log(adminuser)
   db.selectAll(`select id,bodytext,title from document  WHERE id=${adminuser.id}`,(e,r)=>{
    if(e){
      res.status(200).json({"status":false,"msg":e,"data":[]});
    }
    res.status(200).json({"status":true,"msg":"","data":r});
})
});

//删除
app.post('/del',function (req,res) {

  var adminuser = req.body
  // console.log(adminuser.id,12345);
    db.deleteData("document",{"id":adminuser.id},(e,r)=>{
      if(e){
        res.status(200).json({"status":false,"msg":e,"data":[]});
      }
      res.status(200).json({"status":true,"msg":"","data":r});
  })
});
//测试git

//添加
app.post('/add',function (req,res) {

  var adminuser = req.body

  // console.log(adminuser) // 往数据库种添加的数据
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

//登录
app.post('/login',function (req,res) {

  var adminuser = req.body
  //console.log(req.session.userinfo)

  //cookies没过期 直接登陆成功
  if(req.session.userinfo){
    res.send({
      state:true,
      data:req.session.userinfo
    })
  }else{
     //cookies过期 登陆
    db.selectAll('select * from adminuser',(e,r)=>{
      // console.log(r)
      // console.log(adminuser)
  
       var loginstatus = r.filter(item=>item.name==adminuser.name)
      //  console.log(loginstatus)
       if(loginstatus.length>0){
         if(loginstatus[0].password==adminuser.password){
          //登陆成功 添加cookies 
          req.session.userinfo=adminuser.name;
            res.send({
              state:true,
              data:"登录成功"
            })
         }else{
          res.send({
            state:false,
            data:"密码错误"
          })
         }
       }else{
          res.send({
            state:false,
            data:"账号错误"
          })
       }
  
  
   })

  }




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
