
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var backend = require('./routes/backend');
var home = require('./routes/home')
var http = require('http');
var path = require('path');


var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.home);
app.get('/home', routes.home);
app.get('/submitReport', routes.submitReport);
app.post('/submitReport', routes.submitReportData);
app.get('/viewMap', routes.viewMap);
app.get('/viewReport', routes.viewReport);
app.get('/legalAdvise', routes.legalAdvise);
app.get('/aboutUs', routes.aboutUs);
app.get('/contactUs', routes.contactUs);
app.get('/sampleMap', routes.sampleMap);
app.get('/index', routes.index);
app.get('/info', routes.info);
app.get('/connect', routes.connect);
app.get('/track', routes.track);
app.get('/thankyou', routes.thankyou);
app.get('/api', routes.api);
app.post('/addOrg', routes.org)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
