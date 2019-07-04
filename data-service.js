/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Eric Rabiner Student ID: 038806063 Date: July 3, 2019
*
*  Online (Heroku) Link: https://whispering-oasis-80729.herokuapp.com/
*
********************************************************************************/

const Sequelize = require('sequelize');
var sequelize = new Sequelize('d9kl30c9thf62s', 'abjugikuthhxbz', 'a6a9b85443bb7b807b384d35916c98c4a44a1f210fbff68692eed6642c0ec2b8', {
  host: 'ec2-174-129-226-234.compute-1.amazonaws.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: true
  }
});

sequelize.authenticate().then(() => {
  console.log("Connection to database successful.");
}).catch((err) => {
  console.log(err);
});

var Employee = sequelize.define('Employee', {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  department: Sequelize.INTEGER,
  hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departmentName: Sequelize.STRING
});

module.exports.initialize = function() {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      resolve("Sync to database successful.");
    }).catch(() => {
      reject("Unable to sync the database.");
    })
  });
}

module.exports.getAllEmployees = function() {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      order: ["employeeNum"]
    })
    .then((data) => {
      resolve(data);
    })
    .catch(() => {
      reject("No results returned.");
    });
  });
}

module.exports.getEmployeesByStatus = function(status) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      order: ["employeeNum"],
      where: {
        status: status
      }
    })
    .then((data) => {
      resolve(data);
    })
    .catch(() => {
      reject("No results returned.");
    });
  });
}

module.exports.getEmployeesByDepartment = function(department) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      order: ["employeeNum"],
      where: {
        department: department
      }
    })
    .then((data) => {
      resolve(data);
    })
    .catch(() => {
      reject("No results returned.");
    });
  });
}

module.exports.getEmployeesByManager = function(manager) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      order: ["employeeNum"],
      where: {
        employeeManagerNum: manager
      }
    })
    .then((data) => {
      resolve(data);
    })
    .catch(() => {
      reject("No results returned.");
    });
  });
}

module.exports.getEmployeeByNum = function(num) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {
        employeeNum: num
      }
    })
    .then((data) => {
      resolve(data[0]);
    })
    .catch(() => {
      reject("No results returned.");
    });
  });
}

module.exports.getDepartments = function() {
  return new Promise(function (resolve, reject) {
    Department.findAll({
      order: ["departmentId"]
    })
    .then((data) => {
      resolve(data);
    })
    .catch(() => {
      reject("No results returned.");
    });
  });
}

module.exports.addEmployee = function(employeeData) {
  employeeData.isManager = (employeeData.isManager) ? true : false;
  return new Promise(function (resolve, reject) {
    for (let obj in employeeData) {
      if (employeeData[obj] == "") {
        employeeData[obj] = null;
      }
    }
    Employee.create({
      // employeeNum: employeeData.employeeNum,
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      email: employeeData.email,
      SSN: employeeData.SSN,
      addressStreet: employeeData.addressStreet,
      addressCity: employeeData.addressCity,
      addressState: employeeData.addressState,
      addressPostal: employeeData.addressPostal,
      maritalStatus: employeeData.maritalStatus,
      isManager: employeeData.isManager,
      employeeManagerNum: employeeData.employeeManagerNum,
      status: employeeData.status,
      department: employeeData.department,
      hireDate: employeeData.hireDate
    }).then(() => {
      resolve("Employee created.");
    }).catch(() => {
      reject("Unable to create employee.");
    });
  });
}

module.exports.updateEmployee = function(employeeData) {
  employeeData.isManager = (employeeData.isManager) ? true : false;
  return new Promise(function (resolve, reject) {
    for (let obj in employeeData) {
      if (employeeData[obj] == "") {
        employeeData[obj] = null;
      }
    }
    Employee.update({
      // employeeNum: employeeData.employeeNum,
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      email: employeeData.email,
      SSN: employeeData.SSN,
      addressStreet: employeeData.addressStreet,
      addressCity: employeeData.addressCity,
      addressState: employeeData.addressState,
      addressPostal: employeeData.addressPostal,
      maritalStatus: employeeData.maritalStatus,
      isManager: employeeData.isManager,
      employeeManagerNum: employeeData.employeeManagerNum,
      status: employeeData.status,
      department: employeeData.department,
      hireDate: employeeData.hireDate
    }, {
      where: {
        employeeNum: employeeData.employeeNum
      }
    }).then(() => {
      resolve("Employee updated.");
    }).catch(() => {
      reject("Unable to update employee.");
    });
  });
}

module.exports.addDepartment = function(departmentData) {
  return new Promise(function (resolve, reject) {
    for (let obj in departmentData) {
      if (departmentData[obj] == "") {
        departmentData[obj] = null;
      }
    }
    Department.create({
      // departmentId: departmentData.departmentId,
      departmentName: departmentData.departmentName
    }).then(() => {
      resolve("Department created.");
    }).catch(() => {
      reject("Unable to create department.");
    });
  });
}

module.exports.updateDepartment = function(departmentData) {
  return new Promise(function (resolve, reject) {
      for (let obj in departmentData) {
        if (departmentData[obj] == "") {
          departmentData[obj] = null;
        }
      }
      Department.update({
        // departmentId: departmentData.departmentId,
        departmentName: departmentData.departmentName
      }, {
        where: {
          departmentId: departmentData.departmentId
        }
      }).then(() => {
        resolve("Department updated.");
      }).catch(() => {
        reject("Unable to update department.");
      });
  });
}

module.exports.getDepartmentById = function(id) {
  return new Promise(function (resolve, reject) {
    Department.findAll({
      order: ["departmentId"],
      where: {
        departmentId: id
      }
    })
    .then((data) => {
      resolve(data);
    })
    .catch(() => {
      reject("No results returned.");
    });
  });
}

module.exports.deleteEmployeeByNum = function(empNum) {
  return new Promise(function (resolve, reject) {
    Employee.destroy({
      where: { employeeNum: empNum }
    }).then(() => {
      resolve("Employee destroyed.");
    }).catch(() => {
      reject("Unable to destroy.");
    });
  });
}

module.exports.deleteDepartmentByNum = function(depNum) {
  return new Promise(function (resolve, reject) {
    Department.destroy({
      where: { departmentId: depNum }
    }).then(() => {
      resolve("Department destroyed.");
    }).catch(() => {
      reject("Unable to destroy.");
    });
  });
}