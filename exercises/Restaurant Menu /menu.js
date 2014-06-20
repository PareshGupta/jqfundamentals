var App = {
  seedData : [],

  init : function() {
    $.getJSON("data.json")
      .done(function(data) {
        App.seedData = data;
        App.setup();
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
    App.Menu.bindEvents();
    App.CurrentOrder.bindEvents();
    this.bindEventOnResetButton();
  },

  // method to bind event on the reset button
  bindEventOnResetButton : function() {
    $("#reset").on("click", function() {
      App.resetApp();  
      $(".orders").remove();
      $("#total-sales").val(0);
    });
  },

  // method to reset the menu 
  resetApp : function() {
    $("#menu-container td").removeClass("highlight");
    $("#current-order-section td").remove();
    $("#total-price").val("Rs 0/-");
  },

  // method to calculate the total sales
  totalSales : function() {
    var count = 0;
    $(".confirm-order-price").each(function() {
      count += parseInt($(this).val());
    });
    $("#total-sales").val(count);
  }

}

App.Menu = {
  bindEvents : function() {
    this.clickEventOnMenuItems();
  },

  clickEventOnMenuItems : function() {
    $("#bread-section, #vegetable-section, #sauce-section").on('click', 'td', function() {
      // get item-name, quantity, price 
      var name = $(this).find("span").text();
      var price = $(this).find(".price").val();
      
      // calculating quantity
      var quantity = parseInt($(this).find(".quantity").val());
      // $(this).find(".quantity").val(quantity - 1);

      // getting table id
      var getId = $(this).parents("table").attr("id");
  
      // highlighting the menu-item selected
      $(this).toggleClass("highlight").attr("data-name", name).addClass(getId);
      $(this).parent().siblings().find('td').removeClass("highlight " + getId);

      // condition to add or remove the items from the current order
      if($(this).hasClass("highlight")) {
        App.CurrentOrder.addMenuItems(name, price, getId);
      } else {
        App.CurrentOrder.removeMenuItems(name);
      }
    });
  },
}

App.CurrentOrder = {
  bindEvents : function() {
    this.clickEventOnButton();
  },

  addMenuItems : function(name, price, attr) {
    $("tr." + attr).remove();
    var $row = $("<tr>", {class : attr}).attr("data-name", name);
    $("<td>", {class : "item"}).text(name).appendTo($row);
    $("<td>", {class : "item-price"}).text(price).appendTo($row);
    $row.appendTo("#current-order-section");
    this.calculateTotal();
  },

  removeMenuItems : function(name, quantity) {
    $("#current-order-section tr[data-name='" + name +"']").remove();
    this.calculateTotal();
  },

  calculateTotal : function() {
    var count = 0;
    $("#current-order-section td.item-price").each(function() {
      count += parseInt($(this).text());
    });
    $("#total-price").val(count);
  },

  clickEventOnButton : function() {
    $("#place-order").on("click", function() {
      var name = prompt("Please enter your Name to place an order");
      if(name) {
        PlacedOrder.setup(name);
        App.resetApp();
      }
    });
  }
}

// Menu object 
var Menu = {
  setup : function() {
    this.setupBreadMenu();
    this.setupVegetableMenu();
    this.setupSauceMenu();
  },

  setupBreadMenu : function() {
    for(var i = 0; i < App.seedData['breads'].length; i++) {
      var $row = $("<tr>");
      var $breadColumn = $("<td>");
      var menuItem = App.seedData["breads"][i]
      $("<span>").text(menuItem).appendTo($breadColumn);
      $("<input>", {class : 'quantity', readonly : "readonly"}).val(App.seedData[menuItem]["quantity"]).appendTo($breadColumn);
      $("<input>", {class : 'price', readonly : "readonly"}).val(App.seedData[menuItem]["price"] +"/-").appendTo($breadColumn);
      $breadColumn.appendTo($row);
      $row.appendTo("#bread-section");
    }
  },

  setupVegetableMenu : function() {
    for(var i = 0; i < App.seedData['vegetables'].length; i++) {
      var $row = $("<tr>");
      var $breadColumn = $("<td>");
      var menuItem = App.seedData["vegetables"][i]
      $("<span>").text(menuItem).appendTo($breadColumn);
      $("<input>", {class : 'quantity', readonly : "readonly"}).val(App.seedData[menuItem]["quantity"]).appendTo($breadColumn);
      $("<input>", {class : 'price', readonly : "readonly"}).val(App.seedData[menuItem]["price"] +"/-").appendTo($breadColumn);
      $breadColumn.appendTo($row);
      $row.appendTo("#vegetable-section");
    }
  },

  setupSauceMenu : function() {
    for(var i = 0; i < App.seedData['sauces'].length; i++) {
      var $row = $("<tr>");
      var $breadColumn = $("<td>");
      var menuItem = App.seedData["sauces"][i]
      $("<span>").text(menuItem).appendTo($breadColumn);
      $("<input>", {class : 'quantity', readonly : "readonly"}).val(App.seedData[menuItem]["quantity"]).appendTo($breadColumn);
      $("<input>", {class : 'price', readonly : "readonly"}).val(App.seedData[menuItem]["price"] +"/-").appendTo($breadColumn);
      $breadColumn.appendTo($row);
      $row.appendTo("#sauce-section");
    }
  }
}

var PlacedOrder = {
  setup : function(name) {
    var total = $("#total-price").val();
    var $order = $("<div>", { class : 'orders'});
    $("<p>").text(name).appendTo($order);
    $("#current-order-section td.item").each(function() {
      var itemName = $(this).text();
      var itemPrice = $(this).next().text();
      $("<p>").html("<span class='placed-order'>" + itemName + "</span><span class='placed-order'>" + itemPrice + "</span").appendTo($order)
    });
    $("<span>").text("Total Price: ").appendTo($order);
    $("<input>", {class : 'confirm-order-price'}).val(total).appendTo($order);
    $order.appendTo("#placed-order-section");
    App.totalSales();
  }
}


$(function() {
  App.init();
})