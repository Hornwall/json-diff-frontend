app.controller("ViewFilesController", function($scope, $routeParams, $http, $cookies) {
  $scope.repository_name = $routeParams.repository_name;
  $scope.loading = true;
  $scope.search_term = $cookies.get("search_term") || ""

  var search_timeout = null;

  $scope.search_term_changed = function(search_term) {
    $scope.loading = true;
    $scope.files = [];

    if(search_timeout) {
      clearTimeout(search_timeout)
    }

    search_timeout = setTimeout(function(){
      search($scope, $http, search_term, $routeParams.repository_name);
      $cookies.put("search_term", search_term);
    }, 1000);
  };

  search($scope, $http, $scope.search_term, $routeParams.repository_name);
});


app.controller("ViewFileController", function($scope, $routeParams, $http){
  $scope.repository_name = $routeParams.repository_name;
  $scope.file_name = $routeParams.file_name;
  $scope.related_files = get_related_file_names($routeParams.file_name);

  $scope.commit_changed = function(commit) {
    load_file($scope, $http, $routeParams.file_name, $routeParams.repository_name, commit.step);
  };


  load_file($scope, $http, $routeParams.file_name, $routeParams.repository_name, $scope.commit? $scope.commit.step : 0);
  get_commits($scope, $http, $routeParams.repository_name, 0);
});

function load_file($scope, $http, file_name, repository_name, step) {
  $scope.loading = true;
  $http.get("http://localhost:5000/" + repository_name + "/files/" + file_name + "?steps=" + step,  { cache: true})
    .success(function(res){
      $scope.current = res;
      get_atc_codes_for_substance(res, $http, $scope, repository_name, step);
      get_narcotic_class(res, $http, $scope, repository_name, step);
      $("#file_json").jsonViewer(res); 
    })
    .catch(function(err) {
    })
    .finally(function() {
      $scope.loading = false;
    });
}


function get_atc_codes_for_substance(substance, $http, $scope, repository_name, step) {
  var substance_atc_codes = [];

  if(substance.substance_codes) {
    for(i = 0; i < substance.substance_codes.length; i++) {
      if(substance.substance_codes[i].code_system_cv.term_id == "100000123556"){
        substance_atc_codes.push(substance.substance_codes[i].code);
      }
    }

    $http.get("http://localhost:5000/" + repository_name + "/files/atc-code-lx.json?steps=" + step)
      .success(function(res) {
        $scope.atc = [];
        for(i = 0; i < res.length; i++) {
          if($.inArray(res[i].value, substance_atc_codes) > -1) {
            $scope.atc.push(res[i]);
          }
        }
        $scope.has_atc = $scope.atc.length > 0;

      }).catch(function(err){
      });
  }
}

function get_narcotic_class(substance, $http, $scope, repository_name, step) {
  if(substance.narcotic_class != null) {
    $http.get("http://localhost:5000/" + repository_name + "/files/narcclass-lx.json?steps=" + step)
      .success(function(res) {
        for(i = 0; i < res.length; i++) {
          if(res[i].value == substance.narcotic_class) {
            $scope.narc_class = res[i]
          }
        }
        $scope.has_narc_class = true;

      }).catch(function(err){
      });
  }
}

function get_other_file_name(name) {
  if(name.indexOf("_other") == -1) {
    var split = name.split(".");
    return split[0] + "_other." + split[1];
  } else {
    var split = name.split("_other");
    return split[0] + split[1];
  }
}

function get_related_file_names(name) {
  var file_names = [];
  if(name.indexOf("ID") >= 0){
    file_names.push(get_other_file_name(name));
    if(name.indexOf("_other") == -1) {
      file_names.push("atc-code-lx.json");
    } else {
      file_names.push("narcclass-lx.json");
    }
  }
  return file_names;
}

function search($scope, $http, search_term, repository_name) {
  $http.get("http://localhost:5000/" + repository_name + "/files?search_term=" + search_term,  { cache: true})
    .success(function(res){
      $scope.files = res;
    })
    .catch(function(err) {
    })
    .finally(function() {
      $scope.loading = false;
    });
}

