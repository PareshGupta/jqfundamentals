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
    this.KidMenu.bindEvents();
  },

  resetCalculator : function() {
    $("#tortillas, #tortillas-kid").children("div").remove();

    // clear table
    $(".nutrition-values").remove();

    // clear selection
    $("input[type='checkbox']").prop('checked', false);
    $(".kids-item input").prop('checked', false);
  },

  changeMenu : function() {
    $('#adult-menu').on('click', function() {
      $(this).addClass('background').next().removeClass("background");
      $("#kid-container").hide();
      $("#main-container").show();
    });

    $('#kid-menu').on('click', function() {
      $(this).addClass('background').prev().removeClass("background");
      $("#kid-container").show();
      $("#main-container").hide();
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
      var value = $(this).attr('id');
      App.Menu.setupTortillaMenu(value, "#tortillas");
    });
  },

  changeEventOnRadioButtons : function() {
    $('#tortillas').on('change', 'input', function() {
      App.NutritionTable.addRow($(this));
    });
  },

  changeEventOnCheckboxes : function() {
    $("#main-container").on('change', "input[type='checkbox']", function() {
      App.Menu.checkUncheckCondition($(this));
    });
  },

  // method to setup the tortillas menu according to the main item's
  setupTortillaMenu : function(value, menu) {
    App.resetCalculator();

    //build menu
    for(var i = 0; i < App.seedData[value].length; i++) {
      $("<div>").html("<input type='radio' name='menu' data-name='" + value.toLowerCase() + "'><span>" + App.seedData[value][i] + "</span>").appendTo(menu);
    }

    // select first tortilla
    $("[name='menu']:first").prop('checked', true);
    var name = $("[name='menu']:first").next().text();
    var $row = $("<tr>", {class : 'nutrition-values tacos'}).attr("data-name", name);
    App.NutritionTable.addingItem(name, $row);

    // preselected items for small quesadilla meal 
    if($("[data-item='SMALL QUESADILLA MEAL'] input").prop("checked")){
      $(".kids-item:visible").find('input:first').each(function() {
        if($(this).attr("id") == "meat0") {
          $(this).prop("checked", true);
        } else {
          $(this).prop("checked", true);
          var name = $(this).next().text();
          var $row = $("<tr>", {class : 'nutrition-values tacos'}).attr("data-name", name);
          App.NutritionTable.addingItem(name, $row);
        }
      });
      var name = $("#meat-kid #meat6").attr("name", "cheese").prop("checked", true).next().text();
      var $row = $("<tr>", {class : 'nutrition-values tacos'}).attr("data-name", name);
      App.NutritionTable.addingItem(name, $row);
    }

    // preselected items for single taco and two taco 
    if($("[data-item='SINGLE TACO MEAL'] input").prop("checked") || $("[data-item='TWO TACO MEAL'] input").prop("checked")) {
      $(".kids-item:visible").find('input:first').each(function() {
        if($(this).attr("id") == "meat0") {
          $(this).prop("checked", true);
        } else {
          $(this).prop("checked", true);
          var name = $(this).next().text();
          var $row = $("<tr>", {class : 'nutrition-values tacos'}).attr("data-name", name);
          App.NutritionTable.addingItem(name, $row);
        }
      });
      var name = $("#meat-kid #meat6").attr("name", "cheese").prop("checked", true).next().text();
      var $row = $("<tr>", {class : 'nutrition-values tacos'}).attr("data-name", name);
      App.NutritionTable.addingItem(name, $row);
    }
  },

  // method to check the if the checkboxes are checked or unchecked
  checkUncheckCondition : function($this) {
    if($this.prop('checked')) {
      $row = $("<tr>", {class : 'nutrition-values'}).attr("data-name", $this.attr("data-name"));
      var name = $this.next().text();
      var meatCount = $this.parents("#meat").length;
      App.NutritionTable.addingItem(name, $row, meatCount);        
    } else {
      var value = $this.attr("data-name");
      $("#nutrition-table").find("[data-name='" + value + "']").remove();
      App.NutritionTable.calculateTotal();
    }
  }
}

App.KidMenu = {
  bindEvents : function() {
    this.changeEventOnMainMenu();
    this.changeEventOnRadioButtons();
    this.changeEventOnCheckboxes();
    this.changeEventOnOtherRadioButtons();
  },

  changeEventOnMainMenu : function() {
    $("#kid-menu-item").on('change', '[name="item"]', function() {
      if($("#menu0").prop("checked")) {
        $("#kid-additionals, #taco-rice").hide();
        $("#first-side, #second-side").show();
      } 
      if($("#menu1").prop("checked") || $("#menu2").prop("checked")) {
        $("#first-side, #second-side").hide();
        $("#kid-additionals, #taco-rice").show();
      }
      var value = $(this).next().text();
      App.Menu.setupTortillaMenu(value, "#tortillas-kid");
    });
  },

  changeEventOnRadioButtons : function() {
    $('#tortillas-kid').on('change', 'input', function() {
      App.NutritionTable.addRow($(this));
    });
  },

  changeEventOnCheckboxes : function() {
    $(".kids-item").on('change', "input[type = 'checkbox']", function() {
      App.Menu.checkUncheckCondition($(this));
    });
  },

  changeEventOnOtherRadioButtons : function() {
    $(".kids-item").on('change', 'input[type = "radio"]', function() {
      App.NutritionTable.addRowOnSelectedKidMenu($(this));
    });
  }
}

App.NutritionTable = {
  bindEvents : function() {
    this.removeItem();
    this.addServing();
    this.removeServing();
  },

  // method to reset table and add new item to table on changing the tortillas item
  addRow : function($this) {
    $("#nutrition-table .tacos").remove();
    var name = $this.next().text();
    var $row = $("<tr>", {class : 'nutrition-values tacos'}).attr("data-name", name);
    this.addingItem(name, $row);   
  },

  addRowOnSelectedKidMenu : function($this) {
    var value = $this.parents(".kids-item").attr('id');
    $("#nutrition-table ." + value).remove();
    var name = $this.next().text();
    var $row = $("<tr>", {class : 'nutrition-values ' + value}).attr("data-name", name);
    this.addingItem(name, $row);   
  },

  // method to add new items to table on selecting the other items 
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
      $("<input>", {id : "adult-meat" + i, type : 'checkbox',}).attr("data-name", App.seedData['meat'][i]).appendTo($div);
      $("<label>", {for : "adult-meat" + i, text : App.seedData['meat'][i]}).appendTo($div);
      $div.appendTo("#meat");
    }
  },

  setupAdditionalMenu : function() {
    for(var i = 0; i < App.seedData["additional"].length; i++) {
      $div = $("<div>", {class : 'options'});
      $("<input>", {id : "adult-additional" + i, type : 'checkbox',}).attr("data-name", App.seedData['additional'][i]).appendTo($div);
      $("<label>", {for : "adult-additional" + i, text : App.seedData['additional'][i]}).appendTo($div);
      $div.appendTo("#additionals");
    } 
  },

  setupChipsMenu : function() {
    for(var i = 0; i < App.seedData["chips-salsa"].length; i++) {
      $div = $("<div>", {class : 'chips'});
      $("<input>", {id : 'adult-chips' + i, type : 'checkbox',}).attr("data-name",App.seedData['chips-salsa'][i]).appendTo($div);
      $("<label>", {for : 'adult-chips' + i, text : App.seedData['chips-salsa'][i]}).appendTo($div);
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
    this.setupRiceSection();
    this.setupChipsMenu();
    this.setupAdditionalMenu();
  },
  
  setupMainMenu : function() {
    var menu = App.seedData["kid-item"];
    for(var i = 0; i < menu.length; i++) {
      $item = $("<div>", {class : 'kid-menu'}).attr("data-item", menu[i]);
      $("<input>", { id : "menu" + i, type : 'radio', name : 'item'}).appendTo($item);
      $("<label>", { for : "menu" + i, text : menu[i]}).appendTo($item);
      $item.appendTo("#kid-menu-item");
    }
  },

  setupMeatMenu : function() {
    for(var i = 0; i < App.seedData["meat-kid"].length; i++) {
      $div = $("<div>");
      $("<input>", {id : "meat" + i, type : 'radio', name : 'meat'}).attr("data-name", App.seedData['meat-kid'][i]).appendTo($div);
      $("<label>", {for : "meat" + i, text : App.seedData['meat-kid'][i]}).appendTo($div);
      $div.appendTo("#meat-kid");
    }
  },

  setupFirstSide : function() {
    for(var i = 0; i < App.seedData["1st-side"].length; i++) {
      $div = $("<div>");
      $("<input>", {id : "rice" + i, type : 'radio', name : 'rice'}).attr("data-name", App.seedData['1st-side'][i]).appendTo($div);
      $("<label>", {for : "rice" + i, text : App.seedData['1st-side'][i]}).appendTo($div);
      $div.appendTo("#first-side");
    }
  },
  
  setupSecondSide : function() {
    for(var i = 0; i < App.seedData["2nd-side"].length; i++) {
      $div = $("<div>");
      $("<input>", {id : "bean" + i, type : 'radio', name : 'beans'}).attr("data-name", App.seedData['2nd-side'][i]).appendTo($div);
      $("<label>", {for : "bean" + i, text : App.seedData['2nd-side'][i]}).appendTo($div);
      $div.appendTo("#second-side");
    }
  },

  setupChipsMenu : function() {
    for(var i = 0; i < App.seedData["chip"].length; i++) {
      $div = $("<div>");
      $("<input>", {id : "chip" + i, type : 'radio', name : 'chips'}).attr("data-name", App.seedData['chip'][i]).appendTo($div);
      $("<label>", {for : "chip" + i, text : App.seedData['chip'][i]}).appendTo($div);
      $div.appendTo("#chip");
    }
  },

  setupRiceSection : function() {
    for(var i = 0; i < App.seedData["1st-side"].length; i++) {
      $div = $("<div>");
      $("<input>", {id : "taco-rice" + i, type : 'radio', name : 'rice'}).attr("data-name", App.seedData['1st-side'][i]).appendTo($div);
      $("<label>", {for : "taco-rice" + i, text : App.seedData['1st-side'][i]}).appendTo($div);
      $div.appendTo("#taco-rice");
    }
  },

  setupAdditionalMenu : function() {
    for(var i = 0; i < App.seedData["additional"].length; i++) {
      $div = $("<div>", {class : 'options'});
      $("<input>", {id : "additional" + i, type : 'checkbox',}).attr("data-name", App.seedData['additional'][i]).appendTo($div);
      $("<label>", {for : "additional" + i, text : App.seedData['additional'][i]}).appendTo($div);
      $div.appendTo("#kid-additionals");
    } 
  }
}

$(function() {
  App.init();
});