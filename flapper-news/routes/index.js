var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

// retrieve all posts
router.get('/posts', function(req, res, next){
	// query all posts, next() is err handling function
	Post.find(function(err, posts){
		if(err){ return next(err); }
		res.json(posts);
	});
});

// add one post
router.post('/posts', auth, function(req, res, next){
	var post = new Post(req.body);
	post.author = req.payload.username;
	post.save(function(err, post){
		if(err){ return next(err); }
		res.json(post);
	});
});

router.param('post', function(req, res, next, id){
	var query = Post.findById(id);

	query.exec(function(err, post){
		if(err) { return next(err); }
		if(!post){ return next(new Error('can\'t find post')); }

		// returns id
		req.post = post;
		return next();
	});
});

router.param('comment', function(req, res, next, id){
	var query = Comment.findById(id);

	query.exec(function(err, comment){
		if(err){ return next(err); }
		if(!comment){ return next(new Error('No comment found for id ' + id)); }

		req.comment = comment;
		return next();
	})
})

router.get('/posts/:post', function(req, res){
	req.post.populate('comments', function(err, post){
		if(err){ return next(err); }
		res.json(post);
	})
});

router.put('/posts/:post/upvote', auth, function(req, res, next){
	var user = User.findOne({username: req.payload.username}, function(err, user){
		if(err){ return next(err); }
		var isInArray = user.votedOn.some(function (post) {
    		return post.equals(req.post._id);
		});
		if(!isInArray){
			req.post.upvote(function(err, post){
				user.votedOn.push(post);
				user.save(function(err, user){
					if(err){ return next(err); }
					res.json(post);
				});
			});
		} else {
			return res.status(400).json({message: 'You can only vote on a post once.'});
		}
	});
});

router.put('/posts/:post/downvote', auth, function(req, res, next){
	var user = User.findOne({username: req.payload.username}, function(err, user){
		if(err){ return next(err); }
		var isInArray = user.votedOn.some(function (post) {
    		return post.equals(req.post._id);
		});
		if(!isInArray){
			req.post.downvote(function(err, post){
				user.votedOn.push(post);
				user.save(function(err, user){
					if(err){ return next(err); }
					res.json(post);
				});
			});
		} else {
			return res.status(400).json({message: 'You can only vote on a post once.'});
		}
	});
});

router.post('/posts/:post/comments', auth, function(req, res, next){
	var comment = new Comment(req.body);
	comment.post = req.post;
	comment.author = req.payload.username;

	comment.save(function(err, comment){
		if(err){ return next(err); }
		// adding comment to post obj then saving
		req.post.comments.push(comment);
		req.post.save(function(err, post){
			if(err){ return next(err); }
			res.json(comment);
		});
	});
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next){
	req.comment.upvote(function(err, comment){
		if(err){ return next(err); }
		res.json(comment);
	});
});

// passport
router.post('/register', function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password);

	user.save(function(err){
		if(err){ return next(err); }
		return res.json({token: user.generateJWT()});
	});
});

router.post('/login', function(req, res, next){
	console.log(req);
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	passport.authenticate('local', function(err, user, info){
		if(err){ return next(err); }

		if(user){
			return res.json({token: user.generateJWT()});
		}
		else{
			return res.status(401).json(info);
		}
	})(req, res, next);
});

