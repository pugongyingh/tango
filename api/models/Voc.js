/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  
  attributes: {
    jp: {
      type: 'string',
      required: true
    },
    phonic: {
      type: 'string'
    },
    meaning: {
      type: 'string',
      required: true
    },
    user:{
      model: "user",
      required: true
    }
  }
};

