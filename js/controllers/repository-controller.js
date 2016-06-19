app.controller("RepositoriesController", function($scope, $http) {
  $scope.repositories = [
  ];
  $scope.loading = true;

   $http.get("http://localhost:5000/",  { cache: true})
       .success(function(res){
           $scope.repositories = res;
        })
        .catch(function(err) {
        })
        .finally(function() {
          $scope.loading = false;
        });
});

app.controller("RepositoryController", function($scope, $routeParams, $http) {
  $scope.repository_name = $routeParams.repository_name;
  $scope.loading = true;
  $http.get("http://localhost:5000/" + $routeParams.repository_name,  { cache: true})
      .success(function(res){
           $scope.changes = res;
        })
      .catch(function(err) {
      })
      .finally(function() {
        $scope.loading = false;
      });
});
