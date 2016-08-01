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
      db = $cordovaSQLite.openDB({
        name : "todolist.db",
        location: 'default'
      });
      $cordovaSQLite.execute(db,'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, priority INTEGER, deadline NUMERIC, description TEXT,created NUMERIC)');
    });
})
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('index',{
    url : '/',
    templateUrl : 'templates/index.html',
    controller : 'indexCtrl'
  })
  .state('doneTodos',{
    url : '/donetd',
    templateUrl : 'templates/doneTodos.html',
    controller : 'doneTodosCtrl'
  })
  .state('noneDoneTodos',{
    url : '/nonedonetd',
    templateUrl : 'templates/noneDoneTodos.html',
    controller : 'nonedoneTodosCtrl'
  })
  .state('todoDetails',{
    url : '/nonedonetd/:idTodo',
    templateUrl : 'templates/noneDoneTodos.html',
    controller : 'todoDetailsCtrl'
  });
  $urlRouterProvider.otherwise('/');
});

function getIcon(state){
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
        get
      }
});

app.controller("indexCtrl",function($scope,$stateParams,$ionicModal,$cordovaToast,DBLayer){
  // initalizing form values
  $scope.todo = {
    title : "",
    deadline : new Date(),
    priority : "0",
    remindmeAt : new Date(),
    description : ""
  }
  $scope.reminder = false;

  $scope.showReminder = function(){
        $scope.reminder = !$scope.reminder;
  }

  $ionicModal.fromTemplateUrl('templates/addTodoForm.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

  $scope.openAddForm = function(){
    $scope.modal.show();
  }
  $scope.closeAddForm = function(){
    $scope.modal.hide();
  }
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
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

  $scope.todos = [
    {
      title : 'Acheter le pin a mon retour',
      description : 'description todos 1',
      state : 0,
      icon : getIcon(0),
      deadline : 'mi-nuit',
      reminder : 'notify',
      priority : 0
    },
    {
      title : 'Todos 2',
      description : 'description todos 2',
      state : 1,
      icon : getIcon(1),
      deadline : '10',
      reminder : 'notify',
      priority : 0
    },
    {
      title : 'Todos 3',
      description : 'description todos 3',
      state : 2,
      icon : getIcon(2),
      deadline : '10',
      reminder : 'notify',
      priority : 0
    }];
}).controller("doneTodosCtrl",function($scope,$stateParams){

}).controller("nonedoneTodosCtrl",function($scope,$stateParams){

}).controller("todoDetailsCtrl",function($scope,$stateParams){

});
