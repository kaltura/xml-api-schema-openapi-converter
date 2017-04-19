var FS = require('fs');
var Converter = require('api-spec-converter');
var Kaltura = require('./lib/kaltura-spec');
Converter.Formats['kaltura'] = Kaltura;
var args = require('yargs').argv;

var SCHEMA_URL = process.env.TARGET_API === 'ott'
  ? "https://tvpapi-us-preprod.ott.kaltura.com/v4_1/clientlibs/KalturaClient.xml"
  : "http://www.kaltura.com/api_v3/api_schema.php";
var DEFAULT_OUTPUT = process.env.TARGET_API === 'ott'
  ? "out/ott.openapi.json"
  : "out/ovp.openapi.json";
args.schema = args.schema || SCHEMA_URL;
args.output = args.output || DEFAULT_OUTPUT;

Converter.convert({
  from: 'kaltura',
  to: 'swagger_2',
  source: args.schema,
}, function(err, spec) {
  if (err) throw err;
  FS.writeFileSync(args.output, spec.stringify());
  if (!args.novalidate) {
    console.log('Done, validating...');
    spec.validate(function(errs, warnings) {
      if (errs) console.log("ERRORS", JSON.stringify(errs, null, 2));
    })
  }
});
