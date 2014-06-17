var App = {
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
    this.nutritionTable();
    this.setupMenu();
    this.events();
  },

  nutritionTable : function() {
    $(this.seedData['nutrition-table']).each(function(index, name) {
      var nutritionValue = new NutritionTable(name);
    })
  },

  setupMenu : function() {
    var menuItem = new Menu();
    menuItem.init();
  },

  events : function() {
    this.Menu.changeEvent();
    this.Menu.addEvent();
    this.NutritionTable.removeItem();
    this.NutritionTable.addServing();
    this.NutritionTable.removeServing();
  }

}

App.Menu = {
  // method to change the main menu 
  changeEvent : function() {
    $("#menu-item").on('change', "[name='item']", function() {
      $("#tortillas").children("div").remove();
      $(".nutrition-values").remove();
      var value = $(this).attr('id');
      for(var i = 0; i < App.seedData[value].length; i++) {
        $("<div>").html("<input type='radio' name='menu' data-name='" + value + "'><span>" + App.seedData[value][i] + "</span>").appendTo("#tortillas");
      }
      $("input[type='checkbox']").prop('checked', false);
      $("[name='menu']:first").prop('checked', true);
      var name = $("[name='menu']:first").next().text();
      $row = $("<tr>", {class : 'nutrition-values'}).attr("data-name", name);
      for(var i = 0; i < App.seedData["nutrition-table"].length; i++) {
        if(i == 0) {
          var $item = $("<td>", { class : 'item-name'});
          $("<span>", {class : 'names'}).text(name).appendTo($item);
          $item.appendTo($row);
        } else {
          $("<td>", {class : i}).text(App.seedData[name][i-1]).attr('data-value', App.seedData[name][i-1]).appendTo($row);
        }
      }
      $row.insertBefore("#total");
      App.NutritionTable.calculateTotal();
    });
  },

  // method to add or remove the item from the nutrition table by change event
  addEvent : function() {
    $("#main-container").on('change', "input", function() {
      var count = 0
      if($(this).prop('checked')) {
        $row = $("<tr>", {class : 'nutrition-values'}).attr("data-name", $(this).attr("data-name"));
        var name = $(this).next().text();
        for(var i = 0; i < App.seedData["nutrition-table"].length; i++) {
          if(i == 0) {
            var $item = $("<td>", { class : 'item-name'});
            $("<span>", {class : 'names'}).text(name).appendTo($item);
            $item.appendTo($row);
            if($(this).parents("#meat").length) {
              $item.attr('data-item', 'meat');
              $("<input>", {class : 'servings', type : 'text', value : 1, readonly : 'readonly'}).appendTo($item);
              $("<button>", {class : 'add', text : '+'}).appendTo($item);
              $("<button>", {class: 'sub', text : '-'}).appendTo($item);
            }
          } else {
            $("<td>", { class : i}).text(App.seedData[name][i-1]).attr('data-value', App.seedData[name][i-1]).appendTo($row);
          }
        }
        $row.insertBefore("#total");
        App.NutritionTable.calculateTotal();
      } else {
        var value = $(this).attr("data-name");
        $("#nutrition-table").find("[data-name='" + value + "']").remove();
      }
    });
  }
}

App.NutritionTable = {
  // method to remove the item from the nutrition table
  removeItem : function() {
    $("#nutrition-table").on('click', '.nutrition-values td:not([data-item="meat"])', function() {
      var value = $(this).parent().attr("data-name");
      if($(this).children("input").length) {
        alert("cannot be deleted from here");
      } else {
        $(this).parent().remove();
        $("[data-name='" + value + "']").prop("checked", false);
      }
      App.NutritionTable.calculateTotal();
    })
  },

  // method to add or remove servings
  addServing : function() {
    $('#nutrition-table').on('click', '.add', function() {
      var count = $(this).prev().val();
      if(count == 2) {
        alert("maximum 2 servings can be included");
        return false;
      }
      $(this).prev().val(++count);
      $(this).parent().siblings().each(function() {
        var value = parseInt($(this).attr("data-value") * count);
        $(this).text(value);
      });
      App.NutritionTable.calculateTotal();
    });
  },

  removeServing : function() {
    $('#nutrition-table').on('click', '.sub', function() {
      var count = $(this).siblings('.servings').val();
      if(count == 1) {
        alert("minimum servings should be 1");
      } else {
        $(this).siblings('.servings').val(--count);
        $(this).parent().siblings().each(function() {
          var value = parseInt($(this).attr("data-value") * count);
          $(this).text(value);
        });
      }
      App.NutritionTable.calculateTotal();
    });
  },

  calculateTotal : function() {
    $("#total td:not(:first)").remove();
    for(var i = 1; i < App.seedData["nutrition-table"].length; i++) {
      var count = 0;
      $("." + i).each(function() {
        count = parseInt($(this).text()) + count;
      });
      $("<td>").text(count).appendTo("#total"); 
    }
  }
}

// Nutrition Class
function NutritionTable(name) {
  this.name = name;
  this.setup();
}

NutritionTable.prototype.setup = function() {
  $("<td>", { text : this.name}).appendTo("#nutrition-value");
}

// Menu Class
function Menu() {
  this.init = function() {
    this.setup();
    this.setupMeatMenu();
    this.setupAdditionalMenu();
    this.setupChipsMenu();
  }
}

Menu.prototype.setup = function() {
  var menu = App.seedData["menu-item"];
  for(var i = 0; i < menu.length; i++) {
    $item = $("<div>").attr("data-item", menu[i]);
    $("<input>", { id : menu[i], type : 'radio', name : 'item'}).appendTo($item);
    $("<label>", { for : menu[i], text : menu[i]}).appendTo($item);
    $item.appendTo("#menu-item");
  }
}

Menu.prototype.setupMeatMenu = function() {
  for(var i = 0; i < App.seedData["meat"].length; i++) {
    $div = $("<div>");
    $("<input>", {type : 'checkbox',}).attr("data-name", App.seedData['meat'][i]).appendTo($div);
    $("<span>", {text : App.seedData['meat'][i]}).appendTo($div);
    $div.appendTo("#meat");
  }
}

Menu.prototype.setupAdditionalMenu = function() {
  for(var i = 0; i < App.seedData["additional"].length; i++) {
    $div = $("<div>", {class : 'options'});
    $("<input>", {type : 'checkbox',}).attr("data-name", App.seedData['additional'][i]).appendTo($div);
    $("<span>", {text : App.seedData['additional'][i]}).appendTo($div);
    $div.appendTo("#additionals");
  } 
}

Menu.prototype.setupChipsMenu = function() {
  for(var i = 0; i < App.seedData["chips-salsa"].length; i++) {
    $div = $("<div>", {class : 'chips'});
    $("<input>", {type : 'checkbox',}).attr("data-name",App.seedData['chips-salsa'][i]).appendTo($div);
    $("<span>", {text : App.seedData['chips-salsa'][i]}).appendTo($div);
    $div.appendTo("#chips");
  } 
}

$(function() {
  App.init();
});