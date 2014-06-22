var RestaurantApp = {
  seedData : [],

  init : function() {
    $.getJSON("data.json")
      .done(function(data) {
        RestaurantApp.seedData = data;
        console.log(RestaurantApp.seedData);
        RestaurantApp.setup();
      })
      .fail(function() {
        alert("Not able to load JSON");
      });
  },

  setup : function() {
    Menu.setup();
    this.bindEvents(); 
  },

  bindEvents : function() {
    this.bindEventOnResetButton();
    RestaurantApp.Menu.bindEvents();
    RestaurantApp.Order.bindEvents();
  },

  // method to bind event on the reset button
  bindEventOnResetButton : function() {
    $("#reset").on("click", function() {
      RestaurantApp.reset();  
    });
  },

  reset : function() {
    $("#menu-container td").removeClass("highlight");
    $("#current-order-section td").remove();
    $("#total-price").text("Rs 0/-");
  },
}

RestaurantApp.Menu = {
  bindEvents : function() {
    this.clickEventOnMenuItems();
  },

  clickEventOnMenuItems : function() {
    $("#Breads, #Vegetables, #Sauces").on('click', 'td', function() {

      // highlighting the menu-item selected
      $(this).toggleClass("highlight").attr("data-name", name);
      $(this).parent().siblings().find('td').removeClass("highlight");

    });
  }
}

RestaurantApp.Order = {
  bindEvents : function() {
    this.clickEventOnButton();
  },

  clickEventOnButton : function() {
    $("#place-order").on("click", function() {
      var name = prompt("Please enter your Name to place an order");
      if(name) {
        alert("you placed an order");
        RestaurantApp.reset();
      }
    });
  }
}


//  Menu Class
var Menu = {
  setup : function() {
    for(var i = 0; i < Object.keys(RestaurantApp.seedData).length; i++) {
      var $menu = $("<table>", {id :  Object.keys(RestaurantApp.seedData)[i]});
      var $row = $("<tr>").appendTo($menu);
      var $menuHeader = $("<th>").text(Object.keys(RestaurantApp.seedData)[i]).appendTo($row);
      for(var j = 0; j < RestaurantApp.seedData[Object.keys(RestaurantApp.seedData)[i]].length; j++) {
        var $itemRow =$("<tr>").appendTo($menu);  
        $column = $("<td>").appendTo($itemRow);
        $("<p>").text(RestaurantApp.seedData[Object.keys(RestaurantApp.seedData)[i]][j]["name"]).appendTo($column);
        $("<p>", {class : 'quantity'}).text(RestaurantApp.seedData[Object.keys(RestaurantApp.seedData)[i]][j]["quantity"]).appendTo($column);
        $("<p>", {class : 'price'}).text(RestaurantApp.seedData[Object.keys(RestaurantApp.seedData)[i]][j]["price"] +"/-").appendTo($column);
      }
    $menu.appendTo("#menu-container");
    }
  }
}

//  Order Class
function Order() {
  this.current = true;
  this.menuItems =[];
}

Order.prototype.addMenuItem = function(menu_item) {

}

$(function() {
  RestaurantApp.init();
})