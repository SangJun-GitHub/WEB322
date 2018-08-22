/*********************************************************************************
* WEB322 – Practical Test 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Sang Jun Park Student ID: 112293170 Date: 2018-07-08
*
* Online (Heroku) Link: 
* http://localhost:3000/
* http://localhost:3000/sp
* http://localhost:3000/pool
********************************************************************************/
var express = require('express');
var pg = require("pg");
var app = express();
 
var config = {
    user: 'SangJunPark',
    database: 'mysql', 
    password: '112293170',
    host: 'localhost', 
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

app.listen(3000, function () {
    console.log('Server is running.. on Port 3000');
});