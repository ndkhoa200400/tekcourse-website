const User = require("../model/user.model");

exports.alerts = (req, res, next) => {
 
  };

exports.getLoginForm = (req, res) => {
  res.status(200).render('home', {
    title: "Log into your account",
  });
};

