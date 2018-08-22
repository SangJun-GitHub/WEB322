/*********************************************************************************
* WEB322 – Practical Test 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Sang Jun Park Student ID: 112293170 Date: 2018-07-08
*
* Online (Heroku) Link:  
* https://protected-coast-14057.herokuapp.com/
* https://protected-coast-14057.herokuapp.com/sp 
* https://protected-coast-14057.herokuapp.com/pool  
********************************************************************************/
var express = require('express');
var pg = require("pg");
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

var func = function() {
    console.log("regular fun");
}


var config = {
    user: 'ckfudvwwoqizip',
    database: 'd4u5u77onjn1rk', 
    password: 'ddbb57d51ea605c33c22cdd910939b2470abd27c110f7f4d73cd5e1790a52c62',
    host: 'ec2-54-227-240-7.compute-1.amazonaws.com', 
    port: 5432, 
    max: 10, // max number of connection can be open to database
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };
  
  var pool = new pg.Pool(config);

app.get('/', function (req, res) {
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       const query = client.query('SELECT * FROM Employee where empid = $1', [1],function(err,result)    {            
           done();
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

app.get('/sp', function (req, res, next) {
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       const query = client.query('SELECT * from GetAllEmployee()' ,function(err,result) {
         
        done();
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

app.get('/pool', function (req, res) {
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       const query = client.query('SELECT * from GetAllEmployee()' ,function(err,result) {
          done(); 
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});


app.listen(HTTP_PORT, function()
{
    console.log("Express http server listening on: " + HTTP_PORT)
});
