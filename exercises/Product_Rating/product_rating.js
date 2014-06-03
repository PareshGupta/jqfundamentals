function ProductRating() {
  this.cacheData = '';

  this.init = function() {
    this.getJSON();
  }

  // method to get the JSON data
  this.getJSON = function() {
    var that = this;
    $.getJSON("data.json")
      .done(function(data) {
        that.cacheData = data;
        that.createTable();
      })
      .fail(function(data) {
        alert("Not able to load JSON");
      })
  }

  // method to create Rows and Columns in the table
  this.createTable = function() {
    // [FIX] use var before declaring variable
    $table = $("<table/>");
    var that = this;
    // [FIX] loop is running more than it should run
    for(var i = 0; i <= that.cacheData["drinks"].length; i++) {
      // [FIX] don't use row as function property, it shud be a simple variable
      that.row = $("<tr/>").appendTo($table);
      for(var j = 0; j <= that.cacheData["ratings"].length; j++) {
      // [FIX] don't use row as function property, it shud be a simple variable
        that.column = $("<td/>").appendTo(that.row);
        that.setupTable(i, j);
      }
      // [FIX] append table should be present out of the loop
      $table.appendTo("body");
    }
    that.bindEventOnRadioButtons();
    that.bindEventOnProducts();
  }

  // method to set the table Rows and Columns
  this.setupTable = function(index1, index2) {
    if(index1 == 0 && index2 > 0) {
      this.column.text(this.cacheData["ratings"][index2 - 1]).addClass("ratings");
    } else if(index1 > 0 && index2 == 0) {
      this.column.text(this.cacheData["drinks"][index1 - 1]).addClass("products");
    } else if(index1 > 0 && index2 > 0) {
      $("<input>", { type : "radio" }).appendTo(this.column);
    }
  }

  // binding events on products when highlighted
  this.bindEventOnProducts = function() {
    var that = this;
    $(".products").on("click", function() {
      $(".products, .ratings").removeClass("highlight");
      $(this).addClass("highlight");
      // getting the checkedRadioButton 
      $checkedRadioButton = $(this).parent().find("input[type = 'radio']:checked");
      if($checkedRadioButton.length) {
        // find index of the checked radio button and highlighting the corresponding rating
        var radioIdx = $(this).nextAll().index($checkedRadioButton.parent());
        $(".ratings").eq(radioIdx).addClass("highlight");
      } else {
        // [FIX] eventlistener is getting attached multiple times, instead it should attach once
        that.bindEventOnRatings(); 
      }
    });
  }

  // binding event on ratings's when highlighted
  this.bindEventOnRatings = function() {
    $(".ratings").on("click", function() {
      $(".ratings").removeClass("highlight");
      $(this).addClass("highlight");
      // getting the column index
      var columnIdx = $("td").index($(this));
      if($(".products.highlight").length) {
        $(".products.highlight").siblings()
                                .find("input")
                                .prop("checked", false)
                                .eq(columnIdx - 1)
                                .prop("checked", true);
      } 
    });
  }

  // method to highlight product and rating on clicking the radio button
  this.bindEventOnRadioButtons = function() {
    $("tr:not(:first)").each(function() {
      var $that = $(this);
      // bindind change event on radio buttons
      $that.find("input[type = 'radio']").on("change", function() {
        // getting checked radio button index
        // [FIX] fetch only checked radio buttons
        var radioIdx = $that.find("input[type = 'radio']")
                            .prop("checked", false)
                            .index($(this));
        $(this).prop("checked", true);
        
        // highlighting the rating tab corresponding to the radio button
        // [FIX] extract out code to highlight columns in a diff function
        $("td.ratings").removeClass("highlight")
                       .eq(radioIdx)
                       .addClass("highlight");
        // highlighting the product tab corresponding to the radio button
        $("td.products").removeClass("highlight");
        $that.find("td.products").addClass("highlight");
      });
    });
    
    // [FIX] this is getting called on page load
    this.bindEventOnRatings();
  }
}

$(function() {
  var product = new ProductRating();
  product.init();
})