/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  attributes: {
    word: {
      type: 'string',
      required: true
    },
    phonic: {
      type: 'string'
    },
    
    // 詞類
    type: {
      type: 'string',
      required: true
    },
    meaning: {
      type: 'string',
      required: true
    },
    creator: {
      model: 'User',
      required: true
    }
  },
  
  
  
  validationMessages: {
    word: {
      required : '單字是必填欄位'
    },
    type: {
      required : '詞性是必填欄位'
    },
    meaning: {
      required : '含意是必填欄位'
    },
    creator: {
      required : '建立者是必填欄位'
    }
  }
  
  
};

