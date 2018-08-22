var employees = []; 
var departments = []; 
var empCount = 0; 
var err = "Cannot open files";
var fs = require("fs");

module.exports.initialize = function()
{
    return new Promise(function(resolve,reject)
    {
        try{
            fs.readFile('./data/employees.json', (err, data) =>
            {
                if(err)
                { 
                    throw err;
                }else{
                    employees = JSON.parse(data);
                    empCount = employees.length;
                }
            });
            fs.readFile('./data/departments.json', (err, data) =>
            {
                if(err)
                { 
                    throw err;
                }else{
                    departments = JSON.parse(data);
                } 
            });
        }catch(ex){
             reject("Unable to read file");
        }
        resolve("Successfully read JSON file.");   
    });
}

module.exports.getAllEmployees = function()
{
    var AllEmployees=[];
    return new Promise(function(resolve,reject)
    {
        for(var i = 0;i < employees.length; i++) 
        {
            AllEmployees.push(employees[i]);
        }
        if(AllEmployees.length == 0)
        {
            reject("No Result Returned");
        }
        resolve(AllEmployees);
    });
}

module.exports.getEmployeesByStatus = function(status)
{
    var StatusArray = [];
    return new Promise(function(resolve,reject)
    {
        for(var i = 0; i < employees.length; i++)
        {
            if(employees[i].status == status)
            {
                StatusArray.push(employees[i]);
            }
        }
        if(StatusArray.length == 0)
        {
            reject("No Result Returned");
        }
        resolve(StatusArray);
    });
}

module.exports.getEmployeesByDepartment = function(department)
{
    var ByDepartment = [];
    return new Promise(function(resolve,reject)
    {
        for(var i = 0; i < employees.length; i++)
        {
            if(employees[i].department == department)
            {
                ByDepartment.push(employees[i]);
            }
        }
        if(ByDepartment.length == 0)
        {
            reject("No Result Returned");
        }
    resolve(ByDepartment);
    });
}

module.exports.getEmployeesByManager = function(manager) 
{
    var GetEmployeesByManager = [];
    return new Promise(function(resolve,reject) 
    {
        for(var i = 0; i< employees.length; i++) 
        {
            if(employees[i].employeeManagerNum == manager) 
            {
                GetEmployeesByManager.push(employees[i]);
            }
        }
        if(GetEmployeesByManager.length == 0 ) 
        {
            reject("No Result Returned");
        }
    resolve(GetEmployeesByManager);
    });
}

module.exports.getEmployeeByNum = function(num) 
{
    return new Promise(function(resolve,reject)
    {
        for(var i = 0, max = employees.length; i < max; i++)
        {
            if(employees[i].employeeNum == num)
            {
                resolve(employees[i]);
            }
        }
    reject("No Result Returned");
    });
}

module.exports.getManagers = function() 
{
    var GetManagers = [];
    return new Promise(function(resolve,reject)
    {
        if(employees.length == 0)
        {
            reject("No Result Returned");
        }else{
            for(var i = 0; i < employees.length; i++) 
            {
                 if (employees[i].isManager == true)
                {
                    GetManagers.push(employees[i]);       
                }
            }
            if(GetManagers.length == 0)
            {
                reject("No Result Returned");
            }
        }
        resolve(GetManagers);
     });
}

module.exports.getDepartments = function() 
{
    var GetDepartments = [];
    return new Promise(function(resolve,reject)
    {
        for (var i = 0; i < departments.length; i++)
        {
         GetDepartments.push(departments[i]);
        }
       if (GetDepartments.length == 0)
        {
         reject("no results returned");
        }
       resolve(GetDepartments);
    });
}

module.exports.addEmployee = function(employeeData)
{
    employeeData.employeeNum = empCount+1;
    return new Promise(function(resolve, reject)
    {
        employees.push(employeeData);  
        if (employees.length == 0) 
        {
            reject("No Result Returned!");
        }
        resolve(employees);
    });
}

module.exports.updateEmployee = function(employeeData)
{
    return new Promise(function(resolve,reject)
    {   
        for(var i = 0,max = employees.length; i < max; i++)
        {
            if (employees[i].employeeNum == employeeData.employeeNum) 
            {
                employees[i] = employeeData;
            }
        }
        if(employees.length ==0)
        {
            reject("No Result Returned!");
        }
    resolve(employees); 
    });
}
