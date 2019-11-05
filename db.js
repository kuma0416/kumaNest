var MongoClient = require('mongodb').MongoClient;

exports.ConnectAndGet = function ConnectAndGet(callback){
  MongoClient.connect("mongodb://localhost:27017", function(err, client){
    var db = client.db('test');
    if (err) throw err;
    db.collection('Items', function(err, collection){
      collection.find().toArray(function(err, items){
        if (err) throw err;
        callback(items);
        client.close();
      });
    });
  });
}
//註冊功能
exports.WriteData = function WriteData(account, password, username, callback){
  MongoClient.connect("mongodb://localhost:27017", function(err, client){
    var db = client.db('test');
    if (err) throw err;
    db.collection('userspace', function(err, collection){
      collection.findOne({account:account})//因為檢查重複，所以如果資料庫裏面有，那麼必定只有一筆
        .then(function(user){//抓取promise成功的資訊
          if(user){//如果有資料，代表這個帳號在資料庫已經被使用過
            callback("exist!");//回傳已存在訊息回index.js
          } else {
            userInsert(account, password, username);//call function
            callback("insert!")//回傳註冊成功資料回index.js
          }
        })
    });
    client.close();//關閉client
  });
}
//插入註冊資料進資料庫
function userInsert (account,password,username){
  MongoClient.connect("mongodb://localhost:27017", function(err, client){
    var db = client.db('test');
    if (err) throw err;
    db.collection('userspace', function(err, collection){
      collection.insert({account:account,password:password,username:username});
    });
  });
}
//登入
exports.loginCheck = function loginCheck(account, password, callback){
  MongoClient.connect("mongodb://localhost:27017", function(err, client){
    var db = client.db('test');
    if (err) throw err;
    db.collection('userspace', function(err, collection){
      collection.findOne({account: account})
        .then(function(check){
          if(check == null){
            callback("fail","");
          } else if(account === check.account && password === check.password){
            callback("success",check.username);
          }
        })
    });
  });
}
//新增商品
exports.addItem = function addItem(itemName, itemPrice, itemPicture){
  
}