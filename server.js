var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');

require('dotenv').config();

require('./config/database');
require('./config/passport');

const indexRouter = require('./routes/index');
const budgetsRouter = require('./routes/budgets');
const billsRouter = require('./routes/bills');
const balancesRouter = require('./routes/balances');
const lineItemsRouter = require('./routes/lineItems');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/stylesheets', express.static(path.join(__dirname + '/node_modules/bootstrap/dist/css')));
app.use('/javascripts', express.static(path.join(__dirname + '/node_modules/bootstrap/dist/js')));
app.use('/javascripts', express.static(path.join(__dirname + '/node_modules/jquery/dist')));
app.use(methodOverride('_method'));

app.use(session({
  secret: 'j0w0Balancer',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});



app.use('/', indexRouter);
app.use('/budgets', budgetsRouter);
app.use('/bills', billsRouter)
app.use('/balances', balancesRouter);
app.use('/line-items', lineItemsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //next(createError(404));
  next(res.redirect('/'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
