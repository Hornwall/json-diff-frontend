app.controller("ViewDiffController", function($scope, $routeParams, $http){
  $scope.repository_name = $routeParams.repository_name
  $scope.file_name = $routeParams.file_name
  $scope.loading_current = true;

  $scope.commit_changed = function(commit) {
    load_compare_file($scope, $http, $routeParams.file_name, $routeParams.repository_name, commit.step);
  };


  get_commits($scope, $http, $routeParams.repository_name, 1);

  $http.get("http://localhost:5000/" + $routeParams.repository_name + "/files/" + $routeParams.file_name,  { cache: true})
    .success(function(res){
      $scope.current = res;
      $("#current_json").jsonViewer(res); 
    })
    .catch(function(err) {
    })
    .finally(function() {
      display_diff($scope);
      $scope.loading_current = false;
    });

    load_compare_file($scope, $http, $routeParams.file_name, $routeParams.repository_name, 1);
});


function load_compare_file($scope, $http, file_name, repository_name, step) {
  $scope.loading_old = true;
  $("#old_json").empty();
  $http.get("http://localhost:5000/" + repository_name + "/files/" + file_name + "?steps=" + step,  { cache: true})
    .success(function(res){
      $scope.old = res;
      $("#old_json").jsonViewer(res);
    })
    .catch(function(err) {
    })
    .finally(function() {
      display_diff($scope);
      $scope.loading_old = false;
    });
}

function display_diff(scope) {
  if(scope.current && scope.old) {
    var old = difflib.stringAsLines(JSON.stringify(scope.old, null, 4))
    var current = difflib.stringAsLines(JSON.stringify(scope.current, null, 4))

    var sm = new difflib.SequenceMatcher(old, current);
    var opcodes = sm.get_opcodes();

    $("div#diff").empty();

    $("div#diff").append(diffview.buildView({
      baseTextLines: old,
      newTextLines: current,
      opcodes: opcodes,
      baseTextName: "Förra",
      newTextName: "Nuvarande",
      viewType: 1
    }));
  }
}
