(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService);

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this;
    ctrl.searchTerm = '';
    ctrl.found = [];
    ctrl.searched = false;

    ctrl.narrowDown = function () {
      ctrl.searched = true;

      // If searchTerm is empty or only whitespace, clear results and return
      if (!ctrl.searchTerm.trim()) {
        ctrl.found = [];
        return;
      }

      MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
        .then(function (matchedItems) {
          ctrl.found = matchedItems;

          // If no items are found, set `searched` to true to show a message
          if (ctrl.found.length === 0) {
            ctrl.message = "Nothing found!";
          } else {
            ctrl.message = "";
          }
        })
        .catch(function () {
          ctrl.found = [];
          ctrl.message = "Error fetching data!";
        });
    };

    ctrl.removeItem = function (index) {
      ctrl.found.splice(index, 1);
    };
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
        .then(function (response) {
          var allItems = response.data;
          var found = [];

          // Ensure `allItems` is valid
          if (!allItems) {
            return found;
          }

          // Iterate through all categories and their menu items
          for (var key in allItems) {
            if (allItems.hasOwnProperty(key)) {
              var category = allItems[key];
              var items = category.menu_items;

              // Ensure `items` is valid before iterating
              if (Array.isArray(items)) {
                for (var i = 0; i < items.length; i++) {
                  var item = items[i];
                  if (item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                    found.push(item);
                  }
                }
              }
            }
          }
          return found;
        });
    };
  }
})();
