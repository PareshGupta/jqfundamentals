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
    $table = $("<table/>");
    var that = this;
    for(var i = 0; i <= that.cacheData["drinks"].length; i++) {
      that.row = $("<tr/>").appendTo($table);
      for(var j = 0; j <= that.cacheData["ratings"].length; j++) {
        that.column = $("<td/>").appendTo(that.row);
        that.setupTable(i, j);
      }
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
      $(".products").removeClass("highlight");
      $(this).addClass("highlight");
      // getting the row index
      that.rowIdx = $("tr").index($(this).parent());

      $checkedRadioButton = $(this).parent().find("input[type = 'radio']:checked");
      if($checkedRadioButton.length) {
        // find index of the checked radio button and highlighting the corresponding rating
        var radioIdx = $(this).nextAll().index($checkedRadioButton.parent());
        $(".ratings").removeClass("highlight").eq(radioIdx).addClass("highlight");
      } else if($(".ratings.highlight").length) {
        // find index of the highlighted rating and checking the corresponding radio button
        var highlightedRatingIdx = $(".ratings").index($(".ratings.highlight"));
        $(this).siblings().eq(highlightedRatingIdx).children().prop("checked", true);
      } else {
        that.bindEventOnRatings(); 
      }
    });
  }

  // binding event on ratings's when highlighted
  this.bindEventOnRatings = function() {
    var that = this;
    $(".ratings").on("click", function() {
      $(".ratings").removeClass("highlight");
      $(this).addClass("highlight");
      // getting the column index
      that.columnIdx = $("td").index($(this));
      that.checkUncheckRadioButton();
    });
  }

  // method to check the radio button
  this.checkUncheckRadioButton = function() {
    // unchecking all radio buttons in the row
    $("tr").eq(this.rowIdx).find('input').prop("checked", false);
    // checking the radio button
    $("tr").eq(this.rowIdx).find('td').eq(this.columnIdx).children().prop("checked", true);
  }

  // method to highlight product and rating on clicking the radio button
  this.bindEventOnRadioButtons = function() {
    $("tr:not(:first)").each(function() {
      var $that = $(this);
      // bindind change event on radio buttons
      $that.find("input[type = 'radio']").on("change", function() {
        // getting checked radio button index
        var radioIdx = $that.find("input[type = 'radio']")
                            .prop("checked", false)
                            .index($(this));
        $(this).prop("checked", true);         
        // highlighting the rating tab corresponding to the radio button
        $("td.ratings").removeClass("highlight")
                       .eq(radioIdx)
                       .addClass("highlight");
        // highlighting the product tab corresponding to the radio button
        $("td.products").removeClass("highlight");
        $that.find("td.products").addClass("highlight");
      });
    });
  }
}

$(function() {
  var product = new ProductRating();
  product.init();
})