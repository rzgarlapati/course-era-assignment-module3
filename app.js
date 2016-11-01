(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController )
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', foundItemsDirective);


function foundItemsDirective(){

  var ddo = {
   templateUrl: 'foundItemList.html',
   scope: {
     items: '=',
     onRemove: '&'
 }

};

return ddo;
}






NarrowItDownController.$inject = ['MenuSearchService'];

function NarrowItDownController(MenuSearchService){

  var controller = this;

  controller.bookSearchTerm = "";
  controller.result = "";
  controller.found=[];
  this.searchForBook = function(bookSearchTerm){
    var promise = MenuSearchService.getSearchedBooks(bookSearchTerm);

    promise.then(function (response) {
      var items = response.data.menu_items;
      items.forEach(function (item) {
          var description = item.name.toLowerCase();
          if (description.indexOf(controller.bookSearchTerm) >= 0) {
              controller.found.push(item);
          }
      });



    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    });
  }

  controller.removeItem = function (itemIndex) {

    controller.found.splice(itemIndex,1);


  };

};






MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getSearchedBooks = function (bookSearchTerm) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
      data: { name: bookSearchTerm }
    });

    return response;

}
}

})();
