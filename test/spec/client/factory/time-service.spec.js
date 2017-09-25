describe('timeService', function () {
  var test;

  beforeEach(function () {
    test = this;

    module('app');

    var
      data = {},

      storageService = {
        'get' : function get() {
        },

        'set' : function set() {}
      },


      spies = {
        'storageService' : {
          'get' : spyOn(storageService, 'get').and.callThrough(),
          'set' : spyOn(storageService, 'set').and.callThrough()
        }
      },

      dependencies = {
        'storageService' : storageService
      },

      callInject = function callInject() {
        module(function ($provide) {
          var name;

          for (name in dependencies) {
            $provide.value(name, dependencies[name]);
          }
        });

        inject(['timeService', function (timeService) {
          test.service = timeService;
        }]);
      };

    test.data   = data;
    test.spies  = spies;

    callInject();
  });

  it('should sync w/ storage service', function () {
    expect(test.spies.storageService.get).toHaveBeenCalledWith('monthBeg');
  });
});
