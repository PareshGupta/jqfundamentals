function Slideshow() {
  $("#slideshow li").hide();
  $("#slideshow").prependTo("body");
  this.count = 0;
  this.firstSlide = $("#slideshow li:first");
  // creating a element for slide counts
  this.slideCounter = $("<p />").addClass("current").appendTo("#slideshow");
  // getting the total slides
  this.totalSlides = $("#slideshow li").length;
  this.startSlideShow();
}


Slideshow.prototype = {
  constructor : Slideshow,
  
  // method to start the slideshow effect
  startSlideShow : function() {
    var that = this;
    that.showSlideNumber();
    that.firstSlide.fadeIn(1000)
                   .delay(1500)
                   .fadeOut(function() { that.countSlide() });
  },

  // method to show slide number
  showSlideNumber : function() {
    this.count++;
    this.slideCount = "<<< " + this.count + " / " + this.totalSlides + " >>>";
    this.slideCounter.text(this.slideCount);
  },


  // method to count the slides
  countSlide : function() {
    if(this.count !== this.totalSlides) {
      this.nextSlide();  
    } else {
      this.backToFirstSlide();
    }
  },

  // method to move to next slide
  nextSlide : function() {
    this.firstSlide = this.firstSlide.next();
    this.startSlideShow();
  },

  // method to get back to the first slide
  backToFirstSlide : function() {
    this.firstSlide = $("#slideshow li:first");
    this.count = 0;
    this.startSlideShow();
  }
}

$(function() {
  // new instance of the Slideshow function
  new Slideshow();    
});
