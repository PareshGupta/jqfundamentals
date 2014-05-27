function LoadJSON() {
  this.dataJSON = "";

  this.init = function() {
    this.createDiv();
    this.removeSubmitButton();
    this.cachedData();
    this.bindEvent();
  }

  this.createDiv = function() {
    $('<div />').attr('id', 'targetDiv').insertAfter('#specials form');
  }

  this.removeSubmitButton = function() {
    $('#specials li.buttons').remove();
  }
  
  this.readJSON = function() {
    var that = this;
    $.getJSON('data/specials.json')
      .done(function(data) {
        that.dataJSON = data;
      })
      .fail(function(data) {
        alert("Could not read JSON");
      })
  }

  this.bindEvent = function() {
    var that = this;
    $("select[name = 'day']").bind('change', function() {
      var selectedDay = $(this).val(); 
      if(selectedDay) {
        $('#targetDiv').html(that.dataJSON[selectedDay].title + '<br/>' + that.dataJSON[selectedDay].text);
      } else {
        $('#targetDiv').text('');
      }
    });
  }

  this.cachedData = function() {
    if(!this.dataJSON) {
      this.readJSON();
    }
  } 
}  

$(function() {
  var data = new LoadJSON();
  data.init();
});


