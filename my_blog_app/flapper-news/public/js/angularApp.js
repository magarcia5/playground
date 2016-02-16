var app = angular.module('flapperNews', [
	'ui.router',
	'appController'
]);

app.factory('posts', [function(){
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
	return o;
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
		})
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostCtrl'
		});

	$urlRouterProvider.otherwise('home');
}]);