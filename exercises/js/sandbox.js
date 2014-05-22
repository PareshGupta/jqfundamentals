$(document).ready(function() {
// Adding 5 new List Items to the end of unordered list '#myList'
  for(var i = 1; i <= 5; i++) {
    var newList = $("<li>").text("New List Item " + i);
    $("#myList").append(newList);
  }
  console.log("new list items added in unordered list");
  
// Removing the odd list items from unordered list
  $("#myList li:odd").remove();
  console.log("odd list items removed from unordered list");

// Add 'h2' and 'p' elements to the last div.module
  var newHeadingTag = $('<h2>').text("New Heading Added");
  var newParagraphTag = $('<p>').text("New Paragraph Added");
  $("div.module").last().append(newHeadingTag).append(newParagraphTag);
  console.log("h2 and p tags inserted in div container");

// Add another option to the select element; give the option the value "Wednesday"
  var optionTag = $("<option>").val("Wednesday").text("Wednesday");
  $("select[name = 'day']").append(optionTag);
  console.log("option tag inserted with new value in select element");

// Add a new div.module to the page after the last one; put a copy of one of the existing images inside of it.
  var newDiv = $("<div>").addClass("module");
  $("div.module").last().after(newDiv);
  $("img").eq(0).clone().appendTo(newDiv);
  console.log("new div container inserted with image after the last divContainer");
});