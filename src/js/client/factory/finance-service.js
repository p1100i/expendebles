define(['app'], function (app) {
  app.factory('financeService', ['$rootScope', 'timeService', 'settingService', 'storageService', function financeServiceFactory($rootScope, timeService, settingService, storageService) {
    var
      balances          = [],
      transactions      = [],
      nextTransactionId = 1,
      nextBalanceId     = 1,

      interval        = timeService.getInterval(),
      defaultCategory = settingService.getDefaultCategory(),

      isAfterInterval = function isAfterInterval(serializedItem) {
        return interval.end <= serializedItem.t;
      },

      isInInterval = function isInInterval(serializedItem) {
        return interval.beg <= serializedItem.t && serializedItem.t <= interval.end;
      },

      isSameMonthAsIntervalBeg = function isSameMonthAsIntervalBeg(serializedItem) {
        return interval.begDate.getMonth() === serializedItem.m;
      },

      isSameMonthAsIntervalEnd = function isSameMonthAsIntervalEnd(serializedItem) {
        return interval.endDate.getMonth() === serializedItem.m;
      },

      getCategory = function getCategory(id) {
        return settingService.getCategory(id);
      },

      deserialize = function deserialize(itemData) {
        var
          item = {};

        if (itemData.a !== undefined) {
          item.amount = parseFloat(itemData.a);
        }

        if (itemData.c !== undefined) {
          item.category = getCategory(itemData.c);
        }

        if (itemData.e !== undefined) {
          item.expense = !!itemData.e;
        }

        if (itemData.i !== undefined) {
          item.id = itemData.i;
        }

        if (itemData.t !== undefined) {
          item.timestamp = itemData.t;
        }

        return item;
      },

      serialize = function serialize(item) {
        var
          serializedItem = {};

        if (item.amount !== undefined) {
          serializedItem.a = item.amount;
        }

        if (item.category !== undefined) {
          serializedItem.c = item.category.id;
        }

        if (item.expense !== undefined) {
          serializedItem.e = item.expense ? 1 : 0;
        }

        if (item.id !== undefined) {
          serializedItem.i = item.id;
        }

        if (item.timestamp !== undefined) {
          serializedItem.t = item.timestamp;
        }

        if (item.month !== undefined) {
          serializedItem.m = item.month;
        }

        return serializedItem;
      },

      updateItem = function updateItem(serializedItems, newSerializedItem) {
        var
          len = serializedItems.length,
          serializedItem;

        while (len--) {
          serializedItem = serializedItems[len];

          if (serializedItem.i === newSerializedItem.i) {
            serializedItems[len] = newSerializedItem;

            return;
          }
        }

        serializedItems.push(newSerializedItem);
      },

      // TODO implement me
      destroy = function destroy() {
        // if (balanceMode) {
        //   balances.remove(item);
        // } else {
        //   transactions.remove(item);
        // }
      },

      getBalances = function getBalances() {
        return balances;
      },

      getTransactions = function getTransactions() {
        return transactions;
      },

      getIntervalMiddleTimestamp = function getIntervalMiddleTimestamp() {
        return Math.floor((interval.end - interval.beg) / 2 + interval.beg);
      },

      getTransactionTimestamp = function getTransactionTimestamp(forceIntervalMiddle) {
        var
          timestamp = Date.now();

        if (timestamp < interval.beg || interval.end < timestamp) {
          timestamp = getIntervalMiddleTimestamp();
        }

        return timestamp;
      },

      createTransaction = function createTransaction(transaction, amount) {
        if (!transaction) {
          transaction = {};
        }

        transaction.type = 'transaction';

        if (!transaction.timestamp) {
          transaction.timestamp  = getTransactionTimestamp();
        }

        if (transaction.id === undefined) {
          transaction.id = nextTransactionId++;
        }

        if (transaction.expense === undefined) {
          transaction.expense = true;
        }

        if (transaction.amount === undefined) {
          transaction.amount = amount;
        }

        if (transaction.date === undefined) {
          transaction.date = new Date(transaction.timestamp);
        }

        if (transaction.category === undefined) {
          transaction.category = defaultCategory;
        }

        return transaction;
      },

      createBalance = function createBalance(balance, amount) {
        if (!balance) {
          balance = {};
        }

        balance.type = 'balance';

        if (balance.id === undefined) {
          balance.id = nextBalanceId++;
        }

        if (balance.month === undefined) {
          balance.month = interval.begDate.getMonth();
        }

        if (balance.expense === undefined) {
          balance.expense = true;
        }

        if (balance.amount === undefined) {
          balance.amount = amount;
        }

        return balance;
      },

      addBalance = function addBalance(amount) {
        amount = parseFloat(amount);

        if (isNaN(amount)) {
          throw new Error('invalid_amount');
        }

        var
          balance = createBalance({}, amount);

        balances.push(balance);

        return balance;
      },

      addTransaction = function addTransaction(amount) {
        amount = parseFloat(amount);

        if (isNaN(amount)) {
          throw new Error('invalid_amount');
        }

        var
          transaction = createTransaction({}, amount);

        transactions.push(transaction);

        return transaction;
      },

      getSum = function getSum() {
        return transactions.sum('amount');
      },

      fillItems = function fillItems(items, createItem, serializedItems, isActual, maxId) {
        if (!serializedItems) {
          return;
        }

        if (maxId === undefined) {
          maxId = 0;
        }

        var
          i,
          serializedItem,
          len = serializedItems.length;

        for (i = 0; i < len; i++) {
          serializedItem = serializedItems[i];

          maxId = Math.max(maxId, serializedItem.i + 1);

          if (isActual(serializedItem)) {
            items.push(createItem(deserialize(serializedItem)));
          }
        }

        return maxId;
      },

      getBalancesSum = function getBalancesSum(isCurrent) {
        var
          currentBalances   = [],
          serializedFinance = storageService.get('finance');

        fillItems(
          currentBalances,
          createBalance,
          serializedFinance.balances,
          isCurrent
        );

        return currentBalances.length ? currentBalances.sum('amount') : undefined;
      },

      getCurrentBalancesSum = function getCurrentBalancesSum() {
        return getBalancesSum(isSameMonthAsIntervalBeg);
      },

      getNextBalancesSum = function getNextBalancesSum() {
        return getBalancesSum(isSameMonthAsIntervalEnd);
      },

      sync = function sync() {
        transactions.clear();
        balances.clear();

        var
          serializedFinance = storageService.get('finance');

        nextTransactionId = fillItems(
          transactions,
          createTransaction,
          serializedFinance.transactions,
          isInInterval,
          nextTransactionId
        );

        nextBalanceId = fillItems(
          balances,
          createBalance,
          serializedFinance.balances,
          isSameMonthAsIntervalBeg,
          nextBalanceId
        );
      },

      update = function update(item) {
        var
          serializedFinance       = storageService.get('finance'),
          serializedTransactions  = serializedFinance.transactions,
          serializedBalances      = serializedFinance.balances,
          serializedItem          = serialize(item);

        if (item.type === 'balance') {
          updateItem(serializedBalances, serializedItem);

          if (!isSameMonthAsIntervalBeg(serializedItem)) {
            balances.remove(item);
          }
        } else {
          updateItem(serializedTransactions, serializedItem);

          if (!isInInterval(serializedItem)) {
            transactions.remove(item);
          }
        }

        storageService.set('finance', {
          'transactions'  : serializedTransactions,
          'balances'      : serializedBalances
        });
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

      formatAmount = function formatAmount(amount) {
        //
        // amount = sanitizeAmount(amount).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        //

        return sanitizeAmount(amount).toLocaleString();
      },

      init = function init() {
        $rootScope.$on('intervalSet', sync);

        sync();
      };

    init();

    return {
      'addBalance'            : addBalance,
      'addTransaction'        : addTransaction,
      'destroy'               : destroy,
      'formatAmount'          : formatAmount,
      'getBalances'           : getBalances,
      'getCurrentBalancesSum' : getCurrentBalancesSum,
      'getNextBalancesSum'    : getNextBalancesSum,
      'getSum'                : getSum,
      'getTransactions'       : getTransactions,
      'sanitizeAmount'        : sanitizeAmount,
      'update'                : update,
      'sync'                  : sync
    };
  }]);
});
