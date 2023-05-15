'use strict';

/**
 * Import necessary libraries
 */
const FS = require('fs');
const Converter = require('api-spec-converter');
const xml2js = require('xml2js');
const Promise = require('bluebird');
const _ = require('lodash');

// Local dependencies
const utils = require('./utils');
const SwaggerBuilder = require('./swagger-builder');

/**
 * The Kaltura class
 * @extends Converter.BaseFormat
 */
class Kaltura extends Converter.BaseFormat {
  constructor() {
    super();
    this.type = 'kaltura';
    this.converters.swagger_2 = Promise.method(kaltura => convertToSwagger(kaltura.spec.xml));
    this.parsers = {
      'XML': data => Promise.promisify(xml2js.parseString)(data)
    };
  }

  /**
   * Returns the version of the format
   * @return {string} The version of the format
   */
  getFormatVersion() {
    return '1.0';
  }

  /**
   * Check if the given spec is of Kaltura format, not really needed here, so we just return true always
   * @param {Object} spec - The spec to check
   * @return {boolean} Always returns true as there's no check implemented
   */
  checkFormat(spec) {
    return true;
  }
}

// Define static properties
Kaltura.prototype.formatName = 'kaltura'; // Set the format name
Kaltura.prototype.supportedVersions = ['1.0']; // Define supported versions

/**
 * Convert the Kaltura spec to Swagger
 * @param {Object} kaltura - The Kaltura spec to convert
 * @return {Object} The converted Swagger spec
 */
function convertToSwagger(kaltura) {
  let builder = new SwaggerBuilder();
  builder.run(kaltura);
  return builder.swagger;
}

// Export the Kaltura class
module.exports = Kaltura;
