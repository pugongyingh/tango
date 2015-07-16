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
      model: "user",
      required: true
    }
  }
};

