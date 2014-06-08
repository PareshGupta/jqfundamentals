// [FIX] Use proper var/function names 

function OnlineStore() {
  this.cacheData = '';
  this.total = 0;
  
  this.init = function() {
    this.getJSON();
    this.productTab();
    this.myCartTab();
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
    this.buildingProducts();
    this.addProductsToCart();
    this.removeProduct();
    this.changeQuantity();
  }

  // method to create the elements in the div
  this.buildingProducts = function() {
    for(var company in this.cacheData) {
      // creating a div and span element
      var $div = $("<div/>", { class : "products" });
      var $span = $("<span>", { class : "details" });
      // creating image tag 
      $("<img>", { class : 'productImage1'}).attr("src", this.cacheData[company]["image"]).appendTo($div);
      // creating heading tag for the product name 
      $("<h2/>", { class : 'product-name'}).text(this.cacheData[company]["productName"]).appendTo($span);
      // creating paragraph tag for the details of the products
      $("<p/>").text("Category : " + this.cacheData[company]["category"]).appendTo($span);
      $("<p/>").text(this.cacheData[company]["details"]).appendTo($span);
      // creating heading tag for the price of the product
      $("<h2/>", { class : 'price'}).text("Price : " + this.cacheData[company]["price"])
                                    .data("price", this.cacheData[company]["price"])
                                    .appendTo($span);
      // creating span and input tag for the quantity
      $("<span>", { class : "quantity"}).text("Quantity : ").appendTo($div);
      $("<input>", { type : 'text', val : "1" }).appendTo($div);
      //  creating input button tag for adding items to cart
      $("<input>", { class : 'addItems', type : 'button', value : "Add to Cart" }).appendTo($div);
      $span.appendTo($div);
      $div.appendTo("#main-container");
    }
  }

  // method to bind click event on the product tab
  this.productTab = function() {
    $("#product-tab").on("click", function() {
      $(this).addClass("highlight").next().removeClass("highlight");
      $(".products").show();
      $("#mycart").hide();
    });
  }

  // method to bind event on the MyCart tab
  this.myCartTab = function() {
    $("#mycart-tab").on("click", function() {
      $(this).addClass("highlight").prev().removeClass("highlight");
      $("#mycart").show()
      $(".products").hide();
    });
  }

  // method to bind event on button "Add to MyCart"
  this.addProductsToCart = function() {
    var that = this;
    $(".addItems").click(function() {
      var cachePrice = $(this).siblings(".details").find(".price").data("price");
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
    $("<td>").html($("<input>", { type : "text"}).val(quantity).addClass("productQuantity")).appendTo($productRow);

    // fourth column subTotal
    $("<td>", { class : 'subtotal' }).text(subtotal).data("subtotal", subtotal).appendTo($productRow);

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
    $(".productQuantity").each(function() {
      that.quantity += parseInt($(this).val());
    });
    $("#mycart-tab").text("My Cart (" + that.quantity + ")" );
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
    // [FIX] instead of using text, use data-attrs
    var subTotal = parseFloat(obj.prev().text());
    this.total = this.total - subTotal;
    $("#total-price").val(this.total.toFixed(2));
    this.checkTotalQuantity();
  }

  // method to change quantity from the My Cart tab
  this.changeQuantity = function() {
    var that = this;
    $("table").on("change", ".productQuantity", function() {
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

