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
        templateUrl: 'foundItems.html'
      };
    }
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var ctrl = this;
      ctrl.searchTerm = '';
      ctrl.found = [];
      ctrl.message = '';
  
      ctrl.narrow = function () {
        if (!ctrl.searchTerm) {
          ctrl.message = "Nothing found";
          ctrl.found = [];
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
      this.getMatchedMenuItems = function (searchTerm) {
        return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
          .then(function (response) {
            var allItems = response.data.menu_items;
            return allItems.filter(item =>
              item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
          });
      };
    }
  
  })();
  