// Object of Products
function ProductGrid() {  
  this.createGrid = function() {
    var $grid = $("<div>", {id : "product-grid"});
    for(var i = 0; i < this.cacheProductData.length; i++) {
      $("<img>", { src : "images/" + this.cacheProductData[i]["url"]}).addClass(this.setClassAttribute(this.cacheProductData[i]["brand"]))
                                                                      .addClass(this.cacheProductData[i]["color"].toLowerCase())
                                                                      .addClass(this.cacheProductData[i]["sold_out"])
                                                                      .addClass("all")
                                                                      .appendTo($grid);
    }
    $grid.appendTo("body");
    this.bindEventOnCheckboxes();
  }

  // method to set the data-brand value to lower case
  this.setClassAttribute = function(value) {
    var string = value.toLowerCase();
    return string.slice(-1);
  }
}

// Object of Categories 
function Categories() {
  // method to create filter column
  this.createFilterColumn = function() {
    var $filterColumn = $("<div>", {id : 'filters'});
    this.createCategories($filterColumn, "Brands");
    this.createCategories($filterColumn, "Colors");
    this.creatRadioButton($filterColumn);
    $filterColumn.appendTo("body");
    this.bindEventOnRadio();
  }

  // method to create brand and color categories
  this.createCategories = function(obj, option) {
    var $category = $("<div>", {id : option}).appendTo(obj);
    $("<h4>").text(option).appendTo($category);
    var $checkbox = $("<input>", { type : 'checkbox'});
    var data = this.cacheFilterData[option];
    // for brand checkboxes value;
    var value = this.cacheFilterData["value"];
    for(var i = 0; i < data.length ; i++) {
      var $para = $("<p>").appendTo($category);
      if(option == "Brands") {
        $("<input>", {id : option + i, type : "checkbox", value : value[i]}).appendTo($para);
        $("<label>", {for : option + i, text : data[i]}).appendTo($para); 
      } else {
        $("<input>", {id : option + i, type : "checkbox", value : data[i].toLowerCase()}).appendTo($para);
        $("<label>", {for : option + i, text : data[i]}).appendTo($para); 
      }
    }
  }

  // method to create radio button 
  this.creatRadioButton = function(obj) {
    var $allProduct = $("<p>").appendTo(obj);
    var $available = $("<p>").appendTo(obj);
    $("<input>", { type : "radio", name : "toggle", id : "all", checked : "checked" }).appendTo($allProduct);
    $("<label>", { for : "all", text : "All Products" }).appendTo($allProduct);
    $("<input>", { type : "radio", name : "toggle", id : "available", value : "0" }).appendTo($available);
    $("<label>", { for : "available", text : "Available Products" }).appendTo($available);
  }

  // binding event on radio button
  this.bindEventOnRadio = function() {
    var that = this;
    $("input[type = 'radio']").on("click", function() {
      if($("#all").prop("checked")) {
        $("img").show();
      } else {
        $("img").hide();
        $("img.0").show();
      }
    });
  }
}

Categories.prototype = new ProductGrid();

// Object to fetch JSON data
function JSON() {
  this.cacheProductData = "";
  this.cacheFilterData = "";

  // method to fetch Product Json 
  this.getProductData = function() {
    var that = this;
    $.getJSON("product.json")
      .done(function(data) {
        that.cacheProductData = data;
        that.createGrid();
      })
      .fail(function() {
        alert("JSON unable to load");
      })
  }

  // method to fetch Filter Json 
  this.getFilterData = function() {
    var that = this;
    $.getJSON("filter.json")
      .done(function(data) {
        that.cacheFilterData = data;
        that.createFilterColumn();
      })
      .fail(function() {
        alert("JSON unable to load");
      })
  }
}

JSON.prototype = new Categories();

// Object for Filtering Products
function Filter() {

  this.init = function() {
    this.getFilterData();
    this.getProductData();
  }

  // binding event on all checkboxes
  this.bindEventOnCheckboxes = function() {
    var that = this;
    $("#Brands, #Colors").on("change", "input[type = 'checkbox']", function() {
      that.displayProductsBasedOnRadioButton();
    });
  }

  // Displaying products based on checked radio button
  this.displayProductsBasedOnRadioButton = function() {
    if($("#available").prop("checked")) {
      this.displayProductsBasedOnFilters(".0");
    } else {
      this.displayProductsBasedOnFilters(".all");
    }
  }

  // Displaying products based 
  this.displayProductsBasedOnFilters = function(choice) {
    $("img" + choice).hide();
    var str = ""
    var $Brands = $("#Brands input:checked");
    var $Colors = $("#Colors input:checked");

    if($Brands.length == 0 && $Colors.length == 0){
      $("img" + choice).show();
    }

    if($Brands.length >= 1 && $Colors.length == 0) {
      for(var i = 0; i < $Brands.length; i++) {
        $("img" + choice + "." + $($Brands[i]).val()).show();
      }
    } else if($Brands.length == 0 && $Colors.length >= 1) {
      for(var i = 0; i < $Colors.length; i++) {
        $("img" + choice + "." + $($Colors[i]).val()).show();
      }
    } else if($Brands.length >= 1 && $Colors.length >= 1){
      for(var i = 0; i < $Brands.length; i++) {
        for(var j = 0; j < $Colors.length; j++) {
          str += choice + "." + $($Brands[i]).val() + "." + $($Colors[j]).val() + ",";
        }
      }
      var selectorString = str.slice(0,-1);
      $("img" + selectorString).show();
    }
  }
}

Filter.prototype = new JSON();

$(function() {
  var productsFilter = new Filter();
  productsFilter.init();
});