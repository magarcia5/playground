var app = angular.module('flapperNews', [
	'ui.router',
	'appController'
]);

app.factory('posts', [
	'$http',
function(
	$http
){
	var o = {
		posts: [
			{
				title: "This is hilarious!", 
				link: "https://www.youtube.com/watch?v=SNYOEgMeSvM", 
				upvotes: 7,
				comments: [
					{author: 'Brad Paisley', body: 'I cant change the world, baby thats for sure', upvotes: 0},
					{author: 'Florida Georgia Line', body: 'If I told you I loved you would it make you want to stay?', upvotes: 0}
				]
			},
			{
				title: "Superbowl halftime show", 
				link: "https://www.youtube.com/watch?v=L_Hgh7sPDLM", 
				upvotes: 11,
				comments: [
					{author: 'Muse', body: 'You trick your lovers that youre wicked and divine', upvotes: 0},
					{author: 'Brett Eldredge', body: 'You make me crazy and I kinda like it', upvotes: 0}
				]
			}
		]
	}
	o.getAll = function(){
		return $http.get('/posts').success(function(data){
			angular.copy(data, o.posts);
		});
	};

	o.create = function(post){
		return $http.post('/posts', post).success(function(data){
			o.posts.push(data);
		})
	};

	o.upvote = function(post){
		return $http.put('/posts/' + post._id + '/upvote').success(function(data){
			post.upvotes += 1;
		});
	}

	o.get = function(id){
		return $http.get('posts/' + id).then(function(res){
			return res.data;
		});
	};

	o.addComment = function(id, comment){
		return $http.post('/posts/' + id + '/comments', comment);
	};

	o.upvoteComment = function(post, comment){
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
			.success(function(data){
				comment.upvotes += 1;
			})
	};
	return o;
}]);

app.factory('auth', [
	'$http',
	'$window',
function(
	$http,
	$window
){
	var auth = {};

	auth.saveToken = function(token){
		$window.localStorage['flapper-news-token'] = token;
	};

	auth.getToken = function(){
		return $window.localStorage['flapper-news-token'];
	};

	auth.isLoggedIn = function(){
		var token = auth.getToken();

		if(token){
			// don't ask
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else{
			return false;
		}
	};

	auth.currentUser = function(){
		if(auth.isLoggedIn()){
			var token = auth.getToken();

			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.username;
		}
	};

	auth.register = function(user){
		return $http.post('/register', user).success(function(data){
			auth.saveToken(data.token);
		});
	};

	auth.login = function(user){
		return $http.post('/login', user).success(function(data){
			auth.saveToken(data.token);
		});
	};

	auth.logout = function(){
		$window.localStorage.removeItem('flapper-news-token');
	};

	return auth;
}]);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
function(
	$stateProvider,
	$urlRouterProvider
){
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			// TODO: look up wtf this thing is
			resolve: {
				postDeferred: ['posts', function(posts){
					return posts.getAll();
				}]
			}
		})
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostCtrl',
			resolve: {
				post: ['$stateParams', 'posts', function($stateParams, posts){
					return posts.get($stateParams.id);
				}]
			}
		})
		.state('login', {
			url: '/login',
			templateUrl: '/login.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
					$state.go('home');
				}
			}]
		})
		.state('register', {
			url: '/register',
			templateUrl: '/register.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
					$state.go('home');
				}
			}]
		});

	$urlRouterProvider.otherwise('home');
}]);