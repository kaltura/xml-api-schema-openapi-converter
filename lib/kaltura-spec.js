'use strict';

var Inherits = require('util').inherits;
var Converter = require('api-spec-converter');
var Types = Converter.Types;
var XMLParser = require('xml2js').parseString;

var Kaltura = module.exports = function() {
  Kaltura.super_.apply(this, arguments);
  this.type = 'kaltura';
  this.converters = {
    swagger_2: function(kaltura, callback) {
      var swagger = {swagger: '2.0'};
      swagger.host = 'www.kaltura.com';
      swagger.schemes = ['http', 'https'];
      swagger.basePath = '/api_v3';
      swagger.info = {title: 'Kaltura', description: 'The Kaltura API'};
      swagger.definitions = {};
      swagger.paths = {'/': {
        parameters: [{
          name: 'action',
          type: 'string',
          in: 'query'
        }, {
          name: 'service',
          type: 'string',
          in: 'query',
        }]
      }};
      callback(null, new Types['swagger_2'](swagger));
    }
  }
}
Types['kaltura'] = Kaltura;
Inherits(Kaltura, Types.base);

Kaltura.prototype.formatName = 'kaltura';
Kaltura.prototype.supportedVersions = ['1.0'];
Kaltura.prototype.getFormatVersion = function () {
  return '1.0';
}

Kaltura.prototype.parsers = [function(string, cb) {
  XMLParser(string, function(err, parsed) {
    cb(err, parsed ? parsed.xml : null);
  })
}];

Kaltura.prototype.checkFormat = function (spec) {
  return true;
}
