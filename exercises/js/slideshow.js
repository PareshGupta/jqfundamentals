// function to slideshow the images
function slideshow(length) {
  $count++;
  var navigateImageDetail = "<<< " + $count + " / " + length + " >>>";
  $newNavigateElement.text(navigateImageDetail);
  $slideshowElement.fadeIn(1000).delay(1500).fadeOut(function() {
    if($count !== length) {
      $slideshowElement = $slideshowElement.next();
    } else {
      $slideshowElement = $("#slideshow li").first();
      $count = 0;
    }
    slideshow(length);
  });
}

$(document).ready(function() {
  $slideshowElement = $("#slideshow li").first();
  $slideshowElementLength = $("#slideshow li").hide().length;
  $count = 0;
  // creating navigation image area below slideshow
  $newNavigateElement = $("<p>").addClass("current").appendTo($("#slideshow"));
  
  // prepend the #slideshow elements to top of the page
  $("body").prepend($("#slideshow"));

  // calling a function slideshow
  slideshow($slideshowElementLength);
});