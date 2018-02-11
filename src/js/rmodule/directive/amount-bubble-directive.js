define(['app'], function (app) {
  app.directive('amountBubble', ['$rootScope', 'financeService', function ($rootScope, financeService) {
    var
      templateUrl = 'amount-bubble.html',

      scope = {
        'amount'  : '<amount',
        'expense' : '<expense'
      },

      link = function link(scope, element, attrs) {
        scope.formatAmount = financeService.formatAmount;
      };

    return {
      'link'          : link,
      'scope'         : scope,
      'templateUrl'   : templateUrl
    };
  }]);
});
