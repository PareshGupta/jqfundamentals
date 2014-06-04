function CountryNames() {

  this.bindEvent = function() {
    var that = this;
    $("#countrylist1").on("mouseover", "li", function() {
      that.dragAndDrop("#countrylist1", "#countrylist2");
    });

    $("#countrylist2").on("mouseover", "li", function() {
      that.dragAndDrop("#countrylist2", "#countrylist1");
    });
  }

  // method to drag and drop the countries 
  this.dragAndDrop = function(list1, list2) {
    $(list1).find("li").draggable({
      snap : true,
      cursor : "move",
      helper : "clone"
    }).disableSelection();

    $(list2).droppable({
      drop : function(event, ui) {
        ui.draggable.removeAttr("style").appendTo($(this));
      }
    });
  }
}

$(function() {
  var moveCountries = new CountryNames()
  moveCountries.bindEvent();  
});