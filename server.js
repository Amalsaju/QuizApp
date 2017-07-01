
const express = require('express')
const app = express()

var Datastore =require('nedb')
var db = new Datastore({filename:'store.db', autoload:true});

var session = require('express-session');
var sess;

app.use(session({
    secret: "secret",
    name: "cookie_name",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));



app.set('port',process.env.PORT||5000)

app.use(express.static('public'));
app.set('view engine', 'ejs');
var ejs = require('ejs');

app.get('/home', function (req, res) {
	console.log(__dirname);
	res.render('Home');
  })

app.get('/contactUs', function (req, res) {
	res.render('ContactUs')
  })

app.get('/login', function (req, res) {
	sess = req.session;
	if(sess.email) {
		var person ={
			"email":sess.email
		}
		db.find(person,function (err,result) {
			res.render('Profile',{results:result});
		})
	}else{
		res.render('Login')
	}
 })

app.get('/loginSubmit', function(req, res){
	sess = req.session;

	var userEmail = req.query.email;
	var userPassword = req.query.password;

	sess.email = userEmail;
	
	var person = {

		"email":userEmail,
		"password":userPassword
	}
	
	db.find(person,function(err,result){
		
		if(result.length>0){
			res.render('Profile',{results:result});
		}else{
			res.render('Login');
		}
	})
})

app.get('/Profile',function(req,res){
	sess = req.session;
	var userEmail = req.query.email;
	console.log(sess.email);
	if(sess.email) {
		var person ={
			"email":sess.email
		}
		db.find(person,function (err,result) {
			res.render('Profile',{results:result});
		})
	}else{
		res.render('Login')
	}
})

app.get('/showDB',function(req,res){
	db.find({},function(err,result){
		console.log(result);
	})
})
app.get('/removeDB',function(req,res){
	db.remove({}, { multi: true }, function (err, numRemoved) {
		console.log(numRemoved);
	});
})

app.get('/signUpSubmit', function(req, res){

	sess = req.session;

	var userFirstName = req.query.firstName;
	var userSecondName = req.query.secondName;
	var userEmail = req.query.email;
	var userPassword = req.query.password;
	var userMobile = req.query.mobile;
	
	sess.email = userEmail;

	var person = {	

		"firstName":userFirstName,
		"secondName":userSecondName,
		"email":userEmail,
		"password":userPassword,
		"mobile":userMobile
	}
	db.find(person,function(err, result){
		if(result.length>0){
			res.render("SignUp");
		}else{
			db.insert(person,function(err,data){
				console.log(data,"Insertion Success");
			})
			db.find(person,function(err, record){
				res.render('Profile',{results:record});
			})
		}
	})

})

app.get('/signUp', function (req, res) {
	sess = req.session;
	if(session.email) {
		var person ={
			"email":sess.email
		}
		db.find(person,function (err,result) {
			res.render('Profile',{results:result});
		})
	}else{
		res.render('SignUp')
	}
}) 

app.get('/logout',function(req,res){
	req.session.destroy(function(err) {
    	if(err) {
	    	console.log(err);
	  	} else {
	    	res.redirect('/Home');
	  	}
	})
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port 5000!')
});