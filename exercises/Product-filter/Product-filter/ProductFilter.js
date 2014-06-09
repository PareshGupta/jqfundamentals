function JSONData() {
  this.cacheProductData = "";
  this.cacheFilterData = "";

  this.init = function() {
    this.getFilterData();
    this.getProductData();
  }

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

  // method to create product grid
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
    this.bindEventOnRadio();
  }

  // method to set the data-brand value to lower case
  this.setClassAttribute = function(value) {
    var string = value.toLowerCase();
    return string.slice(-1);
  }

  // method to create filter column
  this.createFilterColumn = function() {
    var $filterColumn = $("<div>", {id : 'filters'});
    this.createCategories($filterColumn, "Brands");
    this.createCategories($filterColumn, "Colors");
    this.creatRadioButton($filterColumn);
    $filterColumn.appendTo("body");
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

  this.bindEventOnRadio = function() {
    var that = this;
    $("input[type = 'radio']").on("click", function() {
      that.displayProductsBasedOnFilters();
    });
  }

  // binding event on all checkboxes
  this.bindEventOnCheckboxes = function() {
    var that = this;
    $("#Brands, #Colors" ).on("click", "input", function() {
      that.displayProductsBasedOnFilters();
    });
  }

  this.displayProductsBasedOnFilters = function() {
    $("img").hide();
    var selectorArray = [];
    var brandArray = [];
    var colorArray = [];
    var availableArray = [];
    
    $("#Brands input:checked").each(function() {
      brandArray.push($(this).val());
    });
    selectorArray = this.addToFilters(selectorArray, brandArray);


    $("#Colors input:checked").each(function() {
      colorArray.push($(this).val());
    })
    selectorArray = this.addToFilters(selectorArray, colorArray);


    if($("#available:checked").length) {
      availableArray.push($("#available").val());
    }
    selectorArray = this.addToFilters(selectorArray, availableArray);


    this.createSelector(selectorArray);
  }

  this.createSelector = function(selectorArray) {
    selectorArray = selectorArray.map(function(item){ return "img." + item});
    if (selectorArray.length){
      $(selectorArray.join(', ')).show();
    } else {
      $('img').show();
    }
  }

  this.addToFilters = function(arr1, arr2) {
    if(arr1.length ==0 || arr2.length == 0) {
      return arr1.concat(arr2);
    } else {
      var arr = []
      for(var i = 0; i < arr1.length; i++) {
        for(var j = 0; j < arr2.length; j++) {
          arr.push(arr1[i] + "." + arr2[j]);
        }
      }
      return arr;
    }
  }
}

var data = new JSONData();
data.init();
