var fs = require('fs');
var request = require('request');

var schemas = [{
  label: 'Syndication Feed',
  type: 'syndication',
}, {
  label: 'Bulk Upload',
  type: 'bulkUploadXml.bulkUploadXML',
}, {
  label: 'Bulk Upload Results',
  type: 'bulkUploadXml.bulkUploadResultXML',
}, {
  label: 'Cue Point Serve',
  type: 'cuePoint.serveAPI',
}, {
  label: 'Cue Point Ingest',
  type: 'cuePoint.ingestAPI',
}, {
  label: 'Drop Folder',
  type: 'dropFolderXmlBulkUpload.dropFolderXml',
}]

schemas.forEach(function(s) {
  s.downloadURL = 'http://www.kaltura.com/api_v3/index.php/service/schema/action/serve/type/' + s.type + '/name/' + s.type + '.xsd';
  s.filename = __dirname + '/schemas/' + s.type + '.xsd';
  s.xml = fs.readFileSync(s.filename, 'utf8');
})

function getContents(s) {
  return [
    '## ' + s.label,
    '[Download XSD](' + s.downloadURL + ')',
    '',
    '```xml',
    s.xml,
    '```',
  ].join('\n');
}

module.exports = schemas.map(function(s) {
  return {
    title: s.label,
    contents: getContents(s),
  }
});

if (require.main === module) {
  schemas.forEach(function(s) {
    request.get(s.downloadURL, function(err, resp, body) {
      if (err || resp.statusCode !== 200) throw new Error(err || resp.statusCode);
      fs.writeFileSync(__dirname + '/schemas/' + s.type + '.xsd', body)
    })
  })
}
