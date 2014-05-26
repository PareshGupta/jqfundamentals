$(document).ready(function() {
// Clicking on headline should slide down its excerpt paragraph, and slide up any other currently showing excerpt paragraphs.
  $("#blog h3").click(function(event) {
    event.preventDefault();
    $(this).siblings().slideDown(1000);
    $(this).parent().siblings().children(".excerpt").slideUp(1000);
  });
});
