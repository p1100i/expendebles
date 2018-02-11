/* globals
  document,
  window
*/
var
  diClient  = require('./dimodule/di-client'),
  html      = document.getElementsByTagName('html')[0],

  init = function init() {
    var
      file,
      karma = window && window.__karma__,
      files = karma && karma.files,

      karmaRequirejsConfig = {
        'baseUrl' : '/base/js/rmodule'
      },

      // Workaround so, r.js ignores it on minifaction.
      karmaDeps = ['../lib/angular-mocks'],

      onRequireJsFinished = function onRequireJsFinished() {
        if (karma) {
          requirejs(karmaDeps, function () {
            karma.start();
          });
        }
      };

    for (file in files) {
      if (/absolute.*spec\.js$/g.test(file)) {
        karmaDeps.push(file);
      }
    }

    requirejs.config({
      'baseUrl': '/js/rmodule',

      'urlArgs' : function () {
        return '?' + Math.random().toString(36).slice(2);
      },

      'paths' : {
        'angular'             : '../lib/angular',
        'angularRoute'        : '../lib/angular-route',
        'angularLocalStorage' : '../lib/angular-local-storage',
        'socketIo'            : '../lib/socket.io'
      },

      'shim' : {
        'angular'  :{
          'exports' : 'angular'
        },

        'angularRoute' : {
          'deps'    : ['angular'],
          'exports' : 'angularRoute'
        },

        'angularLocalStorage' : {
          'deps'    : ['angular'],
          'exports' : 'angularLocalStorage'
        }
      }

    });

    if (karma) {
      requirejs.config(karmaRequirejsConfig);
    }

    define('di', function defineDi() {
      return diClient;
    });

    define('build', function () {
      //
      // Strings gets replaced on build time, by grunt.
      //
      return {
        'date'    : '@@BUILD_DATE',
        'commit'  : '@@BUILD_COMMIT'
      };
    });

    //
    // List all of your services/constants/controllers/etc, here.
    //
    requirejs([
      'angular',
      'app',
      'angularRoute',
      'angularLocalStorage',
      'socketIo',
      'constant/route-config',
      'controller/about-controller',
      'controller/app-controller',
      'controller/help-controller',
      'directive/help-directive',
      'factory/setting-service'
    ], function (angular, app) {
      app.config(['$httpProvider', '$routeProvider', 'routeConfig', 'localStorageServiceProvider', function ($httpProvider, $routeProvider, routeConfig, localStorageServiceProvider) {
        var
          i,
          path,
          paths,
          route,
          controller,
          routes = routeConfig.routes;

        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

        localStorageServiceProvider.setPrefix('app');

        for (controller in routes) {
          route = routes[controller];
          paths = route.paths;

          for (i = 0; i < paths.length; i++) {
            path = paths[i];

            $routeProvider.when(path, {
              'controller'      : controller,
              'controllerAs'    : route.controllerAs,
              'templateUrl'     : route.templateUrl,
              'reloadOnSearch'  : false
            });
          }
        }

        $routeProvider.otherwise({
          redirectTo : '/'
        });
      }]);

      window.angularTemplates(app);

      angular.bootstrap(html, ['app']);

      onRequireJsFinished();
    });
  };

window.onload = init;
