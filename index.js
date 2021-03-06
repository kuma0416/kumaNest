//var MongoClient=require('mongodb').MongoClient;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var db = require('./db');
const port = 3000;
var session = require('express-session');
var formidable = require('formidable');

function render(filename, params) {
  var data = fs.readFileSync(filename, 'utf8');
  for (var key in params) {
    data = data.replace('{' + key + '}', params[key]);
  }
return data;
}

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.get('/', function(req, res){
  var username = req.session.username;
  res.render('index',{
    username: username,
    duplicate: true,
    login:""
  });
});

app.get('/login', function(req, res){
  res.render('login',{
    login:""
  });
});

app.get('/reg', function(req, res){
  res.render('reg',{
    duplicate: false
  });
});

app.post('/reg', function(req, res){
  console.log(req.body.account + req.body.password + req.body.username);
  var account = req.body.account;
  var password = req.body.password;
  var username = req.body.username;
  db.WriteData(account, password, username, function(userdata){
    if(userdata == "exist!"){
      res.render('reg',{
        duplicate: true
      })
    } else {
      res.render('index',{
        login: "",
        duplicate: false,
        username: ""
      })
    }
  });
})

app.post('/login', function(req, res){
  var account = req.body.account;
  var password = req.body.password;
  db.loginCheck(account, password, function(login,username){
    if(login == "success"){
      res.render('index',{
        login: "success",
        duplicate: true,
        username: username
      })
    } else {
      res.render('login', {
        login: "fail"
      })
    }
  });
});

app.get('/home/:catogories', function(req, res){
  res.render('item',{
    catogories: req.params.catogories
  });
});

app.get('/addItem', function(req, res){
  res.render('addItem');
});

app.post('/addItem', function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files){
    if(err) throw err;
    console.log("fields: ", fields, "files: ", files);
    res.render('itemTry', {
      files: files
    });
  });
  //res.redirect('/');
});

app.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
});
app.listen(port);
 /*
MongoClient.connect("mongodb://localhost:27017",function(err,client){
  var db = client.db('test');
   if(err) throw err;
   //Write databse Insert/Update/Query code here..
 
   db.collection('Persons',function(err,collection){
    collection.insert({ id:1, firstName:'Steve', lastName:'Jobs' });
    collection.insert({ id:2, firstName:'Bill', lastName:'Gates' });
    collection.insert({ id:3, firstName:'James', lastName:'Bond' });
 
    collection.count(function(err,count){
        if(err) throw err;
        console.log('Total Rows:'+count);
    });
  });
  client.close(); //關閉連線
});

db.ConnectAndGet(function(items){
  console.log(items);
});

var username = 'parker';
db.WriteData(9754814, 31524, username, function(userdata){
  console.log(userdata);
});
*/