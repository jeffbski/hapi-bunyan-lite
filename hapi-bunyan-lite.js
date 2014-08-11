'use strict';

var Joi = require('joi');

var defaultOptions = {
  logger: null, // required
  defaultLogLevel: 'info'
};

var logLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

var optionsSchema = Joi.object().keys({
  logger: Joi.object().required(),
  defaultLogLevel: Joi.string()
    .valid(logLevels)
    .default('info'),
  preProcessData: Joi.func(),
});

exports.register = function (plugin, options, next) {
  Joi.validate(options, optionsSchema, function (err, opts) {
    if (err) { return next(err); }

    var rootLogger = opts.logger;

    function logEvent(request, event, tags) {

      var objLog = {
        data: event.data
      };

      if (options.preProcessData) {
        options.preProcessData(objLog, event, tags, request);
      }

      var level = findLogLevelFromTags(tags, opts.defaultLogLevel);

      if (request) { objLog.requestId = request.id; }

      rootLogger[level](objLog, event.tags);
    }

    plugin.events
      .on('log', logEvent.bind(null, null)) // request is null
      .on('request', logEvent);

    return next();
  });
};

exports.register.attributes = {
  pkg: require('./package.json')
};

/**
 * find highest log level in tags or use default
 */
function findLogLevelFromTags(tags, defaultLogLevel) {
  return logLevels.reduce(function (accum, level) {
    if (tags[level]) { accum = level; }
    return accum;
  }, defaultLogLevel);
}