/*********************************************************************************
*  WEB322 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Eric Rabiner Student ID: 038806063 Date: July 22, 2019
*
*  Online (Heroku) Link: https://fast-brook-82025.herokuapp.com/
*
********************************************************************************/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

var userSchema = new Schema({
    "userName":  {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
});

let User;

module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://erabiner:duf3trUU@senecaweb-mfgwn.mongodb.net/test?retryWrites=true&w=majority");
        db.on('error', (err) => {
            reject(err);
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
}

module.exports.registerUser = function(userData) {
    return new Promise(function(resolve, reject) {
        if (userData.password == userData.password2) {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) {
                    reject("There was an error encrypting the password");
                }
                else {
                    bcrypt.hash(userData.password, salt, function(err, hash) {
                        if (err) {
                            reject("There was an error encrypting the password");
                        }
                        else {
                            userData.password = hash;
                            let newUser = new User(userData);
                            newUser.save((err) => {
                                if (err && err.code == 11000) {
                                    reject("User Name already taken.");
                                }
                                else if (err) {
                                    reject("There was an error creating the user: " + err);
                                }
                                else {
                                    resolve();
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            reject("Passwords do not match.");
        }
    });
}

module.exports.checkUser = function(userData) {
    return new Promise(function(resolve, reject) {
        User.find({userName: userData.userName})
        .exec()
        .then((foundUser) => {
            if (foundUser.length == 0) { // if empty array
                reject("Unable to find user: " + userData.userName);
            }
            else {
                hash = foundUser[0].password;
                bcrypt.compare(userData.password, hash)
                .then((res) => {
                    if (res == true) {
                        foundUser[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                        User.updateOne(
                            {userName: foundUser[0].userName},
                            {$set: {loginHistory: foundUser[0].loginHistory}}
                        )
                        .exec()
                        .then(() => {
                            resolve(foundUser[0]);
                        })
                        .catch((err) => {
                            reject("There was an error verifying the user: " + err);
                        });

                    }
                    else {
                        reject("Incorrect Password for user: " + userData.userName);
                    }
                })
                .catch((err) => {
                    reject("There was an error verifying the user: " + err);
                });
            }
        })
        .catch(() => {
            reject("Unable to find user: " + userData.userName);
        });
    });
}