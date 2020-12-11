const express = require('express');
const morgan =  require("morgan");
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError')
const rateLimit = require("express-rate-limit");
const exphbs  = require('express-handlebars');
const path = require('path');
var hbs = require('hbs');

const app = express();

//this required before view engine setup
// hbs.registerPartial('partial', fs.readFileSync(__dirname + '/views/partial.hbs', 'utf8'));
// hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  exphbs({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    defaultLayout: 'main'
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

app.use(express.static('public'));

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

app.all('*', (req, res, next)=>{
    // 404 Not Found Error;
    next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});


module.exports = app;