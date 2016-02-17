var appController = angular.module('appController', []);

appController.controller('MainCtrl', [
	'$scope',
	'posts',
function(
	$scope,
	posts
){
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
}]);

appController.controller('PostCtrl', [
	'$scope',
	'posts',
	'post',
function(
	$scope,
	posts,
	post
){
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