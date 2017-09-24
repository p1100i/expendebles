describe('statisticController', function () {
  var test;

  beforeEach(function () {
    test = this;

    module('app');

    var
      categories = {
        'sport' : {
          'id'    : 'spo',
          'name'  : 'sport',
          'icon'  : 'soccer-ball-o'
        },

        'salary' : {
          'id'    : 'sal',
          'name'  : 'salary',
          'icon'  : 'money'
        },

        'fun' : {
          'id'    : 'fun',
          'name'  : 'fun',
          'icon'  : 'fun'
        }
      },

      data = {
        'categories' : categories
      },

      financeService = {
        'getItems' : function getItems() { return []; }
      },

      spies = {
        'financeService' : {
          'getItems' : spyOn(financeService, 'getItems').and.callThrough()
        }
      },

      dependencies  = {
        'financeService' : financeService
      },

      injectCtrl = function injectCtrl() {
        inject(['$controller', '$rootScope', function ($controller, $rootScope) {
          dependencies.$scope = $rootScope.$new();

          test.ctrl = $controller('statisticController', dependencies);
        }]);
      };

    test.data       = data;
    test.spies      = spies;
    test.injectCtrl = injectCtrl;
  });

  it('should set sum properties', function () {
    test.injectCtrl();

    expect(test.ctrl.sum).toEqual({
      'expense'       : 0,
      'expenseWidth'  : 0,
      'income'        : 0,
      'incomeWidth'   : 0,
      'total'         : 0
    });
  });

  describe('with an item', function () {
    beforeEach(function () {
      test.spies.financeService.getItems.and.returnValue([
        {
          'amount'    : 10,
          'category'  : test.data.categories.sport,
          'expense'   : true
        }
      ]);
    });

    it('should cancel out the value', function () {
      test.injectCtrl();

      expect(test.ctrl.sum).toEqual({
        'expense'       : 10,
        'expenseWidth'  : 260,
        'income'        : 0,
        'incomeWidth'   : 0,
        'total'         : 10
      });
    });

    it('should add to expense groups', function () {
      test.injectCtrl();

      expect(test.ctrl.expenseGroups.length).toBe(1);
    });
  });

  describe('with opposite equal-category items', function () {
    beforeEach(function () {
      test.spies.financeService.getItems.and.returnValue([
        {
          'amount'    : 10,
          'category'  : test.data.categories.sport,
          'expense'   : true
        },
        {
          'amount'    : 10,
          'category'  : test.data.categories.sport,
          'expense'   : false
        }
      ]);
    });

    it('should sanitize groups with zero values', function () {
      test.injectCtrl();

      expect(test.ctrl.expenseGroups).toEqual([]);
      expect(test.ctrl.incomeGroups).toEqual([]);
    });

    it('should cancel out the value', function () {
      test.injectCtrl();

      expect(test.ctrl.sum).toEqual({
        'expense'       : 0,
        'expenseWidth'  : 0,
        'income'        : 0,
        'incomeWidth'   : 0,
        'total'         : 0
      });
    });
  });

  describe('with equal / mixed items', function () {
    beforeEach(function () {
      test.spies.financeService.getItems.and.returnValue([
        {
          'amount'    : 40,
          'category'  : test.data.categories.fun,
          'expense'   : true
        },
        {
          'amount'    : 20,
          'category'  : test.data.categories.sport,
          'expense'   : true
        },
        {
          'amount'    : 10,
          'category'  : test.data.categories.sport,
          'expense'   : false
        },
        {
          'amount'    : 40,
          'category'  : test.data.categories.salary,
          'expense'   : false
        }
      ]);
    });

    it('should set groups', function () {
      test.injectCtrl();

      expect(test.ctrl.expenseGroups.length).toBe(2);
      expect(test.ctrl.expenseGroups[0].id).toBe('fun');
      expect(test.ctrl.incomeGroups.length).toBe(1);
    });

    it('should calculate sum values', function () {
      test.injectCtrl();

      expect(test.ctrl.sum).toEqual({
        'expense'       : 50,
        'expenseWidth'  : 145,
        'income'        : 40,
        'incomeWidth'   : 115,
        'total'         : 90
      });
    });
  });
});
