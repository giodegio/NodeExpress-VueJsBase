'use strict';

// expose this function to our app using module.exports
module.exports = function(loglib) {
  loglib.configure({
    appenders: {
      // log rolling (and compressed backups)
      logfilerolling: {
        type: 'file',
        filename: 'serverlogs/server-log-full.log',
        maxLogSize: 10485760,
        backups: 5,
        compress: false
      },
      out: { type: 'stdout' }
      // console: { type: 'console' }
    },
    categories: {
      // POSSIBLE DEBUG LEVELS: off, fatal, error, warn, info, debug, trace, all
      default: { appenders: [ 'logfilerolling'], level: 'debug'},

      server: { appenders: [ 'logfilerolling' ], level: 'debug'},
      http: { appenders: [ 'logfilerolling' ], level: 'debug'},
      socketIo: { appenders: [ 'logfilerolling' ], level: 'debug'},

      routesIndex: { appenders: [ 'logfilerolling' ], level: 'debug'},
      routesUsers: { appenders: [ 'logfilerolling' ], level: 'debug'}
    }
  });
};
