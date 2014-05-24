$(document).ready(function() {
// removing the label element and savinn it's text 
  var $hintText = $("label[for = 'q']").remove().text();

// setting the value of search input to the label text and adding class "hint"
  $("input[name = 'q']").val($hintText).addClass("hint");

// bind focus event to search input that removes the hint text & 'hint' class
  $('.input_text').focus(function() {
    if($(this).hasClass('hint')) {
      $(this).val("").removeClass("hint");
    }
  });

// bind blur event to search input restoring the hint text and class "hint"
  $('.input_text').blur(function() {
    if(!$(this).val()) {
      $(this).val($hintText).addClass("hint");
    } 
  });
});