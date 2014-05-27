function Slideshow() {
  this.hideSlides = $("#slideshow li").hide();
  this.prependSlides = $("#slideshow").prependTo("body");
  this.count = 0;
  this.slides = $("#slideshow li:first");
  // creating a element for slide counts
  this.slideText = $("<p>").addClass("current").appendTo("#slideshow");
  // getting the total slides
  this.slideLength = $("#slideshow li").length;
  this.getslideNumber();
}


Slideshow.prototype = {
  constructor : Slideshow,
  
  // method to show slide number
  getslideNumber : function() {
    this.count++;
    this.slideCount = "<<< " + this.count + " / " + this.slideLength + " >>>";
    this.slideText.text(this.slideCount);
    this.getSlideEffect();
  },

  // method to get the slideshow effect
  getSlideEffect : function() {
    var that = this;
    that.slides.fadeIn(1000)
               .delay(1500)
               .fadeOut(function() { that.countSlide() });
  },

  // method to count the slides
  countSlide : function() {
    if(this.count !== this.slideLength) {
      this.nextSlide();  
    } else {
      this.backToFirstSlide();
    }
  },

  // method to move to next slide
  nextSlide : function() {
    this.slides = this.slides.next();
    this.getslideNumber();
  },

  // method to get back to the first slide
  backToFirstSlide : function() {
    this.slides = $("#slideshow li:first");
    this.count = 0;
    this.getslideNumber();
  }
}

$(function() {
  // new instance of the Slideshow function
  new Slideshow();    
});
