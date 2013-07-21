var Db = require("../node_modules/mongodb").Db;
var Connection = require("../node_modules/mongodb").Connection;
var Server = require("../node_modules/mongodb").Server;
var BSON = require("../node_modules/mongodb").BSON;
var ObjectID = require("../node_modules/mongodb").ObjectID;

CategoryProvider = function(host, port) {
  this.db= new Db('openinghours', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

CategoryProvider.prototype.getCollection= function(callback) {
  this.db.collection('category', function(error, category_collection) {
    if( error ) callback(error);
    else callback(null, category_collection);
  });
};

CategoryProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, category_collection) {
      if( error ) callback(error)
      else {
        category_collection.find().toArray(function(error, results) {
          if( error ) callback(error);
          else callback(null, results);
        });
      }
    });
};

CategoryProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, category_collection) {
      if( error ) callback(error)
      else {
        category_collection.findOne({_id: category_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error);
          else callback(null, result);
        });
      }
    });
};

CategoryProvider.prototype.create = function(categories, callback) {
    this.getCollection(function(error, category_collection) {
      if( error ) callback(error);
      else {
        if( typeof(categories.length)=="undefined")
          categories = [categories];

        for( var i =0;i< categories.length;i++ ) {
          category = categories[i];
          category.created_at = new Date();
        }

        category_collection.insert(categories, function() {
          callback(null, categories);
        });
      }
    });
};

CategoryProvider.prototype.edit = function(category, callback) { 
  this.getCollection(function(error, category_collection){
      if(error) callback(error);
      else {
        category_collection.update(
          { _id: category_collection.db.bson_serializer.ObjectID.createFromHexString(category._id)},
          { $set: {name: category.name}},
          function(){
          callback(null, category);
        });
      }
  });
};

CategoryProvider.prototype.delete = function(category, callback) { 
  this.getCollection(function(error, category_collection){
      if(error) callback(error);
      else {
        category_collection.remove(
          {_id: category_collection.db.bson_serializer.ObjectID.createFromHexString(category._id)});
      }
  });
};

exports.CategoryProvider = CategoryProvider;