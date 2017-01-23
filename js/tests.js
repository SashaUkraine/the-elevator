describe('Elevetor tests', function () {
	beforeEach(module('elevator'));
	describe('car module', function () {
		
		var $controller;
		beforeEach(inject(function(_$controller_) {
	        $controller = _$controller_;
	    }));
		
		it('should be active when on 2 floor with n equals 2', function () {
			var $scope = {};
			var $interval = function(){};
			var controller = $controller('ElevatorCtrl', {$scope: $scope, $interval: $interval});
			$scope.car.floor = 2;
			
			expect($scope.car.active(2)).toEqual(true);
		});
		it("should return status Empty ↓↓↓↓ when dir:-1, occupied:false", function () {
			var $scope = {};
			var $interval = function(){};
			var controller = $controller('ElevatorCtrl', {$scope: $scope, $interval: $interval});
			$scope.car.occupied = false;
			$scope.car.dir = -1;

			expect($scope.car.state()).toEqual("Empty ↓↓↓↓");
		})
		it('should be able to open when dir is 0 (stationary) and floor is 2', function () {
			var $scope = {};
			var $interval = function(){};
			var controller = $controller('ElevatorCtrl', {$scope: $scope, $interval: $interval});

			$scope.car.dir = 0;
			$scope.car.floor = 2;
			
			expect($scope.car.canOpen(2)).toEqual(true);
		})
		it('should be in 2 floor when car.floor is 1 and dir is +1', function () {
			var $scope = {};
			var $interval = function(){};
			var controller = $controller('ElevatorCtrl', {$scope: $scope, $interval: $interval});

			$scope.car.floor = 1;
			$scope.car.go(+1);
			
			expect($scope.car.floor).toEqual(2);
		})
	});

	describe('Controlling module', function () {
		
		var $controller;
		beforeEach(inject(function(_$controller_) {
	        $controller = _$controller_;
	    }));
		it('should return direection -1 when going form 2 to 1 floor', function () {
			var $scope = {};
			var $interval = function(){};
			var controller = $controller('ElevatorCtrl', {$scope: $scope, $interval: $interval});

			expect($scope.control.getDir(2, 1)).toEqual(-1);
		})
		it('should assign -1 direction to car when no input yet and car.floor is 4 and input floor is 3 ', function () {
			var $scope = {};
			var $interval = function(){};
			var controller = $controller('ElevatorCtrl', {$scope: $scope, $interval: $interval});

			$scope.car.floor = 4;
			$scope.control.callElevator(3);

			expect($scope.car.dir).toEqual(-1);
		})
		it('should return [1,2,3] when 3 stops added', function () {
			var $scope = {};
			var $interval = function(){};
			var controller = $controller('ElevatorCtrl', {$scope: $scope, $interval: $interval});

			$scope.control.callElevator(3);
			$scope.control.callElevator(1);
			$scope.control.callElevator(2);
			$scope.control.callElevator(4);

			expect($scope.control.route).toEqual([1,2,3,4]);
		})
		it('should clear route when stop is covered', function () {
			var $scope = {};
			var $interval = function(){};
			var controller = $controller('ElevatorCtrl', {$scope: $scope, $interval: $interval});

			$scope.car.floor = 0;
			$scope.car.dir = 1;
			$scope.control.route = [1];
			
			$scope.control.run();
			$scope.control.run();

			expect($scope.control.route).toEqual([]);
		})
		it('should be red when car is occupied', function () {
			var $scope = {};
			var $interval = function(){};
			var controller = $controller('ElevatorCtrl', {$scope: $scope, $interval: $interval});

			$scope.car.occupied = true;
			$scope.car.floor = 0;
			
			$scope.control.manageLights();
			  
			expect($scope.floors[0].light).toEqual("red");
		})
		it('should not move when inner door is opedned', function () {
			var $scope = {};
			var $interval = function(){};
			var controller = $controller('ElevatorCtrl', {$scope: $scope, $interval: $interval});

			$scope.car.open = true;
			$scope.car.floor = 0;

			$scope.control.callElevator(3);
			$scope.control.run();
			$scope.control.run();
			$scope.control.run();

			expect($scope.car.floor).toEqual(0);
		})
	});
});