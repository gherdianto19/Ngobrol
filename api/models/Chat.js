/**
 * Chat
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	
  	id : 'integer',

	username : {
		type: 'string',
		required: true,
		minLength :4,
		maxLength :30
	},

	chat_text : {
		type: 'string',
		required: true,
		minLength :1,
		maxLength :255
	}   
  }

};
