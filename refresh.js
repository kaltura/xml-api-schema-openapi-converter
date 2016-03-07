var FS = require('fs');
var Converter = require('api-spec-converter');
var Kaltura = require('./lib/kaltura-spec');

Converter.convert({
  from: 'kaltura',
  to: 'swagger_2',
  source: __dirname + '/node_modules/kaltura-schema/api_schema.xml',
}, function(err, spec) {
  if (err) console.log(err);
  FS.writeFileSync('out/swagger.json', spec.stringify());
  spec.validate(function(errs, warnings) {
    if (errs) console.log("ERRORS", JSON.stringify(errs, null, 2));
    if (warnings) {
      warnings = warnings.filter(w => w.code !== 'UNUSED_DEFINITION')
      console.log("WARNINGS", JSON.stringify(warnings, null, 2));
    }
  })
});
