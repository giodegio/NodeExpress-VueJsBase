'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var httpRequestLogger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const { Writable } = require('stream');

var loglib = require('log4js');

// configuration ===============================================================
require('./config/log4js')(loglib); // pass loglib for configuration

var logHttp = loglib.getLogger('http');
var logServer = loglib.getLogger('server');
var logSosketIo = loglib.getLogger('socketIo');

logServer.info('START!!! LOGGING THROUGH LOG4JS!!!');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, '../client/dist/static/img', 'degio.ico')));

// Http Request Logging:
// ---------------------
// Use log4js as Http Request Logger:
//   app.use(loglib.connectLogger(loglib.getLogger('http'), { level: 'auto' }));
// Or (better output control) use Morgan and redirect its output to log4js
// Morgan Http Request Logger log format
// You can use Predefined Formats (https://github.com/expressjs/morgan#predefined-formats): common, dev, short, combined, ...
// or you can define your own format (https://github.com/expressjs/morgan#morgancompileformat)
httpRequestLogger.format('GBAHttpLogFormat', // Degio TODO: Add a parameter in app configuration for the Morgan format string
  'Remote= :remote-addr; Method= ":method :url HTTP/:http-version"' +
    '; Status= :status; RespTime= :response-time ms;' +
      'Bytes= :res[content-length]; Referrer= ":referrer"; UserAgent= ":user-agent"');
// Trap dello stream di write del logger http Morgan (httpRequestLogger) e redirezione su log4js
const outStreamHttpReqLogger = new Writable({
  write(chunk, encoding, callback) {
    logHttp.info(chunk.toString().substr(0, chunk.length - 1));
    callback();
  }
});
app.use(httpRequestLogger('GBAHttpLogFormat', {stream: outStreamHttpReqLogger}));

// passing our socket to our response in middleware,
// so we can use res.io.emit("event-name", "eventa-data");
app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

io.on('connection', function(socket) {
  logSosketIo.info('A new WebSocket connection has been established. # Clients: ' + io.engine.clientsCount);

  // Alla connessione di un client invio i messaggi necessari a visualizzare i dati aggiornati al client
  io.emit('NUMBER_OF_CLIENTS', io.engine.clientsCount);

  // Registrazione handler disconnessioni
  socket.on('disconnect', function() {
    // L'emissione del messaggio con il numero di client
    // va effettuata quando effetivamente il client si è disconnesso
    // ossia, quando questa routine è terminata (per restituire il valore corretto di clientsCount)
    setTimeout(function() {
      let numClients = io.engine.clientsCount;

      logSosketIo.info('WebSocket Client disconnected. # Clients: ' + numClients);
      io.emit('NUMBER_OF_CLIENTS', numClients);
    }, 500);
  });

  // Registrazione handlers ricezione eventi dai client
  socket.on('pingServer', function(data) {
    logSosketIo.info('WebSocket Client - received event pingServer: data= ' + data);
  });

});

// ============================
// Test socket.io
// ============================
setInterval(function() {
  if (io.engine.clientsCount > 0) {
    var random_number = Math.floor(Math.random() * 1000);
    io.emit('randomNumberUpdate', random_number);
  }
}, 250);

module.exports = {app: app, server: server};
