(function () {
    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', FoundItemsDirective);
  
    function FoundItemsDirective() {
      return {
        restrict: 'E',
        scope: {
          items: '<',
          onRemove: '&'
        },
        template: `
          <ul>
            <li ng-repeat="item in items track by $index">
              {{ item.name }}, {{ item.short_name }}, {{ item.description }}
              <button ng-click="onRemove({ index: $index })">Don't want this one!</button>
            </li>
          </ul>
        `
      };
    }
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var ctrl = this;
      ctrl.searchTerm = "";
      ctrl.found = [];
      ctrl.message = "";
  
      ctrl.narrow = function () {
        ctrl.message = "";
        if (!ctrl.searchTerm || ctrl.searchTerm.trim() === "") {
          ctrl.found = [];
          ctrl.message = "Nothing found";
          return;
        }
  
        MenuSearchService.getMatchedMenuItems(ctrl.searchTerm).then(function (items) {
          ctrl.found = items;
          ctrl.message = items.length === 0 ? "Nothing found" : "";
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
        return $http.get("https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json")
          .then(function (response) {
            var allItems = response.data.menu_items;
            var foundItems = [];
  
            for (var i = 0; i < allItems.length; i++) {
              if (allItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                foundItems.push(allItems[i]);
              }
            }
            return foundItems;
          });
      };
    }
  })();
  