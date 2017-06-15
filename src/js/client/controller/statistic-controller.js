define(['app'], function (app) {
  app.controller('statisticController', ['$scope', 'financeService', 'storageService', function statisticControllerFactory($scope, financeService, storageService) {
    var
      ctrl = this,

      items,

      MAX_WIDTH = 140,

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
          group.width   = Math.round(group.percent * MAX_WIDTH);

          left += group.width;
        }
      },

      setTopExpenseGroups = function setTopExpenseGroups() {
        var
          expenses,
          expenseGroups;

        expenses      = items.clone().filter(isExpense);
        expenseGroups = getSortedGroups(expenses);

        weighGroups(expenseGroups);

        ctrl.expenseGroups = expenseGroups;
      },

      setTopIncomeGroups = function setTopIncomeGroups() {
        var
          incomes,
          incomeGroups;

        incomes      = items.clone().filter(isIncome);
        incomeGroups = getSortedGroups(incomes);

        weighGroups(incomeGroups);

        ctrl.incomeGroups = incomeGroups;
      },

      setItems = function setItems() {
        items = financeService.getItems();
      },

      init = function init() {
        setItems();
        setTopExpenseGroups();
        setTopIncomeGroups();
      };

    init();
  }]);
});
