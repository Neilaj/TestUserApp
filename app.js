
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost/Company');
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var Schema = new mongoose.Schema({
	_id: String,
	name: String,
	company: String,
	age: Number
});
var person = mongoose.model('emp', Schema);

//here we app data to database
app.post('/new', function(req, res){
	new person({
		_id: req.body.email,
		name: req.body.name,
		company: req.body.company,
		age: req.body.age


	}).save(function(err, doc){
		if (err)res.send('Sorry this email is already in our DB!');
		else res.redirect('/views');
	});
});
//display all persons in emp collection.
app.get('/views', function(req, res){
	person.find({}, function(err, docs){
		if(err) res.send('Something went wrong');
		else res.render('index', {persons:docs});
	})
})

// Display individual user data
app.get('/person/:_id', function(req, res){
person.find({ '_id'  :req.params._id },function(err,res){
	res.send('show');
}
	//mongoose.model('person').find({person:req.params._id, function(err, person){
		//res.send('person');
	//}});
});



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
