var app=angular.module('myApp',[]);
app.controller('myController',['$scope','$http',function($scope,$http){
		//$scope.user=[];
	$http({
		method:'GET',
		url:'/getuser',

	}).then(function success(response){
		$scope.user=response.data;
	},function error(response){
		alert('error occured')
	})


	$scope.saveData=function(users){
		console.log($scope.users);
		$http({
			method:'POST',
			url:'/postuser',
			data:$scope.users
			
		}).then(function success(response){
			$scope.user.push(response.data);
			
			$scope.users={};
		}, function error(response){
			alert('error occured please try again');
		
		})
		

		    
	}

	/*$scope.editData=function($index){
	
		$scope.editUser=true
	
	}*/
     $scope.updateData=function(users){
   		$http({
		method:'PUT',
		url:'/updateUser/'+users._id,
		data:users



      }).then(function success(response){
		alert("edited successfully")
		$scope.editUser=false
	},function error(response){
		alert('error occured in recieving the data from backend')
	})
	}

	$scope.removeData=function(users){
		$http({
			method:'DELETE',
			url:'/removeuser/'+users._id
		}).then(function success(response){
			alert('removed succesfully')
			var index=$scope.user.indexOf(users);
			$scope.user.splice(index,1);

		},function error (response){
			alert('cant be removed plz try again later')

		})
	}
   
  

}])




/*var app=angular.module('myApp',[]);
app.controller('myController',function($scope){
	$scope.user=[];

	$scope.saveData=function(users){
		 $scope.user.push(users);
    	$scope.users = {};

    }

    $scope.removeData=function($index,users){
    	 $scope.user.splice($index,1);
    }



})*/

