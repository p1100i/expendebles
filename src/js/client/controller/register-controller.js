define(['app'], function (app) {
  app.controller('registerController', ['$scope', '$window', 'timeService', 'financeService', 'settingService', function registerControllerFactory($scope, $window, timeService, financeService, settingService) {
    var
      ctrl = this,

      amountInput,
      balanceMode,
      balances,
      categories,
      editMode,
      selectedItem,
      transactions,

      lastValidAmount = 0,

      setAmountInput = function setAmountInput() {
        amountInput = $window.document.getElementById('amount');
      },

      focusInputAmount = function focusInputAmount() {
        setAmountInput();

        if (amountInput) {
          amountInput.focus();
        }
      },

      setInputAmount = function setInputAmount(amount) {
        ctrl.amount = lastValidAmount = amount;

        focusInputAmount();
      },

      setSelectedItem = function setSelectedItem(item) {
        ctrl.selectedItem = selectedItem = (selectedItem === item ? undefined : item);

        if (selectedItem) {
          setInputAmount(selectedItem.amount);
        } else {
          setInputAmount();
        }
      },

      save = function save() {
        financeService.save();
      },

      setExpense = function setExpense($event, item, expense) {
        if (!item) {
          throw new Error('item_needed');
        }

        $event.stopPropagation();

        expense = !!expense;

        if (item.expense !== expense) {
          item.expense = expense;
          save();
        } else if (item === selectedItem) {
          setSelectedItem();
        }
      },

      selectItem = function selectItem($event, item) {
        if ($event && $event.stopPropagation) {
          $event.stopPropagation();
        }

        if (editMode) {
          return;
        }

        if (item !== selectedItem || item !== undefined) {
          setSelectedItem(item);
        }
      },

      isAmountValid = function isAmountValid(amount) {
        return amount !== undefined;
      },

      registerAmount = function registerAmount(amount) {
        var
          item;

        if (balanceMode) {
          item = financeService.addBalance(amount);
        } else {
          item = financeService.addTransaction(amount);
        }

        setSelectedItem(item);
      },

      onAmountChanged = function onAmountChanged(amount) {
        var
          len;

        setAmountInput();

        amount = financeService.sanitizeAmount(amount);
        len    = lastValidAmount ? lastValidAmount.toString().length : 0;

        if (!amount && len > 1) {
          amount = lastValidAmount;
        }

        setInputAmount(amount);

        if (selectedItem) {
          selectedItem.amount = amount;
        } else {
          registerAmount(amount);
        }

        save();
      },

      deleteItem = function deleteItem($event, item) {
        $event.stopPropagation();

        if (balanceMode) {
          balances.remove(item);
        } else {
          transactions.remove(item);
        }

        if (item === selectedItem) {
          setSelectedItem();
        }

        save();
      },

      setEditMode = function setEditMode($event, newEditMode) {
        $event.stopPropagation();

        ctrl.editMode = editMode = newEditMode;
      },

      onItemDateChanged = function onItemDateChanged(item) {
        item.timestamp = item.date.getTime();

        save();
      },

      setCategory = function setCategory($event, item, category) {
        $event.stopPropagation();

        if (balanceMode) {
          return;
        }

        item.category = category;

        save();
      },

      stopEvent = function stopEvent($event) {
        $event.stopPropagation();
      },

      setBalanceMode = function setBalanceMode(newBalanceMode) {
        ctrl.balanceMode = balanceMode = newBalanceMode;
      },

      toggleBalanceMode = function toggleBalanceMode($event) {
        setSelectedItem();
        setBalanceMode(!balanceMode);
      },

      init = function init() {
        setBalanceMode(false);

        $scope.$on('bodyClick', selectItem);

        ctrl.deleteItem         = deleteItem;
        ctrl.isAmountValid      = isAmountValid;
        ctrl.onAmountChanged    = onAmountChanged;
        ctrl.onItemDateChanged  = onItemDateChanged;
        ctrl.selectItem         = selectItem;
        ctrl.setCategory        = setCategory;
        ctrl.setEditMode        = setEditMode        ;
        ctrl.setExpense         = setExpense;
        ctrl.stopEvent          = stopEvent;
        ctrl.toggleBalanceMode  = toggleBalanceMode;

        ctrl.categories   = categories    = settingService.getCategories();
        ctrl.transactions = transactions  = financeService.getTransactions();
        ctrl.balances     = balances      = financeService.getBalances();
      };

    init();
  }]);
});
