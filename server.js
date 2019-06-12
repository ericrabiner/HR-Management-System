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
  res.render("home.hbs");
})

app.get("/about", (req, res) => {
  res.render("about.hbs");
})

app.get("/employees/add", (req, res) => {
  res.render("addEmployee.hbs");
})

app.get("/images/add", (req, res) => {
  res.render("addImage.hbs");
})

app.get("/images", (req, res) => {
  fs.readdir("./public/images/uploaded", (err, items) => {
    res.render("images", {
      data: items
    });
  });
});

// setup route to listen on /employees
app.get("/employees", (req, res) => {
  if (req.query.status != undefined) {
    data_service.getEmployeesByStatus(req.query.status)
    .then((data) => {
      res.render("employees", {
        employees: data
      });
    })
    .catch((err) => {
      res.render("employees", {
        message: err
      });
    });
  }

  else if (req.query.department != undefined) {
    data_service.getEmployeesByDepartment(req.query.department)
    .then((data) => {
      res.render("employees", {
        employees: data
      });
    })
    .catch((err) => {
      res.render("employees", {
        message: err
      });
    });
  }

  else if (req.query.manager != undefined) {
    data_service.getEmployeesByManager(req.query.manager)
    .then((data) => {
      res.render("employees", {
        employees: data
      });
    })
    .catch((err) => {
      res.render("employees", {
        message: err
      });
    });
  }
  else {
    data_service.getAllEmployees()
    .then((data) => {
      res.render("employees", {
        employees: data
      });
    })
    .catch((err) => {
      res.render("employees", {
        message: err
      });
    });
  }
});

app.get("/departments", function(req, res) {
  data_service.getDepartments()
  .then((data) => {
    res.render("departments", {
      departments: data
    });
  })
  .catch((err) => {
    res.render("departments", {
      message: err
    });
  });
});

// setup route to listen on /employee/value
app.get("/employee/:empNum", function(req, res) {
  data_service.getEmployeeByNum(req.params.empNum)
  .then((data) => {
    res.render("employee", {
      employee: data[0]
    });
  })
  .catch((err) => {
    res.render("employee", {
      message: err
    });
  });
});

app.post("/employee/update", (req, res) => {
  console.log(req.body)
  data_service.updateEmployee(req.body)
  .then(() => {
    res.redirect("/employees");
  })
  .catch((err) => {
    res.send(err);
  })
});

// setup route to listen on /managers ***NOT USED IN A4***
app.get("/managers", function(req, res) {
  data_service.getManagers()
  .then((data) => {res.json(data);})
  .catch((err) => {res.json({"message": err});})
});

// storage using Multer
const storage = multer.diskStorage({
  destination: "./public/images/uploaded/",
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({storage: storage});

// setup route to listen on POST of add images
app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.post("/employees/add", function(req, res) {
  data_service.addEmployee(req.body)
  .then(() => {
    res.redirect("/employees");
  })
  .catch((err) => {
    console.log(err);
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