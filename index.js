var request = require('request');
var url = require('url');
var path = require('path');
var $ = require('cheerio');
var fs = require('fs');
var stringify = require('csv-stringify');

function writeCsvFile(csvFile, data) {
  stringify(data, function(err, output) {
    fs.writeFile(csvFile, output, function(err) {
      if (err) {
        return console.err(err);
      }
      console.log('wrote ' + csvFile);
    });
  });
}

function htmlDownload(err, response, html) {
  if (err) {
    return console.error(err);
  }
  var imageFileData = [];
  var $table = $.load(html)('table');
  var $tableRows = $table.find('tr');
  $tableRows.each(function(index, element) {
    var permissions = $(this).find('code').eq(0).text();
    var $linkNode = $(this).find('a').eq(0);
    var imageUrl = domain + $linkNode.attr('href');
    var fileType = path.extname(imageUrl);
    imageFileData.push([permissions, imageUrl, fileType]);
  });
  writeCsvFile(__dirname + '/images.csv', imageFileData);
}

var urlToVisit = 'http://substack.net/images/';
var parsedUrl = url.parse(urlToVisit);
var domain = parsedUrl.protocol + '//' + parsedUrl.host;
request(urlToVisit, htmlDownload);
