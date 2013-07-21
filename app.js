
/**
*@author Anh Hoang Nguyen
*/

/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')

  , routes = require('./routes')
  , user = require('./routes/user')
  , admin = require('./routes/admin')
  , new_hi = require('./routes/hello')
  , search = require('./routes/search');

var host = "127.0.0.1";
var port = process.env.PORT || 3000;

var app = express();

// all environments
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/hello',new_hi.hello);
app.get('/hello/r',new_hi.helloRend);
app.get('/search/:key',search.doSearch);

//Create
app.get('/admin/create', admin.create);
app.post('/admin/create', admin.doCreate);

//Read
app.get('/admin', admin.viewAll);
app.get('/admin/view/:_id', admin.view);

//Update
app.get('/admin/edit/:_id', admin.edit);
app.post('/admin/edit/:_id', admin.doEdit);

//Delete

app.get('/admin/delete/:_id', admin.delete);
app.post('/admin/delete/:_id', admin.doDelete);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
