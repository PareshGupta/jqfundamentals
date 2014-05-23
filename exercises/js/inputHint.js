$(document).ready(function() {
// setting value of search input to the text of the label 
  var labelSearch = $("label[for = 'q']");
  var inputField = $("input[name = 'q']");
  inputField.val(labelSearch.text());

// add class 'hint' to the search input
  inputField.addClass("hint");

// remove label element
  labelSearch.remove();

// bind focus event to search input that removes the hint text & 'hint' class
  inputField.focus(function() {
    $(this).val("").removeClass("hint");
  });

// bind blur event to search input restoring the hint text and class "hint"
  inputField.blur(function() {
    if(!$(this).val()) {
      $(this).val(labelSearch.text()).addClass("hint");
    } 
  });
});