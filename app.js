
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
  , record = require('./routes/record')
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
app.get('/dev/jade', dev.testJade); // /dev/jade --> url pattern

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

//------Record------//
//Create
app.get('/record/create', record.create);
app.post('/record/create', record.doCreate);

//Read
app.get('/record', record.viewAll);
app.get('/record/view/:_id', record.view);

//Update
app.get('/record/edit/:_id', record.edit);
app.post('/record/edit/:_id', record.doEdit);

//Delete

app.get('/record/delete/:_id', record.delete);
app.post('/record/delete/:_id', record.doDelete);

//vote
app.get('/record/voteUp/:_id', record.doVoteUp);
app.get('/record/voteDown/:_id', record.doVoteDown);
//-----------------//



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
