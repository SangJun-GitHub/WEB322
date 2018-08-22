/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Sang Jun Park Student ID: 112293170 Date: 2018-06-15
*
* Online (Heroku) Link: https://polar-sierra-98334.herokuapp.com/
*
********************************************************************************/
var express = require("express");
var path = require("path");
var data = require("./data-service.js");
var multer = require("multer");
var fs = require("fs");
var bodyParser = require('body-parser');
var app = express();
var HTTP_PORT = process.env.PORT || 8080;
var upload = multer({ storage: storage });

var storage = multer.diskStorage(
{
    destination: "./public/images/uploaded", filename: function (req, file, cb) 
    {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

///// GET ///// GET ///// GET ///// GET ///// GET ///// GET///// GET ///// GET ///// GET ///// GET /////
app.get("/", (req,res) => 
{
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req,res) => 
{
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees", (req, res) => 
{
    if (req.query.status) 
    {
        data.getEmployeesByStatus(req.query.status)
        .then((data) => {res.json(data);})
        .catch((err) => {res.json({ message: "no results" });});
    } else if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department)
        .then((data) => {res.json(data);})
        .catch((err) => {res.json({ message: "no results" });});
    } else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager)
        .then((data) => {res.json(data);})
        .catch((err) => {res.json({ message: "no results" });});
    } else {
        data.getAllEmployees()
        .then((data) => {res.json(data);})
        .catch((err) => {res.json({ message: "no results" });});
    }
});

app.get("/managers", (req,res) => 
{
    data.getManagers()
    .then((data)=>{res.json(data);});
});

app.get("/departments", (req,res) => 
{
    data.getDepartments()
    .then((data)=>{res.json(data);});
});

app.get("/images/add", (req,res) => 
{
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
});

app.get("/images", (req,res) => 
{
    fs.readdir("./public/images/uploaded", function(err, items) 
    {
        res.json({images:items});
    });
});

app.get("/employees/add", (req,res) => 
{
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
});

app.get("/employee/:empNum", (req, res) => 
{
    data.getEmployeeByNum(req.params.empNum)
    .then((data) => {res.json(data);})
    .catch((err) => { res.json({message:"no results"});});
});

///// POST ///// POST ///// POST ///// POST ///// POST ///// POST ///// POST ///// POST ///// POST ///// POST /////
app.post("/images/add", upload.single("imageFile"), (req,res) =>
{
    res.redirect("/images");
});

app.post("/employees/add", (req, res) => 
{
    data.addEmployee(req.body)
    .then(()=>{ res.redirect("/employees");});
});

///// USE ///// USE ///// USE ///// USE ///// USE ///// USE///// USE ///// USE ///// USE ///// USE /////
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });

data.initialize().then(function(){
    app.listen(HTTP_PORT, function()
    {
        console.log("Express http server listening on: " + HTTP_PORT)
    });})
    .catch(function(err)
    {
        console.log("unable to read file" + err);
    });