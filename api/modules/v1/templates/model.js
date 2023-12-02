'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		titlePositive: { type: String },
		titleNegative: { type: String },
		positiveMail: { type: String },
		negativeMail: { type: String },

	}, { timestamps: true });
};
