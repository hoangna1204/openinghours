var AdminProvider = require('../models/adminProvider').AdminProvider;
var mongo = require('../node_modules/mongodb');
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;

var adminProvider = new AdminProvider(host, port);

//Create
exports.create = function(req, res) {
    res.render('admin_create', { title: 'Create new admin'});
};

exports.doCreate = function(req, res){
    adminProvider.create({
        email: req.param('txt_email'),
        password: req.param('txt_password')
    }, function( error, docs) {
        res.redirect('/admin')
    });
};

//Read
exports.viewAll = function(req, res) {
	adminProvider.findAll(function(error,results){
        res.render('admin', { title: 'Admin', admins: results });
    });
};

exports.view = function(req, res) {
    adminProvider.findById(req.params._id, function(error, result){
        res.render('admin_view', { title: 'View admin', admin: result });
    });
};

//Update
exports.edit = function(req, res) {
    adminProvider.findById(req.params._id, function(error, result){
        res.render('admin_edit', { title: 'Edit admin', admin: result});
    });
}

exports.doEdit = function(req, res) {
    adminProvider.edit({
        email: req.param('txt_email'),
        _id: req.params._id,
        password: req.param('txt_password')
    }, function( error, docs) {
        res.redirect('/admin')
    });
}

//Delete
exports.delete = function(req, res) {
    adminProvider.findById(req.params._id, function(error, result){
        res.render('admin_delete', { title: 'Delete admin', admin: result});
    });
}

exports.doDelete = function(req, res) {
    adminProvider.delete({
        email: req.param('txt_email'),
        _id: req.params._id
    });
    res.redirect('/admin');
}