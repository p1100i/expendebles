define(['app'], function (app) {
  app.controller('statisticController', ['$rootScope', '$scope', 'financeService', 'storageService', function statisticControllerFactory($rootScope, $scope, financeService, storageService) {
    var
      ctrl = this,

      items,
      expenses,
      expenseGroups,
      incomes,
      incomeGroups,

      sum = {
        'expense'       : 0,
        'expenseWidth'  : 0,
        'income'        : 0,
        'incomeWidth'   : 0,
        'total'         : 0
      },

      MAX_GROUP_WIDTH = 120,
      MAX_SUM_WIDTH   = 260,

      isItemGreater = function isItemGreater(itemA, itemB) {
        return itemB.amount - itemA.amount;
      },

      isExpense = function isExpense(item) {
        return item.expense;
      },

      isIncome = function isIncome(item) {
        return !item.expense;
      },

      getSortedGroups = function getSortedGroups(items) {
        var
          item,
          group,
          categoryId,
          len = items.length,
          groups = [];

        while (len--) {
          item        = items[len];
          categoryId  = item.category.id;
          group       = groups.get(categoryId, 'id');

          if (group) {
            group.amount += item.amount;
          } else {
            groups.push({
              'id'        : categoryId,
              'amount'    : item.amount,
              'category'  : item.category
            });
          }
        }

        groups.sort(isItemGreater);

        return groups;
      },

      weighGroups = function weighGroups(groups) {
        var
          i,
          group,
          sum   = groups.sum('amount'),
          len   = Math.min(groups.length, 5),
          left  = 0;

        groups.splice(len);

        for (i = 0; i < len; i++) {
          group = groups[i];

          group.left    = left;
          group.percent = group.amount / sum;
          group.width   = Math.round(group.percent * MAX_GROUP_WIDTH);

          left += group.width;
        }
      },

      setTopExpenseGroups = function setTopExpenseGroups() {
        expenses      = items.clone().filter(isExpense);
        expenseGroups = getSortedGroups(expenses);

        weighGroups(expenseGroups);

        ctrl.expenseGroups = expenseGroups;
      },

      setTopIncomeGroups = function setTopIncomeGroups() {
        incomes      = items.clone().filter(isIncome);
        incomeGroups = getSortedGroups(incomes);

        weighGroups(incomeGroups);

        ctrl.incomeGroups = incomeGroups;
      },

      setItems = function setItems() {
        items = financeService.getItems();
      },

      setSumWidths = function setSumWidths() {
        var
          incomeSum   = incomes.sum('amount'),
          expenseSum  = expenses.sum('amount'),
          total       = incomeSum + expenseSum;

        sum.income  = incomeSum;
        sum.expense = expenseSum;
        sum.total   = total;

        if (total === 0) {
          sum.incomeWidth   = 0;
          sum.expenseWidth  = 0;
          return;
        }

        sum.incomeWidth  = Math.floor((incomeSum / total) * MAX_SUM_WIDTH);
        sum.expenseWidth = MAX_SUM_WIDTH - sum.incomeWidth;
      },

      sync = function sync() {
        setItems();
        setTopExpenseGroups();
        setTopIncomeGroups();
        setSumWidths();
      },

      init = function init() {
        $rootScope.$on('intervalSet', sync);

        ctrl.sum = sum;

        sync();
      };

    init();
  }]);
});
