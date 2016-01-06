'use strict';

angular.module('MyApp', [
  'ionic',
  'firebase',
  'MyApp.services',
  'MyApp.directives',
  'MyApp.controllers'
])
.config(function($stateProvider, $urlRouterProvider) {
  var resolve = {
    auth: function($q, $timeout, Auth, User) {
      var defer = $q.defer();
      var state = this;

      Auth.getCurrentUser().then(function() {
        User.loadCurrentUser().then(function() {
          if (state.name === 'change-password') {
            defer.resolve();
          } else {
            if (User.hasChangedPassword()) {
              defer.resolve();
            } else {
              defer.reject('change-password');
            }
          }
        });
      }, function() {
        $timeout(function() { // See: http://stackoverflow.com/q/24945731/247243
          defer.reject('login');
        }, 250);
      });

      return defer.promise;
    }
  };

  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/sidemenu.html',
      controller: 'SideMenuCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignupCtrl'
    })
    
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      resolve: {
        didTutorial : function() {
          return window.localStorage.didTutorial;
        }
      }
     
    })
    .state('intro', {
      url: '/intro',
      templateUrl: 'templates/intro.html',
      controller: 'IntroCtrl'
    })

    .state('reset-password', {
      url: '/reset-password',
      templateUrl: 'templates/reset-password.html',
      controller: 'ResetPasswordCtrl'
    })
    .state('change-password', {
      url: '/change-password',
      templateUrl: 'templates/change-password.html',
      controller: 'ChangePasswordCtrl',
      resolve: resolve
    })
    .state('app.dashboard', {
      url: '/dashboard', 
      views: {
        menuContent: {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashboardCtrl',
          resolve: resolve
        }
      }
    })
    .state('app.about', {
      url: '/about', 
      views: {
        menuContent: {
          templateUrl: 'templates/about.html',
          controller: 'DashboardCtrl',
          resolve: resolve
        }
      }
    })
   .state('app.project', {
      url: '/project', 
      views: {
        menuContent: {
          templateUrl: 'templates/project.html',
          controller: 'DashboardCtrl',
          resolve: resolve
        }
      }
    })
   .state('app.contact', {
      url: '/contact', 
      views: {
        menuContent: {
          templateUrl: 'templates/contact.html',
          controller: 'DashboardCtrl',
          resolve: resolve
        }
      }
    });

  $urlRouterProvider.otherwise('/intro');
})
.run(function($rootScope, $state, $ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory 
    // bar above the keyboard for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, 
                                                 fromState, fromParams, error) {
      $state.go(error);
    });
  });
})
.constant('FIREBASE_ROOT', 'https://projectkalam.firebaseio.com/nextcloudcampus');

angular.module('MyApp.services', []);
angular.module('MyApp.directives', []);
angular.module('MyApp.controllers', []);
