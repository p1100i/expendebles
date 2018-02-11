define(['app'], function (app) {
  app.directive('help', ['$rootScope', function ($rootScope) {
    var
      template = 'ℹ',

      link = function link(scope, element, attrs) {
        element.on('click', function () {
          $rootScope.$broadcast('help', attrs.message);
        });

        element.addClass('help');
      };

    return {
      'template'  : template,
      'link'      : link
    };
  }]);
});
