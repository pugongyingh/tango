/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var md5 = require('MD5');
var validator = require('sails-validation-messages');


module.exports = {
  
  // 所有會員
  all: function(req, res) {
    User.find({}).exec(function(err, found) {
      return res.view({
        title: '所有會員',
        userList: found
      });
    });
  },

  // 登入
  login: function(req, res) {
    if (!req.session.me) {
      res.locals.title = '登入';
      res.locals.flash = _.clone(req.session.flash);
      req.session.flash = {};
      res.view();
    }
    else {
      res.redirect('/profile');
    }
  },
  
  checkLogin: function(req, res) {
    var params = req.params.all();
    params.password = md5(params.password);
    
    User.findOne(params)
    .exec(function onlogin (err, user) {
      if (user) {
        req.session.me = user;
        return res.redirect('/');
      }
      else {
        req.session.flash = {}
        req.session.flash.params = req.params.all();
        req.session.flash.err = {
          invalidAttributes: {
            login: [
              {
                message: '帳號或密碼錯誤'
              }
            ]
          }
        };
        return res.redirect('/login');
      }
    });
  },
  
  // 登出
  logout: function(req, res) {
    req.session.me = null;
    return res.redirect('/');
  },
  
  // 註冊
  signup: function(req, res) {
    res.locals.title = '註冊';
    res.locals.flash = _.clone(req.session.flash);
    req.session.flash = {};
    res.view();
  },
  
  create:function(req, res) {
    
    var params = req.params.all();
    var activeCode = md5(params.email + new Date().getTime());
    
    params.activeCode = activeCode;
    
    User.create(params)
    .exec(function created (err, user) {
      
      if(err && err.invalidAttributes) {
        err.invalidAttributes = validator(User, err.invalidAttributes);
        
        req.session.flash = {}
        req.session.flash.params = req.params.all();
        req.session.flash.err = err;
        
        return res.redirect('/signup');
      }
      
      // 寄認證信
      Email.sendActive(user, activeCode);
      
      return res.redirect('/active');
    });
	},
  
  // 修改資料
  profile: function(req, res) {
    // 執行之前會先check policies (請見config/policy  & policies資料夾)
    

    res.locals.title = '會員資料';
    res.locals.flash = _.clone(req.session.flash);
    req.session.flash = {};
    res.view();
  },
  
  saveProfile: function(req, res) {
    // 執行之前會先check policies (請見config/policy  & policies資料夾)
    var avatarURL = '';
    //上傳的部分 還沒弄
    
    // 改密碼開始
    var params = req.params.all();
    
    if (avatarURL) {
      params.avatar = avatarURL;
    }
    
    if (params.new_password) {
      
      if (params.new_password == params.confirm_new_password && md5(params.old_password) == req.session.me.password) {
        params.password = md5(params.new_password);
      }
      else if (params.new_password != params.confirm_new_password) {
        req.session.flash.err = {
          invalidAttributes: {
            confirm_new_password: [{message: '新密碼與確認新密碼必須一致'}]
          }
        }
        return res.redirect('/profile');
      }
      else if (md5(params.old_password) != req.session.me.password) {
        req.session.flash.err = {
          invalidAttributes: {
            old_password: [{message: '您輸入的舊密碼是錯誤的'}]
          }
        }
        return res.redirect('/profile');
      }
    }
    // 改密碼結束
    
    User.update({id: req.session.me.id}, params).exec(function updated (err, user) {
      
      if(err && err.invalidAttributes) { /*!user && */
        err.invalidAttributes = validator(User, err.invalidAttributes);
        
        req.session.flash = {}
        req.session.flash.params = req.params.all();
        req.session.flash.err = err;
        
      }
      else {
        console.log('ok');
        req.session.me = user[0];
        req.session.flash = {success: true}
      }
      
      return res.redirect('/profile');
    });
  },
  
  forget: function(req, res) {
    
    User.findOne({email: req.param('email')}).exec(function (err, user) {
      if (!user || err) {
        return res.redirect('/forget/error');
      }
      else {
        
        var resetPasswordCode = md5(user.email + new Date().getTime());
        
        User.update({id: user.id}, {resetPasswordCode: resetPasswordCode}).exec(function(err, user){
          
          if(user && !err) {
            user = user[0];
            // 寄信
            Email.sendResetPWD(user, resetPasswordCode);
            
            return res.redirect('/forget/success');
            
          }
        });
      }
    });
  },
  
  reset: function(req, res){
    
    if (req.param('new_password') != req.param('confirm_new_password')) {
      return res.redirect('/reset/error');
    }
    
    User.findOne({resetPasswordCode: req.param('code')}).exec(function (err, user) {
      if (!user || err) {
        return res.redirect('/reset/error');
      }
      
      var newPWD = md5(req.param('new_password'));
      
      User.update({id: user.id}, {password: newPWD, resetPasswordCode: null}).exec(function(err, user){
          
          if (!user || err) {
            return res.redirect('/reset/error');
          }
          else if (user) {
            return res.redirect('/reset/success');
          }
        });
    });
  },
  
  
  active: function(req, res) {
    
    User.findOne({status:0, activeCode: req.param('code')}).exec(function (err, user) {
      
      if (!user || err) {
        return res.redirect('/active/error');
      }
      else if (user) {
        User.update({id: user.id}, {status: 1}).exec(function(err, user){
          
          if (!user || err) {
            return res.redirect('/active/error');
          }
          else if (user) {
            //直接幫他登入
            req.session.me = user[0];
            return res.redirect('/active/success');
          }
        });
      }
    });
  }
  
  
};