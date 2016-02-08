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
});
