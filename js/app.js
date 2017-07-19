fs = require("fs")
var woolfApp = angular.module('woolfApp', ['ui.router'])

woolfApp.config(['$stateProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('root', {
    url: '',
    templateUrl: 'views/default.html'
  }).state('view', {
    url: '/view',
    templateUrl: 'views/view.html',
    controller: 'viewController'
  }).state('edit', {
    url: '/edit',
    templateUrl: 'views/edit.html',
    controller: 'editController'
  }).state('configure', {
    url: '/configure',
    templateUrl: 'views/configure.html',
    controller: 'configureController'
  });
}]);

woolfApp.controller('viewController', function viewController($scope, $state, $rootScope) {
  $scope.goto = function(st) {
    $state.go(st);
  };
  $("#text-display").html(markdown.compile($rootScope.global.buffer));
  $('#text-display').find('*').css('-webkit-user-select', 'text');
});

woolfApp.controller('editController', function editController($scope, $state, $rootScope) {
  $scope.goto = function(st) {
    $state.go(st);
  };
  $('#text-edit').on('input propertychange paste', function() {
    fs.writeFile(path + "/" + $rootScope.global.current_file + ".log.md", $('#text-edit').val(), function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Automatically Saving Files...");
    });
  });
});

woolfApp.controller('configureController', function configureController($scope) {
  const remote = require('electron').remote;
  const app = remote.app;
  var basepath = app.getPath('userData');

  $scope.storagePath = basepath + "/log"
  fs.stat(basepath + "/config.json", function(err, stat) {
    if (err == null) {
      console.log('Configuration file exists.');
      fs.readFile(basepath + "/config.json", function(err, data) {
        config = JSON.parse(data);
        $scope.storagePath = config.storagePath;
        $scope.$apply();
      });
    } else if (err.code == 'ENOENT') {
      console.log('Configuration file not present.')
    } else {
      console.log('Unexpected error occured.');
    }
  });

  $scope.save = function() {
    configArray = $("#config").serializeArray();
    configObject = utility.objectifyForm(configArray);
    configString = JSON.stringify(configObject);
    fs.writeFile(basepath + "/config.json", configString, function(err, data) {
      if (err) {
        console.log("The configuration file fails to save.");
      } else {
        $(".alert-success").html("<strong>Success!</strong> Indicates a successful or positive action");
        $(".alert-success").show();
        initialize(configObject.storagePath, $scope.$parent);
        //$scope.$parent.$apply();
      }
    });
  }

  $scope.selectDirectory = function() {
    const {dialog} = require('electron').remote
    $("input[name='storagePath']").val(dialog.showOpenDialog({
        properties: ['openDirectory']
    }));
  }
});


function initialize(path, $scope) {
  try {
    stats = fs.lstatSync(path);
    if (!stats.isDirectory()) {
      fs.mkdirSync(path);
    }
  } catch (e) {
    fs.mkdirSync(path);
  }

  today_str = utility.getDateString();
  fs.stat(path + "/" + today_str + ".log.md", function(err, stat) {
    if (err == null) {
      console.log('File exists');
    } else if (err.code == 'ENOENT') {
      fs.mkdirSync(path + "/" + today_str);
      fs.writeFile(path + "/" + today_str + ".log.md", "", function(err) {
        initialize(path, $scope);
      });
    } else {
      console.log('Some other error: ', err.code);
    }
  });

  // Load Woolf with journal entries.
  fs.readdir(path, function(err, items) {
    // Sort file names (which are essentially date
    // strings) such that later dates appear
    // first.
    items.sort(function(a, b) {
      _a = a.replace(".log.md", "").split('-');
      _b = b.replace(".log.md", "").split('-');
      _a = [_a[2], _a[0], _a[1]].join("");
      _b = [_b[2], _b[0], _b[1]].join("");
      return _a > _b ? -1 : _a < _b ? 1 : 0;
    });
    // Postprocess file names for better
    // readability.
    items = items.filter(function(fn) {
      return fn.includes(".log.md");
    });
    items = items.map(function(fn) {
      return fn.replace(".log.md", "");
    })
    $scope.files = items;
    $scope.$apply();
  });
}

woolfApp.controller('woolfController', function woolfController($scope, $state, $rootScope) {

  $scope.goto = function(st) {
    $state.go(st);
  };

  const remote = require('electron').remote;
  const app = remote.app;
  var basepath = app.getPath('userData');

  fs.stat(basepath + "/config.json", function(err, stat) {
    if (err == null) {
      console.log('Configuration file exists.');
      fs.readFile(basepath + "/config.json", function(err, data) {
        config = JSON.parse(data);
        path = config.storagePath;
        initialize(path, $scope);
      });
    } else if (err.code == 'ENOENT') {
      console.log("No config file is present");
      $state.go("configure");
      return;
    } else {
      console.log('Unexpected error occured.');
    }
  });

  // var sqlite3 = require('sqlite3').verbose();
  // var db = {};

  // fs.stat(basepath + "/Woolf.db", function(err, stat) {
  //   if (err.code == 'ENOENT') {
  //     db = new sqlite3.Database(basepath + "/Woolf.db");
  //     db.serialize(function() {
  //       db.run("CREATE TABLE `` (`name`  TEXT,`text`  TEXT);");
  //     });
  //   }
  //   db = new sqlite3.Database(basepath + "/Woolf.db");
  // }

  // db.serialize(function() {
  //   db.run("CREATE TABLE lorem (info TEXT)");

  //   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  //   for (var i = 0; i < 10; i++) {
  //       stmt.run("Ipsum " + i);
  //   }
  //   stmt.finalize();

  //   db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
  //       console.log(row.id + ": " + row.info);
  //   });
  // });

  // Respond to click on file entries
  $scope.loadFile = function(file) {
    $scope.selectedFileName = file;
    $(this).addClass("active");
    fs.readFile(path + "/" + file + ".log.md", 'utf8', function(err, data) {
      $state.go("view");
      $("#text-display").html(markdown.compile(data));
      $('#text-display').find('*').css('-webkit-user-select', 'text');
      $rootScope.global = {
        buffer: data,
        current_file: file
      };
      $rootScope.$apply();
    });
  };

  $scope.isFileNameSelected = function(fileName) {
    return $scope.selectedFileName === fileName;
  }
});
