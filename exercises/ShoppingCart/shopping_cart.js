function OnlineStore() {
  this.cacheData = '';
  this.total = 0;
  
  this.init = function() {
    this.getJSON();
    this.showProducts();
    this.showMyCart();
  }

  // method to get the json
  this.getJSON = function() {
    var that = this;
    $.getJSON("shoppingcart.json")
      .done(function(data) {
        that.cacheData = data;
        that.setup();
      })
      .fail(function(data) {
        alert("Not able to load JSON");
      })
  }

  // method to setting up the product div's
  this.setup = function() {
    this.settingProducts();
    this.addProductsToCart();
    this.removeProduct();
    this.changeQuantity();
  }

  // method to create the elements in the div
  this.settingProducts = function() {
    var company = Object.keys(this.cacheData);
    for (var i = 0; i < company.length; i++) {
      var $div = $("<div/>", { class : "products" });
      var $span = $("<span>", { class : "details" });
      $("<img>", { class : 'productImage1'}).attr("src", this.cacheData[company[i]]["image"]).appendTo($div);
      $("<h2/>", { class : 'product-name'}).text(this.cacheData[company[i]]["productName"]).appendTo($span);
      $("<p/>").text("Category : " + this.cacheData[company[i]]["category"]).appendTo($span);
      $("<p/>").text(this.cacheData[company[i]]["details"]).appendTo($span);
      $("<h2/>", { class : 'price'}).text("Price : " + this.cacheData[company[i]]["price"]).appendTo($span);
      $("<span>", { class : "quantity"}).text("Quantity : ").appendTo($div);
      $("<input>", { type : 'text', val : "1" }).appendTo($div);
      $("<input>", { type : 'button', value : "Add to Cart" }).appendTo($div);
      $span.appendTo($div);
      $div.appendTo("#main-container");
    }
  }

  // method to bind click event on the product tab
  this.showProducts = function() {
    $("#product-list").on("click", function() {
      $(this).addClass("highlight")
             .siblings("#products-selected")
             .removeClass("highlight");
      $(".products").css("display", "block");
      $("#mycart").css("display", "none");
    });
  }

  // method to bind event on the MyCart tab
  this.showMyCart = function() {
    $("#products-selected").on("click", function() {
      $(this).addClass("highlight")
             .siblings("#product-list")
             .removeClass("highlight");
      $("#mycart").css("display", "block");
      $(".products").css("display", "none");
    });
  }

  // method to bind event on button "Add to MyCart"
  this.addProductsToCart = function() {
    var that = this;
    $(".products input[type = 'button']").click(function() {
      var cachePrice = $(this).siblings(".details").find(".price").text().replace("Price :", "");
      var cacheQuantity = $(this).siblings("input").val();
      // calculating total and add the value to the total
      var totalPrice = parseFloat((cachePrice * cacheQuantity).toFixed(2));
      // $("#total-price").val(totalPrice);
      that.insertRowToMyCart($(this), cachePrice, cacheQuantity, totalPrice);
    });
  }

  // method to insert rows and columns to the mycart tab
  this.insertRowToMyCart = function(obj, price, quantity, subtotal) {
    var $productRow = $("<tr>");
    var $imageAndName = $("<td>");
    // getting image
    var $productImage = obj.siblings("img").clone().removeClass("productImage1").addClass("productImage2")
    // inserting image
    $imageAndName.html($productImage);
    // inserting product Name
    var productName = obj.siblings(".details").find(".product-name").text();
    $imageAndName.append($("<h4>").text(productName));
    $imageAndName.appendTo($productRow);

    // second column Price
    $("<td>").appendTo($productRow).text(price);

    // third column quantity
    $("<td>").html($("<input>", { type : "text"}).val(quantity)).appendTo($productRow);

    // fourth column subTotal
    $("<td>", { class : 'subtotal' }).text(subtotal).appendTo($productRow);

    // fifth column 
    $("<button>").text("Remove").appendTo($productRow);

    $productRow.appendTo($("table"));

    this.calculateTotalPrice(subtotal);
    this.checkTotalQuantity();
  }
  
  // calculating Total price
  this.calculateTotalPrice = function(subtotal) {
    this.total += subtotal;
    $("#total-price").val(this.total.toFixed(2));
  }
  
  // method to calculate the total quantity
  this.checkTotalQuantity = function() {
    var that = this;
    that.quantity = 0;
    $("table input[type = 'text']").each(function() {
      that.quantity += parseInt($(this).val());
    });
    $("#products-selected").text("My Cart (" + that.quantity + ")" );
  }

  // method to remove the product from the cart
  this.removeProduct = function() {
    var that = this;
    $("table").on("click", "button", function(event) {
      $(this).parents("tr").remove();
      that.recalculateTotal($(this)); 
    });
  }

  // method to recalculate total price after removing the product
  this.recalculateTotal = function(obj) {
    var subTotal = parseFloat(obj.prev().text());
    this.total = this.total - subTotal;
    $("#total-price").val(this.total.toFixed(2));
    this.checkTotalQuantity();
  }

  // method to change quantity from the My Cart tab
  this.changeQuantity = function() {
    var that = this;
    $("table").on("change", "input[type = 'text']", function() {
      that.checkTotalQuantity();
      that.recalculateSubTotal($(this));
    }) 
  }

  // method to calculate the subtotal after changing the quantity
  this.recalculateSubTotal = function(obj) {
    var subtotal = parseFloat(obj.parent().prev().text()) * obj.val();
    obj.parent().next().text(subtotal.toFixed(2));
    this.recalculateTotalPrice();
  }

  // method to calculate the total price after changing the quantity
  this.recalculateTotalPrice = function() {
    var that = this;
    that.total = 0;
    $(".subtotal").each(function() {
      that.total = parseFloat($(this).text()) + that.total;
      // alert($(this).text());
      $("#total-price").val(that.total.toFixed(2));
    });
  }
}

$(function() {
  var shoppingCart = new OnlineStore();
  shoppingCart.init();
});

