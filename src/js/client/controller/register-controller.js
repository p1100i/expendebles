define(['app'], function (app) {
  app.controller('registerController', ['$scope', '$window', 'timeService', 'financeService', 'settingService', function registerControllerFactory($scope, $window, timeService, financeService, settingService) {
    var
      ctrl = this,

      amountInput,
      balanceMode,
      balances,
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

      setExpense = function setExpense($event, item, expense) {
        if (!item) {
          throw new Error('item_needed');
        }

        $event.stopPropagation();

        expense = !!expense;

        if (item.expense !== expense) {
          item.expense = expense;
          financeService.update(item);
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

      isEditable = function isEditable() {
        return selectedItem && selectedItem.type === 'transaction';
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

        financeService.update(selectedItem);
      },

      destroyItem = function destroyItem($event, item) {
        $event.stopPropagation();

        financeService.destroy(item);

        if (item === selectedItem) {
          setSelectedItem();
        }
      },

      onItemDateChanged = function onItemDateChanged(item) {
        if (!item || !item.date) {
          return;
        }

        item.timestamp = item.date.getTime();

        financeService.update(item);
      },

      setCategory = function setCategory($event, item, category) {
        $event.stopPropagation();

        if (balanceMode) {
          return;
        }

        item.category = category;

        financeService.update(item);
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

      setTransactions = function setTransactions(newTransactions) {
        ctrl.transactions = transactions = newTransactions;
      },

      setBalances = function setBalances(newBalances) {
        ctrl.balances = balances = newBalances;
      },

      setCategories = function setCategories(categories) {
        ctrl.categories = categories;
      },

      setEditMode = function setEditMode($event, newEditMode) {
        $event.stopPropagation();

        if (newEditMode) {
          setTransactions([selectedItem]);
        } else {
          setTransactions(financeService.getTransactions());
          setBalances(financeService.getBalances());

          if (!transactions.has(selectedItem)) {
            setSelectedItem();
          }
        }

        ctrl.editMode = editMode = newEditMode;
      },

      init = function init() {
        $scope.$on('bodyClick', selectItem);

        ctrl.destroyItem        = destroyItem;
        ctrl.isAmountValid      = isAmountValid;
        ctrl.isEditable         = isEditable;
        ctrl.onAmountChanged    = onAmountChanged;
        ctrl.onItemDateChanged  = onItemDateChanged;
        ctrl.selectItem         = selectItem;
        ctrl.setCategory        = setCategory;
        ctrl.setEditMode        = setEditMode;
        ctrl.setExpense         = setExpense;
        ctrl.stopEvent          = stopEvent;
        ctrl.toggleBalanceMode  = toggleBalanceMode;

        setBalanceMode(false);
        setCategories(settingService.getCategories());
        setTransactions(financeService.getTransactions());
        setBalances(financeService.getBalances());
      };

    init();
  }]);
});
