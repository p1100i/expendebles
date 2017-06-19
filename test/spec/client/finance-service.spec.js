describe('financeService', function () {
  var test;

  beforeEach(function () {
    test = this;

    module('app');

    var
      data = {
        'itemsSerialized' : [
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
            'items' : data.itemsSerialized.clone()
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

  describe('.getItems()', function () {
    describe('with data in local storage in the given time', function () {
      beforeEach(function () {
        test.result = test.service.getItems();
      });

      it('should return one element', function () {
        expect(test.result.length).toBe(1);
      });
    });
  });

  describe('.save()', function () {
    describe('with more data in local storage than in the selected interval', function () {
      beforeEach(function () {
        test.service.save();
      });

      it('should store all data', function () {
        expect(test.spies.storageService.set).toHaveBeenCalledWith('finance', {
          'items' : test.data.itemsSerialized
        });
      });
    });
  });
});