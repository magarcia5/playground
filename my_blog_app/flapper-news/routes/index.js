var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

// retrieve all posts
router.get('/posts', function(req, res, next){
	// query all posts, next() is err handling function
	Post.find(function(err, posts){
		if(err){ return next(err); }
		res.json(posts);
	});
});

// add one post
router.post('/posts', function(req, res, next){
	var post = new Post(req.body);
	post.save(function(err, post){
		if(err){ return next(err); }
		res.json(post);
	});
});

route.param('post', function(req, res, next, id){
	var query = Post.findById(id);

	query.exec(function(err, post){
		if(err) { return next(err); }
		if(!post){ return next(new Error('can\'t find post')); }

		// returns id
		req.post = post;
		return next();
	});
});

router.get('/posts/:post', function(req, res){
	res.json(req.post);
});
