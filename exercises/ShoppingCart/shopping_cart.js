function OnlineStore() {
  this.cacheData = '';
  this.total = 0;
  this.quantity = 0;
  $("#products-selected").text("My Cart (" + this.quantity + ")" );

  this.getJSON = function() {
    var that = this;
    $.getJSON("shoppingcart.json")
      .done(function(data) {
        that.cacheData = data;
        that.settingDiv();
      })
      .fail(function(data) {
        alert("Not able to load JSON");
      })
  }

  this.settingDiv = function() {
    // setting up div for Apple
    var $div = $("<div/>", { class : "products" });
    var $span = $("<span>", { class : "details" });
    $("<img>", { class : 'productImage1'}).attr("src", this.cacheData["Apple"][0]).appendTo($div);
    $("<h2/>", { class : 'product-name'}).text(this.cacheData["Apple"][1]).appendTo($span);
    $("<p/>").text(this.cacheData["Apple"][2]).appendTo($span);
    $("<p/>").text(this.cacheData["Apple"][3]).appendTo($span);
    $("<h2/>", { class : 'price'}).text(this.cacheData["Apple"][4]).appendTo($span);
    $("<span>", { class : "quantity"}).text("Quantity : ").appendTo($div);
    $("<input>", { type : 'text', val : "0" }).appendTo($div);
    $("<input>", { type : 'button', value : "Add to Cart" }).appendTo($div);
    $span.appendTo($div);
    $div.appendTo("#main-container");


    //setting up div for Sony  
    var $div = $("<div/>", { class : "products" });
    var $span = $("<span>", { class : "details" });
    $("<img>", { class : 'productImage1'}).attr("src", this.cacheData["Sony"][0]).appendTo($div);
    $("<h2/>", { class : 'product-name'}).text(this.cacheData["Sony"][1]).appendTo($span);
    $("<p/>").text(this.cacheData["Sony"][2]).appendTo($span);
    $("<p/>").text(this.cacheData["Sony"][3]).appendTo($span);
    $("<h2/>", { class : 'price'}).text(this.cacheData["Sony"][4]).appendTo($span);
    $("<span>", { class : "quantity"}).text("Quantity : ").appendTo($div);
    $("<input>", { type : 'text', val : "0" }).appendTo($div);
    $("<input>", { type : 'button', value : "Add to Cart" }).appendTo($div);
    $span.appendTo($div);
    $div.appendTo("#main-container");

    // setting up div for Canon
    var $div = $("<div/>", { class : "products" });
    var $span = $("<span>", { class : "details" });
    $("<img>", { class : 'productImage1'}).attr("src", this.cacheData["Canon"][0]).appendTo($div);
    $("<h2/>", { class : 'product-name'}).text(this.cacheData["Canon"][1]).appendTo($span);
    $("<p/>").text(this.cacheData["Canon"][2]).appendTo($span);
    $("<p/>").text(this.cacheData["Canon"][3]).appendTo($span);
    $("<h2/>", { class : 'price'}).text(this.cacheData["Canon"][4]).appendTo($span);
    $("<span>", { class : "quantity"}).text("Quantity : ").appendTo($div);
    $("<input>", { type : 'text', val : "0" }).appendTo($div);
    $("<input>", { type : 'button', value : "Add to Cart" }).appendTo($div);
    $span.appendTo($div);
    $div.appendTo("#main-container");

    this.addProductsToCart();
  }

  // method to bind click event on the product tab
  this.showProducts = function() {
    $("#product-list").on("click", function() {
      $(this).addClass("highlight").siblings("#products-selected").removeClass("highlight");
      $(".products").css("display", "block");
      $("#mycart").css("display", "none");
    });
  }

  // method to bind event on the MyCart tab
  this.showMyCart = function() {
    $("#products-selected").on("click", function() {
      $(this).addClass("highlight").siblings("#product-list").removeClass("highlight");
      $("#mycart").css("display", "block");
      $(".products").css("display", "none");
    });
  }

  // method to bind event on button "Add to MyCart"
  this.addProductsToCart = function() {
    var that = this;
    $(".products input[type = 'button']").on("click", function() {
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
    $addedProductRow = $("<tr>");
    $firstColumn = $("<td>");
    // inserting image
    $firstColumn.html(obj.siblings("img").clone().removeClass("productImage1").addClass("productImage2"));
    // inserting product Name
    var productName = obj.siblings(".details").find(".product-name").text();
    $firstColumn.append($("<h4>").text(productName));
    $firstColumn.appendTo($addedProductRow);

    // second column Price
    $("<td>").appendTo($addedProductRow).text(price);

    // third column quantity
    var $thirdColumn = $("<input>", { type : "text"}).val(quantity).appendTo($("<td>"));
    $thirdColumn.appendTo($addedProductRow);

    // fourth column subTotal
    $("<td>", { class : 'subtotal' }).appendTo($addedProductRow).text(subtotal);

    // fifth column 
    $("<button>").text("Remove").appendTo($addedProductRow);

    $addedProductRow.appendTo($("table"));

    // calculating Total price
    this.total += subtotal;
    $("#total-price").val(this.total.toFixed(2));

    // this.newSubtotalOnchangeQuantity();
    this.removeProduct();
    this.totalQuantity();
  }

  // method to remove the product from the cart
  this.removeProduct = function() {
    var that = this;
    $("table button").on("click", function(event) {
      that.recalculateTotal($(this)); 
      $(this).parents("tr").remove();
    });
  }

  // method to recalculate total price
  this.recalculateTotal = function(obj) {
    var subTotal = parseFloat(obj.prev().text());
    this.total = this.total - subTotal;
    $("#total-price").val(this.total.toFixed(2));
  }

  // method to calculate the total quantity
  this.totalQuantity = function() {
    var that = this;
    $("table input[type = 'text']").each(function() {
      that.quantity += parseInt($(this).val());
      $("#products-selected").text("My Cart (" + that.quantity + ")" );
    });
  }

}

$(function() {
  var shoppingCart = new OnlineStore();
  shoppingCart.getJSON();
  shoppingCart.showProducts();
  shoppingCart.showMyCart();
});

