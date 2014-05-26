$(document).ready(function() {
  // creating button to add div's
  var $addButton = $('<button>').attr('id', 'addItem').text('Add Item');
  $('body').prepend($addButton);

  // adding stack of divs on clicking the button
  $('#addItem').bind('click', function() {
    var $divCount = $("#main_container").children().length + 1;
    var $divStack = $("<div>").addClass("sub_containers").text("Div No. " + $divCount);
    $divStack.prependTo("#main_container");
  });
  
  // highlighting the div's by binding event
  $('#main_container').on('click', '.sub_containers', function() {
    $(this).toggleClass('highlight');
  });

  $('#main_container').on('click', '.sub_containers:first', function() {
    $(this).remove();
  });
});