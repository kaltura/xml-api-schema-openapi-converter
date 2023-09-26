// Import necessary libraries
const yargs = require('yargs');
const fs = require('fs');
const Converter = require('api-spec-converter');
const swagger2openapi = require('swagger2openapi');

/**
* Get command-line arguments
* @type {Object}
*/
const args = yargs.argv;

/**
* Set TARGET_API environment variable from command-line arguments,
* existing environment variable, or default to 'ovp'
* @type {string}
*/
process.env.TARGET_API = args.target || process.env.TARGET_API || 'ovp';

// Add Kaltura format to converter
const Kaltura = require('./lib/kaltura-spec');
Converter.Formats['kaltura'] = Kaltura;

/**
* Set schema URL based on TARGET_API environment variable
* @type {string}
*/
const schemaUrl = process.env.TARGET_API === 'ott'
? "https://tvpapi-us-preprod.ott.kaltura.com/v4_1/clientlibs/KalturaClient.xml"
: "http://www.kaltura.com/api_v3/api_schema.php";

/**
* Set default output file based on TARGET_API environment variable
* @type {string}
*/
const defaultOutput = process.env.TARGET_API === 'ott'
? "./out/ott.openapi.json"
: "./out/ovp.openapi.json";

// Use provided schema and output file, or defaults if not provided
args.schema = args.schema || schemaUrl;
args.output = args.output || defaultOutput;

/**
* Convert Kaltura API spec to Swagger 2.0 spec
*/
Converter.convert({
  from: 'kaltura',
  to: 'swagger_2',
  source: args.schema,
}, (err, spec) => {
  if (err) throw err;
  
  
  var swaggerspec = spec.stringify({order: 'alpha'});
  
  // Write converted spec to output file. args.output - filename, stringified spec json ordered in alphanumeric ascending:
  fs.writeFileSync(args.output, swaggerspec);
  
  // Validate the converted spec: if --novalidate option is set, skip this verification
  if (!args.novalidate) {
    console.log('Validating...');
    spec.validate((errs, warnings) => {
      if (errs) {
        console.log("ERRORS", JSON.stringify(errs, null, 2));
      } else {
        console.log("Verification successful.");
      }
    });
  }
  
  // generate an openapi 3.x file too
  if (args.genopenapiv3) {
    console.log("Saving OpenAPI 3 format...");
    swagger2openapi.convertObj(JSON.parse(swaggerspec), {})
    .then((openapi) => {
      let openapiDocument = JSON.stringify(openapi.openapi, null, 2); // Convert the openapi object to a string
      fs.writeFile(args.genopenapiv3, openapiDocument, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  // if both validation and openapi 3.x gen should be skipped - we're successfully completed:
  if (args.novalidate && !args.genopenapiv3) {
    console.log("Done");
  }

});
