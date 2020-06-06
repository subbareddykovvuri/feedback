var app = angular.module('birthdayApp', []);
app.controller('birthdayController', function($scope,$http){

		$http({
		method:'GET',
		url:'/gettodaybirthday',

	}).then(function success(response){
		$scope.born=response.data;
	},function error(response){
		alert('error occured')
	})

		

  $scope.saveBirthday = function(birth){
  	
    $http({
      method : 'POST',
      url : '/postbirthday',
      data : $scope.birth
    }).then(function success(response){
    	
    	$scope.born.push(response.data);
		$scope.birth={};
		
    }, function error(response){
    	alert('Failed, Please try again');
    })
  }

    $scope.email=function(birth){
      $http({
        method:'GET',
        url:'/sendEmail',
        data:$scope.birth
      })
    }
    $scope.sms=function(){
      $http({
        method:'GET',
        url:'/sendSms'  
      })
    }


})

app.controller('birthdayController1', function($scope,$http){
	$http({
		method:'GET',
		url:'/getrecentbirthday',

	}).then(function success(response){
		$scope.born=response.data;
	},function error(response){
		alert('error occured')
	})
})