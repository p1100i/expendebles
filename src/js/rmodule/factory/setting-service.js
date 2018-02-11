define(['app'], function (app) {
  app.factory('settingService', ['storageService', function settingServiceFactory(storageService) {
    var
      CATEGORIES = [
        ['gro', 'groceries',  'shopping-cart'],
        ['uti', 'utility',    'wrench'],
        ['sal', 'salary',     'money'],
        ['inv', 'investment', 'diamond'],
        ['sho', 'shopping',   'shopping-bag'],
        ['eat', 'eating',     'cutlery'],
        ['hea', 'healthcare', 'medkit'],
        ['fue', 'fuel',       'car'],
        ['tra', 'transport',  'train'],
        ['hol', 'holiday',    'suitcase'],
        ['gif', 'gift',       'gift'],
        ['spo', 'sport',      'soccer-ball-o'],
        ['fun', 'fun',        'glass'],
        ['cul', 'culture',    'ticket']
      ],

      categories = [],

      defaultCategory,

      createCategory = function createCategory(id, name, icon) {
        return {
          'id'    : id,
          'name'  : name,
          'icon'  : icon
        };
      },

      addCategory = function addCategory(id, name, icon) {
        var
          category = createCategory(id, name, icon);

        categories.push(category);

        return category;
      },

      getDateFormat = function getDateFormat(short) {
        if (short) {
          return 'yyyy-MM-dd HH:mm';
        }

        return 'yyyy-MM-dd HH:mm:ss';
      },

      getDefaultCategory = function getDefaultCategory() {
        return defaultCategory;
      },

      getCategories = function getCategories() {
        return categories;
      },

      getCategory = function getCategory(id) {
        var
          category = categories.get(id, 'id');

        if (!category) {
          console.error('no category w/ id:', id);
        }
        return category;
      },

      init = function init() {
        var
          i,
          data,
          len = CATEGORIES.length;

        for (i = 0; i < len; i++) {
          data = CATEGORIES[i];

          addCategory(data[0], data[1], data[2]);
        }

        defaultCategory = categories[0];
      };

    init();

    return {
      'getCategories'       : getCategories,
      'getCategory'         : getCategory,
      'getDateFormat'       : getDateFormat,
      'getDefaultCategory'  : getDefaultCategory
    };
  }]);
});
