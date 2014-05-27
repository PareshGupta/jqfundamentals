$(function() {
  // hide all elements having class "module"
  $(".module").hide();

  //creating unordered list element
  var $newUnorderedList = $("<ul />").attr("id", "moduleList")
                                   .insertBefore(".module:first");

  // itereate to class "module" elements and adding new List item to the unordered list
  $(".module h2").each(function() {
    $("<li />").data('module', $(this).parent().attr("id"))
             .text($(this).text())
             .appendTo($newUnorderedList);
  });

  // Bind a click event to the list item that:
  // Shows the related module, and hides any other modules
  // Adds a class of "current" to the clicked list item
  // Removes the class "current" from the other list item
  $("#moduleList li").on("click", function() {
    var elementId = "#" + $(this).data('module');
    $(elementId).show().siblings(".module").hide();
    $(this).addClass("current").siblings(".current").removeClass("current");
  });

  // show first tab
  $('#moduleList li:first').trigger('click');
});