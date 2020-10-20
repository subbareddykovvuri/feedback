var express = require('express');
var router = express.Router();

/*to connect between front end to backend we require (package)monk (middleware)*/
var monk=require('monk');
/* to access time*/
var moment =require('moment');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var request=require('request');
var Cryptr = require('cryptr');
var QRCode = require('qrcode');

var cryptr = new Cryptr('myTotalySecretKey');

var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname)
  }
})
 
var upload = multer({ storage: storage })
/*to create a database or connect to the existing database*/
var db=monk('localhost:27017/feedback');
/*to connect to the collection */
var col=db.get('user');

var signup=db.get('signup');

var col1=db.get('born');

var image=db.get('image');

var atha=db.get('atha');
var pedhamma=db.get('pedhamma');
/* GET home page. */

router.get('/home', function(req,res){
  if(req.session && req.session.user){
    console.log(req.session.user);
    res.locals.user = req.session.user
    res.render('index');
  }
  else{
    req.session.reset();
    res.redirect('/');
  }
});

router.get('/', function(req, res) {
	 res.render('login');
});

router.get('/signup', function(req, res) {
   res.render('signup');
});

router.get('/emailexist', function(req, res) {
   res.render('emailexist');
});

router.get('/image', function(req, res) {
  image.find({},function(err,docs){


   res.render('image',{'a':docs});
   })
});
router.get('/atha', function(req, res) {
  atha.find({},function(err,docs){


   res.render('atha',{'a':docs});
   })
});
router.get('/pedhamma', function(req, res) {
  pedhamma.find({},function(err,docs){


   res.render('pedhamma',{'a':docs});
   })
});
router.get('/qrcode', function(req, res) {
	 
	QRCode.toDataURL('subba', function (err, url) {
  	console.log(url);
  	res.render('qrcode',{'a':url});
})
});

router.get('/logout', function(req,res){
  req.session.reset();
  res.redirect('/');
});


router.get('/forgot', function(req, res) {
	 res.render('forgot');
});
router.get('/birthday', function(req, res) {
	 res.render('birthday');
});
router.get('/simpleinterest', function(req, res) {
   res.render('simpleinterest');
});

router.get('/getuser', function(req, res) {
	col.find({},function(err,docs){
		if(err){
			console.docs(err);
		}
		else{
		//console.log(docs);
		res.send(docs)
		}
	});
});
 

router.post('/postuser',function(req,res){
	//console.log(req.body);
	col.insert(req.body,function(err,docs){
		if(err){
			console.log(err);
		}
		else{
			//console.log(docs);
			res.send(docs);
		}
	})
})

router.delete('/removeuser/:id',function(req,res){
	console.log(req.params.id)
	col.remove({"_id":req.params.id},function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      //console.log(docs);
      res.send(docs);
    }
		
	});
});

router.put('/updateUser/:id',function(req,res){
	 console.log(req.body)
	col.update({"_id":req.params.id},{$set:req.body},function(err,docs){
		if(err){
			console.log(err)
		}
		else{
			res.send(docs);
		}

	})
})

//-------------------------------------signup-----------------------------------

router.post('/postsignup', function(req,res){
  var data = {
    name : req.body.name,
    email : req.body.email,
    password : cryptr.encrypt(req.body.password)
  }
  
  signup.findOne({'email':req.body.email},function(err,docs){
    if(docs==null){
      signup.insert(data, function(err,docs1){
        if (err){
          console.log(err);
        }
        else{
          res.send(docs1);
        }
      });
    }
    else{

      console.log('Email already existed');
      res.redirect('/signup');
    }
  });

});

router.post('/postlogin', function(req,res){
  var email1 = req.body.email;
  signup.find({'email':req.body.email},function(err,data){
  var password2 = cryptr.decrypt(data[0].password);
  var password1 = req.body.password;
  delete data[0].password;
  //console.log(data[0]);
  req.session.user = data[0];
  if(password1==password2){
    res.sendStatus(200);
  }
  else{
    res.sendStatus(500);
  }
  });
});

//-------------------------------OTP Email--------------------------------------
router.post('/postforgot', function(req,res){
  var email = req.body.email;
  var newpassword = randomstring.generate(7);
  
  signup.update({"email":email},{$set:{"password":newpassword}});

  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'subbareddy934@gmail.com',
    pass: 'subbareddy@3898'
  }
  });

  var mailOptions = {
    from: 'Subbareddy',
    to: email,
    subject: 'OTP',
    text: 'Your OTP is'+newpassword
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent');
      res.send(info);
    }
  });
});


//---------------------------------------------birthday mail----------------------------------

router.post('/postbirthday', function(req,res){
  //var bdate = moment(req.body.dob).format('DD-MM');
  //console.log(bdate);
  // var Time = moment().format('hh:mm:ss:a');
  // console.log(Time);
  var Date = moment().format('DD-MM');

  //console.log(Date);
  var data={
  	name:req.body.name,
	mobile:req.body.mobile,
	email:req.body.email,
	dob:moment(req.body.dob).format('DD-MM')
	

  }

  console.log(data.dob);
	col1.insert(data,function(err,docs){
		if(err){
			console.log(err);
		}
		else{
			//console.log(docs);
			res.send(docs);
		}
	})	
});


	
router.get('/gettodaybirthday', function(req, res) {
	var Date = moment().format('DD-MM');
	//console.log(Date)
	col1.find({"dob":Date},function(err,docs){
		if(err){
			console.docs(err);
		}
		else{
		console.log(docs);
		res.send(docs)
		}
	});
});

router.get('/getrecentbirthday', function(req, res) {
	var Date = moment().format('DD-MM');
	//console.log(Date)
	col1.find({"dob":{$ne:Date}},function(err,docs){
		if(err){
			console.docs(err);
		}
		else{
		console.log(docs);
		res.send(docs)
		}
	});
});



router.get('/sendEmail',function(req,res){
  var Date=moment().format('DD-MM');
  console.log(Date);
  console.log(data);
        
        
})

router.get('/sendSms',function(req,res,next){
	//var Date = moment().format('DD-MM');
	
	var options = { 
		method: 'POST',
	  url: 'http://alerts.adeeptechnologies.com/api/v4/?api_key=A3ca2502007ffe7f750f2ef5e91370064&method=sms&message=wish you many more happy retuns of the day,&to=6304544853&sender=ADITYA' 
	  };
	  request(options, function (error, response, body) {
	  if(error){
	    console.log('error');
	  }
	  else{
	  	console.log('sms sent');
	  }
    res.redirect('/birthday');
    });
})

//---------------------------------------image upload-------------------------------
router.post('/imageupload',upload.single('image'), function(req,res){
  console.log(req.file);
  image.insert({"image":req.file.originalname})
  res.redirect('/image');
});
router.post('/athaupload',upload.single('image'), function(req,res){
  console.log(req.file);
  atha.insert({"image":req.file.originalname})
  res.redirect('/atha');
});
router.post('/pedhammaupload',upload.single('image'), function(req,res){
  console.log(req.file);
  pedhamma.insert({"image":req.file.originalname})
  res.redirect('/pedhamma');
});


module.exports = router;


