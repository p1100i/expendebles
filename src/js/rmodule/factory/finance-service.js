define(['app'], function (app) {
  app.factory('financeService', ['$rootScope', 'timeService', 'settingService', 'storageService', function financeServiceFactory($rootScope, timeService, settingService, storageService) {
    var
      balances          = [],
      transactions      = [],
      nextTransactionId = 1,
      nextBalanceId     = 1,

      interval        = timeService.getInterval(),
      defaultCategory = settingService.getDefaultCategory(),

      isInInterval = function isInInterval(serializedItem) {
        return interval.beg <= serializedItem.t && serializedItem.t <= interval.end;
      },

      isCurrentBalance = function isCurrentBalance(serializedItem) {
        return interval.begMonth === serializedItem.m && interval.begYear === serializedItem.y;
      },

      isNextBalance = function isNextBalance(serializedItem) {
        return interval.endMonth === serializedItem.m && interval.endYear === serializedItem.y;
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

        if (item.year !== undefined) {
          serializedItem.y = item.year;
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
          balance.month = interval.begMonth;
        }

        if (balance.year === undefined) {
          balance.year = interval.begYear;
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
          serializedItem  = serializedItems[i];
          maxId           = Math.max(maxId, serializedItem.i + 1);

          if (isActual(serializedItem)) {
            items.push(createItem(deserialize(serializedItem)));
          }
        }

        return maxId;
      },

      getBalancesSum = function getBalancesSum(isActual) {
        var
          len,
          balance,
          result              = 0,
          resultBalances      = [],
          serializedBalances  = storageService.get('balances');

        fillItems(
          resultBalances,
          createBalance,
          serializedBalances,
          isActual
        );

        len = resultBalances.length;

        if (!len) {
          return;
        }

        while (len--) {
          balance = resultBalances[len];
          result += (balance.expense ? -1 : 1) * balance.amount;
        }

        return result;
      },

      getCurrentBalancesSum = function getCurrentBalancesSum() {
        return getBalancesSum(isCurrentBalance);
      },

      getNextBalancesSum = function getNextBalancesSum() {
        return getBalancesSum(isNextBalance);
      },

      sync = function sync() {
        transactions.clear();
        balances.clear();

        var
          serializedBalances      = storageService.get('balances'),
          serializedTransactions  = storageService.get('transactions');

        nextTransactionId = fillItems(
          transactions,
          createTransaction,
          serializedTransactions,
          isInInterval,
          nextTransactionId
        );

        nextBalanceId = fillItems(
          balances,
          createBalance,
          serializedBalances,
          isCurrentBalance,
          nextBalanceId
        );
      },

      update = function update(item) {
        var
          serializedBalances      = storageService.get('balances'),
          serializedTransactions  = storageService.get('transactions'),
          serializedItem          = serialize(item);

        if (item.type === 'balance') {
          updateItem(serializedBalances, serializedItem);

          if (!isCurrentBalance(serializedItem)) {
            balances.remove(item);
          }
        } else {
          updateItem(serializedTransactions, serializedItem);

          if (!isInInterval(serializedItem)) {
            transactions.remove(item);
          }
        }

        storageService.set('balances',      serializedBalances);
        storageService.set('transactions',  serializedTransactions);
      },

      destroy = function destroy(item) {
        var
          serializedItem,
          serializedBalances      = storageService.get('balances'),
          serializedTransactions  = storageService.get('transactions');

        if (item.type === 'balance') {
          balances.remove(item);
          serializedItem = serializedBalances.get(item.id, 'i');
          serializedBalances.remove(serializedItem);
        } else {
          serializedItem = serializedTransactions.get(item.id, 'i');
          serializedTransactions.remove(serializedItem);
          transactions.remove(item);
        }

        storageService.set('balances',      serializedBalances);
        storageService.set('transactions',  serializedTransactions);
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
