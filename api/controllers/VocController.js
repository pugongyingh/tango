/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 
var validator = require('sails-validation-messages');

module.exports = {
  
  all: function(req, res) {
    Voc.find({}).exec(function(err, found) {
      return res.view({
        title: '所有單字',
        vocList: found
      });
    });
  },
  
  'new': function(req, res) {
    res.locals.title = '新增單字';
    res.locals.flash = _.clone(req.session.flash);
    req.session.flash = {};
    res.view();
  },
  
  create:function(req, res) {
    
    var params = req.params.all();
    
    Voc.create(params)
    .exec(function created (err, user) {
      
      if(err && err.invalidAttributes) {
        err.invalidAttributes = validator(Voc, err.invalidAttributes);
        
        req.session.flash = {}
        req.session.flash.params = req.params.all();
        req.session.flash.err = err;
        
        return res.redirect('/voc/new');
      }
      
      return res.redirect('/voc');
    });
    
	},
  
  show: function(req, res) {
    res.locals.title = '單字';
    res.locals.flash = _.clone(req.session.flash);
    req.session.flash = {};
    res.view();
  }
  
  
};