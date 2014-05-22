$(document).ready(function() {
// Select all image elements and log each image's 'alt' attribute
  $('img').css('border', '2px solid blue').each(function() {
    console.log($(this).attr('alt'));
  });

// Select the search input field & traverse up to form & add a class to it.
  var searchField = $("input[name = 'q']").css('background-color', 'yellow');
  searchField.parent().addClass('searchForm');

// Select the list item having class "current" inside #myList and remove that class, adding a class "current" to the next list item
  var listItem = $("#myList li.current").css("background-color", "red");
  listItem.removeClass("current");
  listItem.next().addClass("current");

// Select the select element inside #specials then traverse to the submit button.
  var select = $("#specials").find("select").css("background-color", "green");
  select.parent().next().children().css("border", "2px solid green");

// Select the first list item in the #slideshow element adding class "current" to it, and then add a class of "disabled" to its sibling elements
  var list = $("#slideshow li").first().addClass('current');
  list.children().each(function() {
    $(this).addClass("disabled");
  });
});