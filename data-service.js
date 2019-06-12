/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Eric Rabiner Student ID: 038806063 Date: June 11, 2019
*
*  Online (Heroku) Link:
*
********************************************************************************/

const fs = require('fs');
var employees = [];
var departments = [];

module.exports.initialize = function() {
  function startEmp() {
    return new Promise((resolve, reject) => {
      fs.readFile('data/employees.json', (err, data) => {
        if (!err){
          employees = JSON.parse(data);
          resolve();
        }
        else {
          reject();
        }
      });
    });
  }
  function startDep() {
    return new Promise((resolve, reject) => {
      fs.readFile('data/departments.json', (err, data) => {
        if (!err) {
          departments = JSON.parse(data);
          resolve();
        }
        else {
          reject();
        }
      });
    });
  }

  return new Promise((resolve, reject) => {
    startEmp()
    .then(startDep)
    .then(() => {resolve("Successful initialization.");})
    .catch(() => {reject("Failed to read file(s).");})
  });
}

module.exports.getAllEmployees = function() {
  return new Promise((resolve, reject) => {
    if (employees.length == 0) {
      reject("No results found.");
    }
    else {
      console.log("Employees accessed.");
      resolve(employees);
    }
  });
}

module.exports.getManagers = function() {
  let managers = [];
  for (var i = 0; i < employees.length; i++){
    if (employees[i].isManager == true) {
      managers.push(employees[i]);
    }
  }
  return new Promise((resolve, reject) => {
    if (managers.length == 0) {
      reject("No results found.");
    }
    else {
      console.log("Managers accessed.");
      resolve(managers);
    }
  });
}

module.exports.getDepartments = function() {
  return new Promise((resolve, reject) => {
    if (departments.length == 0) {
      reject("No results found.");
    }
    else {
      console.log("Departments accessed.");
      resolve(departments);
    }
  });
}

module.exports.addEmployee = function(employeeData) {
  return new Promise((resolve, reject) => {
    if (employeeData.isManager == undefined) {
      employeeData.isManager = false;
    }
    else {
      employeeData.isManager = true;
    }
    employeeData.employeeNum = employees.length + 1;
    employees.push(employeeData);
    resolve();
  });
}

module.exports.getEmployeesByStatus = function(status) {
  let emps = [];
  for (var i = 0; i < employees.length; i++) {
    if (employees[i].status == status) {
      emps.push(employees[i]);
    }
  }
  return new Promise((resolve, reject) => {
    if (emps.length == 0) {
      reject("No results found.");
    }
    else {
      resolve(emps);
    }
  });
}

module.exports.getEmployeesByDepartment = function(department) {
  let emps = [];
  for (var i = 0; i < employees.length; i++) {
    if (employees[i].department == department) {
      emps.push(employees[i]);
    }
  }
  return new Promise((resolve, reject) => {
    if (emps.length == 0) {
      reject("No results found.");
    }
    else {
      resolve(emps);
    }
  });
}

module.exports.getEmployeesByManager = function(manager) {
  let emps = [];
  for (var i = 0; i < employees.length; i++) {
    if (employees[i].employeeManagerNum == manager) {
      emps.push(employees[i]);
    }
  }
  return new Promise((resolve, reject) => {
    if (emps.length == 0) {
      reject("No results found.");
    }
    else {
      resolve(emps);
    }
  });
}

module.exports.getEmployeeByNum = function(num) {
  let emps = [];
  for (var i = 0; i < employees.length; i++) {
    if (employees[i].employeeNum == num) {
      emps.push(employees[i]);
    }
  }
  return new Promise((resolve, reject) => {
    if (emps.length == 0) {
      reject("No results found.");
    }
    else {
      resolve(emps);
    }
  });
}

module.exports.updateEmployee = function(employeeData) {
  return new Promise((resolve, reject) => {
    for (var i = 0; i < employees.length; i++) {
      if (employees[i].SSN == employeeData.SSN) {
        employees[i].firstName = employeeData.firstName;
        employees[i].lastName = employeeData.lastName;
        employees[i].email = employeeData.email;
        employees[i].SSN = employeeData.SSN;
        employees[i].addressStreet = employeeData.addressStreet;
        employees[i].addressCity = employeeData.addressCity;
        employees[i].addressState = employeeData.addressState;
        employees[i].addressPostal = employeeData.addressPostal;
        employees[i].isManager = employeeData.isManager;
        employees[i].employeeManagerNum = employeeData.employeeManagerNum;
        employees[i].status = employeeData.status;
        employees[i].department = employeeData.department;
        employees[i].hireDate = employeeData.hireDate;
        resolve();
      }
    }
    console.log(employeeData.employeeNum)
    reject("Employee not found.");
  });
}