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
			$scope.posts.push({
				title: $scope.title, 
				link: $scope.link, 
				upvotes: 0,
				comments: [
					{author: 'Brad Paisley', body: 'I cant change the world, baby thats for sure', upvotes: 0},
					{author: 'Florida Georgia Line', body: 'If I told you I loved you would it make you want to stay?', upvotes: 0}
				]
			});
			$scope.title = '';
			$scope.link = '';
		}
	};

	$scope.upVote = function(post){
		console.log("Upvote?");
		post.upvotes += 1;
	}
}]);

appController.controller('PostCtrl', [
	'$scope',
	'$stateParams',
	'posts',
function(
	$scope,
	$stateParams,
	posts
){
	$scope.post = posts.posts[$stateParams.id];

	$scope.upVote = function(comment){
		comment.upvotes += 1;
	}

	$scope.addComment = function(){
		if($scope.body === ''){ return; }
		$scope.post.comments.push({
			body: $scope.body,
			author: 'user',
			upvotes: 0
		});
		$scope.body = '';
	}
}]);