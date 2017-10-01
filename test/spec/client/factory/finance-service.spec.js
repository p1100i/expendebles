describe('financeService', function () {
  var test;

  beforeEach(function () {
    test = this;

    module('app');

    var
      data = {
        'transactionsSerialized' : [
          {
            'a' : 2,
            'c' : 2,
            'e' : 1,
            'i' : 1,
            't' : 9
          },
          {
            'a' : 1,
            'c' : 1,
            'e' : 0,
            'i' : 4,
            't' : 50
          }
        ],

        'transactions' : [
          {
            'amount'    : 2,
            'category'  : {
              'id'    : 2,
              'name'  : 'some',
              'icon'  : 'icon'
            },
            'expense'   : true,
            'id'        : 1,
            'timestamp' : 9
          }
        ]
      },

      settingService = {
        'getCategory' : function getCategory(id) {
          return {
            'id' : id
          };
        },

        'getDefaultCategory' : function getDefaultCategory() {}
      },

      storageService = {
        'get' : function get() {
          return {
            'transactions'  : data.transactionsSerialized.clone(),
            'balances'      : []
          };
        },

        'set' : function set() {}
      },

      timeService = {
        'getInterval' : function getInterval() {
          return {
            'beg' : 10,
            'end' : 100
          };
        }
      },

      spies = {
        'storageService' : {
          'get' : spyOn(storageService, 'get').and.callThrough(),
          'set' : spyOn(storageService, 'set').and.callThrough()
        }
      },

      dependencies = {
        'settingService'  : settingService,
        'storageService'  : storageService,
        'timeService'     : timeService
      },

      callInject = function callInject() {
        module(function ($provide) {
          var name;

          for (name in dependencies) {
            $provide.value(name, dependencies[name]);
          }
        });

        inject(['financeService', function (financeService) {
          test.service = financeService;
        }]);
      };

    test.data   = data;
    test.spies  = spies;

    callInject();
  });

  it('should sync w/ storage service', function () {
    expect(test.spies.storageService.get).toHaveBeenCalledWith('finance');
  });

  describe('.getTransactions()', function () {
    describe('with data in local storage in the given time', function () {
      beforeEach(function () {
        test.result = test.service.getTransactions();
      });

      it('should return one element', function () {
        expect(test.result.length).toBe(1);
      });
    });
  });

  describe('.update()', function () {
    describe('with more data in local storage than in the selected interval', function () {
      beforeEach(function () {
        test.service.update(test.data.transactions[0]);
      });

      it('should store all data', function () {
        expect(test.spies.storageService.set).toHaveBeenCalledWith('finance', {
          'transactions'  : test.data.transactionsSerialized,
          'balances'      : []
        });
      });
    });
  });
});
