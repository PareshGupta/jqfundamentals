$(document).ready(function() {
  // Appending div element after form in "#special"
  var $newDivElement = $('<div>').attr('id', 'newDiv');
  $('#specials form[action = "specials.html"]').after($newDivElement);

  // Bind select elements to change event and load Ajax request
  var $targetURL = "data/" + $('#specials form').attr('action').replace('html', 'json');
  $("select[name = 'day']").bind('change', function() {
    $.getJSON($targetURL, function(data) {
      $newDivElement.text(data.monday);
    })
    
  });
});