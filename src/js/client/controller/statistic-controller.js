define(['app'], function (app) {
  app.controller('statisticController', ['$rootScope', '$scope', 'financeService', 'storageService', function statisticControllerFactory($rootScope, $scope, financeService, storageService) {
    var
      ctrl = this,

      items,

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

      getGroups = function getGroups(items) {
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

      getExpenseGroups = function getExpenseGroups() {
        var
          expenses = items.clone().filter(isExpense);

        return getGroups(expenses);
      },

      getIncomeGroups = function getIncomeGroups() {
        var
          incomes = items.clone().filter(isIncome);

        return getGroups(incomes);
      },

      setItems = function setItems() {
        items = financeService.getItems();
      },

      balanceGroups = function balanceGroups(groups, otherGroups) {
        var
          group,
          amount,
          otherGroup,
          len = groups.length;

        while (len--) {
          group = groups[len];

          if (group.balanced) {
            continue;
          }

          group.balanced = true;

          otherGroup = otherGroups.get(group.id, 'id');

          if (!otherGroup) {
            continue;
          }

          otherGroup.balanced = true;

          amount = Math.min(group.amount, otherGroup.amount);

          group.amount      -= amount;
          otherGroup.amount -= amount;
        }
      },

      sanitizeGroups = function sanitizeGroups(groups) {
        var
          len = groups.length,
          group;

        while (len--) {
          group = groups[len];

          if (group.amount <= 0) {
            groups.remove(group);
          }
        }
      },

      getWeighedGroups = function getWeighedGroups() {
        var
          expenseGroups  = getExpenseGroups(),
          incomeGroups   = getIncomeGroups();

        balanceGroups(incomeGroups,   expenseGroups);
        balanceGroups(expenseGroups,  incomeGroups);

        sanitizeGroups(incomeGroups);
        sanitizeGroups(expenseGroups);

        incomeGroups.sort(isItemGreater);
        expenseGroups.sort(isItemGreater);

        weighGroups(expenseGroups);
        weighGroups(incomeGroups);

        return {
          'expense' : expenseGroups,
          'income'  : incomeGroups
        };
      },

      setSum = function setSum(incomeSum, expenseSum) {
        var
          total = incomeSum + expenseSum;

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

        var
          groups      = getWeighedGroups(),
          incomeSum   = groups.income.sum('amount'),
          expenseSum  = groups.expense.sum('amount');

        setSum(incomeSum, expenseSum);

        ctrl.expenseGroups  = groups.expense;
        ctrl.incomeGroups   = groups.income;
      },

      init = function init() {
        $rootScope.$on('intervalSet', sync);

        ctrl.sum = sum;

        sync();
      };

    init();
  }]);
});
