
function Products() {
  var cacheJsonData;
  var $tableRow = $('<tr/>', { id : 'Row0' }).appendTo('table');
  
  // method to load the JSON data
  Products.prototype.getJSONData = function() {
    $.getJSON("drinks.json")  
      .done(function(data) {
        cacheJsonData = data;
      })
      .fail(function(data) {
        alert("could not read JSON");
      })
  }

  // method to create rating columns 
  Products.prototype.createRatingColumns = function() {
    var that = this;
    alert(cacheJsonData);
    that.ratingslength = cacheJsonData['ratings'].length;
    $("<th/>").text("").prependTo($tableRow);
    for(var i = 0; i < that.ratingslength; i++) {
      $("<th/>", { text : cacheJsonData['ratings'][i], class : 'ratings' } ).appendTo($tableRow);
    }
  }

  // method to create product
  Products.prototype.createTableRows = function() {
    var that = this;
    alert(cacheJsonData);
    that.drinkslength = cacheJsonData['drinks'].length;
    for(var i = 0; i < that.drinkslength; i++) {
      var $newRow = $('<tr/>', { id : 'Row' + (i+1)  }).appendTo('table');
      $("<td/>", { text : cacheJsonData['drinks'][i], class : 'products' }).prependTo($newRow);
      for(var j = 0; j < this.ratingslength; j++) {
        $("<td>").html($("<input>", { type : 'radio'} )).appendTo($newRow);      
      }
    } 
  }

  // method to highlight the products on click 
  Products.prototype.highlightProducts = function() {
    $('.products').on("click", function() {
      $('.products').removeClass('highlight');
      $(this).addClass('highlight');
    });

    $('.ratings').on("click", function() {
      $('.ratings').removeClass('highlight');
      $(this).addClass('highlight');  
    });
  }

  // // method to select radio button
  // Products.prototype.selectRadioButton = function() {
  //   var $ratingsElement = $('tr:first th');
  //   $('.products').each(function() {
  //     if(this.hasClass("highlight")) {
  //       $(this).parent()
  //     }
  //   })
  // }
}



$(function() {
  var productRating = new Products();
  productRating.getJSONData();
  productRating.createRatingItems();
  productRating.createTableRows();
  productRating.highlightProducts();
});