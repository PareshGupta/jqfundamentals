function LoadJSON(url, element) {
  this.url = url;
  this.selectElement = element;
  this.json = "";
  this.data = "";

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
  $.getJSON(this.url)
    .done(function(data) {
      that.data = data;
    })
    .fail(function(data) {
      alert("Could not read JSON");
    })
}

LoadJSON.prototype.bindEvents = function() {
  var that = this;
  this.selectElement.bind('change', function() {
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
  var URL = 'data/specials.json';
  var $selectElement = $("select[name = 'day']");
  var JSON = new LoadJSON(URL, $selectElement);
  JSON.init();
});


