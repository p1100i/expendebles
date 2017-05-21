define(['app'], function (app) {
  app.factory('settingService', ['storageService', function settingServiceFactory(storageService) {
    var
      categories = [],

      defaultCategory,

      createCategory = function createCategory(name, icon) {
        return {
          'name' : name,
          'icon' : icon
        };
      },

      addCategory = function addCategory(name, icon) {
        var
          category = createCategory(name, icon);

        categories.push(category);

        return category;
      },

      getDefaultCategory = function getDefaultCategory() {
        return defaultCategory;
      },

      getCategories = function getCategories() {
        return categories;
      },

      getCategoryIcon = function getCategoryIcon(name) {
        var
          category = categories.get(name, 'name');

        return category && category.icon;
      },

      init = function init() {
        defaultCategory = addCategory('groceries', 'shopping-cart');

        addCategory('utility', 'wrench');
        addCategory('salary', 'money');
      };

    init();

    return {
      'getCategories'       : getCategories,
      'getCategoryIcon'     : getCategoryIcon,
      'getDefaultCategory'  : getDefaultCategory
    };
  }]);
});
