angular.module('users').controller('ListCandidatesController', ['$scope', 'Candidates', '$stateParams',
	function($scope, Candidates, $stateParams) {
		$scope.getCandidates = function(){
			$scope.users = Candidates.query();
			
		}

		$scope.findOne = function() {
			// console.log($stateParams.candidateId);
			$scope.user = Candidates.get({
				userId: $stateParams.candidateId
			});
		};


	}
]);
