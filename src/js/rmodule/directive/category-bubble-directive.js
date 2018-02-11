define(['app'], function (app) {
  app.directive('categoryBubble', ['$rootScope', 'financeService', 'settingService', function ($rootScope, financeService, settingService) {
    var
      templateUrl = 'category-bubble.html',

      scope = {
        'amount'      : '<amount',
        'highlighted' : '<highlighted',
        'icon'        : '<icon',
        'name'        : '<name',
        'timestamp'   : '<timestamp'
      },

      link = function link(scope, element, attrs) {
        scope.formatAmount = financeService.formatAmount;
        scope.format = settingService.getDateFormat(true);
      };

    return {
      'link'          : link,
      'scope'         : scope,
      'templateUrl'   : templateUrl
    };
  }]);
});
