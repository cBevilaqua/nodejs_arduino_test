angular.module('Arduino', ['btford.socket-io'])
.run(function(socketService){
	socketService.on('connect', function(){
		console.log("socket connected");
	});

	socketService.on('disconnect', function(){
		console.log("socket disconnected");
		//connect();
	});
})
.controller('mainCtrl', function($scope, socketService){

	$scope.strobeSpeed = 0;

	$scope.ligar = function(){
		socketService.emit('ligar');
	};

	$scope.desligar = function(){
		socketService.emit('desligar');
	};

	$scope.$watch('strobeSpeed', function(oldVal, newVal){
		if($scope.strobeSpeed > 0){
			socketService.emit('strobe', 1000 - $scope.strobeSpeed);	
		}
	});


}).service('socketService', function(socketFactory){
 	return socketFactory({ioSocket: io('http://localhost:3000') });
});