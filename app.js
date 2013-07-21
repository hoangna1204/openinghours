
/**
*@author Anh Hoang Nguyen
*/

/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , dev = require('./routes/dev')
  , routes = require('./routes')
  , admin = require('./routes/admin')
  , category = require('./routes/category')
  , user = require('./routes/user')
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
app.get('/dev/index4', dev.index4);

app.get('/search/:key',search.doSearch);


//------Admin------//
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

//-----------------//

//------Category------//
//Create
app.get('/category/create', category.create);
app.post('/category/create', category.doCreate);

//Read
app.get('/category', category.viewAll);
app.get('/category/view/:_id', category.view);

//Update
app.get('/category/edit/:_id', category.edit);
app.post('/category/edit/:_id', category.doEdit);

//Delete

app.get('/category/delete/:_id', category.delete);
app.post('/category/delete/:_id', category.doDelete);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
