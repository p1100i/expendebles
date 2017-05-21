define(['app'], function (app) {
  app.controller('registerController', ['financeService', function registerControllerFactory(financeService) {
    var
      ctrl = this,

      selectedItem,

      setAmount = function setAmount(amount) {
        amount = Math.abs(amount) || 0;

        ctrl.amount = amount;
      },

      addExpense = function addExpense(amount) {
        financeService.addItem(-amount);
        setAmount(0);
      },

      addIncome = function addIncome(amount) {
        financeService.addItem(amount);
        setAmount(0);
      },

      setAmountType = function setAmountType(positive, showCategories) {
        ctrl.amountType = positive;

        if (!selectedItem) {
          throw new Error('selected_item_needed');
        }

        if (showCategories) {
          console.log('IMPLEMENT ME!');
        }
      },

      clearSelected = function clearSelected() {
        setAmount(0);
        setAmountType();
      },

      setSelectedItem = function setSelectedItem(item) {
        ctrl.selectedItem = selectedItem = (selectedItem === item ? undefined : item);

        if (selectedItem) {
          setAmount(selectedItem.amount);
          setAmountType(selectedItem.amount >= 0);
        } else {
          clearSelected();
        }
      },

      selectItem = function selectItem(item) {
        setSelectedItem(item);
      },

      sanitizeAmount = function sanitizeAmount(amount) {
        return Math.abs(parseFloat(amount)) || 0;
      },

      onAmountChanged = function onAmountChanged(amount) {
        amount = sanitizeAmount(amount);

        if (!selectedItem) {
          setSelectedItem(financeService.addItem(amount));
        } else {
          selectedItem.amount = sanitizeAmount(amount);
        }
      },

      isAmountValid = function isAmountValid(amount) {
        return sanitizeAmount(amount) !== 0;
      },

      init = function init() {
        ctrl.addExpense       = addExpense;
        ctrl.addIncome        = addIncome;
        ctrl.onAmountChanged  = onAmountChanged;
        ctrl.selectItem       = selectItem;
        ctrl.setAmountType    = setAmountType;
        ctrl.isAmountValid    = isAmountValid;

        ctrl.items = financeService.getItems();
      };

    init();
  }]);
});
