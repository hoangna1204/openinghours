
exports.hello = function(req, res){
  res.send("hello from me");
};

exports.helloRend = function(req, res){
  res.render('hoang', { hoang: 'Hello you' });
};