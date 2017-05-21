define(['app'], function (app) {
  app.controller('registerController', ['financeService', function registerControllerFactory(financeService) {
    var
      ctrl = this,

      selectedItem,

      AMOUNT_REGEX = /[^\d\.]*/g,

      setInputAmount = function setInputAmount(amount) {
        if (amount && amount.replace) {
          amount = amount.replace(AMOUNT_REGEX, '');
        }

        ctrl.amount = amount;
      },

      setSelectedExpense = function setSelectedExpense(expense) {
        if (!selectedItem) {
          throw new Error('selected_item_needed');
        }

        selectedItem.expense = !!expense;

        // TODO loop to category selection.
      },

      clearSelected = function clearSelected() {
        setInputAmount(0);
      },

      sanitizeAmount = function sanitizeAmount(amount) {
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

        amount = sanitizeAmount(amount);

        if (selectedItem) {
          selectedItem.amount = amount;
        } else {
          setSelectedItem(financeService.addItem(amount));
        }
      },

      isAmountValid = function isAmountValid(amount) {
        return sanitizeAmount(amount) !== 0;
      },

      formatAmount = function formatAmount(amount) {
        return Math.abs(amount);
      },

      init = function init() {
        ctrl.formatAmount       = formatAmount;
        ctrl.isAmountValid      = isAmountValid;
        ctrl.onAmountChanged    = onAmountChanged;
        ctrl.selectItem         = selectItem;
        ctrl.setSelectedExpense = setSelectedExpense;

        ctrl.items = financeService.getItems();
      };

    init();
  }]);
});
