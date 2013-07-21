
/*
 * GET home page.
 */

exports.doSearch = function(req, res){
  res.render('search', { title: 'Search', key: req.params.key});
};