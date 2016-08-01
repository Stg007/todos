// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','ngCordova']);
var db = null;
app.run(function($ionicPlatform,$cordovaSQLite) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
      // db = $cordovaSQLite.openDB({
      //   name : "todolist.db",
      //   location: 'default'
      // });
      // $cordovaSQLite.execute(db,'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, priority INTEGER, state BOOL DEFAULT 0,deadline NUMERIC, description TEXT,created NUMERIC)');
    });
})
.config(function($stateProvider, $urlRouterProvider){
  /*
  There is only one state (one view,one controller) to serve
  all the requests, the parameter [status] refers to the query
  params : 0 -> Home, All todos sorted by the creation date
  params : 1 -> done todos
  params : 2 -> urgent todos (none done but deadline is greater than now)
  params : 3 -> normal todos (none done but deadline is greater than now)
  params : 4 -> none done todos (where the deadline is lesser than now)
  ----------
  the second state handle the detailed view
  */
  $stateProvider
  .state('index',{
    url : '/',
    templateUrl : 'templates/index.html',
    params : {
      status : 0
    },
    controller : 'indexCtrl'
  })
  .state('todoDetails',{
    url : '/nonedonetd/:idTodo',
    templateUrl : 'templates/detailed.html',
    controller : 'todoDetailsCtrl'
  });
  $urlRouterProvider.otherwise('/');
});

function getIcon(state,deadline){
  switch (state) {
    case 0:
      return 'img/doneIcon.png';
    case 1:
      return 'img/pendingIcon.png';
    case 2:
      return 'img/notdoneIcon.png';
    default:
      return 'img/doneIcon.png';
  }
}

app.factory('DBLayer',function($cordovaSQLite){
  return {
        insertTodo : function(title,priority,deadline,description,created,cb){
           $cordovaSQLite.execute(db,'INSERT INTO todos (title, priority, deadline, description,created) VALUES (?,?,?,?)',[title,priority,deadline,description,created])
          .then(function(result) {
            cb({opState : true, message : 'Todo added sucessflly'});
          },function(error){
            cb({opState : false, message : 'Error : '+error });
          });
        },
        getAllTodos : function(cb){
          var query = 'select * from todos order by created';
          $cordovaSQLite.execute(db,query).then(function(res){
              cb({opState : true, results : res});
          }, function(err){
              cb({opState : false, results : null});
          });
        },
        getDoneTodos : function(){
          var query = 'select * from todos where state=1 order by created';
          $cordovaSQLite.execute(db,query).then(function(res){
                cb({opState : true, results : res});
          }, function(err){
            cb({opState : false, results : null});
          });
        },
        getUrgentTodos : function(){
          var query = 'select * from todos where state=0 AND priority=1 order by deadline';
          $cordovaSQLite.execute(db,query).then(function(res){
                cb({opState : true, results : res});
          }, function(err){
            cb({opState : false, results : null});
          });
        },
        getNoneDoneTodos : function(){
          var query = 'select * from todos where state=0 AND deadline<=NOW() order by created';
          $cordovaSQLite.execute(db,query).then(function(res){
                cb({opState : true, results : res});
          }, function(err){
            cb({opState : false, results : null});
          });
        },
        getNormalTodos : function(){
          var query = 'select * from todos where state=0 AND priority=0 order by deadline';
          $cordovaSQLite.execute(db,query).then(function(res){
                cb({opState : true, results : res});
          }, function(err){
            cb({opState : false, results : null});
          });
        }
      }
});

app.controller("indexCtrl",function($scope,$stateParams,$ionicModal,$cordovaToast,DBLayer,$ionicSideMenuDelegate){
  $scope.toggleLeft = function() {
    console.log('yup');
    $ionicSideMenuDelegate.toggleLeft();
  };
  // initalizing form values (for adding a new todo item)
  $scope.todo = {
    title : "",
    deadline : new Date(),
    priority : "0",
    remindmeAt : new Date(),
    description : ""
  }
  $scope.reminder = false;
  // used inside the form
  $scope.showReminder = function(){
        $scope.reminder = !$scope.reminder;
  }
  // Defining the modal to add a new todo item
  $ionicModal.fromTemplateUrl('templates/addTodoForm.html', function($ionicModal) {
        $scope.modal = $ionicModal;
  }, {
      scope: $scope,
      animation: 'slide-in-up'
  });

  $scope.openAddForm = function(){
    console.log('executed');
    $scope.modal.show();
  }
  $scope.closeAddForm = function(){
    $scope.modal.hide();
  }
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // end of the definition

  // used to add a new todo item
  $scope.addTodo = function(){
    // check title's validity
    if($scope.todo.title == undefined || $scope.todo.title.length<3){
      $cordovaToast.showLongBottom('Title is needed at least 3 alphabetes');
    }else if($scope.todo.deadline == undefined || Object.prototype.toString.call($scope.todo.deadline) !== "[object Date]" || isNaN($scope.todo.deadline.getTime())){
      $cordovaToast.showLongBottom('You need to define the deadline date time (time is optional)');
    }else if($scope.todo.priority == undefined){
      $cordovaToast.showLongBottom('You need to define a priority');
    }else if($scope.reminder==true && ($scope.todo.deadline == undefined || Object.prototype.toString.call($scope.todo.deadline) !== "[object Date]" || isNaN($scope.todo.deadline.getTime()))){
      $cordovaToast.showLongBottom('You need to define a date to reminde you');
    }else{
      // data is valid
      DBLayer.insertTodo($scope.todo.title,$scope.todo.priority,$scope.todo.deadline,$scope.todo.description,new Date(),function(result){
        $cordovaToast.showLongBottom(result.message);
        if(result.opState == true)
          $scope.closeAddForm();
      });
    }
  }

  // main instructions
  switch ($stateParams.status) {
    case 1:
      console.log('Done todos');
      DBLayer.getDoneTodos($scope.fillData);
      break;
    case 2:
      console.log('Urgent todos');
      DBLayer.getUrgentTodos($scope.fillData);
      break;
    case 3:
      console.log('Normal todos');
      DBLayer.getNormalTodos($scope.fillData);
      break;
    case 4:
      console.log('None todos');
      DBLayer.getNoneDoneTodos($scope.fillData);
      break;
    default:
      console.log('All');
      // DBLayer.getAllTodos($scope.fillData);
  }

  $scope.fillData = function(queryResult){
    $scope.todos = [];
    if(queryResult.opState == true && queryResult.results.row.length>0){
        for (var i = 0; i < queryResult.results.rows.length; i++) {
          $scope.todos.push({
            title : queryResult.results.rows.item(i).title,
            description : queryResult.results.rows.item(i).description,
            state : queryResult.results.rows.item(i).state,
            icon : getIcon(queryResult.results.rows.item(i).state,queryResult.results.rows.item(i).deadline),
            deadline : queryResult.results.rows.item(i).deadline,
            reminder : '',
            priority : queryResult.results.rows.item(i).priority
          });
        }
    }
  }

  // $scope.todos = [
  //   {
  //     title : 'Acheter le pin a mon retour',
  //     description : 'description todos 1',
  //     state : 0,
  //     icon : getIcon(0),
  //     deadline : 'mi-nuit',
  //     reminder : 'notify',
  //     priority : 0
  //   },
  //   {
  //     title : 'Todos 2',
  //     description : 'description todos 2',
  //     state : 1,
  //     icon : getIcon(1),
  //     deadline : '10',
  //     reminder : 'notify',
  //     priority : 0
  //   },
  //   {
  //     title : 'Todos 3',
  //     description : 'description todos 3',
  //     state : 2,
  //     icon : getIcon(2),
  //     deadline : '10',
  //     reminder : 'notify',
  //     priority : 0
  //   }];
}).controller("todoDetailsCtrl",function($scope,$stateParams){

});
