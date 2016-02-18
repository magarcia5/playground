var appController = angular.module('appController', []);

appController.controller('MainCtrl', [
	'$scope',
	'posts',
	'auth',
function(
	$scope,
	posts,
	auth
){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.posts = posts.posts;
	$scope.addPost = function(){
		if($scope.title){
			posts.create({
				title: $scope.title,
				link: $scope.link,
			});
			$scope.title = '';
			$scope.link = '';
		}
	};

	$scope.upVote = function(post){
		posts.upvote(post);
	}

	$scope.downVote = function(post){
		posts.downVote(post);
	}
}]);

appController.controller('PostCtrl', [
	'$scope',
	'posts',
	'post',
	'auth',
function(
	$scope,
	posts,
	post,
	auth
){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.post = post;

	$scope.upVote = function(comment){
		posts.upvoteComment($scope.post, comment);
	}

	$scope.addComment = function(){
		if($scope.body === ''){ return; }
		posts.addComment($scope.post._id, {
			body: $scope.body,
			author: 'user'
		}).success(function(comment){
			// update view without reloading page, will persist when reloaded
			$scope.post.comments.push(comment);
		});
		$scope.body = '';
	}
}]);

appController.controller('AuthCtrl', [
	'$scope',
	'$state',
	'auth',
function(
	$scope,
	$state,
	auth
){
	$scope.user = {};

	$scope.register = function(){
		auth.register($scope.user).error(function(error){
			$scope.error = error;
		}).then(function(){
			$state.go('home');
		});
	};

	$scope.login = function(){
		auth.login($scope.user).error(function(error){
			$scope.error = error;
		}).then(function(){
			$state.go('home');
		});
	};
}]);

appController.controller('NavCtrl', [
	'$scope',
	'auth',
function(
	$scope,
	auth
){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logout;
}]);