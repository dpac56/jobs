'use strict';

(function() {
	// Jobs Controller Spec
	describe('JobsController', function() {
		// Initialize global variables
		var JobsController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Jobs controller.
			JobsController = $controller('JobsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one job object fetched from XHR', inject(function(Jobs) {
			// Create sample job using the Jobs service
			var sampleJob = new Jobs({
				title: 'An Job about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample jobs array that includes the new job
			var sampleJobs = [sampleJob];

			// Set GET response
			$httpBackend.expectGET('jobs').respond(sampleJobs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.jobs).toEqualData(sampleJobs);
		}));

		it('$scope.findOne() should create an array with one job object fetched from XHR using a jobId URL parameter', inject(function(Jobs) {
			// Define a sample job object
			var sampleJob = new Jobs({
				title: 'An Job about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.jobId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/jobs\/([0-9a-fA-F]{24})$/).respond(sampleJob);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.job).toEqualData(sampleJob);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Jobs) {
			// Create a sample job object
			var sampleJobPostData = new Jobs({
				title: 'An Job about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample job response
			var sampleJobResponse = new Jobs({
				_id: '525cf20451979dea2c000001',
				title: 'An Job about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Job about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('jobs', sampleJobPostData).respond(sampleJobResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the job was created
			expect($location.path()).toBe('/jobs/' + sampleJobResponse._id);
		}));

		it('$scope.update() should update a valid job', inject(function(Jobs) {
			// Define a sample job put data
			var sampleJobPutData = new Jobs({
				_id: '525cf20451979dea2c000001',
				title: 'An Job about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock job in scope
			scope.job = sampleJobPutData;

			// Set PUT response
			$httpBackend.expectPUT(/jobs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/jobs/' + sampleJobPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid jobId and remove the job from the scope', inject(function(Jobs) {
			// Create new job object
			var sampleJob = new Jobs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new jobs array and include the job
			scope.jobs = [sampleJob];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/jobs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleJob);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.jobs.length).toBe(0);
		}));
	});
}());