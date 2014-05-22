$(document).ready(function() {
// Select all image elements and log each image's 'alt' attribute
  $('img').css('border', '2px solid blue').each(function() {
    console.log($(this).attr('alt'));
  });

// Select the search input field & traverse up to form & add a class to it.
  $("input[name = 'q']").css('background-color', 'yellow')
                        .parent()
                        .addClass('searchForm');

// Select the list item having class "current" inside #myList and remove that class, adding a class "current" to the next list item
  $("#myList li.current").css("background-color", "red")
                          .removeClass("current")
                          .next()
                          .addClass("current");

// Select the select element inside #specials then traverse to the submit button.
  var firstList = $("#specials li:first");
  firstList.children().css("background-color", "green");
  firstList.next().children().css("background-color", "green");

// Select the first list item in the #slideshow element adding class "current" to it, and then add a class of "disabled" to its sibling elements
  $("#slideshow li:first").addClass('current').children().each(function() {
    $(this).addClass("disabled");
  });
});