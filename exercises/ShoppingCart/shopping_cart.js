function OnlineStore() {
  this.cacheData = '';
  
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
    this.bindEventToAddProduct();
    this.removeProduct();
    this.bindEventOnQuantity();
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
  this.bindEventToAddProduct = function() {
    var that = this;
    $(".addItems").click(function() {
      that.insertProductToCart($(this));
    });
  }

  // method to insert rows and columns to the mycart tab
  this.insertProductToCart = function(obj) {
    var $productRow = $("<tr>");
    var $imageAndName = $("<td>");
    // getting image
    var $productImage = obj.siblings("img").clone().removeClass("productImage1").addClass("productImage2")
    // inserting image
    $imageAndName.html($productImage);
    // inserting product Name
    var productName = obj.siblings(".details").find(".product-name").text();
    $imageAndName.append($("<h4>", { text : productName }));
    $imageAndName.appendTo($productRow);

    // second column Price
    var price = obj.siblings(".details").find(".price").data("price");
    $("<td>", { text : price }).data("price", price).appendTo($productRow);

    // third column quantity
    var quantity = obj.siblings("input").val();
    $("<td>").html($("<input>", { class : 'productQuantity', type : "text", value : quantity })).appendTo($productRow);

    // fourth column subTotal
    var subTotal = parseFloat((price * quantity).toFixed(2));
    $("<td>", { class : 'subtotal', text : subTotal }).data("subtotal", subTotal).appendTo($productRow);

    // fifth column 
    $("<button>", { text : 'Remove' }).appendTo($productRow);

    $productRow.appendTo($("table"));

    this.calculateTotalPrice();
    this.checkTotalQuantity();
  }
  
  // method to calculate total price of the products in the cart
  this.calculateTotalPrice = function() {
    var that = this;
    var totalPrice = 0;
    $(".subtotal").each(function () {
      totalPrice += $(this).data("subtotal");
    });
    $("#total-price").val(totalPrice.toFixed(2));
  }
  
  // method to calculate the total quantity of the products in the cart
  this.checkTotalQuantity = function() {
    var that = this;
    var totalQuantity = 0;
    $(".productQuantity").each(function() {
      totalQuantity += parseInt($(this).val());
    });
    $("#mycart-tab").text("My Cart (" + totalQuantity + ")" );
  }

  // method to remove the product from the cart
  this.removeProduct = function() {
    var that = this;
    $("table").on("click", "button", function(event) {
      $(this).parent("tr").remove();
      that.calculateTotalPrice(); 
      that.checkTotalQuantity();
    });
  }

  // method to change quantity from the My Cart tab
  this.bindEventOnQuantity = function() {
    var that = this;
    $("table").on("change", ".productQuantity", function() {
      that.checkTotalQuantity();
      that.calculateSubTotal($(this));
    });
  }

  // method to calculate the subtotal after changing the quantity
  this.calculateSubTotal = function(obj) {
    var subtotal = parseFloat(obj.parent().prev().data("price")) * obj.val();
    obj.parent().next().data("subtotal", subtotal).text(subtotal.toFixed(2));
    this.calculateTotalPrice();
  }
}

$(function() {
  var shoppingCart = new OnlineStore();
  shoppingCart.init();
});

