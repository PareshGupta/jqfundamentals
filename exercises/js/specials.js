// function to load the JSON file 
function getJSON() {
  var loadData = '';
  $.ajax({ url : 'data/specials.json',
    dataType : 'json',
    async : false,
    success : function(data) {
      loadData = data;
    }
  })
  .done(function() { console.log( "Successfully Loaded" ); })
  .fail(function() { console.log("Error on Loading"); });
  return loadData;
}

$(document).ready(function() {
  var $dataJSON = '';
  // Appending div element after form in "#special"
  var $newDivElement = $('<div>').attr('id', 'targetDiv');
  $('#specials form').after($newDivElement);

  // remove submit button in the form
  $("input[type = 'submit']").parent().remove();

  // Bind select elements to change event and load Ajax request
  $("select[name = 'day']").bind('change', function() {
    var $selectedOption = $(this).val();
    if($dataJSON.length === 0) {
      $dataJSON = getJSON();
    }

    if($selectedOption) {
      $('#targetDiv').html($dataJSON[$selectedOption].title + '<br/>' + $dataJSON[$selectedOption].text);
    } else {
      $('#targetDiv').text('');
    }
  });
});
  


