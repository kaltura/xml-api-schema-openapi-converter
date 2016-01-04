'use strict';
var FS = require('fs');
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
      swagger.info = {title: 'Kaltura', description: 'The Kaltura API', version: '3'};
      swagger.securityDefinitions = {
        "secret": {
          in: 'query',
          name: 'secret',
          type: 'apiKey',
          description: 'Your API secret'
        },
      }
      var classes = kaltura.spec.classes[0].class;
      swagger.definitions = convertClasses(classes);
      Object.keys(swagger.definitions).forEach(function(k) {
        swagger.definitions[k].properties = {};
      })
      var services = kaltura.spec.services[0].service;
      swagger.paths = convertServices(services);
      callback(null, swagger);
    }
  }
};
Types['kaltura'] = Kaltura;
Inherits(Kaltura, Converter.BaseType);

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

var convertClasses = function(classes) {
  var definitions = {KalturaObjectBase: {}};
  classes.forEach(function(cls) {
    var def = definitions[cls.$.name] = {};
    def.description = cls.$.description;
    def.properties = {};
    var props = cls.property || [];
    props.forEach(function(prop) {
      var swaggerProp = def.properties[prop.$.name] = {};
      if (prop.$.type.indexOf('Kaltura') === 0) {
        swaggerProp.$ref = '#/definitions/' + prop.$.type;
        return;
      }
      swaggerProp.type = convertType(prop.$.type);
    })
  });
  return definitions;
}

var convertServices = function(services) {
  var paths = {};
  services.forEach(function(service) {
    var actions = service.action;
    actions.forEach(function(action) {
      var path = paths['/service/' + service.$.name + '/action/' + action.$.name] = {};
      path = path.get = {};
      path.description = action.$.description;
      path.parameters = [{
        name: 'format',
        in: 'query',
        type: 'integer',
        x_df_default: 1,
      }];
      var parameters = action.param || [];
      parameters.forEach(function(param) {
        if (param.$.type === "array" ||
            param.$.type === "file" ||
            param.$.type.indexOf('Kaltura') === 0) return;
        path.parameters.push({
          name: param.$.name,
          in: 'query',
          description: param.$.description,
          type: convertType(param.$.type),
          required: param.optional === 1,
        });
      });
      path.responses = {
        '200': {
          description: 'Success',
        }
      }
      var result = action.result[0];
      if (result) {
        var resultType = result.$.type;
        if (resultType.indexOf('Kaltura') === 0) {
          path.responses['200'].schema = {'$ref': '#/definitions/' + result.$.type}
        }
      }
    });
  });
  return paths;
}

var convertType = function(type) {
  if (type === "bool") return "boolean";
  if (type === "array") return "array";
  if (type === "int" || type === "bigint") return "integer";
  if (type === "float") return "number";
  if (type === "string") return "string";
  if (type === "map") return "object";
  throw new Error("Unknown type:" + type);
}
