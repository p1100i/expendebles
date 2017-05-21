define(['app'], function (app) {
  app.controller('registerController', ['financeService', function registerControllerFactory(financeService) {
    var
      ctrl = this,

      items,
      selectedItem,

      AMOUNT_DOT_REGEX = /[,]+/g,
      AMOUNT_REMOVE_REGEX = /[^\d\.]*/g,

      setInputAmount = function setInputAmount(amount) {
        if (amount && amount.replace) {
          amount = amount.replace(AMOUNT_DOT_REGEX, '.');
          amount = amount.replace(AMOUNT_REMOVE_REGEX, '');
        }

        ctrl.amount = amount;
      },

      setSelectedExpense = function setSelectedExpense(expense) {
        if (!selectedItem) {
          throw new Error('selected_item_needed');
        }

        selectedItem.expense = !!expense;

        financeService.save();

        // TODO loop to category selection.
      },

      clearSelected = function clearSelected() {
        setInputAmount(0);
      },

      parseAmount = function parseAmount(amount) {
        return Math.abs(parseFloat(amount) || 0);
      },

      setSelectedItem = function setSelectedItem(item) {
        ctrl.selectedItem = selectedItem = (selectedItem === item ? undefined : item);

        if (selectedItem) {
          setInputAmount(selectedItem.amount);
        } else {
          clearSelected();
        }
      },

      selectItem = function selectItem(item) {
        setSelectedItem(item);
      },

      onAmountChanged = function onAmountChanged(amount) {
        setInputAmount(amount);

        amount = parseAmount(amount);

        if (selectedItem) {
          selectedItem.amount = amount;
        } else {
          setSelectedItem(financeService.addItem(amount));
        }
      },

      deleteItem = function deleteItem(item) {
        items.remove(item);

        if (item === selectedItem) {
          setSelectedItem();
        }

        financeService.save();
      },

      isAmountValid = function isAmountValid(amount) {
        return parseAmount(amount) !== 0;
      },

      formatAmount = function formatAmount(amount) {
        //
        // amount = parseAmount(amount).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        //

        return parseAmount(amount).toLocaleString();
      },

      init = function init() {
        ctrl.deleteItem         = deleteItem;
        ctrl.formatAmount       = formatAmount;
        ctrl.isAmountValid      = isAmountValid;
        ctrl.onAmountChanged    = onAmountChanged;
        ctrl.selectItem         = selectItem;
        ctrl.setSelectedExpense = setSelectedExpense;

        ctrl.items = items = financeService.getItems();
      };

    init();
  }]);
});
