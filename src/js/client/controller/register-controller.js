define(['app'], function (app) {
  app.controller('registerController', ['$scope', '$window', 'timeService', 'financeService', 'settingService', function registerControllerFactory($scope, $window, timeService, financeService, settingService) {
    var
      ctrl = this,

      interval = timeService.getInterval(),

      items,
      categories,
      selectedItem,

      amountInput,
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
          financeService.save();
        } else if (item === selectedItem) {
          setSelectedItem();
        }
      },

      parseAmount = function parseAmount(amount) {
        return Math.abs(parseFloat(amount) || 0);
      },

      sanitizeAmount = function sanitizeAmount(amount) {
        amount = parseAmount(amount);

        var
          amountStr = amount.toString();

        if (amountStr.length > 9) {
          amount = parseAmount(amountStr.substring(0, 9));
        }

        return amount;
      },

      selectItem = function selectItem($event, item) {
        if ($event && $event.stopPropagation) {
          $event.stopPropagation();
        }

        if (ctrl.ext) {
          return;
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

        amount = sanitizeAmount(amount);
        len    = lastValidAmount ? lastValidAmount.toString().length : 0;

        if (!amount && len > 1) {
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
        // amount = sanitizeAmount(amount).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        //

        return sanitizeAmount(amount).toLocaleString();
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

      getCategoryIcon = function getCategoryIcon(id) {
        return settingService.getCategoryIcon(id) || 'calendar';
      },

      setCategory = function setCategory($event, item, category) {
        $event.stopPropagation();

        item.category = category.id;

        financeService.save();
      },

      stopEvent = function stopEvent($event) {
        $event.stopPropagation();
      },

      isInInterval = function isInInterval(item) {
        return interval.beg <= item.timestamp && item.timestamp <= interval.end;
      },

      init = function init() {
        $scope.$on('bodyClick', selectItem);

        ctrl.deleteItem         = deleteItem;
        ctrl.formatAmount       = formatAmount;
        ctrl.getCategoryIcon    = getCategoryIcon;
        ctrl.hideItemExtra      = hideItemExtra;
        ctrl.isAmountValid      = isAmountValid;
        ctrl.isInInterval       = isInInterval;
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
