define(['app'], function (app) {
  app.controller('registerController', ['$scope', '$window', 'financeService', 'settingService', function registerControllerFactory($scope, $window, financeService, settingService) {
    var
      ctrl = this,

      items,
      categories,
      selectedItem,

      amountInput,
      lastValidAmount = 0,

      setAmountInput = function setAmountInput() {
        if (!amountInput) {
          amountInput = $window.document.getElementById('amount');
        }
      },

      focusInputAmount = function focusInputAmount() {
        setAmountInput();

        amountInput.focus();
      },

      setInputAmount = function setInputAmount(amount) {
        ctrl.amount = amount;

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
          financeService.save();
        } else if (item === selectedItem) {
          setSelectedItem();
        }
      },

      parseAmount = function parseAmount(amount) {
        return Math.abs(parseFloat(amount) || 0);
      },

      selectItem = function selectItem($event, item) {
        if ($event && $event.stopPropagation) {
          $event.stopPropagation();
        }

        if (item !== selectedItem || item !== undefined) {
          setSelectedItem(item);
        }
      },

      isAmountValid = function isAmountValid(amount) {
        return amount !== undefined;
      },

      onAmountChanged = function onAmountChanged(amount) {
        var
          len;

        setAmountInput();

        amount = parseAmount(amount);
        len    = lastValidAmount.toString().length;

        if (amount) {
          lastValidAmount = amount;
        } else if (len > 1) {
          amount = lastValidAmount;
        }

        setInputAmount(amount);

        if (selectedItem) {
          selectedItem.amount = amount;
        } else {
          setSelectedItem(financeService.addItem(amount));
        }

        financeService.save();
      },

      deleteItem = function deleteItem($event, item) {
        $event.stopPropagation();

        items.remove(item);

        if (item === selectedItem) {
          setSelectedItem();
        }

        financeService.save();
      },

      formatAmount = function formatAmount(amount) {
        //
        // amount = parseAmount(amount).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        //

        return parseAmount(amount).toLocaleString();
      },

      showItemExtra = function showItemExtra($event, item) {
        $event.stopPropagation();

        ctrl.ext = true;
      },

      hideItemExtra = function hideItemExtra($event, item) {
        $event.stopPropagation();

        ctrl.ext = false;
      },

      onItemDateChanged = function onItemDateChanged(item) {
        item.timestamp = item.date.getTime();

        financeService.save();
      },

      getCategoryIcon = function getCategoryIcon(name) {
        return settingService.getCategoryIcon(name) || 'calendar';
      },

      setCategory = function setCategory($event, item, category) {
        $event.stopPropagation();

        item.category = category.name;

        financeService.save();
      },

      stopEvent = function stopEvent($event) {
        $event.stopPropagation();
      },

      init = function init() {
        $scope.$on('bodyClick', selectItem);

        ctrl.deleteItem         = deleteItem;
        ctrl.formatAmount       = formatAmount;
        ctrl.getCategoryIcon    = getCategoryIcon;
        ctrl.hideItemExtra      = hideItemExtra;
        ctrl.isAmountValid      = isAmountValid;
        ctrl.onAmountChanged    = onAmountChanged;
        ctrl.onItemDateChanged  = onItemDateChanged;
        ctrl.selectItem         = selectItem;
        ctrl.setCategory        = setCategory;
        ctrl.setExpense         = setExpense;
        ctrl.showItemExtra      = showItemExtra;
        ctrl.stopEvent          = stopEvent;

        ctrl.categories = categories  = settingService.getCategories();
        ctrl.items      = items       = financeService.getItems();
      };

    init();
  }]);
});
