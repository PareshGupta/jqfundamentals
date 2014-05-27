function Stack() {
  this.setup = function() {
    this.addButton();
    this.addDiv();
    this.highlightDiv();
    this.removeFirstDiv();
  }

  this.addButton = function() {
    $('<button />').attr('id', 'addItem').text('Add Item').prependTo('body');
  }

  this.addDiv = function() {
    var that = this;
    $('#addItem').click(function() { that.createDiv() } );
  }

  this.createDiv = function() {
    var divCount = $("#main_container").children().length + 1;
    var $divStack = $("<div>").addClass("sub_containers").text("Div No. " + divCount);
    $divStack.prependTo("#main_container");
  }

  this.highlightDiv = function() {
    $('#main_container').on('click', '.sub_containers', function() {
      $(this).toggleClass('highlight');
    });
  }

  this.removeFirstDiv = function() {
    $('#main_container').on('click', '.sub_containers:first', function() {
      $(this).remove();
    });
  }
}

$(function() {
  var stack = new Stack();
  stack.setup();
});
