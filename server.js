
const express = require('express')
const app = express()

var Datastore =require('nedb')
var db = new Datastore({filename:'store.db', autoload:true});
var quiz_db = new Datastore({filename:'quiz.db', autoload:true});
var answers_db = new Datastore({filename:'answers.db', autoload:true});

var session = require('express-session');
var sharedSecretKey = 'yoursecret';
var NedbStore = require('nedb-session-store')(session);
var sess;
 
app.use(
  session({
    secret: sharedSecretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000   // e.g. 1 year 
    },
    store: new NedbStore({
      filename: 'path_to_nedb_persistence_file.db'
    })
  })
);


app.set('port',process.env.PORT||5000)

app.use(express.static('public'));
app.set('view engine', 'ejs');
var ejs = require('ejs');

app.get('/home', function (req, res) {
	console.log(__dirname);
	res.render('Home');
  })
app.get('/', function (req, res) {
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
	quiz_db.find({},function(err,result){
		console.log(result);
	})
})
app.get('/removeDB',function(req,res){
	answers_db.remove({}, { multi: true }, function (err, numRemoved) {
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
		res.render('SignUp');
}) 


app.get('/startQuiz',function(req,res){
	sess = req.session;
	if(req.session){
		var person ={
			"email":sess.email
		}
		db.find(person,function (err,result) {
			res.render('Levels');
		})
	}else{
		res.render('Login');
	}
})

app.get('/admin',function(req,res){
	res.render('Admin');
})

app.get('/insertQuiz',function (req,res) {
	var questionNumber = req.query.questionId;
	var question = req.query.question;
	var option1 = req.query.option1;
	var option2 = req.query.option2;
	var option3 = req.query.option3;
	var option4 = req.query.option4;
	var correctAnswer = req.query.correctAnswer;

	var quiz = {
		"questionNumber":questionNumber,
		"question":question,
		"option1":option1,
		"option2":option2,
		"option3":option3,
		"option4":option4
	}

	var answers = {
		"correctAnswer":correctAnswer
	}

	quiz_db.insert(quiz,function(err,data){
		answers_db.insert(answers,function(err,data){
			res.render('Admin');
		})
	})
})

app.get('/quiz',function (req,res) {
	quiz_db.find({},function (err,result) {
		console.log(result);
		res.render('Quiz',{results:result})
	})
})

app.get('/CheckQuiz',function(req,res){
	var c = 0;

	var correctAnswer0 = req.query.correctAnswer0;
	var correctAnswer1 = req.query.correctAnswer1;
	var correctAnswer2 = req.query.correctAnswer2;
	var correctAnswer3 = req.query.correctAnswer3;
	var correctAnswer4 = req.query.correctAnswer4;
	var correctAnswer5 = req.query.correctAnswer5;
	var correctAnswer6 = req.query.correctAnswer6;
	var correctAnswer7 = req.query.correctAnswer7;
	var correctAnswer8 = req.query.correctAnswer8;
	var correctAnswer9 = req.query.correctAnswer9;

		var answers = {
			"correctAnswer":correctAnswer0,
		}
		answers_db.find(answers,function(err,result){
			if(result.length>0){
				c=c+1;
				console.log(c,result);
			}
		})

		var answers = {
			"correctAnswer":correctAnswer1,
		}
		answers_db.find(answers,function(err,result){
			if(result.length>0){
				c=c+1;
				console.log(c,result);
			}
		})
		var answers = {
			"correctAnswer":correctAnswer2,
		}
		answers_db.find(answers,function(err,result){
			if(result.length>0){
				c=c+1;
				console.log(c,result);
			}
		})
		var answers = {
			"correctAnswer":correctAnswer3,
		}
		answers_db.find(answers,function(err,result){
			if(result.length>0){
				c=c+1;
				console.log(c,result);
			}
		})

		var answers = {
			"correctAnswer":correctAnswer4,
		}
		answers_db.find(answers,function(err,result){
			if(result.length>0){
				c=c+1;
				console.log(c,result);
			}
		})

		var answers = {
			"correctAnswer":correctAnswer5,
		}
		answers_db.find(answers,function(err,result){
			if(result.length>0){
				c=c+1;
				console.log(c,result);
			}
		})

		var answers = {
			"correctAnswer":correctAnswer6,
		}
		answers_db.find(answers,function(err,result){
			if(result.length>0){
				c=c+1;
				console.log(c,result);
			}
		})

		var answers = {
			"correctAnswer":correctAnswer7,
		}
		answers_db.find(answers,function(err,result){
			if(result.length>0){
				c=c+1;
				console.log(c,result);
			}
		})

		var answers = {
			"correctAnswer":correctAnswer8,
		}
		answers_db.find(answers,function(err,result){
			if(result.length>0){
				c=c+1;
				console.log(c,result);
			}
		})

		var answers = {
			"correctAnswer":correctAnswer9,
		}
		answers_db.find(answers,function(err,result){
			if(result.length>0){
				c=c+1;
				console.log(c,result);
			}
			res.render('Marks',{res:c});

		})
})

app.get('/quizLevels',function(req,res){
	sess = req.session;
	res.render('Levels');
})

app.get('/takeQuizEasy',function (req,res) {
	sess = req.session;
	quiz_db.find({},function (err,result) {
		res.render('Quiz-Easy',{results:result})
	})
})

app.get('/takeQuizMedium',function (req,res) {
	sess = req.session;
	quiz_db.find({},function (err,result) {
		console.log(result);
		res.render('Quiz-Medium',{results:result})
	})
})

app.get('/takeQuizHard',function (req,res) {
	sess =req.session;
	quiz_db.find({},function (err,result) {
		console.log(result);
		res.render('Quiz-Hard',{results:result})
	})
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