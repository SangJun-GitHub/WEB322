/********************************************************************************* 
 *  WEB322: Assignment 1 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.   
 *  No part of this assignment has been copied manually or electronically from any other source 
 *  (including web sites) or distributed to other students. 
 *  
 *  Name: Sang Jun Park Student ID: 112293170 Date: 2018-05-18 
 * 
 *  Online (Heroku) URL: https://salty-brook-80616.herokuapp.com/ 
 * ********************************************************************************/ 
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.send("Sang Jun Park - 112293170");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);