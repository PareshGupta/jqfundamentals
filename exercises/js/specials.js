function LoadJSON() {
  this.json = "";

  this.init = function() {
    this.createDiv();
    this.removeSubmitButton();
    this.cacheData();
    this.bindEvents();
  }

  this.createDiv = function() {
    $('<div />').attr('id', 'targetDiv').insertAfter('#specials form');
  }

  this.removeSubmitButton = function() {
    $('#specials li.buttons').remove();
  }
}
  
LoadJSON.prototype.readJSON = function() {
  var that = this;
  $.getJSON('data/specials.json')
    .done(function(data) {
      that.data = data;
    })
    .fail(function(data) {
      alert("Could not read JSON");
    })
}

LoadJSON.prototype.bindEvents = function() {
  var that = this;
  $("select[name = 'day']").bind('change', function() {
    var selectedDay = $(this).val(); 
    if(selectedDay) {
      $('#targetDiv').html(that.data[selectedDay].title + '<br/>' + that.data[selectedDay].text);
    } else {
      $('#targetDiv').text('');
    }
  });
}

LoadJSON.prototype.cacheData = function() {
  if(!this.data) {
    this.readJSON();
  }
} 

$(function() {
  var JSON = new LoadJSON();
  JSON.init();
});


