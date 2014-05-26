function Slideshow(slides, element) {
  this.count = 0;
  this.slides = slides;
  this.slideText = element;

  // method to slide images
  this.slideshow = function(length) {
    var that = this;
    this.count++;
    this.slideCount = "<<< " + this.count + " / " + length + " >>>";
    this.slideText.text(this.slideCount);
    this.slides.fadeIn(1000)
               .delay(1500)
               .fadeOut(function() { that.nextSlide(length) });
  }

  // method to check the no of slide and move to next slide
  this.nextSlide = function(length) {
    if(this.count !== length) {
      this.slides = this.slides.next();
    } else {
      this.slides = $("#slideshow li:first");
      this.count = 0;
    }
    this.slideshow(length);
  }
}

$(function() {
  var $slides = $("#slideshow li:first");
  var $slideLength = $("#slideshow li").hide().length;
  // creating a element for slide counts
  var $slideTextElement = $("<p>").addClass("current").appendTo("#slideshow");
  // prepending all images to the body 
  $("#slideshow").prependTo("body");

  // new instance of the Slideshow function
  var imageSlides = new Slideshow($slides, $slideTextElement);
  imageSlides.slideshow($slideLength);    
});
