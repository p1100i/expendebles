define(['app'], function (app) {
  app.factory('settingService', ['storageService', function settingServiceFactory(storageService) {
    var
      CATEGORIES = [
        ['gro', 'groceries',  'shopping-cart'],
        ['uti', 'utility',    'wrench'],
        ['sal', 'salary',     'money']
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

      getDefaultCategory = function getDefaultCategory() {
        return defaultCategory;
      },

      getCategories = function getCategories() {
        return categories;
      },

      getCategoryIcon = function getCategoryIcon(id) {
        var
          category = categories.get(id, 'id');

        return category && category.icon;
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
      'getCategoryIcon'     : getCategoryIcon,
      'getDefaultCategory'  : getDefaultCategory
    };
  }]);
});
