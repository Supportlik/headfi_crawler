var cheerio = require('cheerio');
var request = require('request');
var moment = require('moment');
var base = "http://www.head-fi.org/";
var load_base = "http://www.head-fi.org/f/6550/headphones-for-sale-trade/";


module.exports = {
  loadThreads: function (callback) {
    var complete = 0;
    var crawl_date = new Date();
    var threads = [];
    request(load_base, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        parse_site(body);
        console.log("COMPLETE:", ++complete);
        var count = parse_count(body);
        if (complete == count) {
          callback(true, null, threads);
        } else {
          for (var i = 1; i < count; i++) {
            setTimeout(load_next, i * 50, i, count);
          }
        }
      } else {
        console.log("ERROR", error);
        callback(false, error, threads);
      }
    });

    function load_obj($, thumbnail, thumbnail_body, td_no_wrap) {

      var img_node = thumbnail.find('img');
      var rep_node = thumbnail_body.find('.ilink');
      var title_node = thumbnail_body.find('.classified-title');
      var descr_node = thumbnail_body.find('.forum-list-sub-txt');
      var div_node = rep_node.prevObject[0];
      var poster_node = $(div_node.children[3]);
      var date_node = $(div_node.children[2]);
      var date = get_date(date_node.text());
      var type_obj = get_type($, td_no_wrap);

      var thread = {
        img_url: img_node.attr('src'),
        poster_name: poster_node.text(),
        poster_url: base + poster_node.attr('href'),
        poster_reputation: Number(rep_node.text()),
        poster_reputation_url: base + rep_node.attr('href'),
        thread_title: title_node.text(),
        thread_url: base + title_node.attr('href'),
        thread_description: descr_node.text(),
        thread_date: date,
        type: type_obj.type,
        bumped: type_obj.bumped,
        replies: type_obj.replies,
        views: type_obj.views,
        price: type_obj.price,
        currency: type_obj.currency.name,
        currency_symbol: type_obj.currency.symbol,
        crawl_date: crawl_date
      };

      return thread;
    }

    function get_type($, td) {
      var type_node = td.find('.type');
      var type = type_node.text();
      var obj = null;

      switch (type) {

        case "For Trade":
        case "Free to a Good Home":
          obj = {
            type: type,
            price: 0,
            currency: {
              name: "",
              symbol: ""
            },
            bumped: "",
            views: 0,
            replies: 0
          };
          break;
        case "For Sale":
        case "For Sale or Trade":
        case "Wanted":
          var price_node = td.find('.ctx-price');
          var currency_node = td.find('.currency');
          var price_text = price_node.text();
          var curr_text = currency_node.text();
          var price = Number(price_text.substring(1, price_text.length).replace(/,/g, ""));
          var curr_symbole = price_text.substring(0, 1);
          var curr_name = curr_text.substring(1, curr_text.length - 1);
          obj = {
            type: type,
            price: price,
            currency: {
              name: curr_name,
              symbol: curr_symbole
            },
            bumped: "",
            views: 0,
            replies: 0
          };
          break;
      }

      td.find('.forum-list-sub-txt').each(function (i, elem) {
        var node = $(elem);
        if (node.hasClass('bumped')) {
          obj.bumped = node.text();
        } else if (node.hasClass('views')) {
          obj.views = Number(node.text().substring(6, node.text().length));
        } else {
          obj.replies = Number(node.text().substring(9, node.text().length));
        }
      });

      return obj;
    }

    function get_date(date_text) {
      var splited = date_text.split(' ');
      var day = splited[1];
      var clock = splited[3].split(':');
      var hour = clock[0];
      var minute = clock[1].substring(0, clock[1].length -2);
      var am_pm = clock[1].substring(clock[1].length -2, clock[1].length);
      var date = null;

      switch (day) {
        case 'Today':
          date = moment();
          break;
        case 'Yesterday':
          date = moment();
          date.subtract(-1, 'd');
          break;
        default:
          var splitted_date = day.split('/');
          var day = splitted_date[1];
          var month = splitted_date[0] - 1;
          var year = Number(splitted_date[2]) + 2000;
          date = moment({
            year: year,
            month: month,
            day: day
          });
          break;
      }

      date.hour(hour);
      date.minute(minute);
      if (am_pm == "pm")
        date.add(12, 'h');

      return date.toDate();
    }


    function parse_site(site) {
      var $ = cheerio.load(site);
      var tracks = $(".thread");
      tracks.each(function (i, elem) {
        var thumbnail = $(elem).find('.thumbnail');
        var thumbnail_body = $(elem).find('.thumbnail_body');
        var td_no_wrap = $(elem).find('td[nowrap]');

        threads.push(load_obj($, thumbnail, thumbnail_body, td_no_wrap));
      });
    }

    function parse_count(body) {
      var $ = cheerio.load(body);
      var ul = $($('.pn')[0]);
      var count = Number(ul.find('li.pn-bg2').last().text());

      return count;
    }

    function load_next(i, count) {
      console.log("LOADING: " + i);
      request(load_base + (i * 50), function (error, response, body) {
        console.log("COMPLETE:", ++complete);
        if (!error && response.statusCode == 200) {
          parse_site(body);
          if (complete == count) callback(true, null, threads)
        } else {
          console.log("ERROR", error);
          callback(false, error, threads)
        }
      });
    }
  },
};
