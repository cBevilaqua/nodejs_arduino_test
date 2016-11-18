socket = io.connect('http://localhost:3000');

angular.module('Arduino', [])
.controller('mainCtrl', function($scope){

	$scope.strobeSpeed = 0;

	$scope.ligar = function(){
		console.log("ligar");
		socket.emit('ligar');
	};

	$scope.desligar = function(){
		socket.emit('desligar');
	};

	$scope.$watch('strobeSpeed', function(oldVal, newVal){
		if($scope.strobeSpeed > 0){
			socket.emit('strobe', 1000 - $scope.strobeSpeed);	
		}
	});


});