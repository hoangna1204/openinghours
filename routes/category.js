var CategoryProvider = require('../models/categoryProvider').CategoryProvider;
var mongo = require('../node_modules/mongodb');
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;

var categoryProvider = new CategoryProvider(host, port);

//Create
exports.create = function(req, res) {
    res.render('category_create', { title: 'Create new category'});
};

exports.doCreate = function(req, res){
    categoryProvider.create({
        name: req.param('txt_name'),
    }, function( error, docs) {
        res.redirect('/category')
    });
};

//Read
exports.viewAll = function(req, res) {
	categoryProvider.findAll(function(error,results){
        res.render('category', { title: 'Category', categories: results });
    });
};

exports.view = function(req, res) {
    categoryProvider.findById(req.params._id, function(error, result){
        res.render('category_view', { title: 'View category', categories: result });
    });
};

//Update
exports.edit = function(req, res) {
    categoryProvider.findById(req.params._id, function(error, result){
        res.render('category_edit', { title: 'Edit category', category: result});
    });
}

exports.doEdit = function(req, res) {
    categoryProvider.edit({
        name: req.param('txt_name'),
        _id: req.params._id,
    }, function( error, docs) {
        res.redirect('/category')
    });
}

//Delete
exports.delete = function(req, res) {
    categoryProvider.findById(req.params._id, function(error, result){
        res.render('category_delete', { title: 'Delete category', category: result});
    });
}

exports.doDelete = function(req, res) {
    categoryProvider.delete({
        name: req.param('txt_name'),
        _id: req.params._id
    });
    res.redirect('/category');
}