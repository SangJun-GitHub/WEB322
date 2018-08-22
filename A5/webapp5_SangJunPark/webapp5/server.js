/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
*
* Name: Sang Jun Park Student ID: 112293170 Date: 2018-07-20
*
* Online (Heroku) Link: https://shielded-inlet-91965.herokuapp.com/
*
********************************************************************************/ 
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path"); 
var multer = require("multer"); 
var fs =require("fs");
var static = require("serve-static");
const exphbs = require("express-handlebars"); 

var app = express();
app.use('/', static('public'));
var dataService = require("./data-service.js"); 


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


function onHttpStart() {
    console.log("Express http server listening on %s",HTTP_PORT); 
    
    return new Promise ((res,req)=>{
        dataService.initialize()
        .then(function(data){
            console.log(data);
         })
         .catch(function(err){
            console.log(err);
         });
    });
};

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename:  (req, file, cb)=> {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  

const upload = multer({ storage: storage });


app.engine('.hbs',exphbs({extname:".hbs",
           defaultLayout: 'main',
           helpers :{
                     equal: (lvalue, rvalue, options) => {
                        if (arguments.length < 3)
                           throw new Error("Handlebars Helper equal needs 2 parameters");
                        if (lvalue != rvalue) {
                           return options.inverse(this);
                           } else {
                               return options.fn(this);
                               }
                        },
                    navLink: (url, options)=>{
                            return '<li' +((url == app.locals.activeRoute) ? ' class="active" ' : '') +'><a href="' + url + '">' + options.fn(this) + '</a></li>';}
                    } 
       
})); 


app.set("view engine",".hbs"); 

app.use((req,res,next)=>{
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about",(req,res)=>{
    res.render("about");
}); 

app.get("/images/add",(req,res)=>{
    res.render("addImage"); 
}); 

app.post("/images/add",upload.single("imageFile"),(req,res)=>{
    res.redirect('/images'); 
});


app.get ("/images",(req,res)=>{
    fs.readdir('./public/images/uploaded',(err,files)=>
    {
    if(err){
        console.log(err);
        res.status(500).send("sever error"); 
    }
    res.render("images",{"images": files});
    }); 

}); 


app.get("/employees", (req, res)=> {
    if(req.query.status)
    {
        dataService.getEmployeesByStatus(req.query.status)
       .then((data)=>
       {
        res.render("employees",{employees: data, title : "Employees"});
       })
       .catch((err)=>{
            res.render("employees", {message: "no results"});
       });
    
    }else if(req.query.department)
    {
        dataService.getEmployeesByDepartment(req.query.department)
        .then((data)=>
        {   if(data.length >0 )
          
            {res.render("employees",{employees: data, title: "Employees"});}
            else 
            {
              res.render("employees", {message: "no results"});
            }
        })
        .catch((err)=>{
          
            res.render("employees",{message: "no results"});
        });

    }else if(req.query.manager)
    {
        dataService.getEmployeesByManager(req.query.manager)
        .then((data)=>
        {   
            res.render("employees",{employees: data, title: "Employees"});
        })
        .catch((err)=>{
            
            res.render({message: "no results"});
        });

    }else
    {
        dataService.getAllEmployees()
        .then((data)=>
        {   if (data.length>0)
            {
               res.render("employees", {employees : data, title: "Employees"});
            }
            else 
            {
              res.render("employees", {message: "no results"});
            }

        })
        .catch((err)=>
        {   
            res.render("employees",{message: "no results"});
        });
    }
});

app.get("/employee/:num", (req, res) => {

    let viewData = {}; 
    dataService.getEmployeeByNum(req.params.num)
    .then((data)=>{
        viewData.data = data;
    })
    .catch((err)=>{
        viewData.data = null;
    })
    .then(dataService.getDepartments)
    .then((data)=>{
        viewData.departments = data;
          for(let i = 0; i < viewData.departments.length ; i++){
              if(viewData.departments[i].departmentId == viewData.data.department){
                  viewData.departments[i].selected = true;
              }
          }
    }).catch(()=>{
        viewData.departments=[]; 
    }).then (()=>{
        if(viewData.data == null){
            res.status(404).send("Employee Not Found");
        }
        else{
            res.render("employee", {
                viewData: viewData
            });
        }
    }); 
});


app.get("/employees/add",(req,res)=>{
    dataService.getDepartments()
        .then((data)=>{
            res.render("addEmployee", {
                departments: data
            });
        })
        .catch((err)=>{
            res.render("addEmployee",{message: "no results"});
        });
}); 


app.post("/employees/add", (req, res)=>{
    dataService.addEmployee(req.body)
        .then((data)=>{
            console.log(req.body);
            res.redirect("/employees");
        })
        .catch((err)=>{
            console.log(err);
    })
});


app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body)
        .then((data)=>{
            res.redirect("/employees");
            console.log("complete"); 
        })
        .catch((err)=>{
            console.log(err);
            console.log("fail");
        })
});

app.get("/employee/delete/:empNum", (req, res)=>{
    dataService.deleteEmployeeByNum(req.params.empNum)
        .then((data)=>{
            res.redirect("/employees");
        })
        .catch((err)=>{
            res.status(500).send("Unable to Remove Employee / Employee not found")
        })
});

app.get("/managers", (req, res) => {
    dataService.getManagers()
          .then((data)=>
          {
            res.render("employees", { employees: data, title: "Employees (Managers)" });
          })
          .catch((err)=>
          {
            res.render("employees",{message: "no results"});
          });
});

app.get("/departments", (req, res) =>{
    dataService.getDepartments()
          .then((data)=>
           {
            if (data.length>0)
            {
                res.render("departments", { departments: data, title: "Departments" });
            }
            else 
            {
                res.render("departments",{message: "no results"});
            }
           })
          .catch((err)=>
           {
                res.render("departments",{message: "no results"});
           });
});

app.get("/departments/add",(req,res)=>{
    res.render("addDepartment", {title: "Department"});
}); 

app.post("/departments/add", (req, res)=>{
    dataService.addDepartment(req.body)
        .then((data)=>{
            console.log(req.body);
            res.redirect("/departments");
        })
        .catch((err)=>{
            console.log(err);
    })
});

app.post("/department/update", (req, res)=> {
    dataService.updateDepartment(req.body)
    .then((data)=>{
        res.redirect("/departments");
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get("/department/:departmentId", (req, res)=>{
    dataService.getDepartmentById(req.params.departmentId)
        .then((data)=>{
              res.render("department",{departments:data});
        })
        .catch((err)=>{
            res.status(404).send("Department Not Found!");
        });
});


app.get('/', function (req, res, next) {
    res.render('home', {layout: false});
 });
 
app.use((err, req, res, next)=> { 
    console.error(err.stack);
    res.status(404).send("Page Not Found");
});


app.listen(HTTP_PORT, onHttpStart);