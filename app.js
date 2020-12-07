const express = require('express');
const morgan =  require("morgan");
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError')
const rateLimit = require("express-rate-limit");

const app = express();


// Routing
const userRoute = require('./routes/user.route');
const courseRoute = require('./routes/course.route');

if(process.env.NODE_ENV ==='development')
    app.use(morgan('dev'));


app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
    // Alow 100 requests from the same IP in 1 hour
    max: 100,
    window: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
  });
app.use("/", limiter);


app.use('/user', userRoute);
app.all('*', (req, res, next)=>{
    // 404 Not Found Error;
    next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});



module.exports = app;