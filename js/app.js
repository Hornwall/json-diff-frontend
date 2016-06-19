var app = angular.module("app", ["ngRoute", "ngCookies"]);


app.config( function($routeProvider) {
      $routeProvider.when("/", {
        templateUrl: "templates/repositories.html",
        controller: "RepositoriesController"
      })
      .when("/:repository_name", {
        templateUrl: "templates/repository.html",
        controller: "RepositoryController"
      })
      .when("/:repository_name/diff/:file_name", {
        templateUrl: "templates/diff.html",
        controller: "ViewDiffController"
      })
      .when("/:repository_name/files/:file_name", {
        templateUrl: "templates/file.html",
        controller: "ViewFileController"
      })
      .when("/:repository_name/files", {
        templateUrl: "templates/files.html",
        controller: "ViewFilesController"
      });
    }
  );

 
function get_commits($scope, $http, repository_name, step) {
  $http.get("http://localhost:5000/" + repository_name + "/commits", {cache: true})
    .success(function(res) {
      $scope.commits = res;
      $scope.commit = res[step];
    }).catch(function(err){
    });
}
