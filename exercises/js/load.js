$(document).ready(function() {
  var $targetURL = '';

  $('#blog h3').each( function(index) {
    $(this).after($('<div>'));
    var $newDiv = $(this).next();
    $(this).data('reference', $newDiv);
  })  
  .click(function(event) {
    event.preventDefault();
    $targetURL = $(this).children('a').attr('href');
    $targetURL = 'data/' + $targetURL.replace('#', " #");
    $(this).data('reference').load($targetURL);
  });
});
