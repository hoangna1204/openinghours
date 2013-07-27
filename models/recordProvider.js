var Db = require("../node_modules/mongodb").Db;
var Connection = require("../node_modules/mongodb").Connection;
var Server = require("../node_modules/mongodb").Server;
var BSON = require("../node_modules/mongodb").BSON;
var ObjectID = require("../node_modules/mongodb").ObjectID;

RecordProvider = function(host, port) {
  this.db= new Db('openinghours', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

RecordProvider.prototype.getCollection= function(callback) {
  this.db.collection('record', function(error, record_collection) {
    if( error ) callback(error);
    else callback(null, record_collection);
  });
};

RecordProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, record_collection) {
      if( error ) callback(error);
      else {
        record_collection.find().toArray(function(error, results) {
          if( error ) callback(error);
          else callback(null, results);
        });
      }
    });
};

RecordProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, record_collection) {
      if( error ) callback(error)
      else {
        record_collection.findOne({_id: record_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error);
          else callback(null, result);
        });
      }
    });
};

RecordProvider.prototype.create = function(records, callback) {
    this.getCollection(function(error, record_collection) {
      if( error ) callback(error);
      else {
        if( typeof(records.length)=="undefined")
          records = [records];

        for( var i =0;i< records.length;i++ ) {
          record = records[i];
          record.created_at = new Date();
        }

        record_collection.insert(records, function() {
          callback(null, records);
        });
      }
    });
};

RecordProvider.prototype.edit = function(record, callback) { 
  this.getCollection(function(error, record_collection){
      if(error) callback(error);
      else {
        record_collection.update(
          { _id: record_collection.db.bson_serializer.ObjectID.createFromHexString(record._id)},
          { $set: {
            ownership: true,
            name: record.name,
            city: record.city,
            street: record.street,
            website: record.website,
            phone: record.phone,
            fax: record.fax,
            main_category: record.main_category,
            description: record.description,
            openinghours: {
                mon:[{from:"8.00",to:"12.00"},{from:"13.00",to:"17.00"},{from:"18.00",to:"22.00"}],
                tue:[{from:"8.00",to:"12.00"},{from:"13.00",to:"17.00"},{from:"18.00",to:"22.00"}],
                wed:[{from:"8.00",to:"12.00"},{from:"13.00",to:"17.00"},{from:"18.00",to:"22.00"}],
                thu:[{from:"8.00",to:"12.00"},{from:"13.00",to:"17.00"},{from:"18.00",to:"22.00"}],
                fri:[{from:"8.00",to:"12.00"},{from:"13.00",to:"17.00"},{from:"18.00",to:"22.00"}],
                sat:[{from:"8.00",to:"12.00"},{from:"13.00",to:"17.00"},{from:"18.00",to:"22.00"}],
                sun:[{from:"8.00",to:"12.00"},{from:"--",to:"--"},{from:"",to:""}]
            },
            reviews:[
                {
                    date: new Date(),
                    author: "Hoang",
                    content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. loremfacebook"
                },
                {
                    date: new Date(),
                    author: "Hoang 1",
                    content: "No Content123456789"
                },
                {
                    date: new Date(),
                    author: "Hoang 2",
                    content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. loremfacebook"
                },
            ],
            accuracy: {
                up: 5,
                down: 10
            },        

          }},
          function(){
          callback(null, record);
        });
      }
  });
};

RecordProvider.prototype.delete = function(record, callback) { 
  this.getCollection(function(error, record_collection){
      if(error) callback(error);
      else {
        record_collection.remove(
          {_id: record_collection.db.bson_serializer.ObjectID.createFromHexString(record._id)});
      }
  });
};

RecordProvider.prototype.voteUp = function(record, callback) {
  this.getCollection(function(error, record_collection) {
    if(error) callback(error);
    else {
      record_collection.update(
        { _id: record_collection.db.bson_serializer.ObjectID.createFromHexString(record._id)},
        { $inc: {
            "accuracy.up": 1
          }
        }
        );
    }
  });
}

RecordProvider.prototype.voteDown = function(record, callback) {
  this.getCollection(function(error, record_collection) {
    if(error) callback(error);
    else {
      record_collection.update(
        { _id: record_collection.db.bson_serializer.ObjectID.createFromHexString(record._id)},
        { $inc: {
            "accuracy.down": 1
          }
        }
        );
    }
  });
}


exports.RecordProvider = RecordProvider;