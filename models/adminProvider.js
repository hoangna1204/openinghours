var Db = require("../node_modules/mongodb").Db;
var Connection = require("../node_modules/mongodb").Connection;
var Server = require("../node_modules/mongodb").Server;
var BSON = require("../node_modules/mongodb").BSON;
var ObjectID = require("../node_modules/mongodb").ObjectID;

AdminProvider = function(host, port) {
  this.db= new Db('openinghours', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

AdminProvider.prototype.getCollection= function(callback) {
  this.db.collection('admin', function(error, admin_collection) {
    if( error ) callback(error);
    else callback(null, admin_collection);
  });
};

AdminProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, admin_collection) {
      if( error ) callback(error);
      else {
        admin_collection.find().toArray(function(error, results) {
          if( error ) callback(error);
          else callback(null, results);
        });
      }
    });
};

AdminProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, admin_collection) {
      if( error ) callback(error)
      else {
        admin_collection.findOne({_id: admin_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error);
          else callback(null, result);
        });
      }
    });
};

AdminProvider.prototype.create = function(admins, callback) {
    this.getCollection(function(error, admin_collection) {
      if( error ) callback(error);
      else {
        if( typeof(admins.length)=="undefined")
          admins = [admins];

        for( var i =0;i< admins.length;i++ ) {
          admin = admins[i];
          admin.created_at = new Date();
        }

        admin_collection.insert(admins, function() {
          callback(null, admins);
        });
      }
    });
};

AdminProvider.prototype.edit = function(admin, callback) { 
  this.getCollection(function(error, admin_collection){
      if(error) callback(error);
      else {
        admin_collection.update(
          { _id: admin_collection.db.bson_serializer.ObjectID.createFromHexString(admin._id)},
          { $set: {password: admin.password}},
          function(){
          callback(null, admin);
        });
      }
  });
};

AdminProvider.prototype.delete = function(admin, callback) { 
  this.getCollection(function(error, admin_collection){
      if(error) callback(error);
      else {
        admin_collection.remove(
          {_id: admin_collection.db.bson_serializer.ObjectID.createFromHexString(admin._id)});
      }
  });
};



exports.AdminProvider = AdminProvider;