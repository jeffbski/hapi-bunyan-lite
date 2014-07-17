'use strict';

var bunyan = require('bunyan');
var Hapi = require('hapi');

var myRootLogger = bunyan.createLogger({
  name: 'myapp',
  stream: process.stdout,
  level: 'debug'
});
var plugins = [{
  plugin: require('../'), // require('hapi-bunyan-lite'),
  options: {
    logger: myRootLogger,
    defaultLogLevel: 'info'
  }
}];

var server = Hapi.createServer('localhost', 3000);

var routes = [
  { method: 'GET', path: '/', handler: function (request, reply) {
    request.log(['warn'], 'request at warn');
    request.log(['mytag'], 'request at default');
    reply('Hello World');
  }}
];
server.route(routes);

server.pack.register(plugins, function (err) {
  if (err) { throw err; }
  console.log('hello');
  server.log(['debug'], 'server logging at debug');
  server.log(['mytag'], 'server logging at default');
  server.start();
});

