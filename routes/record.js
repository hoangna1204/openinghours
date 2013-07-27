var RecordProvider = require('../models/recordProvider').RecordProvider;
var mongo = require('../node_modules/mongodb');
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;

var recordProvider = new RecordProvider(host, port);

//Create
exports.create = function(req, res) {
    res.render('record_create', { title: 'Create new record'});
};

exports.doCreate = function(req, res){
    recordProvider.create({
        ownership: true,
        name: req.param('name'),
        city: req.param('city'),
        street: req.param('street'),
        website: req.param('website'),
        phone: req.param('phone'),
        fax: req.param('fax'),
        main_category: req.param('main_category'),
        description: req.param('description'),
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
            up: 45,
            down: 10
        },
    }, function( error, docs) {
        res.redirect('/record');
    })
};

//Read
exports.viewAll = function(req, res) {
	recordProvider.findAll(function(error,results){
        var day = new Date();
        res.render('record', { title: 'Record', records: results, today: day.getDay() });
    });
};

exports.view = function(req, res) {
    recordProvider.findById(req.params._id, function(error, result){
        var day = new Date();
        res.render('record_view', { title: 'View record', record: result, today: day.getDay() });
    });
};

//Update
exports.edit = function(req, res) {
    recordProvider.findById(req.params._id, function(error, result){
        res.render('record_edit', { title: 'Edit record', record: result});
    });
}

exports.doEdit = function(req, res) {
    recordProvider.edit({
        _id: req.params._id,
        ownership: true,
        name: req.param('name'),
        city: req.param('city'),
        street: req.param('street'),
        website: req.param('website'),
        phone: req.param('phone'),
        fax: req.param('fax'),
        main_category: req.param('main_category'),
        description: req.param('description'),
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
            up: 45,
            down: 10
        },        
    }, function( error, docs) {
        res.redirect('/record');
    });
}

//Delete
exports.delete = function(req, res) {
    recordProvider.findById(req.params._id, function(error, result){
        res.render('record_delete', { title: 'Delete record', record: result});
    });
}

exports.doDelete = function(req, res) {
    recordProvider.delete({
        _id: req.params._id
    });
    res.redirect('/record');
}

exports.doVoteUp = function(req, res) {
    recordProvider.voteUp({_id: req.params._id});
    res.redirect('/record/view/'+req.params._id);
}

exports.doVoteDown = function(req, res) {
    recordProvider.voteDown({_id: req.params._id});
    res.redirect('/record/view/'+req.params._id);
}

