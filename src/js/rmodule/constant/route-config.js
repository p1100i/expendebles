define(['app'], function (app) {
  var
    routes = {},

    createEntityConfig = function createEntityConfig(controller, controllerAs, template, urls) {
      return {
        'controller'    : controller,
        'controllerAs'  : controllerAs,
        'template'      : template,
        'urls'          : urls
      };
    },

    appendRoute = function appendRoute(controller, controllerAs, templateUrl, itemType, paths) {
      routes[controller] = {
        'controller'    : controller,
        'controllerAs'  : controllerAs,
        'templateUrl'   : templateUrl,
        'itemType'      : itemType,
        'paths'         : paths
      };
    },

    appendRoutes = function appendRoutes(entitiesConfig) {
      var
        entity,
        entityConfig;

      for (entity in entitiesConfig) {
        entityConfig = entitiesConfig[entity];
        appendRoute(entityConfig.controller, entityConfig.controllerAs, entityConfig.template, entity, entityConfig.urls);
      }
    },

    init = function init() {
      appendRoutes({
        'about'     : createEntityConfig('aboutController',     'about',      'about.html',     ['/']),
        'help'      : createEntityConfig('helpController',      'help',       'help.html',      ['/help']),
        'register'  : createEntityConfig('registerController',  'register',   'register.html',  ['/register']),
        'statistic' : createEntityConfig('statisticController', 'statistic',  'statistic.html', ['/statistic']),
        'config'    : createEntityConfig('configController',    'config',     'config.html',    ['/config'])
      });
    };

  init();

  app.constant('routeConfig', {
    'routes' : routes
  });
});
