$(document).ready(function() {
// Selecting div having class "module"
  $("div.module").css("background-color", "yellow");

// Selecting third item in the unordered list "myList"
  $("#myList li").eq(2).css("background-color", "red");
  $("li[id = 'myListItem']").css("background-color", "red");

  // best use because of specific id on the list item.
  $("#myListItem").css("background-color", "red");

// Selecting label for search input using attribute selector
  $("label[for = 'q']").css("background-color", "green");

// No. of elements hidden in the page
  alert("The total hidden elements are: \n " + $(":hidden").length);

// No. of image elements having 'alt' attribute
  alert("The total image elements having attribute 'alt' are: \n" + $("img[alt]").length);

// All odd table-rows in the table
  $("tr:odd").css("background-color", "blue");
});