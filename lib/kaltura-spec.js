'use strict';
var FS = require('fs');
var Inherits = require('util').inherits;
var Converter = require('api-spec-converter');
var xml2js = require('xml2js');
var Promise = require('bluebird');
var _ = require('lodash');

var utils = require('./utils');
var SwaggerBuilder = require('./swagger-builder');


var Kaltura = module.exports = function() {
  Kaltura.super_.apply(this, arguments);
  this.type = 'kaltura';
  this.converters.swagger_2 = Promise.method(kaltura => convertToSwagger(kaltura.spec.xml))
};
Inherits(Kaltura, Converter.BaseFormat);

Kaltura.prototype.formatName = 'kaltura';
Kaltura.prototype.supportedVersions = ['1.0'];
Kaltura.prototype.getFormatVersion = function () {
  return '1.0';
}

Kaltura.prototype.parsers = {
  'XML': data => Promise.promisify(xml2js.parseString)(data)
};

Kaltura.prototype.checkFormat = function (spec) {
  return true;
}

var convertToSwagger = function(kaltura) {
  let builder = new SwaggerBuilder();
  builder.run(kaltura);
  return builder.swagger;
}

