define(['app'], function (app) {
  app.controller('registerController', ['financeService', function registerControllerFactory(financeService) {
    var
      ctrl = this,

      selectedItem,

      setAmount = function setAmount(amount) {
        ctrl.amount = Math.abs(amount) || 0;
      },

      addExpense = function addExpense(amount) {
        financeService.addItem(-amount);
        setAmount(0);
      },

      addIncome = function addIncome(amount) {
        financeService.addItem(amount);
        setAmount(0);
      },

      toggleItems = function toggleItems() {
        ctrl.items = ctrl.items ? undefined : financeService.getItems();
      },

      setSelectedItem = function setSelectedItem(item) {
        ctrl.selectedItem = selectedItem = (selectedItem === item ? undefined : item);
      },

      selectItem = function selectItem(item) {
        setSelectedItem(item);
        setAmount(selectedItem && selectedItem.amount);
      },

      init = function init() {
        ctrl.addExpense   = addExpense;
        ctrl.addIncome    = addIncome;
        ctrl.toggleItems  = toggleItems;
        ctrl.selectItem   = selectItem;

        toggleItems();
      };

    init();
  }]);
});
