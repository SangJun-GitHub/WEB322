var employess = [];
var departments = [];
var fs = require("fs");

module.exports.initialize = function()
{
    return new Promise(function(resolve, reject)
    {
        try
        {
            fs.readFile('./data/employees.json', function(err, data)
            {
                if(err) throw err;
                employess = JSON.parse(data);
            });
            fs.readFile('./data/departments.json', function(err,data)
            {
                if(err) throw err;
                departments = JSON.parse(data);                
            });
        } catch(e) {
            reject("unable to read file");
        }
        resolve("success to read file");
    });
};

module.exports.getAllEmployees = function()
{
    var data_employees=[];
    return new Promise(function(resolve,reject)
    {
        for (var i = 0; i < employess.length; i++) 
        {
            data_employees.push(employess[i]);
        }
        if (data_employees.length === 0)
        {
            reject("No results returned");
        }
    resolve(data_employees);
    })
};

module.exports.getManagers = function() 
{
    var data_managers = [];
    return new Promise(function(resolve,reject)
    {
        if(employess.length === 0)
        {
            reject("No results returned");
        }else{
            for (var q = 0; q < employess.length; q++) 
            {
                 if (employess[q].isManager == true) 
                 {
                    data_managers.push(employess[q]);       
                 }
            }
            if (data_managers.length === 0) 
            {
                     reject("No results returned");
             }
        }
        resolve(data_managers);
     });
};

module.exports.getDepartments = function() 
{
    var data_departments = [];
    return new Promise(function(resolve,reject)
    {
        if(employess.length === 0)
        {
            reject("No results returned");
        }else{
            for (var v = 0; v < departments.length; v++) 
            {
                data_departments.push(departments[v]);       
            }
            if (data_departments.length === 0) 
            {
                reject("No results returned");
            }
        }
    resolve(data_departments);
    });
};