// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
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
app.controller("indexCtrl",function($scope,$stateParams){
  $scope.addTodo = function(){
    console.log("yup");
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
