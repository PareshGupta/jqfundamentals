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
    var $table = $("<table/>");
    for(var i = 0; i <= this.cacheData["drinks"].length; i++) {
      var row = $("<tr/>").appendTo($table);
      for(var j = 0; j <= this.cacheData["ratings"].length; j++) {
        var column = $("<td/>").appendTo(row);
        this.setupTable(i, j, column);
      }
    }
    $table.appendTo("body");
    this.bindEvents();
  }

  this.bindEvents = function() {
    this.bindEventOnRadioButtons();
    this.bindEventOnProducts();
    this.bindEventOnRatings();
  }

  // method to set the table Rows and Columns
  this.setupTable = function(index1, index2, column) {
    if(index1 == 0 && index2 > 0) {
      column.text(this.cacheData["ratings"][index2 - 1]).addClass("ratings");
    } else if(index1 > 0 && index2 == 0) {
      column.text(this.cacheData["drinks"][index1 - 1]).addClass("products");
    } else if(index1 > 0 && index2 > 0) {
      $("<input>", { type : "radio" }).appendTo(column);
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
      }   
    });
  }

  // binding event on ratings's when highlighted
  this.bindEventOnRatings = function() {
    var that = this;
    $(".ratings").on("click", function() {
      if($(".products.highlight").length) {
        that.highlightRating($(this));
        // getting the column index
        var columnIdx = $("td").index($(this));
        if($(".products.highlight").length) {
          $(".products.highlight").siblings()
                                  .find("input")
                                  .prop("checked", false)
                                  .eq(columnIdx - 1)
                                  .prop("checked", true);
        } 
      }
    });
  }

  // method to highlight product and rating on clicking the radio button
  this.bindEventOnRadioButtons = function() {
    var that = this;
    $("tr:not(:first)").each(function() {
      var $that = $(this);
      // bindind change event on radio buttons
      $that.find("input[type = 'radio']").on("change", function() {
        // getting checked radio button index
        var radioIdx = $that.find("input[type = 'radio']")
                            .prop("checked", false)
                            .index($(this).prop("checked", true));
        that.highlightRating(radioIdx);
        that.highlightProduct($that);   
      });
    });
  }

  // method to highlight the ratings
  this.highlightRating = function(choice) {
    if(choice >= 0) {
      $("td.ratings").removeClass("highlight")
                     .eq(choice)
                     .addClass("highlight");
    } else {
      $(".ratings").removeClass("highlight");
      choice.addClass("highlight");
    }
  }

  // method to highlight the products
  this.highlightProduct = function(obj) {
    $("td.products").removeClass("highlight");
    obj.find("td.products").addClass("highlight");
  }
}

$(function() {
  var product = new ProductRating();
  product.init();
});