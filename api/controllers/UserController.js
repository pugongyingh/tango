/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var md5 = require('MD5');
var validator = require('sails-validation-messages');
var uuid = require('node-uuid');

module.exports = {
  
  // 顯示所有會員
  all: function(req, res) {
    User.find({}).exec(function(err, found) {
      return res.view({
        title: '所有會員',
        userList: found
      });
    });
  },
  // 顯示單一會員
  showUser: function(req, res) {
    User.findOne({id: req.param('id')}).exec(function(err, user) {
      return res.view({
        title: user.nickname,
        user: user
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

    var params = req.params.all();
    
    // 改密碼開始
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
    
    
    // 改個人資料
    User.update({id: req.session.me.id}, params).exec(function updated (err, user) {
      
      if(err && err.invalidAttributes) { /*!user && */
        err.invalidAttributes = validator(User, err.invalidAttributes);
        
        req.session.flash = {};
        req.session.flash.params = req.params.all();
        req.session.flash.err = err;
        
      }
      else {
        req.session.me = user[0];
        req.session.flash = {success: true}
      }
      
      return res.redirect('/profile');
      
    });
  },
  
  saveAvatar: function(req, res) {
    
    
    var avatarURL;
    
    
    
    
    req.file('avatar').upload({}, function(err, uploadedFiles){
      if (err) {
        return res.negotiate(err);
      }
      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }
      //console.log(uploadedFiles[0].extra.Location)
      tempUrl = uploadedFiles[0].fd;
      console.log(tempUrl);
      
      
      // 這是可以REDSIZE的  如果S3沒辦法ON THE FLY改圖片大小 就改用這個吧
      //require('aws-sdk'); 不用require  只要裝 然後加一個檔案 \user\username\.aws\credentials 寫KEY跟SECRET KEY就好
      var Upload = require('s3-uploader');
      var client = new Upload('boggyjan.tango', {
        aws: {
          path: 'avatar/',
          region: 'us-east-1',
          acl: 'public-read'
        },
       
        cleanup: {
          versions: true,
          original: false
        },
       
        original: {
          awsImageAcl: 'private'
        },
       
        versions: [{
          maxHeight: 2000,
          maxWidth: 2000,
          format: 'jpg',
          quality: 80
        },{
          maxHeight: 1000,
          maxWidth: 1000,
          format: 'jpg',
          suffix: '-large',
          quality: 80
        },{
          maxHeight: 780,
          maxWidth: 780,
          format: 'jpg',
          suffix: '-medium'
        },{
          maxHeight: 320,
          maxWidth: 320,
          format: 'jpg',
          suffix: '-small'
        },{
          maxHeight: 100,
          maxWidth: 100,
          format: 'jpg',
          suffix: '-thumb'
        }]
      });
      
      client.upload(tempUrl, {}, function(err, images, meta) {
        
        if (err) {
          console.error(err);
        }
        else {
          
          for (var i = 0; i < images.length; i++) {
            console.log(images[i]);
          }
          
          
          avatarURL = images[0].url;
    
    
          User.update({id: req.session.me.id}, {avatar: avatarURL}).exec(function updated (err, user) {
          
            if(err && err.invalidAttributes) {
              err.invalidAttributes = validator(User, err.invalidAttributes);
              
              req.session.flash = {}
              req.session.flash.params = req.params.all();
              req.session.flash.err = err;
              
            }
            else {
              req.session.me = user[0];
              req.session.flash = {success: true}
            }
            
            return res.redirect('/profile');
            
          });
          
        }
      });
      
    });
      
    
    
    
    
    
    /*
    req.file('avatar').upload({
      adapter: require('skipper-s3'),
      key: 'AKIAISC5CP2SXZM7SSDQ',
      secret: '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',
      bucket: 'boggyjan.tango'
      }, function whenDone(err, uploadedFiles) {
      
      if (err) {
        return res.negotiate(err);
      }
      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }
      //console.log(uploadedFiles[0].extra.Location)
      avatarURL = uploadedFiles[0].extra.Location
      
      
      User.update({id: req.session.me.id}, {avatar: avatarURL}).exec(function updated (err, user) {
      
        if(err && err.invalidAttributes) {
          err.invalidAttributes = validator(User, err.invalidAttributes);
          
          req.session.flash = {}
          req.session.flash.params = req.params.all();
          req.session.flash.err = err;
          
        }
        else {
          req.session.me = user[0];
          req.session.flash = {success: true}
        }
        
        return res.redirect('/profile');
        
      });
      
    });
    */
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
  },
  
  resendActiveEmail: function(req, res) {
    if (req.session.me) {
      Email.resendActiveEmail(req.session.me);
    }
    return res.redirect('/active');
  }
  
  
};