var
  html          = document.getElementsByTagName('html')[0],
  shortMethods  = require('short-methods'),
  pkg           = require('./package'),

  init = function init() {
    var
      file,
      karma = window && window.__karma__,
      files = karma && karma.files,

      karmaRequirejsConfig = {
        'baseUrl' : '/base/js/client'
      },

      // Workaround so, r.js ignores it on minifaction.
      karmaDeps = ['../lib/angular-mocks/angular-mocks'],

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
      'baseUrl': '/js/client',

      'urlArgs' : function () {
        return '?' + Math.random().toString(36).slice(2);
      },

      'paths' : {
        'angular'             : '../lib/angular/angular',
        'angularCookies'      : '../lib/angular-cookies/angular-cookies',
        'angularRoute'        : '../lib/angular-route/angular-route',
        'angularLocalStorage' : '../lib/angular-local-storage/dist/angular-local-storage'
      },

      'shim' : {
        'angular'  :{
          'exports' : 'angular'
        },

        'angularCookies' : {
          'deps'    : ['angular'],
          'exports' : 'angularCookies'
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

    define('pkg', function () {
      return pkg;
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
      'angularCookies',
      'angularRoute',
      'angularLocalStorage',
      'constant/route-config',
      'controller/about-controller',
      'controller/app-controller',
      'controller/data-controller',
      'controller/register-controller',
      'controller/statistic-controller',
      'directive/help-directive',
      'factory/debug-service',
      'factory/finance-service',
      'factory/setting-service',
      'factory/storage-service',
      'factory/time-service'
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

      shortMethods(true);

      angular.bootstrap(html, ['app']);

      onRequireJsFinished();
    });
  };

window.onload = init;
