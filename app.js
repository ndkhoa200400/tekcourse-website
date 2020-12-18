const express = require('express');
const morgan =  require("morgan");
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError')
const rateLimit = require("express-rate-limit");
const exphbs  = require('express-handlebars');
const path = require('path');
const hbsHelpers = require('handlebars-helpers')();
var hbs = require('hbs');
// const numeral = require('numeral');

const app = express();

//this required before view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  exphbs({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    defaultLayout: 'main',
    helpers: hbsHelpers
    // helpers: {
    //   format_number(val) {
    //     return numeral(val).format('0,0');
    //   }
    // }
  })
);

app.use(express.urlencoded({
    extended: true
  }));

// Routing
const userRoute = require('./routes/user.route');
const courseRoute = require('./routes/course.route');
const lectureRoute = require('./routes/lecture.route');
const viewRouter = require('./routes/view.route');
const feedbackRoute = require('./routes/feedback.route');

if(process.env.NODE_ENV ==='development')
    app.use(morgan('dev'));
app.use(express.static((__dirname + "/public")));
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname , "./" , "/public")));

const limiter = rateLimit({
    // Alow 100 requests from the same IP in 1 hour
    max: 100,
    window: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
  });
app.use("/", limiter);

app.use('/', viewRouter);
app.use('/api/user', userRoute);
app.use('/api/course', courseRoute);
app.use('/api/lecture', lectureRoute);
app.use('/api/feedback', feedbackRoute);

app.get('*', function(req, res,next){
  res.status(404);
  // 404 Not Found Error;
  res.render('error_404',{
    title: 'Not Found',
    layout : false
  })
  //next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});

module.exports = app;