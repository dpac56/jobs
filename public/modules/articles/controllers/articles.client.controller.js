'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		 $scope.jobCategories = [
      {name:'Designer'},
      {name:'Developer'},
      {name:'Marketing'},
      {name:'Operations'},
      {name:'Sales'}
    ];

     $scope.jobTypes = [
      {name:'Full-time'},
      {name:'Part-time'},
      {name:'Internship'},
      {name:'Remote'},
    ];

    $scope.category = $scope.jobCategories[0];
    $scope.type = $scope.jobTypes[0];

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content,
				category: this.category.name,
				type: this.type.name
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
			console.log($scope.authentication.user.roles);
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);