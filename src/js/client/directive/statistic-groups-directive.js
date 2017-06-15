define(['app'], function (app) {
  app.directive('statisticGroups', ['$rootScope', function ($rootScope) {
    var
      templateUrl = 'statistic-groups.html',

      scope = {
        'color'   : '=color',
        'groups'  : '=groups'
      },

      link = function link(scope, element, attrs) {
      };

    return {
      'link'          : link,
      'scope'         : scope,
      'templateUrl'   : templateUrl
    };
  }]);
});
