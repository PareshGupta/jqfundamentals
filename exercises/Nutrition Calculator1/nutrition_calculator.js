var App = {
  seedData : [],

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
    this.buildNutritionTableHeader();
    this.setupMenu();
    this.setupKidMenu();
    this.bindEvents();
    this.changeMenu();
  },

  buildNutritionTableHeader : function() {
    $(this.seedData['nutrition-table']).each(function(index, name) {
      var nutritionValue = new NutritionTable(name);
    })
  },

  setupMenu : function() {
    Menu.init();
  },

  setupKidMenu : function() {
    KidMenu.init();
  },

  bindEvents : function() {
    this.Menu.bindEvents();
    this.NutritionTable.bindEvents();
  },

  resetCalculator : function() {
    $("#tortillas").children("div").remove();

    // clear table
    $(".nutrition-values").remove();

    // clear selection
    $("input[type='checkbox']").prop('checked', false);
  },

  changeMenu : function() {
    $('#adult-menu').on('click', function() {
      $(".kid-menu").hide();
      $(".adult-menu").show();
      $("#main-container").show();
    });

    $('#kid-menu').on('click', function() {
      $(".kid-menu").show();
      $(".adult-menu").hide();
      $("#main-container").hide();
      // $('#tortillas').show().siblings().hide();
    });
  }

}

App.Menu = {
  bindEvents : function() {
    this.changeEventOnMainMenu();
    this.changeEventOnCheckboxes();
    this.changeEventOnRadioButtons();
  },

  // method to change the main menu 
  changeEventOnMainMenu : function() {
    $("#menu-item").on('change', "[name='item']", function() {
      App.resetCalculator();
      
      // get id and build menu
      var value = $(this).attr('id');
      for(var i = 0; i < App.seedData[value].length; i++) {
        $("<div>").html("<input type='radio' name='menu' data-name='" + value.toLowerCase() + "'><span>" + App.seedData[value][i] + "</span>").appendTo("#tortillas");
      }

      // select first tortilla
      $("[name='menu']:first").prop('checked', true);
      
      var name = $("[name='menu']:first").next().text();
      var $row = $("<tr>", {class : 'nutrition-values tacos'}).attr("data-name", name);
      App.NutritionTable.addingItem(name, $row);
    });
  },

  changeEventOnRadioButtons : function() {
    $('#tortillas').on('change', 'input', function() {
      $("#nutrition-table .tacos").remove();
      var name = $(this).next().text();
      var $row = $("<tr>", {class : 'nutrition-values tacos'}).attr("data-name", name);
      App.NutritionTable.addingItem(name, $row);   
    });
  },

  changeEventOnCheckboxes : function() {
    $("#main-container").on('change', "input[type='checkbox']", function() {
      var count = 0
      if($(this).prop('checked')) {
        $row = $("<tr>", {class : 'nutrition-values'}).attr("data-name", $(this).attr("data-name"));
        var name = $(this).next().text();
        var meatCount = $(this).parents("#meat").length;
        App.NutritionTable.addingItem(name, $row, meatCount);        
      } else {
        var value = $(this).attr("data-name");
        $("#nutrition-table").find("[data-name='" + value + "']").remove();
      }
    });
  }
}

App.NutritionTable = {
  bindEvents : function() {
    this.removeItem();
    this.addServing();
    this.removeServing();
  },

  addingItem : function(name, row, item) {
    for(var i = 0; i < App.seedData["nutrition-table"].length; i++) {
      if(i == 0) {
        var $item = $("<td>", { class : 'item-name'});
        $("<span>", {class : 'names'}).text(name).appendTo($item);
        $item.appendTo(row);
        if(item) {
          $item.attr('data-item', 'meat');
          $("<input>", {class : 'servings', type : 'text', value : 1, readonly : 'readonly'}).appendTo($item);
          $("<button>", {class : 'add', text : '+'}).appendTo($item);
          $("<button>", {class: 'sub', text : '-'}).appendTo($item);
        }
      } else {
        $("<td>", {class : i}).text(App.seedData[name][i-1]).attr('data-value', App.seedData[name][i-1]).appendTo(row);
      }
    }
    row.insertBefore("#total");
    App.NutritionTable.calculateTotal();
  },

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
  this.buildHeader();
}

NutritionTable.prototype.buildHeader = function() {
  $("<td>", { text : this.name}).appendTo("#nutrition-value");
}

// Menu Class
var Menu = {
  init : function() {
    this.setupMainMenu();
    this.setupMeatMenu();
    this.setupAdditionalMenu();
    this.setupChipsMenu();
  },

  setupMainMenu : function() {
    var menu = App.seedData["menu-item"];
    for(var i = 0; i < menu.length; i++) {
      $item = $("<div>", {class : 'adult-menu'}).attr("data-item", menu[i]);
      $("<input>", { id : menu[i], type : 'radio', name : 'item'}).appendTo($item);
      $("<label>", { for : menu[i], text : menu[i]}).appendTo($item);
      $item.appendTo("#menu-item");
    }
  },

  setupMeatMenu : function() {
    for(var i = 0; i < App.seedData["meat"].length; i++) {
      $div = $("<div>");
      $("<input>", {type : 'checkbox',}).attr("data-name", App.seedData['meat'][i]).appendTo($div);
      $("<span>", {text : App.seedData['meat'][i]}).appendTo($div);
      $div.appendTo("#meat");
    }
  },

  setupAdditionalMenu : function() {
    for(var i = 0; i < App.seedData["additional"].length; i++) {
      $div = $("<div>", {class : 'options'});
      $("<input>", {type : 'checkbox',}).attr("data-name", App.seedData['additional'][i]).appendTo($div);
      $("<span>", {text : App.seedData['additional'][i]}).appendTo($div);
      $div.appendTo("#additionals");
    } 
  },

  setupChipsMenu : function() {
    for(var i = 0; i < App.seedData["chips-salsa"].length; i++) {
      $div = $("<div>", {class : 'chips'});
      $("<input>", {type : 'checkbox',}).attr("data-name",App.seedData['chips-salsa'][i]).appendTo($div);
      $("<span>", {text : App.seedData['chips-salsa'][i]}).appendTo($div);
      $div.appendTo("#chips");
    } 
  }
}

var KidMenu = {
  init : function() {
    this.setupMainMenu();
    this.setupMeatMenu();
    this.setupFirstSide();
    this.setupSecondSide();
  },
  
  setupMainMenu : function() {
    var menu = App.seedData["kid-item"];
    for(var i = 0; i < menu.length; i++) {
      $item = $("<div>", {class : 'kid-menu'}).attr("data-item", menu[i]);
      $("<input>", { id : menu[i], type : 'radio', name : 'item'}).appendTo($item);
      $("<label>", { for : menu[i], text : menu[i]}).appendTo($item);
      $item.appendTo("#menu-item");
    }
  },

  setupMeatMenu : function() {
    for(var i = 0; i < App.seedData["meat-kid"].length; i++) {
      $div = $("<div>");
      $("<input>", {type : 'radio', name : 'meat'}).attr("data-name", App.seedData['meat-kid'][i]).appendTo($div);
      $("<span>", {text : App.seedData['meat-kid'][i]}).appendTo($div);
      $div.appendTo("#meat-kid");
    }
  },

  setupFirstSide : function() {
    for(var i = 0; i < App.seedData["1st-side"].length; i++) {
      $div = $("<div>");
      $("<input>", {type : 'radio', name : 'rice'}).attr("data-name", App.seedData['1st-side'][i]).appendTo($div);
      $("<span>", {text : App.seedData['1st-side'][i]}).appendTo($div);
      $div.appendTo("#first-side");
    }
  },
  
  setupSecondSide : function() {
    for(var i = 0; i < App.seedData["2nd-side"].length; i++) {
      $div = $("<div>");
      $("<input>", {type : 'radio', name : 'beans'}).attr("data-name", App.seedData['2nd-side'][i]).appendTo($div);
      $("<span>", {text : App.seedData['2nd-side'][i]}).appendTo($div);
      $div.appendTo("#second-side");
    }
  },
}

$(function() {
  App.init();
});