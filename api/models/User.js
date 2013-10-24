/**
 * User
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

	password : {
		type: 'string',
		required: true,
		minLength :4,
		maxLength :30
	}   
  },
/*
  beforeCreate: function(values, next) {
	values.password = require('crypto').createHash('md5').update(values.password).digest("hex");
  }
*/
};
