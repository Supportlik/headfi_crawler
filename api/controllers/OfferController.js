/**
 * OfferController
 *
 * @description :: Server-side logic for managing offers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
  load: function (req, res) {
    var load_cb = function (loaded, err, threads) {
      if (loaded) {
          Offer.create(threads, function(err, created){
            if(err) res.send("FAILED - OK: " + created.length);
            else res.send("OK: " + created.length);

          });
      } else {
        res.send("COMPLETED: " + threads.length + "FAILED: " + err);
      }
    };

    UserLoadService.loadThreads(load_cb);
  },
  crawl_dates: function(req, res){
    Offer.native(function(err, collection){
      if (err) return res.serverError(err);
      collection.aggregate([
        {$group: {_id: "$crawl_date", total: {$sum: 1}}},
        { $sort : { _id : -1} }
        //,{ $limit : 2 }
      ], function(err, result){
        if (err) return res.serverError(err);
        return res.json(result);
      });

    });
  },
  get_by_date: function(req, res){
    var date =  new Date(req.param('date', ""));
    Offer.find({
      crawl_date: date
    }, function(err, offers){
      if(err) return res.json(err);
      return res.json(offers);
    });
  }
};

