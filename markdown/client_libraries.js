var fs = require('fs');

var CLIENT_LANGS = ['php5', 'php53', 'php5Zend', 'csharp', 'ruby', 'java', 'android', 'js', 'python', 'objc', 'cli', 'node'];

var markdown = fs.readFileSync(__dirname + '/client_libraries.md', 'utf8');
/*
var genDate = fs.readFileSync(__dirname + '/../node_modules/kaltura-schema/api_schema.xml', 'utf8').match(/generatedDate="(\d+)"/)[1];
genDate = new Date(parseInt(genDate) * 1000);
var year = (genDate.getYear() + 1900).toString();
var month = (genDate.getMonth() + 1).toString();
if (month.length === 1) month = '0' + month;
var day = genDate.getDate();
if (day.length === 1) day = '0' + day;
genDate = day + '-' + month + '-' + year;
*/
var genDate = '14-05-2015';
CLIENT_LANGS.forEach(function(cl) {
  var link = 'http://cdnbakmi.kaltura.com/content/clientlibs/' + cl + '_' + genDate + '.tar.gz';
  if (cl === 'node') cl = 'nodejs';
  markdown += '<div class="client-lib-link ' + cl +  '"><a href="' + link + '">' +
                      '<img src="http://www.kaltura.com/api_v3/testme/images/buttons/' + cl + '.jpg">' +
                   '</a></div>';
});

module.exports = markdown;
