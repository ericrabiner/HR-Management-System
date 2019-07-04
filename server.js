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

const express = require("express");
const app = express();
const path = require("path");
const data_service = require("./data-service.js");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

app.use(express.static("./public/"));
app.use(bodyParser.urlencoded({ extended: true }));

const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});

// storage using Multer
const storage = multer.diskStorage({
  destination: "./public/images/uploaded/",
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({storage: storage});

app.engine(".hbs", exphbs({
  extname: ".hbs",
  defaultLayout: "main",
  helpers: {
    navLink: function(url, options){
      return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3) {
        throw new Error("Handlebars Helper equal needs 2 parameters");
      }
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));

app.set("view engine", ".hbs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/images/add", (req, res) => {
  res.render("addImage");
});

app.get("/images", (req, res) => {
  fs.readdir("./public/images/uploaded", (err, items) => {
    res.render("images", { data: items });
  });
});

app.get("/employees", (req, res) => {
  if (req.query.status) {
    data_service.getEmployeesByStatus(req.query.status)
    .then((data) => {
      if (data.length > 0) {
        res.render("employees", { employees: data });
      }
      else {
        res.render("employees", { message: "No results." });
      }
    })
    .catch((err) => {
      res.render("employees", { message: err });
    });
  }

  else if (req.query.department) {
    data_service.getEmployeesByDepartment(req.query.department)
    .then((data) => {
      if (data.length > 0) {
        res.render("employees", { employees: data });
      }
      else {
        res.render("employees", { message: "No results." });
      }
    })
    .catch((err) => {
      res.render("employees", { message: err });
    });
  }

  else if (req.query.manager) {
    data_service.getEmployeesByManager(req.query.manager)
    .then((data) => {
      if (data.length > 0) {
        res.render("employees", { employees: data });
      }
      else {
        res.render("employees", { message: "No results." });
      }
    })
    .catch((err) => {
      res.render("employees", { message: err });
    });
  }
  else {
    data_service.getAllEmployees()
    .then((data) => {
      if (data.length > 0) {
        res.render("employees", { employees: data });
      }
      else {
        res.render("employees", { message: "No results." });
      }
    })
    .catch((err) => {
      res.render("employees", { message: err });
    });
  }
});

app.get("/employees/add", (req, res) => {
  // res.render("addEmployee");
  data_service.getDepartments()
  .then((data) => {
    res.render("addEmployee", {departments: data });
  })
  .catch((err) => {
    res.render("addEmployee", { departments: [] });
  });
});

app.get("/employee/:empNum", function(req, res) {
  // initialize an empty object to store the values
  let viewData = {};
  data_service.getEmployeeByNum(req.params.empNum).then((data) => {
      if (data) {
        viewData.employee = data; //store employee data in the "viewData" object as "employee"
      } else {
        viewData.employee = null; // set employee to null if none were returned
      }
  }).catch(() => {
    viewData.employee = null; // set employee to null if there was an error 
  }).then(data_service.getDepartments)
  .then((data) => {
    viewData.departments = data; // store department data in the "viewData" object as "departments"

    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching 
    // viewData.departments object

    for (let i = 0; i < viewData.departments.length; i++) {
      if (viewData.departments[i].departmentId == viewData.employee.department) {
          viewData.departments[i].selected = true;
      }
    }

  }).catch(() => {
    viewData.departments = []; // set departments to empty if there was an error
  }).then(() => {
    if (viewData.employee == null) { // if no employee - return an error
      res.status(404).send("Employee Not Found");
    } else {
      res.render("employee", { viewData: viewData }); // render the "employee" view
    }
  });
});

app.get("/employees/delete/:empNum", function(req, res) {
  data_service.deleteEmployeeByNum(req.params.empNum)
  .then((msg) => {
    console.log(msg);
    res.redirect("/employees");
  })
  .catch((err) => {
    console.log(err);
    res.status(404).send("Employee Not Found");
  });
});

app.get("/departments", function(req, res) {
  data_service.getDepartments()
  .then((data) => {
    if (data.length > 0) {
      res.render("departments", { departments: data });
    }
    else {
      res.render("departments", { message: "No results." });
    }
  })
  .catch((err) => {
    res.render("departments", { message: err });
  });
});

app.get("/departments/add", (req, res) => {
  res.render("addDepartment");
});

// I don't like res.send message. I want to keep the departments hbs file, and display the msg there.
app.get("/department/:departmentid", function(req, res) {
  data_service.getDepartmentById(req.params.departmentid)
  .then((data) => {
    if (data) {
      res.render("department", { department: data[0] });
    }
    else {
      res.status(404).send("Department Not Found");
    }
  })
  .catch((err) => {
    res.status(404).send("Department Not Found");
  });
});

app.get("/departments/delete/:depNum", function(req, res) {
  data_service.deleteDepartmentByNum(req.params.depNum)
  .then((msg) => {
    console.log(msg);
    res.redirect("/departments");
  })
  .catch((err) => {
    console.log(err);
    res.status(404).send("Department Not Found");
  });
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.post("/employees/add", function(req, res) {
  data_service.addEmployee(req.body)
  .then((msg) => {
    console.log(msg);
    res.redirect("/employees");
  })
  .catch((err) => {
    console.log(err);
  })
});

app.post("/employee/update", (req, res) => {
  data_service.updateEmployee(req.body)
  .then((msg) => {
    console.log(msg);
    res.redirect("/employees");
  })
  .catch((err) => {
    res.send(err);
  })
});

app.post("/departments/add", function(req, res) {
  data_service.addDepartment(req.body)
  .then((msg) => {
    console.log(msg);
    res.redirect("/departments");
  })
  .catch((err) => {
    console.log(err);
  })
});

app.post("/department/update", (req, res) => {
  data_service.updateDepartment(req.body)
  .then((msg) => {
    console.log(msg);
    res.redirect("/departments");
  })
  .catch((err) => {
    res.send(err);
  })
});

// setup route to listen on 404 page
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Initialization
data_service.initialize()
.then((msg) => {
  // setup http server to listen on HTTP_PORT
  console.log(msg);
  app.listen(HTTP_PORT, onHttpStart);
})
.catch((err) => {console.log(err);
});