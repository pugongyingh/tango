/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var md5 = require('MD5');

module.exports = {
  
  uniqueEmail: false,

  types: {
    uniqueEmail: function(value) {
      return uniqueEmail;
    }
  },
    
  attributes: {
    firstname: {
      type: 'string',
      required: true
    },
    lastname: {
      type: 'string',
      required: true
    },
    nickname: {
      type: 'string',
      required: true
    },
    email: {
      type: 'email',
      required: true,
      unique: true,
      uniqueEmail: true
    },
    password: {
      type: 'string',
      required: true
    },
    resetPasswordCode: {
      type: 'string'
    },
    status: {
      type: 'integer',
      defaultsTo: 0, //0 is inactive; 1 is actived
      required: true
    },
    activeCode: {
      type: 'string',
      required: true
    },
    group: {
      type: 'integer',
      defaultsTo: 0,
      required: true
    },
    vocs: {
      collection: 'voc',
      via: 'user'
    },
    avatar: {
      type: 'string'
    }
  },
  
  beforeCreate: function (values, next) {
    values.password = md5(values.password);
    next();
  },

  beforeValidate: function(values, cb){
    User.findOne({email: values.email}).exec(function (err, record) {
      uniqueEmail = !err && !record;
      cb();
    });
  },
  
  validationMessages: {
  	firstname: {
      required : '名稱是必填欄位',
    },
    lastname: {
      required : '姓氏是必填欄位',
    },
    nickname: {
      required : '膩稱是必填欄位',
    },
    email: {
      required : 'Email是必填欄位',
      email : '請輸入正確的Email',
      uniqueEmail: '這個Email已經註冊過了'
    },
    password: {
      required : '密碼是必填欄位',
    }
  }
  

};

