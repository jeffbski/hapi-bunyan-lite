# hapi-bunyan-lite - basic Hapi Bunyan integration

Minimalistic Bunyan integration for Hapi - forwards Hapi log events to bunyan

## Goals

 - forward Hapi log events to Bunyan
 - assign log level based on existence of tags (trace, debug, info, warn, error, fatal) or use configurable default

## Installation

```bash
npm install --save https://github.com/jeffbski/hapi-bunyan-lite/archive/v0.0.1.tar.gz
```

## Usage

```javascript
var bunyan = require('bunyan');
var myRootLogger = bunyan.createLogger({
  name: 'myapp',
  stream: process.stdout,
  level: 'debug'
});
var plugins = [{
  plugin: require('hapi-bunyan-lite'),
  options: {
    logger: myRootLogger,
    defaultLogLevel: 'info'
  }
}];
server.pack.register(plugins, cb);
// logging with hapi log method, forwarded to bunyan
server.log(['warn'], 'logging at warn level');
server.log(['mytag'], 'logging at default level');
request.log(['error'], 'logging at error level');
```
