var FS = require('fs');
var Converter = require('api-spec-converter');
var Kaltura = require('./lib/kaltura-spec');
Converter.Formats['kaltura'] = Kaltura;
var args = require('yargs').argv;

args.schema = args.schema || __dirname + '/node_modules/kaltura-schema/api_schema.xml';
args.output = args.output || __dirname + '/out/swagger.json';

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
