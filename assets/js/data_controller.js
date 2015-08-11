app.controller("data_controller", function($scope, $http, Lightbox){

  // connection handler
  $scope.loaded_dates = false;
  $scope.loaded_data = false;
  $scope.sending = false;


  $scope.failed = false;
  $scope.error = null;

  $scope.offers = [];
  $scope.offers_copy = [];
  $scope.dates = [];

  $scope.selected_date = null;

  $scope.reload = function(){
    $scope.loaded_dates = false;
    $scope.loaded_data = false;
    $scope.sending = true;
    $scope.failed = false;
    $scope.dates.splice(0, $scope.dates.length);
    $scope.offers.splice(0, $scope.offers.length);
    $http.get("/offer/load").then(function(res){
      $scope.get_dates();
    }, function(res){
      console.log("FAIL", res);
      $scope.sending = false;
    });

  };

  $scope.open_lightbox_img = function(img, caption){
    var img_obj = {
      url: img,
      caption: caption
    };

    Lightbox.openModal([img_obj], 0);
  };

  $scope.get_offers = function(){
    $scope.loaded_data = false;
    $scope.sending = true;
    $scope.failed = false;
    $scope.offers.splice(0, $scope.offers.length);
    $http.get("/offer/get_by_date", {params: {date: $scope.selected_date.date_txt}}).then(function(res){
      console.log("SUC offer", res);
      res.data.forEach(function(offer){

        var of = {



          thread_date: new Date(offer.thread_date),
          thread_date_txt: format_date(offer.thread_date),
          thread_description: offer.thread_description,
          thread_title: offer.thread_title,
          thread_url: offer.thread_url,

          poster_name: offer.poster_name,
          poster_url: offer.poster_url,
          poster_rep: offer.poster_reputation,
          poster_rep_url: offer.poster_rep_url,

          img_url: offer.img_url,

          type: offer.type,
          price: offer.price,
          currency: offer.currency,
          currency_symbole: offer.currency_symbol,

          bumped: offer.bumped,
          replies: offer.replies,
          views: offer.views
        };

        $scope.offers.push(of);
        $scope.offers_copy.push(of);
      });
      $scope.loaded_data = true;
      $scope.sending = false;
      $scope.failed = false;
    }, function(res){
      console.log("FAIL  offer", res);
      $scope.sending = false;
      $scope.failed = true;
    });
  };

  $scope.get_dates = function(){
    $scope.loaded_dates = false;
    $scope.loaded_data = false;
    $scope.sending = true;
    $scope.failed = false;
    $scope.dates.splice(0, $scope.dates.length);
    $scope.offers.splice(0, $scope.offers.length);
    $http.get("/offer/crawl_dates").then(function(res){
      console.log("SUC", res);
      res.data.forEach(function(date){
        $scope.dates.push({
          count: date.total,
          date: new Date(date._id),
          date_txt: date._id,
          txt: format_date(date._id)  + "  Count: " + date.total
        });
      });
      $scope.selected_date = $scope.dates[0];
      $scope.loaded_dates = true;
      $scope.sending = false;
    }, function(res){
      console.log("FAIL", res);
      $scope.sending = false;
    });
  };


  function format_date(date){
    var d = new Date(date);

    return (d.getYear() + 1900) + "." + (((d.getMonth() + 1) < 10) ? ("0" + (d.getMonth() + 1)):(d.getMonth() + 1)) + "." + d.getDate() + " " + d.getHours() + ":" + ((d.getMinutes() < 10) ? ("0" + d.getMinutes()) : d.getMinutes());
  }
});
