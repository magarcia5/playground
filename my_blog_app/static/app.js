var app = angular.module('flapperNews', ['ui.router']);

app.factory('posts', [function(){
	var o = {
		posts: [
			{title: "This is hilarious!", link: "https://www.youtube.com/watch?v=SNYOEgMeSvM", upvotes: 7},
			{title: "Superbowl halftime show", link: "https://www.youtube.com/watch?v=L_Hgh7sPDLM", upvotes: 11}
		]
	}
	return o;
}]);

app.controller('MainCtrl', [
	'$scope',
	'posts',
function(
	$scope,
	posts
){
	$scope.test = 'Hello world!';
	$scope.posts = posts.posts;

	$scope.addPost = function(){
		if($scope.title){
			$scope.posts.push({title: $scope.title, link: $scope.link, upvotes: 0});
			$scope.title = '';
			$scope.link = '';
		}
	};

	$scope.upVote = function(post){
		post.upvotes += 1;
	}
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
			controller: 'MainCtrl'
		});
	$urlRouterProvider.otherwise('home');
}]);