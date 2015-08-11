/**
 * Offer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  schema: true,
  attributes: {
    img_url: {
      type: 'string',
      required: true
    },
    poster_name: {
      type: 'string',
      required: true
    },
    poster_url: {
      type: 'string',
      required: true
    },
    poster_reputation: {
      type: 'integer',
      required: true
    },
    poster_reputation_url: {
      type: 'string',
      required: true
    },
    thread_date: {
      type: 'datetime',
      required: true
    },
    thread_description: {
      type: 'text',
      required: true
    },
    thread_title: {
      type: 'string',
      required: true
    },
    thread_url: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      enum: ["For Trade", "Free to a Good Home", "For Sale", "For Sale or Trade", "Wanted"],
      required: true
    },
    bumped: {
      type: 'string',
      required: false,
      defaultsTo: ""
    },
    replies: {
      type: 'integer',
      required: true
    },
    views: {
      type: 'integer',
      required: true
    },
    price: {
      type: 'integer',
      required: true
    },
    currency: {
      type: 'string',
      required: false
    },
    currency_symbol: {
      type: 'string',
      required: false
    },
    crawl_date: {
      type: 'datetime',
      required: true
    }
  }
};

