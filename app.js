const express = require('express');
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError')
const rateLimit = require("express-rate-limit");
const exphbs = require('express-handlebars');
const path = require('path');
const hbsHelpers = require('handlebars-helpers')();
const hbs_sections = require('express-handlebars-sections');
const globalErrorHandler = require("./controllers/error.controller");
var hbs = require('hbs');
const session = require('express-session');

;
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
    helpers: hbsHelpers,
    section: hbs_sections
    // helpers:{
    //   section: hbs_sections(),
    //   format_number(val) {
    //     return numeral(val).format('0,0');
    //   }


  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});


// Routing
const userRoute = require('./routes/user.route');
const courseRoute = require('./routes/course.route');
const lectureRoute = require('./routes/lecture.route');
const viewRouter = require('./routes/view.route');
const feedbackRoute = require('./routes/feedback.route');
const registeredCourse = require("./routes/registeredCourse.route");
const cartRoute = require('./routes/cart.route');
const watchListRoute = require('./routes/watchList.route');


if (process.env.NODE_ENV === 'development')
  app.use(morgan('dev'));
app.use(express.static((__dirname + "/public")));
app.use('/static', express.static(path.join(__dirname, 'public')))


app.set('trust proxy', 1)
app.use(session({
  secret: 'SECRET_KEY',
  resave: false,
  saveUninitialized: true,
  maxAge: Date.now() + (60 * 60 * 1000)
}));
app.use(express.static(path.join(__dirname, "./", "/public")));


app.use('/', viewRouter);
app.use('/course', courseRoute)
app.use('/feedback', feedbackRoute);;
app.use('/cart', cartRoute);
app.use('/watchlist', watchListRoute);
app.use('/user', userRoute);
app.use('/api/lecture', lectureRoute);

app.use('/api/checkout', registeredCourse);

app.get('*', function (req, res, next) {
  res.status(404);
  // 404 Not Found Error;
  res.render('error_404', {
    title: 'Not Found',
    layout: false
  })
  //next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});
app.use(globalErrorHandler);
module.exports = app;