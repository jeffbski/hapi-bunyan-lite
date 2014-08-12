# hapi-bunyan-lite - basic Hapi Bunyan integration

Minimalistic Bunyan integration for Hapi - forwards Hapi log events to bunyan

## Goals

 - forward Hapi log events to Bunyan
 - assign log level based on existence of tags (trace, debug, info, warn, error, fatal) or use configurable default

## Installation

```bash
npm install --save https://github.com/jeffbski/hapi-bunyan-lite/archive/v0.0.2.tar.gz
```

## Usage

```javascript
var bunyan = require('bunyan');
var Hapi = require('hapi');

var myRootLogger = bunyan.createLogger({
  name: 'myapp',
  stream: process.stdout,
  level: 'debug'
});
// This is an optional extra function you can create,
// It will allow you to change things before its pushed to the streams.
var optionalPreProccessData = function (objLog, event, tags, request) {

  // Here we add the tag "new-tag" to everything.
  // But you can make it do more interesting things.
  tags.push('new-tag');
}
var plugins = [{
  plugin: require('hapi-bunyan-lite'),
  options: {
    logger: myRootLogger,
    defaultLogLevel: 'info',
    preProcessData: optionalPreProccessData
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
```

## License

MIT
